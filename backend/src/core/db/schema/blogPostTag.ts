import { randId } from "@/core/utils/crypto";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { blogPostsTable } from "./blogPost";

export const tagsTable = pgTable("tags", {
  id: varchar("id", { length: 10 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => randId(20)),
  name: varchar("name", { length: 100 }).notNull(),
});

export const postTagsTable = pgTable("post_tags", {
  postId: varchar("post_id", { length: 10 })
    .notNull()
    .references(() => blogPostsTable.id),
  tagId: varchar("tag_id", { length: 10 })
    .notNull()
    .references(() => tagsTable.id),
});

export type Tag = typeof tagsTable.$inferSelect;
export type NewTag = typeof tagsTable.$inferInsert;
export type PostTag = typeof postTagsTable.$inferSelect;
export type NewPostTag = typeof postTagsTable.$inferInsert;
