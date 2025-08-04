import { checkConditions } from "@/common/checkers/utils";
import { db } from "@/core/db/db";
import { User, usersTable } from "@/core/db/schema";
import { filesTable } from "@/core/db/schemas/resources/file";
import { banMotivesTable } from "@/core/db/schemas/user/banMotive";
import { HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import {
  UpdateUserInfoDTO,
  UserBanDTO,
  UserBanResponseDTO,
  UserDTO,
} from "./users.dto";
import { AccessmgtService } from "@/accessmgt/accessmgt.service";

@Injectable()
export class UsersService {
  constructor(private accessmgtModule: AccessmgtService) {}
  async getUserById(userId: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    checkConditions({
      conditions: [!!user],
      statusCode: 404,
      message: "User not found",
    });
    const r: UserDTO = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      profilePictureFileId: user.profilePictureFileId,
      joinedAt: user.joinedAt,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
    };
    return r;
  }

  async getCurrentUser(user: User) {
    const r: UserDTO = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      profilePictureFileId: user.profilePictureFileId,
      joinedAt: user.joinedAt,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
    };
    return r;
  }

  async getUsers({
    limit = 20,
    offset = 0,
  }: { limit?: number; offset?: number } = {}): Promise<UserDTO[]> {
    const users = (
      await db.select().from(usersTable).offset(offset).limit(limit)
    ).map((u) => {
      const r: UserDTO = {
        id: u.id,
        email: u.email,
        username: u.username,
        fullName: u.fullName,
        profilePictureFileId: u.profilePictureFileId,
        joinedAt: u.joinedAt,
        isBanned: u.isBanned,
        isVerified: u.isVerified,
      };
      return r;
    });

    return users;
  }

  async updateUserInfo(
    userId: string,
    updateData: UpdateUserInfoDTO,
  ): Promise<UserDTO> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    await this.accessmgtModule.checkPermissions({
      user: user,
      permissions: [
        {
          action: "rw",
          resource: "user",
          resourceId: user.id,
        },
      ],
    });

    checkConditions({
      conditions: [!!user],
      statusCode: 404,
      message: "User not found",
    });

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        fullName: updateData.fullName,
        lastUpdated: new Date(),
      })
      .where(eq(usersTable.id, userId))
      .returning();

    const r: UserDTO = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      fullName: updatedUser.fullName,
      profilePictureFileId: updatedUser.profilePictureFileId,
      joinedAt: updatedUser.joinedAt,
      isBanned: updatedUser.isBanned,
      isVerified: updatedUser.isVerified,
    };
    return r;
  }

  async changeProfilePicture({ id, user }: { id: string; user: User }) {
    const [dbFile] = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.id, id))
      .limit(1);

    checkConditions({
      conditions: [!!dbFile],
      statusCode: 404,
      message: "File not found",
    });

    await this.accessmgtModule.checkPermissions({
      user: user,
      permissions: [
        {
          action: "rw",
          resource: "file",
          resourceId: dbFile.id,
        },
        {
          action: "rw",
          resource: "user",
          resourceId: user.id,
        },
      ],
    });

    await db
      .update(usersTable)
      .set({ profilePictureFileId: id })
      .where(eq(usersTable.id, user.id));

    const r: UserDTO = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      profilePictureFileId: dbFile.id,
      joinedAt: user.joinedAt,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
    };
    return r;
  }

  async banUser({ data, user }: { data: UserBanDTO; user: User }) {
    const { userId, motive } = data;
    const [userToBan] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    checkConditions({
      conditions: [!!userToBan],
      statusCode: 404,
      message: "User not found",
    });

    checkConditions({
      conditions: [await this.accessmgtModule.isHigher(user, userToBan)],
      statusCode: HttpStatus.FORBIDDEN,
      message: "You cannot ban this user",
    });

    await db
      .update(usersTable)
      .set({ isBanned: true })
      .where(eq(usersTable.id, userToBan.id));

    const [banMotive] = await db
      .insert(banMotivesTable)
      .values({
        userId: userToBan.id,
        motive: motive,
        banBy: user.id,
      })
      .returning();

    const r: UserBanResponseDTO = {
      userId: userToBan.id,
      motive: banMotive.motive,
      bannedAt: banMotive.createdAt,
      bannedBy: banMotive.banBy,
    } as UserBanResponseDTO;
    return r;
  }

  async unbanUser(userId: string) {
    const [userToUnban] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    checkConditions({
      conditions: [!!userToUnban],
      statusCode: 404,
      message: "User not found",
    });

    const [unbannedUser] = await db
      .update(usersTable)
      .set({ isBanned: false })
      .where(eq(usersTable.id, userToUnban.id))
      .returning();

    await db
      .delete(banMotivesTable)
      .where(eq(banMotivesTable.userId, userToUnban.id));

    const r: UserDTO = {
      id: unbannedUser.id,
      email: unbannedUser.email,
      username: unbannedUser.username,
      fullName: unbannedUser.fullName,
      profilePictureFileId: unbannedUser.profilePictureFileId,
      joinedAt: unbannedUser.joinedAt,
      isBanned: unbannedUser.isBanned,
      isVerified: unbannedUser.isVerified,
    };
    return r;
  }
}
