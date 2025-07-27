import type {
  RoleCreationDTO,
  RoleUpdateDTO,
  PermissionCreationDTO,
  PermissionUpdateDTO,
  RoleAssignmentDTO,
  PermissionAssignmentDTO,
} from "../dto/accessmgt";
import { db } from "@/core/db/db";
import { safeQuery } from "../middleware/drizzle";
import {
  rolesTable,
  usersRolesTable,
  permissionsTable,
  rolesPermissionsTable,
  type NewRole,
  type NewPermission,
  type NewUserRole,
  type NewRolePermission,
} from "@/core/db/schema/security";
import { and, eq } from "drizzle-orm";
import { checkConditions } from "@/core/security/checkers";
import { StatusCodes } from "http-status-codes";

export async function createRole({ name, description }: RoleCreationDTO) {
  const newRole: NewRole = {
    name,
    description,
  };

  const result = await safeQuery(() =>
    db.insert(rolesTable).values(newRole).returning()
  );
  return result[0];
}

export async function getAllRoles() {
  return await safeQuery(() => db.select().from(rolesTable));
}

export async function getRoleById(id: string) {
  const result = await safeQuery(() =>
    db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, id))
      .limit(1)
  );
  checkConditions([
    {
      condition: result.length > 0,
      message: "Role not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return result[0];
}

export async function updateRole(id: string, data: RoleUpdateDTO) {
  const result = await safeQuery(() =>
    db
      .update(rolesTable)
      .set(data)
      .where(eq(rolesTable.id, id))
      .returning()
  );

  checkConditions([
    {
      condition: result.length > 0,
      message: "Role not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return result[0];
}

export async function deleteRole(id: string) {
  await safeQuery(() =>
    db.delete(usersRolesTable).where(eq(usersRolesTable.roleId, id))
  );

  await safeQuery(() =>
    db
      .delete(rolesPermissionsTable)
      .where(eq(rolesPermissionsTable.roleId, id))
  );

  const result = await safeQuery(() =>
    db
      .delete(rolesTable)
      .where(eq(rolesTable.id, id))
      .returning()
  );

  checkConditions([
    {
      condition: result.length > 0,
      message: "Role not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return { message: "Role deleted successfully" };
}

export async function createPermission({
  name,
  resource,
  resourceId,
  action,
  description,
}: PermissionCreationDTO) {
  const newPermission: NewPermission = {
    name,
    resource,
    resourceId,
    action,
    description,
  };

  const result = await safeQuery(() =>
    db
      .insert(permissionsTable)
      .values(newPermission)
      .returning()
  );
  return result[0];
}

export async function getAllPermissions() {
  return await safeQuery(() => db.select().from(permissionsTable));
}

export async function getPermissionById(id: string) {
  const result = await safeQuery(() =>
    db
      .select()
      .from(permissionsTable)
      .where(eq(permissionsTable.id, id))
      .limit(1)
  );

  checkConditions([
    {
      condition: result.length > 0,
      message: "Permission not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return result[0];
}

export async function updatePermission(id: string, data: PermissionUpdateDTO) {
  const result = await safeQuery(() =>
    db
      .update(permissionsTable)
      .set(data)
      .where(eq(permissionsTable.id, id))
      .returning()
  );

  checkConditions([
    {
      condition: result.length > 0,
      message: "Permission not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return result[0];
}

export async function deletePermission(id: string) {
  await safeQuery(() =>
    db
      .delete(rolesPermissionsTable)
      .where(eq(rolesPermissionsTable.permissionId, id))
  );

  const result = await safeQuery(() =>
    db
      .delete(permissionsTable)
      .where(eq(permissionsTable.id, id))
      .returning()
  );

  checkConditions([
    {
      condition: result.length > 0,
      message: "Permission not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return { message: "Permission deleted successfully" };
}

export async function assignRoleToUser({ userId, roleId }: RoleAssignmentDTO) {
  const existing = await safeQuery(() =>
    db
      .select()
      .from(usersRolesTable)
      .where(
        and(
          eq(usersRolesTable.userId, userId),
          eq(usersRolesTable.roleId, roleId),
        ),
      )
      .limit(1)
  );

  checkConditions([
    {
      condition: existing.length === 0,
      message: "Role already assigned to user",
      status: StatusCodes.CONFLICT,
    },
  ]);

  const newAssignment: NewUserRole = {
    userId,
    roleId,
  };

  await safeQuery(() =>
    db.insert(usersRolesTable).values(newAssignment)
  );
  return { message: "Role assigned successfully" };
}

export async function removeRoleFromUser({
  userId,
  roleId,
}: RoleAssignmentDTO) {
  const result = await safeQuery(() =>
    db
      .delete(usersRolesTable)
      .where(
        and(
          eq(usersRolesTable.userId, userId),
          eq(usersRolesTable.roleId, roleId),
        ),
      )
      .returning()
  );

  checkConditions([
    {
      condition: result.length > 0,
      message: "Role assignment not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return { message: "Role removed successfully" };
}

export async function getUserRoles(userId: string) {
  return await safeQuery(() =>
    db
      .select({ role: rolesTable })
      .from(rolesTable)
      .innerJoin(usersRolesTable, eq(rolesTable.id, usersRolesTable.roleId))
      .where(eq(usersRolesTable.userId, userId))
  );
}

export async function assignPermissionToRole({
  roleId,
  permissionId,
}: PermissionAssignmentDTO) {
  const existing = await safeQuery(() =>
    db
      .select()
      .from(rolesPermissionsTable)
      .where(
        and(
          eq(rolesPermissionsTable.roleId, roleId),
          eq(rolesPermissionsTable.permissionId, permissionId),
        ),
      )
      .limit(1)
  );

  checkConditions([
    {
      condition: existing.length === 0,
      message: "Permission already assigned to role",
      status: StatusCodes.CONFLICT,
    },
  ]);

  const newAssignment: NewRolePermission = {
    roleId,
    permissionId,
  };

  await safeQuery(() =>
    db.insert(rolesPermissionsTable).values(newAssignment)
  );
  return { message: "Permission assigned successfully" };
}

export async function removePermissionFromRole({
  roleId,
  permissionId,
}: PermissionAssignmentDTO) {
  const result = await safeQuery(() =>
    db
      .delete(rolesPermissionsTable)
      .where(
        and(
          eq(rolesPermissionsTable.roleId, roleId),
          eq(rolesPermissionsTable.permissionId, permissionId),
        ),
      )
      .returning()
  );

  checkConditions([
    {
      condition: result.length > 0,
      message: "Permission assignment not found",
      status: StatusCodes.NOT_FOUND,
    },
  ]);
  return { message: "Permission removed successfully" };
}

export async function getRolePermissions(roleId: string) {
  return await safeQuery(() =>
    db
      .select({ permission: permissionsTable })
      .from(permissionsTable)
      .innerJoin(
        rolesPermissionsTable,
        eq(permissionsTable.id, rolesPermissionsTable.permissionId),
      )
      .where(eq(rolesPermissionsTable.roleId, roleId))
  );
}
