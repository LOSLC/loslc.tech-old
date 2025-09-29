import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@/auth/auth.guard";
import { User } from "@/common/decorators/user.decorator";
import { User as DBUser } from "@/core/db/schema";
import { Message } from "@/common/dto/message";
import { ForumService } from "./forum.service";
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
	ForumTagDTO,
	CreateForumTagDTO,
	VoteCountDTO,
} from "./forum.dto";

@ApiTags("Forum")
@Controller("forum")
export class ForumController {
	constructor(private readonly forumService: ForumService) {}

	@Get("posts")
	@ApiOperation({ summary: "List forum posts" })
	@ApiQuery({ name: "offset", required: false, type: Number })
	@ApiQuery({ name: "limit", required: false, type: Number })
	@ApiQuery({ name: "authorId", required: false, type: String })
	@ApiQuery({ name: "tag", required: false, type: String })
	@ApiQuery({ name: "query", required: false, type: String })
	@ApiResponse({ status: 200, type: [ForumPostDTO] })
	async listPosts(
		@Query() query: GetForumPostsQueryDTO,
	): Promise<ForumPostDTO[]> {
		return this.forumService.listPosts(query);
	}

	@Get("posts/:id")
	@ApiOperation({ summary: "Get forum post by id" })
	@ApiParam({ name: "id", description: "Post ID" })
	@ApiResponse({ status: 200, type: ForumPostDTO })
	@ApiResponse({ status: 404, description: "Forum post not found" })
	async getPost(@Param("id") id: string): Promise<ForumPostDTO> {
		return this.forumService.getPost(id);
	}

	@Post("posts")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Create forum post" })
	@ApiResponse({ status: 201, type: ForumPostDTO })
	async createPost(
		@Body() body: CreateForumPostDTO,
		@User() user: DBUser,
	): Promise<ForumPostDTO> {
		return this.forumService.createPost(body, user);
	}

	@Put("posts/:id")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Update forum post" })
	@ApiParam({ name: "id", description: "Post ID" })
	@ApiResponse({ status: 200, type: ForumPostDTO })
	@ApiResponse({ status: 404, description: "Forum post not found" })
	async updatePost(
		@Param("id") id: string,
		@Body() body: UpdateForumPostDTO,
		@User() user: DBUser,
	): Promise<ForumPostDTO> {
		return this.forumService.updatePost(id, body, user);
	}

	@Delete("posts/:id")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Delete forum post" })
	@ApiParam({ name: "id", description: "Post ID" })
	@ApiResponse({ status: 200, type: Message })
	@ApiResponse({ status: 404, description: "Forum post not found" })
	async deletePost(
		@Param("id") id: string,
		@User() user: DBUser,
	): Promise<Message> {
		return this.forumService.deletePost(id, user);
	}

	@Get("posts/:postId/comments")
	@ApiOperation({ summary: "List comments for a post" })
	@ApiParam({ name: "postId", description: "Post ID" })
	@ApiResponse({ status: 200, type: [ForumCommentDTO] })
	async listComments(
		@Param("postId") postId: string,
		@Body() body: GetForumCommentsQueryDTO,
	): Promise<ForumCommentDTO[]> {
		return this.forumService.listComments(postId, body);
	}

	@Post("posts/:postId/comments")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Add comment to a post" })
	@ApiParam({ name: "postId", description: "Post ID" })
	@ApiResponse({ status: 201, type: ForumCommentDTO })
	async addComment(
		@Param("postId") postId: string,
		@Body() body: CreateForumCommentDTO,
		@User() user: DBUser,
	): Promise<ForumCommentDTO> {
		return this.forumService.addComment(postId, body, user);
	}

	@Put("comments/:commentId")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Update a comment" })
	@ApiParam({ name: "commentId", description: "Comment ID" })
	@ApiResponse({ status: 200, type: ForumCommentDTO })
	async updateComment(
		@Param("commentId") commentId: string,
		@Body() body: UpdateForumCommentDTO,
		@User() user: DBUser,
	): Promise<ForumCommentDTO> {
		return this.forumService.updateComment(commentId, body, user);
	}

	@Delete("comments/:commentId")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Delete a comment" })
	@ApiParam({ name: "commentId", description: "Comment ID" })
	@ApiResponse({ status: 200, type: Message })
	async deleteComment(
		@Param("commentId") commentId: string,
		@User() user: DBUser,
	): Promise<Message> {
		return this.forumService.deleteComment(commentId, user);
	}

	@Post("posts/:postId/vote")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Vote on a post (1 or -1)" })
	@ApiParam({ name: "postId", description: "Post ID" })
	async vote(
		@Param("postId") postId: string,
		@Body() body: VoteDTO,
		@User() user: DBUser,
	) {
		return this.forumService.vote(postId, body, user);
	}

	@Post("comments/:commentId/vote")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Vote on a comment (1 or -1)" })
	@ApiParam({ name: "commentId", description: "Comment ID" })
	async voteComment(
		@Param("commentId") commentId: string,
		@Body() body: VoteDTO,
		@User() user: DBUser,
	) {
		return this.forumService.voteComment(commentId, body, user);
	}

	@Get("comments/:commentId/has-voted")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Check if current user voted this comment" })
	@ApiParam({ name: "commentId", description: "Comment ID" })
	async hasVotedComment(
		@Param("commentId") commentId: string,
		@User() user: DBUser,
	) {
		return this.forumService.hasVotedComment(commentId, user);
	}

	@Get("posts/:postId/votes")
	@ApiOperation({ summary: "Get vote counts for a post" })
	@ApiParam({ name: "postId", description: "Post ID" })
	@ApiResponse({ status: 200, type: VoteCountDTO })
	async getPostVoteCounts(
		@Param("postId") postId: string,
	): Promise<VoteCountDTO> {
		return this.forumService.getPostVoteCounts(postId);
	}

	@Get("comments/:commentId/votes")
	@ApiOperation({ summary: "Get vote counts for a comment" })
	@ApiParam({ name: "commentId", description: "Comment ID" })
	@ApiResponse({ status: 200, type: VoteCountDTO })
	async getCommentVoteCounts(
		@Param("commentId") commentId: string,
	): Promise<VoteCountDTO> {
		return this.forumService.getCommentVoteCounts(commentId);
	}

	@Get("tags")
	@ApiOperation({ summary: "Search forum tags" })
	@ApiQuery({ name: "query", required: true, type: String })
	@ApiResponse({ status: 200, type: [ForumTagDTO] })
	async searchTags(@Query("query") query: string): Promise<ForumTagDTO[]> {
		return this.forumService.searchTags(query);
	}

	@Post("tags")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Create a forum tag (idempotent by name)" })
	@ApiResponse({ status: 201, type: ForumTagDTO })
	async createTag(@Body() body: CreateForumTagDTO): Promise<ForumTagDTO> {
		return this.forumService.createTag(body.name);
	}
}
