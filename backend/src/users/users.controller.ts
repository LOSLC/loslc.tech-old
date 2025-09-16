import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateUserInfoDTO, UserBanDTO, UserBanResponseDTO } from "./users.dto";
import { User as UserDecorator } from "@/common/decorators/user.decorator";
import { User } from "@/core/db/schema";
import { AuthGuard } from "@/auth/auth.guard";
import { AccessGuard } from "@/accessmgt/accessmgt.guard";
import { BypassRole } from "@/accessmgt/bypassroles.decorator";
import { Permissions } from "@/accessmgt/permissions.decorator";

@ApiTags("Users")
@Controller("users")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("public/:userId")
  @ApiOperation({
    summary: "Get minimal public user info",
    description: "Returns only id, username, fullName and profilePictureFileId for public display",
  })
  @ApiParam({ name: "userId", description: "The unique identifier of the user" })
  @ApiResponse({
    status: 200,
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        username: { type: "string" },
        fullName: { type: "string" },
        profilePictureFileId: { type: "string", nullable: true },
      },
    },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async getPublicUser(@Param("userId") userId: string) {
    return this.usersService.getPublicUser(userId);
  }

  @Get("me")
  @ApiOperation({
    summary: "Get current user",
    description: "Retrieve the authenticated user's profile information",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved current user",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        username: { type: "string" },
        fullName: { type: "string" },
        profilePictureFileId: { type: "string", nullable: true },
        joinedAt: { type: "string", format: "date-time" },
        lastUpdated: { type: "string", format: "date-time" },
        isBanned: { type: "boolean" },
        isVerified: { type: "boolean" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @UseGuards(AuthGuard)
  async getCurrentUser(@UserDecorator() user: User) {
    return this.usersService.getCurrentUser(user);
  }

  @Get()
  @ApiOperation({
    summary: "Get all users",
    description: "Retrieve a paginated list of all users in the system",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of users to return (max 100)",
    required: false,
    type: "number",
    example: 20,
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
    description: "Successfully retrieved users",
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
          lastUpdated: { type: "string", format: "date-time" },
          isBanned: { type: "boolean" },
          isVerified: { type: "boolean" },
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
  @Permissions([{ resource: "user", action: "r" }])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getUsers(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.usersService.getUsers({ limit, offset });
  }

  @Get(":userId")
  @ApiOperation({
    summary: "Get user by ID",
    description:
      "Retrieve a specific user's profile information by their unique identifier",
  })
  @ApiParam({
    name: "userId",
    description: "The unique identifier of the user",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved user",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        username: { type: "string" },
        fullName: { type: "string" },
        profilePictureFileId: { type: "string", nullable: true },
        joinedAt: { type: "string", format: "date-time" },
        lastUpdated: { type: "string", format: "date-time" },
        isBanned: { type: "boolean" },
        isVerified: { type: "boolean" },
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
  @UseGuards(AuthGuard)
  async getUserById(@Param("userId") userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Patch("me")
  @ApiOperation({
    summary: "Update current user information",
    description:
      "Update changeable information for the authenticated user (currently only fullName)",
  })
  @ApiBody({
    type: UpdateUserInfoDTO,
    description: "User information to update",
    examples: {
      example1: {
        summary: "Update full name",
        value: {
          fullName: "John Doe Updated",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Successfully updated user information",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        username: { type: "string" },
        fullName: { type: "string" },
        profilePictureFileId: { type: "string", nullable: true },
        joinedAt: { type: "string", format: "date-time" },
        lastUpdated: { type: "string", format: "date-time" },
        isBanned: { type: "boolean" },
        isVerified: { type: "boolean" },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid input data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  async updateCurrentUserInfo(
    @UserDecorator() user: User,
    @Body() updateData: UpdateUserInfoDTO,
  ) {
    return this.usersService.updateUserInfo(user.id, updateData);
  }

  @Post(":userId/profile-picture/:fileId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Change user profile picture",
    description: "Change the profile picture for a specific user",
  })
  @ApiParam({
    name: "userId",
    description: "The unique identifier of the user",
    type: "string",
  })
  @ApiParam({
    name: "fileId",
    description: "The unique identifier of the file to set as profile picture",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully changed profile picture",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        username: { type: "string" },
        fullName: { type: "string" },
        profilePictureFileId: { type: "string" },
        joinedAt: { type: "string", format: "date-time" },
        lastUpdated: { type: "string", format: "date-time" },
        isBanned: { type: "boolean" },
        isVerified: { type: "boolean" },
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
    description: "User or file not found",
  })
  @UseGuards(AuthGuard)
  async changeProfilePicture(
    @Param("fileId") fileId: string,
    @UserDecorator() currentUser: User,
  ) {
    return this.usersService.changeProfilePicture({
      id: fileId,
      user: currentUser,
    });
  }

  @Post("ban")
  @ApiOperation({
    summary: "Ban a user",
    description: "Ban a user from the system with a specified reason",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userId: { type: "string", description: "The ID of the user to ban" },
        motive: {
          type: "string",
          description: "The reason for banning the user",
        },
      },
      required: ["userId", "motive"],
    },
    examples: {
      example1: {
        summary: "Ban user for spam",
        value: {
          userId: "123e4567-e89b-12d3-a456-426614174000",
          motive: "Repeated spam violations",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Successfully banned user",
    schema: {
      type: "object",
      properties: {
        userId: { type: "string" },
        motive: { type: "string" },
        bannedBy: { type: "string" },
        bannedAt: { type: "string", format: "date-time" },
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
  @Permissions([{ resource: "user", action: "rw" }])
  @BypassRole({ roleName: "mod" })
  @UseGuards(AuthGuard, AccessGuard)
  async banUser(
    @Body() data: UserBanDTO,
    @UserDecorator() user: User,
  ): Promise<UserBanResponseDTO> {
    return this.usersService.banUser({ data, user });
  }

  @Post("unban/:userId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Unban a user",
    description: "Remove the ban from a previously banned user",
  })
  @ApiParam({
    name: "userId",
    description: "The unique identifier of the user to unban",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully unbanned user",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        username: { type: "string" },
        fullName: { type: "string" },
        profilePictureFileId: { type: "string", nullable: true },
        joinedAt: { type: "string", format: "date-time" },
        lastUpdated: { type: "string", format: "date-time" },
        isBanned: { type: "boolean" },
        isVerified: { type: "boolean" },
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
  @Permissions([{ resource: "user", action: "rw" }])
  @BypassRole({ roleName: "mod" })
  @UseGuards(AuthGuard, AccessGuard)
  async unbanUser(@Param("userId") userId: string) {
    return this.usersService.unbanUser(userId);
  }

  @Delete(":userId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete a user",
    description: "Permanently delete a user from the system",
  })
  @ApiParam({
    name: "userId",
    description: "The unique identifier of the user to delete",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully deleted user",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "User deleted successfully",
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
  @Permissions([{ resource: "user", action: "rw" }])
  @BypassRole({ roleName: "superadmin" })
  @UseGuards(AuthGuard, AccessGuard)
  async deleteUser(
    @Param("userId") userId: string,
    @UserDecorator() user: User,
  ) {
    return this.usersService.deleteUser(userId, user);
  }
}
