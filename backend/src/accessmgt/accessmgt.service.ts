import { checkConditions } from "@/common/checkers/utils";
import { db } from "@/core/db/db";
import * as objsAreEqual from "fast-deep-equal";
import {
  permissionsTable,
  RolePermissionLink,
  rolePermissionsTable,
  rolesTable,
  User,
  UserRoleLink,
  userRolesTable,
  usersTable,
} from "@/core/db/schema";
import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import {
  CreatePermissionDTO,
  CreateRoleDTO,
  GetRolePermissionsDTO,
  GetUserRolesDTO,
  PermissionAssignmentDTO,
  PermissionDTO,
  RoleAssignmentDTO,
  RoleDTO,
} from "./accessmgt.dto";
import { Message } from "@/common/dto/message";
import {
  BypassRoles as BypassRolesReg,
  BypassRole,
  ActionType,
  ResourceType,
  PermissionCheck,
} from "./accessmgt.types";
import { toUserDTO } from "@/users/users.dto";

@Injectable()
export class AccessmgtService {
  async getAllRoles({
    all,
    limit,
    offset,
  }: { all?: boolean; limit?: number; offset?: number } = {}): Promise<
    RoleDTO[]
  > {
    const rolesQuery = db.select().from(rolesTable);
    if (all) {
      const result = await rolesQuery;
      return result;
    }
    const result = await rolesQuery.limit(limit ?? 10).offset(offset ?? 0);
    return result;
  }

  async getAllPermissions({
    all,
    limit,
    offset,
  }: { all?: boolean; limit?: number; offset?: number } = {}): Promise<
    PermissionDTO[]
  > {
    const permissionsQuery = db.select().from(permissionsTable);
    if (all) {
      const result = await permissionsQuery;
      return result;
    }
    const result = await permissionsQuery
      .limit(limit ?? 10)
      .offset(offset ?? 0);
    return result;
  }

