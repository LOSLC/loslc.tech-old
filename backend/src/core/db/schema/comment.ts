import { randId } from "@/core/utils/crypto";
import { pgTable, text, varchar, type AnyPgColumn } from "drizzle-orm/pg-core";
import { blogPostsTable } from "./blogPost";
import { usersTable } from "./user";

export const commentsTable = pgTable("comments", {
  id: varchar("id")
    .$defaultFn(() => randId(10))
    .primaryKey()
    .notNull(),
  authorId: varchar("author_id")
    .notNull()
    .references((): AnyPgColumn => usersTable.id, {
      onDelete: "cascade",
    }),
  postId: varchar("post_id")
    .notNull()
    .references((): AnyPgColumn => blogPostsTable.id, {
      onDelete: "cascade",
    }),
  parentId: varchar("parent_id").references(
    (): AnyPgColumn => commentsTable.id,
    {
      onDelete: "cascade",
    },
  ),
  content: text("content").notNull(),
});

export type Comment = typeof commentsTable.$inferSelect;
export type NewComment = typeof commentsTable.$inferInsert;
