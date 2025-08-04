import * as pg from "drizzle-orm/pg-core";

export const blogPostCategoriesTable = pg.pgTable("blogpost_category", {
  id: pg.uuid("id").notNull().primaryKey().defaultRandom(),
  name: pg.varchar("name").notNull(),
});
