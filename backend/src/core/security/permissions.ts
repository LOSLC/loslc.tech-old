import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  permissionsTable,
  rolesPermissionsTable,
  type Role,
} from "../db/schema/security";
import { and, eq } from "drizzle-orm";

type BypassRoleName = "admin" | "superadmin"

export interface PermissionCheck {
  resource: string;
  resourceId?: string;
  action: string;
}

export class PermissionChecker<DBType extends PostgresJsDatabase> {
  constructor(
    private db: DBType,
    private roles: Role[],
    private checks: PermissionCheck[],
    private bypassRoleNames: BypassRoleName[] = [],
    private either = false,
  ) {
    this.db = db;
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
        const permissionsQuery = this.db
          .select({ p: permissionsTable })
          .from(permissionsTable)
          .innerJoin(rolesPermissionsTable, eq(permissionsTable.id, role.id));
        if (check.resourceId) {
          const result = await permissionsQuery.where(
            and(
              eq(permissionsTable.resource, check.resource),
              eq(permissionsTable.action, check.action),
              eq(permissionsTable.resourceId, check.resourceId),
            ),
          );
          if (result.length > 0) {
            successfullChecks.push(true);
          }
        }
        const result = await permissionsQuery.where(
          and(
            eq(permissionsTable.resource, check.resource),
            eq(permissionsTable.action, check.action),
          ),
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
