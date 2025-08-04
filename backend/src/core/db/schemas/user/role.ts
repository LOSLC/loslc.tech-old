import { randString } from "@/core/utils/random";
import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const rolesTable = pgTable("role", {
  id: pg
    .varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randString()),
  name: pg.varchar("name"),
  description: pg.text("description"),
  createdAt: pg.timestamp("created_at").defaultNow().notNull(),
});

export const userRolesTable = pgTable("user_role", {
  userId: pg
    .varchar("user_id")
    .references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  roleId: pg
    .varchar()
    .notNull()
    .references((): pg.AnyPgColumn => rolesTable.id, { onDelete: "cascade" }),
});

export type Role = typeof rolesTable.$inferSelect;
export type UserRoleLink = typeof userRolesTable.$inferSelect;
export type NewRole = typeof rolesTable.$inferInsert;
export type NewUserRoleLink = typeof userRolesTable.$inferInsert;
