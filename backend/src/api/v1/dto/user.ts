import type { User } from "@/core/db/schema/user";

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function userToDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullname,
    isActive: user.verified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
