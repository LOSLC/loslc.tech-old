import { checkConditions } from "@/common/checkers/utils";
import { db } from "@/core/db/db";
import { User, usersTable } from "@/core/db/schema";
import { filesTable } from "@/core/db/schemas/resources/file";
import { banMotivesTable } from "@/core/db/schemas/user/banMotive";
import { HttpStatus, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import {
	UpdateUserInfoDTO,
	UserBanDTO,
	UserBanResponseDTO,
	UserDTO,
	toUserDTO,
	toPublicUserDTO,
	PublicUserDTO,
} from "./users.dto";
import { AccessmgtService } from "@/accessmgt/accessmgt.service";
import { Message } from "@/common/dto/message";

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
		return toUserDTO(user);
	}

	async getCurrentUser(user: User) {
		return toUserDTO(user);
	}

	async getPublicUser(userId: string): Promise<PublicUserDTO> {
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
		return toPublicUserDTO(user as User);
	}

	async getUsers({
		limit = 20,
		offset = 0,
	}: { limit?: number; offset?: number } = {}): Promise<UserDTO[]> {
		const users = (
			await db
				.select()
				.from(usersTable)
				.offset(offset)
				.limit(limit)
				.orderBy(desc(usersTable.joinedAt))
		).map(toUserDTO);

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

		return toUserDTO(updatedUser);
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

		return toUserDTO({ ...user, profilePictureFileId: dbFile.id });
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

		return toUserDTO(unbannedUser);
	}

	async deleteUser(userId: string, user: User) {
		const [userToDelete] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId))
			.limit(1);

		checkConditions({
			conditions: [!!userToDelete],
			statusCode: 404,
			message: "User not found",
		});

		await this.accessmgtModule.checkPermissions({
			user: user,
			permissions: [
				{
					action: "rw",
					resource: "user",
					resourceId: userToDelete.id,
				},
			],
		});

		await db.delete(usersTable).where(eq(usersTable.id, userToDelete.id));

		const message: Message = {
			message: "User deleted successfully",
		};
		return message;
	}
}
