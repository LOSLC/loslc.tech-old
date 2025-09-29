import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";

export const forumPostsTable = pg.pgTable("forum_posts", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	title: pg.text("title").notNull(),
	content: pg.text("content").notNull(),
	authorId: pg
		.varchar("author_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id),
	postedAt: pg.timestamp("posted_at").defaultNow().notNull(),
	updatedAt: pg.timestamp("updated_at").defaultNow().notNull(),
});

export const forumCommentsTable = pg.pgTable("forum_comments", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	postId: pg
		.uuid("post_id")
		.notNull()
		.references((): pg.AnyPgColumn => forumPostsTable.id),
	content: pg.text("content").notNull(),
	authorId: pg
		.varchar("author_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id),
	postedAt: pg.timestamp("posted_at").defaultNow().notNull(),
	updatedAt: pg.timestamp("updated_at").defaultNow().notNull(),
});

export const forumVotesTable = pg.pgTable("forum_votes", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	postId: pg
		.uuid("post_id")
		.notNull()
		.references((): pg.AnyPgColumn => forumPostsTable.id),
	userId: pg
		.varchar("user_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id),
	voteType: pg.integer("vote_type").notNull(), // 1 for upvote, -1 for downvote
	votedAt: pg.timestamp("voted_at").defaultNow().notNull(),
});

export const forumCommentVotesTable = pg.pgTable("forum_comment_votes", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	commentId: pg
		.uuid("comment_id")
		.notNull()
		.references((): pg.AnyPgColumn => forumCommentsTable.id),
	userId: pg
		.varchar("user_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id),
	voteType: pg.integer("vote_type").notNull(), // 1 for upvote, -1 for downvote
	votedAt: pg.timestamp("voted_at").defaultNow().notNull(),
});

export const forumTagsTable = pg.pgTable("forum_tags", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	name: pg.text("name").notNull().unique(),
});

export const forumPostTagsTable = pg.pgTable("forum_post_tags", {
	postId: pg
		.uuid("post_id")
		.notNull()
		.references((): pg.AnyPgColumn => forumPostsTable.id),
	tagId: pg
		.uuid("tag_id")
		.notNull()
		.references((): pg.AnyPgColumn => forumTagsTable.id),
});

export type ForumPost = typeof forumPostsTable.$inferSelect;
export type NewForumPost = typeof forumPostsTable.$inferInsert;

export type ForumComment = typeof forumCommentsTable.$inferSelect;
export type NewForumComment = typeof forumCommentsTable.$inferInsert;

export type ForumVote = typeof forumVotesTable.$inferSelect;
export type NewForumVote = typeof forumVotesTable.$inferInsert;

export type ForumTag = typeof forumTagsTable.$inferSelect;
export type NewForumTag = typeof forumTagsTable.$inferInsert;
export type ForumPostTag = typeof forumPostTagsTable.$inferSelect;
export type NewForumPostTag = typeof forumPostTagsTable.$inferInsert;
