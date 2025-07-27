import { randId } from "@/core/utils/crypto";
import {
  pgTable,
  timestamp,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const rolesTable = pgTable("roles", {
  id: varchar("id", { length: 20 })
    .$defaultFn(() => randId(20))
    .primaryKey()
    .notNull(),
  name: varchar("name"),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const permissionsTable = pgTable("permissions", {
  id: varchar("id", { length: 20 })
    .$defaultFn(() => randId(20))
    .primaryKey()
    .notNull(),
  name: varchar("name"),
  resource: varchar("resource").notNull(),
  resourceId: varchar("resource_id"),
  action: varchar("actions").notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRolesTable = pgTable("users_roles", {
  userId: varchar("user_id")
    .references((): AnyPgColumn => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  roleId: varchar("role_id")
    .references((): AnyPgColumn => rolesTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const rolesPermissionsTable = pgTable("roles_permissions", {
  roleId: varchar("role_id")
    .references((): AnyPgColumn => rolesTable.id, { onDelete: "cascade" })
    .notNull(),
  permissionId: varchar("permission_id")
    .references((): AnyPgColumn => permissionsTable.id, { onDelete: "cascade" })
    .notNull(),
});

export type Role = typeof rolesTable.$inferSelect;
export type NewRole = typeof rolesTable.$inferInsert;
export type Permission = typeof permissionsTable.$inferSelect;
export type NewPermission = typeof permissionsTable.$inferInsert;
export type UserRole = typeof usersRolesTable.$inferSelect;
export type NewUserRole = typeof usersRolesTable.$inferInsert;
export type RolePermission = typeof rolesPermissionsTable.$inferSelect;
export type NewRolePermission = typeof rolesPermissionsTable.$inferInsert;
