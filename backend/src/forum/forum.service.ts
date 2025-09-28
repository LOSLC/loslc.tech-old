import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { AccessmgtService } from "@/accessmgt/accessmgt.service";
import { db } from "@/core/db/db";
import {
	forumCommentsTable,
	forumPostTagsTable,
	forumPostsTable,
	forumTagsTable,
	forumVotesTable,
	User,
	usersTable,
	forumCommentVotesTable,
} from "@/core/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import {
	CreateForumCommentDTO,
	CreateForumPostDTO,
	ForumCommentDTO,
	ForumPostDTO,
	GetForumCommentsQueryDTO,
	GetForumPostsQueryDTO,
	UpdateForumCommentDTO,
	UpdateForumPostDTO,
	VoteDTO,
} from "./forum.dto";
import { Message } from "@/common/dto/message";
import { ForumTagDTO } from "./forum.dto";

@Injectable()
export class ForumService {
	constructor(readonly accessManager: AccessmgtService) {}

	async listPosts(query: GetForumPostsQueryDTO): Promise<ForumPostDTO[]> {
		const { offset, limit, authorId, tag, query: q } = query;

		let base = db
			.select({
				id: forumPostsTable.id,
				title: forumPostsTable.title,
				content: forumPostsTable.content,
				authorId: forumPostsTable.authorId,
				postedAt: forumPostsTable.postedAt,
				updatedAt: forumPostsTable.updatedAt,
			})
			.from(forumPostsTable)
			.leftJoin(usersTable, eq(usersTable.id, forumPostsTable.authorId));

		if (tag) {
			base = base
				.innerJoin(
					forumPostTagsTable,
					eq(forumPostTagsTable.postId, forumPostsTable.id),
				)
				.innerJoin(
					forumTagsTable,
					and(
						eq(forumTagsTable.id, forumPostTagsTable.tagId),
						eq(forumTagsTable.name, tag),
					),
				);
		} else if (q) {
			base = base
				.leftJoin(
					forumPostTagsTable,
					eq(forumPostTagsTable.postId, forumPostsTable.id),
				)
				.leftJoin(
					forumTagsTable,
					eq(forumTagsTable.id, forumPostTagsTable.tagId),
				);
		}

		const where = [] as any[];
		if (authorId) where.push(eq(forumPostsTable.authorId, authorId));
		if (q) {
			const pattern = `%${q}%`;
			where.push(
				or(
					ilike(forumPostsTable.title, pattern),
					ilike(forumPostsTable.content, pattern),
					ilike(usersTable.fullName, pattern),
					ilike(usersTable.username, pattern),
					ilike(forumTagsTable.name, pattern),
				),
			);
		}

		const rows = await base
			.where(where.length > 0 ? and(...where) : undefined)
			.groupBy(
				forumPostsTable.id,
				forumPostsTable.title,
				forumPostsTable.content,
				forumPostsTable.authorId,
				forumPostsTable.postedAt,
				forumPostsTable.updatedAt,
			)
			.orderBy(desc(forumPostsTable.postedAt))
			.offset(offset ?? 0)
			.limit(limit ?? 20);

		return rows as ForumPostDTO[];
	}

	async searchTags(query: string): Promise<ForumTagDTO[]> {
		const pattern = `%${query}%`;
		const tags = await db
			.select()
			.from(forumTagsTable)
			.where(ilike(forumTagsTable.name, pattern))
			.limit(20);
		return tags as ForumTagDTO[];
	}

	async createTag(name: string): Promise<ForumTagDTO> {
		const [existing] = await db
			.select()
			.from(forumTagsTable)
			.where(eq(forumTagsTable.name, name))
			.limit(1);
		if (existing) return existing as ForumTagDTO;
		const [row] = await db.insert(forumTagsTable).values({ name }).returning();
		return row as ForumTagDTO;
	}

	async getPost(id: string, optionalUser?: User): Promise<ForumPostDTO> {
		const [post] = await db
			.select()
			.from(forumPostsTable)
			.where(eq(forumPostsTable.id, id))
			.limit(1);
		if (!post) throw new NotFoundException("Forum post not found");
		return post as ForumPostDTO;
	}

