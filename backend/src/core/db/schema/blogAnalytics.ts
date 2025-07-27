import { randId } from "@/core/utils/crypto";
import {
  integer,
  pgTable,
  timestamp,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { blogPostsTable } from "./blogPost";

export const blogPostsViewTable = pgTable("blog_posts_view", {
  id: varchar("id", { length: 20 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => randId(20)),
  viewTime: integer().notNull().default(0),
  userId: varchar("user_id").references((): AnyPgColumn => usersTable.id, {
    onDelete: "cascade",
  }),
  postId: varchar("post_id")
    .notNull()
    .references((): AnyPgColumn => blogPostsTable.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogVisitsTable = pgTable("blog_visits", {
  id: varchar("id", { length: 20 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => randId(20)),
  userId: varchar("user_id").references((): AnyPgColumn => usersTable.id, {
    onDelete: "cascade",
  }),
  visitTime: integer().notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BlogPostsView = typeof blogPostsViewTable.$inferSelect;
export type NewBlogPostsView = typeof blogPostsViewTable.$inferInsert;
export type BlogVisit = typeof blogVisitsTable.$inferSelect;
export type NewBlogVisit = typeof blogVisitsTable.$inferInsert;
