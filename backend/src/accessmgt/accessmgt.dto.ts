import { NewPermission, NewRole, Permission, Role } from "@/core/db/schema";
import { IsNotEmpty, Max, Min } from "class-validator";
import { ActionType, ResourceType } from "./accessmgt.types";
import { Expose } from "class-transformer";

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
  @Expose()
  userId: string;
  
  @Expose()
  all?: boolean;

  @Expose()
  @Max(100)
  limit?: number;

  @Expose()
  @Min(0)
  offset?: number;
}

export class GetRolePermissionsDTO implements GetRolePermissionsInterface {
  @Expose()
  roleId: string;
  
  @Expose()
  all?: boolean;
  
  @Expose()
  @Max(100)
  limit?: number;
  
  @Expose()
  @Min(0)
  offset?: number;
}

export class RoleDTO implements RoleDTOInterface {
  @Expose()
  id: string;
  
  @Expose()
  name: string | null;
  
  @Expose()
  description: string | null;
  
  @Expose()
  createdAt: Date;
}

export class PermissionDTO implements PermissionDTOInterface {
  @Expose()
  id: string;
  
  @Expose()
  name: string | null;
  
  @Expose()
  action: string;
  
  @Expose()
  resource: string;
  
  @Expose()
  resourceId: string | null;
  
  @Expose()
  description: string | null;
  
  @Expose()
  createdAt: Date;
}

export class CreateRoleDTO implements CreateRoleDTOInterface {
  @Expose()
  name: string | null;
  
  @Expose()
  description: string | null;
}

export class CreatePermissionDTO implements CreatePermissionDTOInterface {
  @Expose()
  name: string | null;

  @Expose()
  @IsNotEmpty()
  action: ActionType;

  @Expose()
  @IsNotEmpty()
  resource: ResourceType;

  @Expose()
  resourceId: string | null;
  
  @Expose()
  description: string | null;
}

export class RoleAssignmentDTO implements RoleAssignmentDTOInterface {
  @Expose()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @IsNotEmpty()
  roleId: string;
}

export class PermissionAssignmentDTO
  implements PermissionAssignmentDTOInterface
{
  @Expose()
  @IsNotEmpty()
  roleId: string;

  @Expose()
  @IsNotEmpty()
  permissionId: string;
}
