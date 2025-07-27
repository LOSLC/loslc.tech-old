import type {
  NewPermission,
  NewRole,
  Permission,
  Role,
} from "@/core/db/schema/security";

export type PermissionCreationDTO = NewPermission;
export type PermissionUpdateDTO = Partial<NewPermission>;
export type PermissionDTO = Permission;
export interface PermissionAssignmentDTO {
  roleId: string;
  permissionId: string;
}
export type RoleCreationDTO = NewRole;
export type RoleUpdateDTO = Partial<NewRole>;
export type RoleDTO = Role;
export interface RoleAssignmentDTO {
  userId: string;
  roleId: string;
}
