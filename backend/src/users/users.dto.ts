import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { User } from "@/core/db/schema";

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  fullName: string;
  profilePictureFileId: string | null;
  joinedAt: Date;
  isBanned: boolean;
  isVerified: boolean;
}

/**
 * Convert a User from the database to UserDTO
 * @param user - User object from database
 * @returns UserDTO object
 */
export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    profilePictureFileId: user.profilePictureFileId,
    joinedAt: user.joinedAt,
    isBanned: user.isBanned,
    isVerified: user.isVerified,
  };
}

export interface UserBanDTO {
  userId: string;
  motive: string;
}

export interface UserBanResponseDTO {
  userId: string;
  motive: string;
  bannedBy: string;
  bannedAt: Date;
}

export class UpdateUserInfoDTO {
  @Expose()
  @ApiProperty({
    description: "The user's full name",
    example: "John Doe",
    minLength: 2,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;
}

export class GetUsersDTO {
  @Expose()
  @ApiProperty({
    description: "Maximum number of users to return",
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  limit?: number = 20;

  @Expose()
  @ApiProperty({
    description: "Number of users to skip for pagination",
    example: 0,
    required: false,
    minimum: 0,
  })
  offset?: number = 0;
}