	async createPost(
		data: CreateForumPostDTO,
		author: User,
	): Promise<ForumPostDTO> {
		const [post] = await db
			.insert(forumPostsTable)
			.values({ title: data.title, content: data.content, authorId: author.id })
			.returning();

		if (data.tags?.length) await this.setPostTags(post.id, data.tags);

		return post as ForumPostDTO;
	}

	async updatePost(
		id: string,
		data: UpdateForumPostDTO,
		user: User,
	): Promise<ForumPostDTO> {
		const [existing] = await db
			.select()
			.from(forumPostsTable)
			.where(eq(forumPostsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Forum post not found");

		if (existing.authorId !== user.id) {
			const isAdmin = await this.accessManager.isAdmin(user);
			if (!isAdmin) throw new UnauthorizedException("Not authorized");
		}

		const [updated] = await db
			.update(forumPostsTable)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(forumPostsTable.id, id))
			.returning();

		if (data.tags) {
			await db
				.delete(forumPostTagsTable)
				.where(eq(forumPostTagsTable.postId, id));
			if (data.tags.length) await this.setPostTags(id, data.tags);
		}

		return updated as ForumPostDTO;
	}

	async deletePost(id: string, user: User): Promise<Message> {
		const [existing] = await db
			.select()
			.from(forumPostsTable)
			.where(eq(forumPostsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Forum post not found");

		if (existing.authorId !== user.id) {
			const isAdmin = await this.accessManager.isAdmin(user);
			if (!isAdmin) throw new UnauthorizedException("Not authorized");
		}

		await db.delete(forumPostsTable).where(eq(forumPostsTable.id, id));
		return { message: "Forum post deleted successfully" };
	}

	async listComments(
		postId: string,
		data: GetForumCommentsQueryDTO,
	): Promise<ForumCommentDTO[]> {
		const { offset, limit } = data;
		const rows = await db
			.select()
			.from(forumCommentsTable)
			.where(eq(forumCommentsTable.postId, postId))
			.offset(offset ?? 0)
			.limit(limit ?? 20);
		return rows as ForumCommentDTO[];
	}

	async addComment(
		postId: string,
		data: CreateForumCommentDTO,
		author: User,
	): Promise<ForumCommentDTO> {
		await this.getPost(postId);
		const [row] = await db
			.insert(forumCommentsTable)
			.values({ postId, content: data.content, authorId: author.id })
			.returning();
		return row as ForumCommentDTO;
	}

	async updateComment(
		commentId: string,
		data: UpdateForumCommentDTO,
		user: User,
	): Promise<ForumCommentDTO> {
		const [existing] = await db
			.select()
			.from(forumCommentsTable)
			.where(eq(forumCommentsTable.id, commentId))
			.limit(1);
		if (!existing) throw new NotFoundException("Comment not found");

		if (existing.authorId !== user.id) {
			const isAdmin = await this.accessManager.isAdmin(user);
			if (!isAdmin) throw new UnauthorizedException("Not authorized");
		}

		const [updated] = await db
			.update(forumCommentsTable)
			.set({ content: data.content, updatedAt: new Date() })
			.where(eq(forumCommentsTable.id, commentId))
			.returning();
		return updated as ForumCommentDTO;
	}

	async deleteComment(commentId: string, user: User): Promise<Message> {
		const [existing] = await db
			.select()
			.from(forumCommentsTable)
			.where(eq(forumCommentsTable.id, commentId))
			.limit(1);
		if (!existing) throw new NotFoundException("Comment not found");

		if (existing.authorId !== user.id) {
			const isAdmin = await this.accessManager.isAdmin(user);
			if (!isAdmin) throw new UnauthorizedException("Not authorized");
		}

		await db
			.delete(forumCommentsTable)
			.where(eq(forumCommentsTable.id, commentId));
		return { message: "Comment deleted successfully" };
	}

	async vote(postId: string, data: VoteDTO, user: User) {
		await this.getPost(postId);
		const [existing] = await db
			.select()
			.from(forumVotesTable)
			.where(
				and(
					eq(forumVotesTable.postId, postId),
					eq(forumVotesTable.userId, user.id),
				),
			)
			.limit(1);

		if (existing) {
			if (existing.voteType === data.voteType) {
				await db
					.delete(forumVotesTable)
					.where(
						and(
							eq(forumVotesTable.postId, postId),
							eq(forumVotesTable.userId, user.id),
						),
					);
				return { voted: false, message: "Vote removed" };
			}
			const [updated] = await db
				.update(forumVotesTable)
				.set({ voteType: data.voteType })
				.where(
					and(
						eq(forumVotesTable.postId, postId),
						eq(forumVotesTable.userId, user.id),
					),
				)
				.returning();
			return { voted: true, vote: updated, message: "Vote updated" };
		}

		const [vote] = await db
			.insert(forumVotesTable)
			.values({ postId, userId: user.id, voteType: data.voteType })
			.returning();
		return { voted: true, vote, message: "Voted successfully" };
	}

	async voteComment(commentId: string, voteData: VoteDTO, user: User) {
		const [comment] = await db
			.select()
			.from(forumCommentsTable)
			.where(eq(forumCommentsTable.id, commentId))
			.limit(1);
		if (!comment) throw new NotFoundException("Comment not found");
		const [existingVote] = await db
			.select()
			.from(forumCommentVotesTable)
			.where(
				and(
					eq(forumCommentVotesTable.commentId, commentId),
					eq(forumCommentVotesTable.userId, user.id),
				),
			)
			.limit(1);

		if (existingVote) {
			if (existingVote.voteType === voteData.voteType) {
				await db
					.delete(forumCommentVotesTable)
					.where(
						and(
							eq(forumCommentVotesTable.commentId, commentId),
							eq(forumCommentVotesTable.userId, user.id),
						),
					);
				return { voted: false, message: "Vote removed" };
			}

			const [updated] = await db
				.update(forumCommentVotesTable)
				.set({ voteType: voteData.voteType })
				.where(
					and(
						eq(forumCommentVotesTable.commentId, commentId),
						eq(forumCommentVotesTable.userId, user.id),
					),
				)
				.returning();
			return { voted: true, vote: updated, message: "Vote updated" };
		}

		const [newVote] = await db
			.insert(forumCommentVotesTable)
			.values({
				commentId: comment.id,
				userId: user.id,
				voteType: voteData.voteType,
			})
			.returning();
		return { voted: true, vote: newVote, message: "Voted successfully" };
	}

	async hasVotedComment(commentId: string, user: User) {
		const [row] = await db
			.select()
			.from(forumCommentVotesTable)
			.where(
				and(
					eq(forumCommentVotesTable.commentId, commentId),
					eq(forumCommentVotesTable.userId, user.id),
				),
			)
			.limit(1);
		return {
			hasVoted: Boolean(row),
			voteType: row?.voteType as 1 | -1 | undefined,
		};
	}

	async getPostVoteCounts(postId: string) {
		await this.getPost(postId); // ensure exists
		const rows = await db
			.select({ voteType: forumVotesTable.voteType })
			.from(forumVotesTable)
			.where(eq(forumVotesTable.postId, postId));
		let up = 0;
		let down = 0;
		for (const r of rows) {
			if (r.voteType === 1) up++;
			else if (r.voteType === -1) down++;
		}
		return { up, down, score: up - down };
	}

	async getCommentVoteCounts(commentId: string) {
		const [comment] = await db
			.select({ id: forumCommentsTable.id })
			.from(forumCommentsTable)
			.where(eq(forumCommentsTable.id, commentId))
			.limit(1);
		if (!comment) throw new NotFoundException("Comment not found");
		const rows = await db
			.select({ voteType: forumCommentVotesTable.voteType })
			.from(forumCommentVotesTable)
			.where(eq(forumCommentVotesTable.commentId, commentId));
		let up = 0;
		let down = 0;
		for (const r of rows) {
			if (r.voteType === 1) up++;
			else if (r.voteType === -1) down++;
		}
		return { up, down, score: up - down };
	}

	private async setPostTags(postId: string, tagNames: string[]) {
		for (const name of tagNames) {
			let [tag] = await db
				.select()
				.from(forumTagsTable)
				.where(eq(forumTagsTable.name, name))
				.limit(1);
			if (!tag) {
				[tag] = await db.insert(forumTagsTable).values({ name }).returning();
			}
			await db
				.insert(forumPostTagsTable)
				.values({ postId, tagId: tag.id })
				.onConflictDoNothing();
		}
	}
}
