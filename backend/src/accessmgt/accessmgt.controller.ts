import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { AccessmgtService } from "./accessmgt.service";
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
  RolePermissionLink,
  UserRoleLink,
  User as UserType,
} from "@/core/db/schema";
import { AuthGuard } from "@/auth/auth.guard";
import { AccessGuard } from "./accessmgt.guard";
import { BypassRole } from "./bypassroles.decorator";
import { Permissions } from "./permissions.decorator";
import { User } from "@/common/decorators/user.decorator";

@ApiTags("Access Management")
@Controller("accessmgt")
export class AccessmgtController {
  constructor(private readonly accessmgtService: AccessmgtService) {}

  @Get("roles")
  @ApiOperation({
    summary: "Get all roles",
    description: "Retrieve all roles in the system",
  })
  @ApiQuery({
    name: "all",
    description: "Return all roles without pagination",
    required: false,
    type: "boolean",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of roles to return (max 100)",
    required: false,
    type: "number",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of roles to skip for pagination",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved roles",
    type: [RoleDTO],
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getAllRoles(
    @Query("all") all?: boolean,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<RoleDTO[]> {
    return this.accessmgtService.getAllRoles({ all, limit, offset });
  }

  @Get("permissions")
  @ApiOperation({
    summary: "Get all permissions",
    description: "Retrieve all permissions in the system",
  })
  @ApiQuery({
    name: "all",
    description: "Return all permissions without pagination",
    required: false,
    type: "boolean",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of permissions to return (max 100)",
    required: false,
    type: "number",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of permissions to skip for pagination",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved permissions",
    type: [PermissionDTO],
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getAllPermissions(
    @Query("all") all?: boolean,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<PermissionDTO[]> {
    return this.accessmgtService.getAllPermissions({ all, limit, offset });
  }

  @Get("users/:userId/roles")
  @ApiOperation({
    summary: "Get user roles",
    description: "Retrieve all roles assigned to a specific user",
  })
  @ApiParam({
    name: "userId",
    description: "The unique identifier of the user",
    type: "string",
  })
  @ApiQuery({
    name: "all",
    description: "Return all roles without pagination",
    required: false,
    type: "boolean",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of roles to return (max 100)",
    required: false,
    type: "number",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of roles to skip for pagination",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved user roles",
    type: [RoleDTO],
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getUserRoles(
    @Param("userId") userId: string,
    @Query("all") all?: boolean,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<RoleDTO[]> {
    const getUserRolesDTO: GetUserRolesDTO = {
      userId,
      all,
      limit,
      offset,
    };
    return this.accessmgtService.getUserRoles(getUserRolesDTO);
  }

  @Get("roles/:roleId/permissions")
  @ApiOperation({
    summary: "Get role permissions",
    description: "Retrieve all permissions assigned to a specific role",
  })
  @ApiParam({
    name: "roleId",
    description: "The unique identifier of the role",
    type: "string",
  })
  @ApiQuery({
    name: "all",
    description: "Return all permissions without pagination",
    required: false,
    type: "boolean",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of permissions to return (max 100)",
    required: false,
    type: "number",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of permissions to skip for pagination",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved role permissions",
    type: [PermissionDTO],
  })
  @ApiResponse({
    status: 404,
    description: "Role not found",
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getRolePermissions(
    @Param("roleId") roleId: string,
    @Query("all") all?: boolean,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<PermissionDTO[]> {
    const getRolePermissionsDTO: GetRolePermissionsDTO = {
      roleId,
      all,
      limit,
      offset,
    };
    return this.accessmgtService.getRolePermissions(getRolePermissionsDTO);
  }

  @Get("roles/:roleId")
  @ApiOperation({
    summary: "Get role by ID",
    description: "Retrieve a specific role by its unique identifier",
  })
  @ApiParam({
    name: "roleId",
    description: "The unique identifier of the role",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved role",
    type: RoleDTO,
  })
  @ApiResponse({
    status: 404,
    description: "Role not found",
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getRoleById(@Param("roleId") roleId: string): Promise<RoleDTO> {
    return this.accessmgtService.getRoleById(roleId);
  }

  @Get("roles/:roleId/users")
  @ApiOperation({
    summary: "Get users with role",
    description: "Retrieve all users assigned to a specific role",
  })
  @ApiParam({
    name: "roleId",
    description: "The unique identifier of the role",
    type: "string",
  })
  @ApiQuery({
    name: "all",
    description: "Return all users without pagination",
    required: false,
    type: "boolean",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of users to return (max 100)",
    required: false,
    type: "number",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of users to skip for pagination",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved users with role",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          username: { type: "string" },
          fullName: { type: "string" },
          profilePictureFileId: { type: "string", nullable: true },
          joinedAt: { type: "string", format: "date-time" },
          isBanned: { type: "boolean" },
          isVerified: { type: "boolean" },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Role not found",
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getRoleUsers(
    @Param("roleId") roleId: string,
    @Query("all") all?: boolean,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.accessmgtService.getRolesUsers({
      roleId,
      all,
      limit,
      offset,
    });
  }

  @Get("permissions/:permissionId")
  @ApiOperation({
    summary: "Get permission by ID",
    description: "Retrieve a specific permission by its unique identifier",
  })
  @ApiParam({
    name: "permissionId",
    description: "The unique identifier of the permission",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved permission",
    type: PermissionDTO,
  })
  @ApiResponse({
    status: 404,
    description: "Permission not found",
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getPermissionById(
    @Param("permissionId") permissionId: string,
  ): Promise<PermissionDTO> {
    return this.accessmgtService.getPermissionById(permissionId);
  }

  @Get("permissions/:permissionId/users")
  @ApiOperation({
    summary: "Get users with permission",
    description: "Retrieve all users that have a specific permission (through their roles)",
  })
  @ApiParam({
    name: "permissionId",
    description: "The unique identifier of the permission",
    type: "string",
  })
  @ApiQuery({
    name: "all",
    description: "Return all users without pagination",
    required: false,
    type: "boolean",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of users to return (max 100)",
    required: false,
    type: "number",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of users to skip for pagination",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved users with permission",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          username: { type: "string" },
          fullName: { type: "string" },
          profilePictureFileId: { type: "string", nullable: true },
          joinedAt: { type: "string", format: "date-time" },
          isBanned: { type: "boolean" },
          isVerified: { type: "boolean" },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Permission not found",
  })
  @Permissions([
    { resource: "user", action: "r" },
    { resource: "role", action: "rw" },
  ])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getPermissionUsers(
    @Param("permissionId") permissionId: string,
    @Query("all") all?: boolean,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.accessmgtService.getPermissionsUsers({
      permissionId,
      all,
      limit,
      offset,
    });
  }

  @Post("roles")
  @ApiOperation({
    summary: "Create a new role",
    description: "Create a new role in the system",
  })
  @ApiBody({
    type: CreateRoleDTO,
    description: "Role creation data",
    examples: {
      example1: {
        summary: "Admin role example",
        value: {
          name: "Administrator",
          description: "Full system access with all permissions",
        },
      },
      example2: {
        summary: "User role example",
        value: {
          name: "User",
          description: "Basic user access with limited permissions",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Role created successfully",
    type: RoleDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async createRole(@Body() createRoleDTO: CreateRoleDTO): Promise<RoleDTO> {
    console.log(createRoleDTO)
    return this.accessmgtService.createRole(createRoleDTO);
  }

  @Post("permissions")
  @ApiOperation({
    summary: "Create a new permission",
    description: "Create a new permission in the system",
  })
  @ApiBody({
    type: CreatePermissionDTO,
    description: "Permission creation data",
    examples: {
      example1: {
        summary: "User management permission",
        value: {
          name: "Manage Users",
          action: "manage",
          resource: "users",
          resourceId: null,
          description: "Permission to create, update, and delete users",
        },
      },
      example2: {
        summary: "Read specific post permission",
        value: {
          name: "Read Specific Post",
          action: "read",
          resource: "posts",
          resourceId: "123e4567-e89b-12d3-a456-426614174000",
          description: "Permission to read a specific post",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Permission created successfully",
    type: PermissionDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async createPermission(
    @Body() createPermissionDTO: CreatePermissionDTO,
  ): Promise<PermissionDTO> {
    console.log(createPermissionDTO);
    return this.accessmgtService.createPermission(createPermissionDTO);
  }

  @Post("users/roles/assign")
  @ApiOperation({
    summary: "Assign role to user",
    description: "Assign a specific role to a user",
  })
  @ApiBody({
    type: RoleAssignmentDTO,
    description: "Role assignment data",
    examples: {
      example1: {
        summary: "Assign admin role",
        value: {
          userId: "123e4567-e89b-12d3-a456-426614174000",
          roleId: "456e7890-e89b-12d3-a456-426614174001",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Role assigned to user successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        roleId: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User or role not found",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async assignRoleToUser(
    @Body() roleAssignmentDTO: RoleAssignmentDTO,
  ): Promise<UserRoleLink> {
    return this.accessmgtService.assignRoleToUser(roleAssignmentDTO);
  }

  @Post("roles/permissions/assign")
  @ApiOperation({
    summary: "Assign permission to role",
    description: "Assign a specific permission to a role",
  })
  @ApiBody({
    type: PermissionAssignmentDTO,
    description: "Permission assignment data",
    examples: {
      example1: {
        summary: "Assign manage users permission",
        value: {
          roleId: "456e7890-e89b-12d3-a456-426614174001",
          permissionId: "789e0123-e89b-12d3-a456-426614174002",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Permission assigned to role successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        roleId: { type: "string" },
        permissionId: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Role or permission not found",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async assignPermissionToRole(
    @Body() permissionAssignmentDTO: PermissionAssignmentDTO,
  ): Promise<RolePermissionLink> {
    return this.accessmgtService.assignPermissionToRole(
      permissionAssignmentDTO,
    );
  }

  @Delete("users/roles/revoke")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Revoke role from user",
    description: "Remove a specific role from a user",
  })
  @ApiBody({
    type: RoleAssignmentDTO,
    description: "Role revocation data",
    examples: {
      example1: {
        summary: "Revoke admin role",
        value: {
          userId: "123e4567-e89b-12d3-a456-426614174000",
          roleId: "456e7890-e89b-12d3-a456-426614174001",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Role revoked from user successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Role revoked from user successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User or role not found",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async revokeRoleFromUser(
    @Body() roleAssignmentDTO: RoleAssignmentDTO,
  ): Promise<Message> {
    return this.accessmgtService.revokeRoleFromUser(roleAssignmentDTO);
  }

  @Delete("roles/permissions/revoke")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Revoke permission from role",
    description: "Remove a specific permission from a role",
  })
  @ApiBody({
    type: PermissionAssignmentDTO,
    description: "Permission revocation data",
    examples: {
      example1: {
        summary: "Revoke manage users permission",
        value: {
          roleId: "456e7890-e89b-12d3-a456-426614174001",
          permissionId: "789e0123-e89b-12d3-a456-426614174002",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Permission revoked from role successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Permission revoked from role successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Role or permission not found",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async revokePermissionFromRole(
    @Body() permissionAssignmentDTO: PermissionAssignmentDTO,
  ): Promise<Message> {
    return this.accessmgtService.revokePermissionFromRole(
      permissionAssignmentDTO,
    );
  }

  @Delete("roles/:roleId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete a role",
    description: "Permanently delete a role from the system",
  })
  @ApiParam({
    name: "roleId",
    description: "The unique identifier of the role to delete",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Role deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Role deleted successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Role not found",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async deleteRole(@Param("roleId") roleId: string): Promise<Message> {
    return this.accessmgtService.deleteRole(roleId);
  }

  @Delete("permissions/:permissionId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete a permission",
    description: "Permanently delete a permission from the system",
  })
  @ApiParam({
    name: "permissionId",
    description: "The unique identifier of the permission to delete",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Permission deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Permission deleted successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Permission not found",
  })
  @Permissions([{ resource: "adminaction", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async deletePermission(
    @Param("permissionId") permissionId: string,
  ): Promise<Message> {
    return this.accessmgtService.deletePermission(permissionId);
  }

  @Get("users/is-admin")
  @ApiOperation({
    summary: "Check if user is admin",
    description: "Check if a specific user has admin or superadmin role",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully checked admin status",
    schema: {
      type: "object",
      properties: {
        isAdmin: {
          type: "boolean",
          description: "Whether the user has admin privileges",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @Permissions([{ resource: "user", action: "r" }])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async isUserAdmin(@User() user: UserType): Promise<{ isAdmin: boolean }> {
    // Create a minimal user object for the isAdmin check
    const isAdmin = await this.accessmgtService.isAdmin(user);
    return { isAdmin };
  }
}
