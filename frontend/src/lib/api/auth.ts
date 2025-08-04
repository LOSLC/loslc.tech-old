import { apiWithErrorHandling as api } from "./client";
import { resolveRequest } from "./request";

// Types based on your backend DTOs
export interface RegisterDto {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface OtpVerificationDto {
  token: string;
}

export interface AccountVerificationDto {
  authSessionId: string;
  authSessionToken: string;
}

export interface PasswordResetRequestDto {
  email: string;
}

export interface PasswordResetDto {
  sessionId: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface Message {
  message: string;
}

// Auth API functions using resolveRequest pattern
export const authApi = {
  // Register a new user
  register: async (data: RegisterDto) => {
    const promise = api.post("auth/register", { json: data }).json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Login user
  login: async (data: LoginDto) => {
    const promise = api.post("auth/login", { json: data }).json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Logout user
  logout: async () => {
    const promise = api.post("auth/logout").json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Verify email
  verifyEmail: async (data: AccountVerificationDto) => {
    const promise = api.post('auth/verify-email', { json: data }).json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Verify OTP
  verifyOtp: async (data: OtpVerificationDto) => {
    const promise = api.post("auth/verify-otp", { json: data }).json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Resend OTP
  resendOtp: async () => {
    const promise = api.post("auth/resend-otp").json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Request password reset
  requestPasswordReset: async (data: PasswordResetRequestDto) => {
    const promise = api
      .post("auth/request-password-reset", { json: data })
      .json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Reset password
  resetPassword: async (data: PasswordResetDto) => {
    const promise = api
      .post("auth/reset-password", { json: data })
      .json<Message>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Check if email exists
  checkEmailExists: async (email: string) => {
    const promise = api
      .get(`auth/check-email/${encodeURIComponent(email)}`)
      .json<boolean>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },

  // Check if username exists
  checkUsernameExists: async (username: string) => {
    const promise = api
      .get(`auth/check-username/${encodeURIComponent(username)}`)
      .json<boolean>();
    const [response, error] = await resolveRequest(promise);
    if (error) {
      throw new Error(error.message);
    }
    return response;
  },
};
