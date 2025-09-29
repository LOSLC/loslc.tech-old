import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { blogPostsTable } from "./post";
import { usersTable } from "../user/user";

export const blogPostCommentsTable = pgTable("blogpost_comment", {
	id: pg.uuid("id").notNull().primaryKey().defaultRandom(),
	postId: pg
		.varchar("post_id")
		.notNull()
		.references((): pg.AnyPgColumn => blogPostsTable.id, {
			onDelete: "cascade",
		}),
	authorId: pg
		.varchar("author_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
	parentId: pg
		.uuid("parent_id")
		.references((): pg.AnyPgColumn => blogPostCommentsTable.id, {
			onDelete: "cascade",
		}),
	content: pg.text().notNull(),
});

export type BlogPostComment = typeof blogPostCommentsTable.$inferSelect;
export type BlogPostCommentInsert = typeof blogPostCommentsTable.$inferInsert;
