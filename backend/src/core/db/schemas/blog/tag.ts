import { randString } from "@/core/utils/random";
import * as pg from "drizzle-orm/pg-core";
import { blogPostsTable } from "./post";
import { usersTable } from "../user/user";

export const blogTagsTable = pg.pgTable("blog_tag", {
  id: pg
    .varchar("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => randString(6)),
  name: pg.varchar("name", { length: 100 }).notNull(),
  userId: pg
    .varchar("user_id")
    .notNull()
    .references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
  createdAt: pg.timestamp().notNull().defaultNow(),
});

export const blogPostTagsTable = pg.pgTable("blogpost_tag_link", {
  postId: pg
    .varchar("post_id")
    .notNull()
    .references((): pg.AnyPgColumn => blogPostsTable.id, {
      onDelete: "cascade",
    }),
  tagId: pg
    .varchar("tag_id")
    .notNull()
    .references((): pg.AnyPgColumn => blogTagsTable.id, {
      onDelete: "cascade",
    }),
});

export type BlogTag = typeof blogTagsTable.$inferSelect;
export type BlogPostTag = typeof blogPostTagsTable.$inferSelect;
export type BlogPostTagInsert = typeof blogPostTagsTable.$inferInsert;
export type BlogTagInsert = typeof blogTagsTable.$inferInsert;
