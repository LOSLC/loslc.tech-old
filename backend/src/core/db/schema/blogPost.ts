import { randId } from "@/core/utils/crypto";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const blogPostCategoriesTable = pgTable("blog_posts_categories", {
  id: varchar("id")
    .$defaultFn(() => randId(20))
    .primaryKey()
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  authorId: varchar("author_id").references((): AnyPgColumn => usersTable.id),
});

export const blogPostsTable = pgTable("blog_posts", {
  id: varchar("id")
    .$defaultFn(() => randId(10))
    .primaryKey()
    .notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: varchar("description", { length: 1000 }),
  content: text("content").notNull(),
  authorId: varchar("author_id").references((): AnyPgColumn => usersTable.id),
  categoryId: varchar("category_id").references(
    (): AnyPgColumn => blogPostCategoriesTable.id,
  ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  publishedAt: timestamp("published_at"),
  isPublished: boolean("is_published").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
});

export type BlogPost = typeof blogPostsTable.$inferSelect;
export type NewBlogPost = typeof blogPostsTable.$inferInsert;
export type BlogPostCategory = typeof blogPostCategoriesTable.$inferSelect;
export type NewBlogPostCategory = typeof blogPostCategoriesTable.$inferInsert;