  async getRolesUsers({
    roleId,
    limit,
    all,
    offset,
  }: {
    roleId: string;
    limit?: number;
    all?: boolean;
    offset?: number;
  }) {
    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Role not found",
    });

    const usersQuery = db
      .select({ usersTable })
      .from(usersTable)
      .innerJoin(
        userRolesTable,
        and(
          eq(userRolesTable.roleId, roleId),
          eq(userRolesTable.userId, usersTable.id),
        ),
      );
    const result = (
      all
        ? await usersQuery
        : await usersQuery.limit(limit ?? 10).offset(offset ?? 0)
    ).map((u) => toUserDTO(u.usersTable));
    return result;
  }

  async getPermissionsUsers({
    permissionId,
    limit,
    all,
    offset,
  }: {
    permissionId: string;
    limit?: number;
    all?: boolean;
    offset?: number;
  }) {
    const [permission] = await db
      .select()
      .from(permissionsTable)
      .where(eq(permissionsTable.id, permissionId))
      .limit(1);
    checkConditions({
      conditions: [!!permission],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Permission not found",
    });

    const usersQuery = db
      .select({ usersTable })
      .from(usersTable)
      .innerJoin(
        userRolesTable,
        and(
          eq(userRolesTable.userId, usersTable.id),
          eq(userRolesTable.roleId, rolesTable.id),
        ),
      )
      .innerJoin(rolesTable, eq(rolesTable.id, userRolesTable.roleId))
      .innerJoin(
        rolePermissionsTable,
        and(
          eq(rolePermissionsTable.permissionId, permissionId),
          eq(rolePermissionsTable.roleId, rolesTable.id),
        ),
      );
    const result = (
      all
        ? await usersQuery
        : await usersQuery.limit(limit ?? 10).offset(offset ?? 0)
    ).map((u) => toUserDTO(u.usersTable));
    return result;
  }

  async getUserRoles({
    userId,
    limit = 10,
    all = false,
    offset = 0,
  }: GetUserRolesDTO): Promise<RoleDTO[]> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    checkConditions({
      conditions: [!!user],
      statusCode: HttpStatus.NOT_FOUND,
      message: "User not found",
    });
    const rolesQuery = db
      .select({ rolesTable })
      .from(rolesTable)
      .innerJoin(
        userRolesTable,
        and(
          eq(userRolesTable.userId, userId),
          eq(userRolesTable.roleId, rolesTable.id),
        ),
      );
    if (all) {
      const result = (await rolesQuery).map((r) => r.rolesTable);
      return result;
    }
    const result = (await rolesQuery.offset(offset).limit(limit)).map(
      (r) => r.rolesTable,
    );
    return result;
  }

  async getRolePermissions({
    roleId,
    all = false,
    limit = 10,
    offset = 0,
  }: GetRolePermissionsDTO): Promise<PermissionDTO[]> {
    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "User not found",
    });
    const permissionsQuery = db
      .select({ permissionsTable })
      .from(permissionsTable)
      .innerJoin(
        rolePermissionsTable,
        and(
          eq(rolePermissionsTable.roleId, roleId),
          eq(rolePermissionsTable.permissionId, permissionsTable.id),
        ),
      );
    if (all) {
      const result = (await permissionsQuery).map((r) => r.permissionsTable);
      return result;
    }
    const result = (await permissionsQuery.offset(offset).limit(limit)).map(
      (r) => r.permissionsTable,
    );
    return result;
  }

  async getRoleById(roleId: string): Promise<RoleDTO> {
    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Role not found",
    });
    return role;
  }

  async getPermissionById(permissionId: string): Promise<PermissionDTO> {
    const [permission] = await db
      .select()
      .from(permissionsTable)
      .where(eq(permissionsTable.id, permissionId))
      .limit(1);
    checkConditions({
      conditions: [!!permission],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Permission not found",
    });
    return permission;
  }

  async createRole(props: CreateRoleDTO): Promise<RoleDTO> {
    const [role] = await db
      .insert(rolesTable)
      .values({
        name: props.name,
        description: props.description,
      })
      .returning();
    return role;
  }

  async createPermission(props: CreatePermissionDTO): Promise<PermissionDTO> {
    const [permission] = await db
      .insert(permissionsTable)
      .values(props)
      .returning();
    return permission;
  }

  async assignRoleToUser({
    userId,
    roleId,
  }: RoleAssignmentDTO): Promise<UserRoleLink> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    checkConditions({
      conditions: [!!user],
      statusCode: HttpStatus.NOT_FOUND,
      message: "User not found",
    });

    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Role not found",
    });

    const [r] = await db
      .insert(userRolesTable)
      .values({ userId, roleId })
      .returning();
    return r;
  }

  async assignPermissionToRole({
    roleId,
    permissionId,
  }: PermissionAssignmentDTO): Promise<RolePermissionLink> {
    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Role not found",
    });

    const [permission] = await db
      .select()
      .from(permissionsTable)
      .where(eq(permissionsTable.id, permissionId))
      .limit(1);
    checkConditions({
      conditions: [!!permission],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Permission not found",
    });

    const [r] = await db
      .insert(rolePermissionsTable)
      .values({ roleId, permissionId })
      .returning();
    return r;
  }

  async revokeRoleFromUser({
    userId,
    roleId,
  }: RoleAssignmentDTO): Promise<Message> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    checkConditions({
      conditions: [!!user],
      statusCode: HttpStatus.NOT_FOUND,
      message: "User not found",
    });

    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Role not found",
    });

    await db
      .delete(userRolesTable)
      .where(
        and(
          eq(userRolesTable.userId, userId),
          eq(userRolesTable.roleId, roleId),
        ),
      )
      .returning();
    return { message: "Role revoked from user successfully" };
  }

  async revokePermissionFromRole({
    roleId,
    permissionId,
  }: PermissionAssignmentDTO): Promise<Message> {
    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Role not found",
    });

    const [permission] = await db
      .select()
      .from(permissionsTable)
      .where(eq(permissionsTable.id, permissionId))
      .limit(1);
    checkConditions({
      conditions: [!!permission],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Permission not found",
    });

    await db
      .delete(rolePermissionsTable)
      .where(
        and(
          eq(rolePermissionsTable.roleId, roleId),
          eq(rolePermissionsTable.permissionId, permissionId),
        ),
      )
      .returning();

    return { message: "Permission revoked from role successfully" };
  }

  async deleteRole(roleId: string): Promise<Message> {
    const [role] = await db
      .delete(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .returning();
    checkConditions({
      conditions: [!!role],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Role not found",
    });
    return { message: "Role deleted successfully" };
  }

  async deletePermission(permissionId: string): Promise<Message> {
    const [permission] = await db
      .delete(permissionsTable)
      .where(eq(permissionsTable.id, permissionId))
      .returning();
    checkConditions({
      conditions: [!!permission],
      statusCode: HttpStatus.NOT_FOUND,
      message: "Permission not found",
    });
    return { message: "Permission deleted successfully" };
  }

  async checkPermissions({
    user,
    permissions,
    either = false,
    bypassRole,
  }: {
    user: User;
    permissions: PermissionCheck[];
    either?: boolean;
    bypassRole?: BypassRole;
  }) {
    const userRoles = await this.getUserRoles({
      userId: user.id,
      all: true,
    });

    const check = async () => {
      if (bypassRole) {
        const bypassed = userRoles.filter(
          (r) =>
            r.name &&
            BypassRolesReg[r.name] !== undefined &&
            (BypassRolesReg[r.name] as number) >=
              BypassRolesReg[bypassRole.roleName],
        );
        if (bypassed.length > 0) {
          return true;
        }
      }

      if (either) {
        for (const role of userRoles) {
          const rolePermissions: PermissionCheck[] = (
            await this.getRolePermissions({
              roleId: role.id,
              all: true,
            })
          ).map((o) => {
            return {
              action: o.action as ActionType,
              resource: o.resource as ResourceType,
              resourceId: o.resourceId,
            };
          });
          for (const pcheck of permissions) {
            const hasPermission = rolePermissions.some(
              (p) =>
                objsAreEqual(p, {
                  action: pcheck.action,
                  resource: pcheck.resource,
                  resourceId: pcheck.resourceId,
                }) ||
                (objsAreEqual(
                  { resource: p.resource, action: p.action },
                  { resource: p.resource, action: pcheck.action },
                ) &&
                  (p.resourceId === null || p.resourceId === undefined)),
            );
            if (hasPermission) {
              return true;
            }
          }
        }
      } else {
        for (const p of permissions) {
          let hasPermission = false;
          for (const role of userRoles) {
            const roleHasPermission = (
              await this.getRolePermissions({ roleId: role.id, all: true })
            )
              .map((perm) => {
                return `${perm.action}:${perm.resource}${perm.resourceId ? `:${perm.resourceId}` : ""}`;
              })
              .includes(
                `${p.action}:${p.resource}${p.resourceId ? `:${p.resourceId ?? ""}` : ""}`,
              );
            if (roleHasPermission) {
              hasPermission = true;
              break;
            }
          }
          if (!hasPermission) {
            return false;
          }
        }
        return true;
      }
      return false;
    };
    if (!(await check())) {
      throw new UnauthorizedException("Not authorized to access this resource");
    }
    return true;
  }

  async isHigher(ua: User, ub: User): Promise<boolean> {
    const uaRoles = await this.getUserRoles({ userId: ua.id, all: true });
    const ubRoles = await this.getUserRoles({ userId: ub.id, all: true });

    if (uaRoles.length === 0 || ubRoles.length === 0) {
      return false;
    }

    const uaPriority = uaRoles.reduce((acc, role) => {
      const rolePriority =
        (BypassRolesReg[role.name ?? ""] as number | undefined) ?? 0;
      if (rolePriority > acc) {
        return rolePriority;
      }
      return acc;
    }, 0);
    const ubPriority = ubRoles.reduce((acc, role) => {
      const rolePriority =
        (BypassRolesReg[role.name ?? ""] as number | undefined) ?? 0;
      if (rolePriority > acc) {
        return rolePriority;
      }
      return acc;
    }, 0);

    return uaPriority > ubPriority;
  }

  async isAdmin(user: User): Promise<boolean> {
    const userRoles = await this.getUserRoles({
      userId: user.id,
      all: true,
    });

    return userRoles.some(
      (role) =>
        role.name && (role.name === "admin" || role.name === "superadmin"),
    );
  }
}
