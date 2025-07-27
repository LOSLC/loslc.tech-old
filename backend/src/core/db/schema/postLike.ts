import { randId } from "@/core/utils/crypto";
import { pgTable, varchar, type AnyPgColumn } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const postLikesTable = pgTable("post_likes", {
  id: varchar("id", { length: 20 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => randId(20)),
  userId: varchar("user_id")
    .notNull()
    .references((): AnyPgColumn => usersTable.id, {
      onDelete: "cascade",
    }),
  postId: varchar("post_id")
    .notNull()
    .references((): AnyPgColumn => usersTable.id, {
      onDelete: "cascade",
    }),
});

export type PostLike = typeof postLikesTable.$inferSelect;
export type NewPostLike = typeof postLikesTable.$inferInsert;
