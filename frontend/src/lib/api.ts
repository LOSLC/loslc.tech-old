import ky from "ky";

// Define types for API responses
interface MessageResponse {
  message: string;
}

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  user: User | null;
}

// Create a configured ky instance for API requests
export const api = ky.create({
  prefixUrl: "/api/v1",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response && response.body) {
          try {
            const errorData = (await response.json()) as { message?: string };
            error.message = errorData.message || error.message;
          } catch {
            // If parsing fails, keep the original error message
          }
        }
        return error;
      },
    ],
  },
});

// Authentication API methods
export const authApi = {
  register: (data: any): Promise<MessageResponse> =>
    api.post("auth/register", { json: data }).json(),
  login: (data: any): Promise<MessageResponse> =>
    api.post("auth/login", { json: data }).json(),
  authenticate: (data: any): Promise<MessageResponse> =>
    api.post("auth/authenticate", { json: data }).json(),
  verifyAccount: (data: any): Promise<MessageResponse> =>
    api.post("auth/verify", { json: data }).json(),
  getCurrentUser: (): Promise<UserResponse> => api.get("auth/me").json(),
  getOptionalCurrentUser: (): Promise<UserResponse> =>
    api.get("auth/me/optional").json(),
  logout: (): Promise<MessageResponse> => api.post("auth/logout").json(),
  passwordResetRequest: (data: any): Promise<MessageResponse> =>
    api.post("auth/password-reset-request", { json: data }).json(),
  resetPassword: (data: any): Promise<MessageResponse> =>
    api.post("auth/reset-password", { json: data }).json(),
};
