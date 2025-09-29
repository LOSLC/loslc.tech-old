import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";
import { blogPostsTable } from "./post";

export const blogPostLikesTable = pgTable("blogpost_like", {
	id: pg.uuid().notNull().primaryKey().defaultRandom(),
	likerId: pg
		.varchar()
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
	postId: pg
		.varchar("post_id")
		.notNull()
		.references((): pg.AnyPgColumn => blogPostsTable.id, {
			onDelete: "cascade",
		}),
	likedAt: pg.timestamp().notNull().defaultNow(),
});

export type BlogPostLike = typeof blogPostLikesTable.$inferSelect;
export type BlogPostLikeInsert = typeof blogPostLikesTable.$inferInsert;
