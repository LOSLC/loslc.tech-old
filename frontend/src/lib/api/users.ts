import { apiWithErrorHandling as api } from "./client";
import { resolveRequest } from "./request";

// Types based on backend DTOs
export interface UserDTO {
  id: string;
  email: string;
  username: string;
  fullName: string;
  profilePictureFileId: string | null;
  joinedAt: Date;
  lastUpdated: Date | null;
  isBanned: boolean;
  isVerified: boolean;
}

export interface PublicUserDTO {
  id: string;
  username: string;
  fullName: string;
  profilePictureFileId: string | null;
}

export interface UpdateUserInfoDTO {
  fullName: string;
}

export interface GetUsersQueryDTO {
  limit?: number;
  offset?: number;
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

// User API functions using resolveRequest pattern
export const userApi = {
  // Get current authenticated user
  getCurrentUser: async (): Promise<UserDTO> => {
    const promise = api.get("users/me").json<UserDTO>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<UserDTO> => {
    const promise = api.get(`users/${userId}`).json<UserDTO>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Get public user info (minimal)
  getPublicUser: async (userId: string): Promise<PublicUserDTO> => {
    const promise = api.get(`users/public/${userId}`).json<PublicUserDTO>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Get all users with pagination
  getUsers: async (query: GetUsersQueryDTO = {}): Promise<UserDTO[]> => {
    const searchParams = new URLSearchParams();

    if (query.limit !== undefined) {
      searchParams.append("limit", query.limit.toString());
    }
    if (query.offset !== undefined) {
      searchParams.append("offset", query.offset.toString());
    }

    const promise = api.get("users", { searchParams }).json<UserDTO[]>();

    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Update current user information
  updateCurrentUser: async (data: UpdateUserInfoDTO): Promise<UserDTO> => {
    const promise = api.patch("users/me", { json: data }).json<UserDTO>();

    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Admin functions - ban user
  banUser: async (data: UserBanDTO): Promise<UserBanResponseDTO> => {
    const promise = api
      .post("users/ban", { json: data })
      .json<UserBanResponseDTO>();

    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Admin functions - unban user
  unbanUser: async (userId: string): Promise<{ message: string }> => {
    const promise = api
      .post(`users/unban/${userId}`)
      .json<{ message: string }>();

    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Change profile picture for current user (backend infers current user)
  changeProfilePicture: async (
    userId: string,
    fileId: string,
  ): Promise<UserDTO> => {
    const promise = api
      .post(`users/${userId}/profile-picture/${fileId}`)
      .json<UserDTO>();

    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  isAdmin: async (): Promise<boolean> => {
    const promise = api.get("accessmgt/users/is-admin").json<{ isAdmin: boolean }>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response.isAdmin;
  },
};

export default userApi;
