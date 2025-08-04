import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";
import { blogPostsTable } from "./post";

export const blogPostViewsTable = pgTable("blogpost_view", {
  id: pg.uuid().notNull().primaryKey().defaultRandom(),
  viewerId: pg
    .varchar()
    .references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
  viewedAt: pg.timestamp().notNull().defaultNow(),
  postId: pg
    .varchar("post_id")
    .notNull()
    .references((): pg.AnyPgColumn => blogPostsTable.id, { onDelete: "cascade" }),
  viewTime: pg.integer().notNull().default(0), // in seconds
});

export type BlogPostView = typeof blogPostViewsTable.$inferSelect;
export type BlogPostViewInsert = typeof blogPostViewsTable.$inferInsert;
