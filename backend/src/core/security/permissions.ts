import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  permissionsTable,
  rolesPermissionsTable,
  type Role,
} from "../db/schema/security";
import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { safeQuery } from "@/api/v1/middleware/drizzle";

export type Resource =
  | "blogPost"
  | "user"
  | "blogPostComment"
  | "blogPostTag"
  | "blogPostCategory"
  | "adminAction";

type BypassRoleName = "admin" | "superadmin";

export type Action = "rw" | "r";

export const bypassRoleNames: Record<BypassRoleName, string> = {
  admin: "admin",
  superadmin: "superadmin",
};

export const ActionTypes: Record<Action, string> = {
  rw: "rw",
  r: "r",
};

export const ResourceTypes: Record<Resource, string> = {
  blogPost: "blogPost",
  user: "user",
  blogPostComment: "blogPostComment",
  blogPostTag: "blogPostTag",
  adminAction: "adminAction",
  blogPostCategory: "blogPostCategory",
};

export interface PermissionCheck {
  resource: Resource;
  resourceId?: string;
  action: Action;
}

export type DBType<T> = T extends PostgresJsDatabase<infer Schema>
  ? Schema
  : never;

export class PermissionChecker {
  constructor(
    private roles: Role[],
    private checks: PermissionCheck[],
    private bypassRoleNames: BypassRoleName[] = [],
    private either = false,
  ) {
    this.roles = roles;
    this.bypassRoleNames = bypassRoleNames;
    this.checks = checks;
    this.either = either;
  }

  async check(): Promise<boolean> {
    const successfullChecks: boolean[] = [];
    for (const role of this.roles) {
      if (this.bypassRoleNames.includes(role.name as BypassRoleName)) {
        return true;
      }

      for (const check of this.checks) {
        const permissionsQuery = db
          .select({ p: permissionsTable })
          .from(permissionsTable)
          .innerJoin(rolesPermissionsTable, eq(permissionsTable.id, role.id));
        const conditions = [
          eq(permissionsTable.resource, check.resource),
          eq(permissionsTable.action, check.action),
        ];
        if (check.resourceId) {
          conditions.push(eq(permissionsTable.resourceId, check.resourceId));
        }
        const result = await safeQuery(() =>
          permissionsQuery.where(and(...conditions)),
        );
        if (result.length > 0) {
          successfullChecks.push(true);
        }
      }
    }
    if (this.either) {
      return successfullChecks.length > 0;
    }
    return successfullChecks.length >= this.checks.length;
  }
}
