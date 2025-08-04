import { randString } from "@/core/utils/random";
import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";
import { filesTable } from "../resources/file";
import { blogPostCategoriesTable } from "./category";

export const blogPostsTable = pgTable("blogpost", {
  id: pg
    .varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randString(6)),
  authorId: pg
    .varchar()
    .notNull()
    .references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
  categoryId: pg
    .uuid("category_id")
    .references((): pg.AnyPgColumn => blogPostCategoriesTable.id),
  coverImageId: pg.uuid().references((): pg.AnyPgColumn => filesTable.id),
  title: pg.varchar("title", { length: 500 }).notNull(),
  description: pg.varchar("description", { length: 1000 }).notNull(),
  content: pg.text().notNull(),
  featured: pg.boolean().notNull().default(false),
  published: pg.boolean().notNull().default(false),
  archived: pg.boolean().notNull().default(false),
  createdAt: pg.timestamp().notNull().defaultNow(),
  updatedAt: pg.timestamp(),
});

export type BlogPost = typeof blogPostsTable.$inferSelect;
export type BlogPostInsert = typeof blogPostsTable.$inferInsert;
