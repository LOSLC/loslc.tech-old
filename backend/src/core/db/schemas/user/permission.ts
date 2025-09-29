import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { rolesTable } from "./role";
import { randString } from "@/core/utils/random";

export const permissionsTable = pgTable("permission", {
	id: pg
		.varchar("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => randString()),
	name: pg.varchar("name"),
	description: pg.text("description"),
	action: pg.varchar("action").notNull(),
	resource: pg.varchar("resource").notNull(),
	resourceId: pg.varchar("resource_id"),
	createdAt: pg.timestamp("created_at").defaultNow().notNull(),
});

export const rolePermissionsTable = pgTable("role_permission", {
	roleId: pg
		.varchar("role_id")
		.references((): pg.AnyPgColumn => rolesTable.id, { onDelete: "cascade" })
		.notNull(),
	permissionId: pg
		.varchar("permission_id")
		.references((): pg.AnyPgColumn => permissionsTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
});

export type Permission = typeof permissionsTable.$inferSelect;
export type RolePermissionLink = typeof rolePermissionsTable.$inferSelect;
export type NewPermission = typeof permissionsTable.$inferInsert;
export type NewRolePermissionLink = typeof rolePermissionsTable.$inferInsert;
