import { NewPermission, NewRole, Permission, Role } from "@/core/db/schema";
import { IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import { ActionType, ResourceType } from "./accessmgt.types";
import { Transform, Type } from "class-transformer";

interface GetUserRolesInterface {
  userId: string;
  all?: boolean;
  limit?: number;
  offset?: number;
}

interface GetRolePermissionsInterface {
  roleId: string;
  all?: boolean;
  limit?: number;
  offset?: number;
}

interface RoleDTOInterface extends Role {}
interface PermissionDTOInterface extends Permission {}

interface CreateRoleDTOInterface extends NewRole {}
interface CreatePermissionDTOInterface extends NewPermission {
  action: ActionType;
  resource: ResourceType;
}

interface RoleAssignmentDTOInterface {
  userId: string;
  roleId: string;
}
interface PermissionAssignmentDTOInterface {
  roleId: string;
  permissionId: string;
}

export class GetUserRolesDTO implements GetUserRolesInterface {
  userId: string;
  
  all?: boolean;

  @Max(100)
  limit?: number;

  @Min(0)
  offset?: number;
}

export class GetRolePermissionsDTO implements GetRolePermissionsInterface {
  roleId: string;
  
  all?: boolean;
  
  @Max(100)
  limit?: number;
  
  @Min(0)
  offset?: number;
}

export class RoleDTO implements RoleDTOInterface {
  id: string;
  
  name: string | null;
  
  description: string | null;
  
  createdAt: Date;
}

export class PermissionDTO implements PermissionDTOInterface {
  id: string;
  
  name: string | null;
  
  action: string;
  
  resource: string;
  
  resourceId: string | null;
  
  description: string | null;
  
  createdAt: Date;
}

export class CreateRoleDTO implements CreateRoleDTOInterface {
  @IsOptional()
  name: string | null;
  
  @IsOptional()
  description: string | null;
}

export class CreatePermissionDTO implements CreatePermissionDTOInterface {
  name: string | null;

  @IsNotEmpty()
  action: ActionType;

  @IsNotEmpty()
  resource: ResourceType;

  resourceId: string | null;
  
  description: string | null;
}

export class RoleAssignmentDTO implements RoleAssignmentDTOInterface {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  roleId: string;
}

export class PermissionAssignmentDTO
  implements PermissionAssignmentDTOInterface
{
  @IsNotEmpty()
  roleId: string;

  @IsNotEmpty()
  permissionId: string;
}
