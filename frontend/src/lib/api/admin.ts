import { apiWithErrorHandling as api } from "./client";
import { resolveRequest } from "./request";
import { UserDTO, UserBanDTO, UserBanResponseDTO } from "./users";
import { 
  BlogPostDTO, 
  CreateBlogPostDTO, 
  UpdateBlogPostDTO, 
  BlogCategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  BlogTagDTO,
  CreateTagDTO,
  GetBlogPostsQueryDTO
} from "./blog";

// Access Management Types
export interface RoleDTO {
  id: string;
  name: string;
  description: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface PermissionDTO {
  id: string;
  name: string;
  description: string;
  action: string;
  resource: string;
  resourceId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateRoleDTO {
  name: string;
  description: string;
  priority?: number;
}

export interface CreatePermissionDTO {
  name: string;
  description: string;
  action: string;
  resource: string;
  resourceId?: string;
}

export interface RoleAssignmentDTO {
  userId: string;
  roleId: string;
}

export interface PermissionAssignmentDTO {
  roleId: string;
  permissionId: string;
}

export interface GetUserRolesDTO {
  userId: string;
  limit?: number;
  offset?: number;
  all?: boolean;
}

export interface GetRolePermissionsDTO {
  roleId: string;
  limit?: number;
  offset?: number;
  all?: boolean;
}

// File Management Types
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  fileType: string;
  protected: boolean;
  userId: string;
  createdAt: Date;
}

export interface UploadResponse {
  id: string;
  name: string;
  size: number;
  fileType: string;
  protected: boolean;
  userId: string;
  createdAt: Date;
}

// Admin API functions
export const adminApi = {
  // Dashboard
  dashboard: {
    getPopularBlogPosts: async (limit = 5): Promise<BlogPostDTO[]> => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
      });
      const promise = api.get("blog/posts/popular", { searchParams }).json<BlogPostDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    getFeaturedBlogPosts: async (limit = 5): Promise<BlogPostDTO[]> => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        featured: 'true',
      });
      const promise = api.get("blog/posts", { searchParams }).json<BlogPostDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    getRecentBlogPosts: async (limit = 5): Promise<BlogPostDTO[]> => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
      });
      const promise = api.get("blog/posts", { searchParams }).json<BlogPostDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    getRecentUsers: async (limit = 5): Promise<UserDTO[]> => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: '0',
      });
      const promise = api.get("users", { searchParams }).json<UserDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },
  },

  // User Management
  users: {
    getAll: async (limit = 20, offset = 0): Promise<UserDTO[]> => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      const promise = api.get("users", { searchParams }).json<UserDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    banUser: async (data: UserBanDTO): Promise<UserBanResponseDTO> => {
      const promise = api.post("users/ban", { json: data }).json<UserBanResponseDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    unbanUser: async (userId: string): Promise<{ message: string }> => {
      const promise = api.post(`users/unban/${userId}`).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    deleteUser: async (userId: string): Promise<{ message: string }> => {
      const promise = api.delete(`users/${userId}`).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },
  },

  // Access Management
  accessManagement: {
    // Roles
    getAllRoles: async (all?: boolean, limit?: number, offset?: number): Promise<RoleDTO[]> => {
      const searchParams = new URLSearchParams();
      if (all !== undefined) searchParams.set("all", all.toString());
      if (limit !== undefined) searchParams.set("limit", limit.toString());
      if (offset !== undefined) searchParams.set("offset", offset.toString());
      
      const url = `accessmgt/roles${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const promise = api.get(url).json<RoleDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    getRoleById: async (roleId: string): Promise<RoleDTO> => {
      const promise = api.get(`accessmgt/roles/${roleId}`).json<RoleDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    createRole: async (data: CreateRoleDTO): Promise<RoleDTO> => {
      const promise = api.post("accessmgt/roles", { json: data }).json<RoleDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    deleteRole: async (roleId: string): Promise<{ message: string }> => {
      const promise = api.delete(`accessmgt/roles/${roleId}`).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    // Permissions
    getAllPermissions: async (all?: boolean, limit?: number, offset?: number): Promise<PermissionDTO[]> => {
      const searchParams = new URLSearchParams();
      if (all !== undefined) searchParams.set("all", all.toString());
      if (limit !== undefined) searchParams.set("limit", limit.toString());
      if (offset !== undefined) searchParams.set("offset", offset.toString());
      
      const url = `accessmgt/permissions${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const promise = api.get(url).json<PermissionDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    getPermissionById: async (permissionId: string): Promise<PermissionDTO> => {
      const promise = api.get(`accessmgt/permissions/${permissionId}`).json<PermissionDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    createPermission: async (data: CreatePermissionDTO): Promise<PermissionDTO> => {
      const promise = api.post("accessmgt/permissions", { json: data }).json<PermissionDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    deletePermission: async (permissionId: string): Promise<{ message: string }> => {
      const promise = api.delete(`accessmgt/permissions/${permissionId}`).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    // User Roles
    getUserRoles: async (userId: string): Promise<RoleDTO[]> => {
      const promise = api.get(`accessmgt/users/${userId}/roles`).json<RoleDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    assignRoleToUser: async (data: RoleAssignmentDTO): Promise<{ message: string }> => {
      const promise = api.post("accessmgt/users/roles/assign", { json: data }).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    revokeRoleFromUser: async (data: RoleAssignmentDTO): Promise<{ message: string }> => {
      const promise = api.delete("accessmgt/users/roles/revoke", { json: data }).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    // Role Permissions
    getRolePermissions: async (roleId: string): Promise<PermissionDTO[]> => {
      const promise = api.get(`accessmgt/roles/${roleId}/permissions`).json<PermissionDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    assignPermissionToRole: async (data: PermissionAssignmentDTO): Promise<{ message: string }> => {
      const promise = api.post("accessmgt/roles/permissions/assign", { json: data }).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    revokePermissionFromRole: async (data: PermissionAssignmentDTO): Promise<{ message: string }> => {
      const promise = api.delete("accessmgt/roles/permissions/revoke", { json: data }).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },
  },

  // Blog Management
  blog: {
    // Posts
    getAllPosts: async (query: GetBlogPostsQueryDTO = {}): Promise<BlogPostDTO[]> => {
      const searchParams = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      
      const promise = api.get(`blog/admin/posts?${searchParams.toString()}`).json<BlogPostDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    createPost: async (data: CreateBlogPostDTO): Promise<BlogPostDTO> => {
      const promise = api.post("blog/posts", { json: data }).json<BlogPostDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    updatePost: async (id: string, data: UpdateBlogPostDTO): Promise<BlogPostDTO> => {
      const promise = api.put(`blog/posts/${id}`, { json: data }).json<BlogPostDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    deletePost: async (id: string): Promise<{ message: string }> => {
      const promise = api.delete(`blog/posts/${id}`).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    // Categories
    getCategories: async (): Promise<BlogCategoryDTO[]> => {
      const promise = api.get("blog/categories").json<BlogCategoryDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    createCategory: async (data: CreateCategoryDTO): Promise<BlogCategoryDTO> => {
      const promise = api.post("blog/categories", { json: data }).json<BlogCategoryDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    updateCategory: async (id: string, data: UpdateCategoryDTO): Promise<BlogCategoryDTO> => {
      const promise = api.put(`blog/categories/${id}`, { json: data }).json<BlogCategoryDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    deleteCategory: async (id: string): Promise<{ message: string }> => {
      const promise = api.delete(`blog/categories/${id}`).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    // Tags
    getTags: async (): Promise<BlogTagDTO[]> => {
      const promise = api.get("blog/tags").json<BlogTagDTO[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    createTag: async (data: CreateTagDTO): Promise<BlogTagDTO> => {
      const promise = api.post("blog/tags", { json: data }).json<BlogTagDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    updateTag: async (id: string, data: CreateTagDTO): Promise<BlogTagDTO> => {
      const promise = api.put(`blog/tags/${id}`, { json: data }).json<BlogTagDTO>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    deleteTag: async (id: string): Promise<{ message: string }> => {
      const promise = api.delete(`blog/tags/${id}`).json<{ message: string }>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },
  },

  // File Management
  files: {
    getAll: async (limit = 20, offset = 0): Promise<FileInfo[]> => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      const promise = api.get("files", { searchParams }).json<FileInfo[]>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    upload: async (file: File, name?: string, isProtected = false): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);
      if (name) formData.append("name", name);
      if (isProtected) formData.append("protected", "true");

      const promise = api.post("files/upload", { 
        body: formData,
        headers: {
          // Remove Content-Type header to let browser set it with boundary for FormData
          'Content-Type': undefined
        }
      }).json<UploadResponse>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    uploadMultiple: async (files: File[], isProtected = false): Promise<UploadResponse> => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      if (isProtected) formData.append("protected", "true");

      const promise = api.post("files/upload-multiple", { 
        body: formData,
        headers: {
          // Remove Content-Type header to let browser set it with boundary for FormData
          'Content-Type': undefined
        }
      }).json<UploadResponse>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },

    delete: async (id: string): Promise<void> => {
      const promise = api.delete(`files/${id}`);
      const [, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
    },

    getInfo: async (id: string): Promise<FileInfo> => {
      const promise = api.get(`files/${id}/info`).json<FileInfo>();
      const [response, error] = await resolveRequest(promise);
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },
  },
};

export default adminApi;
