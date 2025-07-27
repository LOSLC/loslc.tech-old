import type { Request, Response } from "express";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  RegisterSchema,
  LoginSchema,
  type RegisterData,
  type LoginData,
} from "../dto/auth";
import type { MessageResponse } from "../dto/message";
import {
  register,
  verifyAccount,
  login,
  authenticate,
  getCurrentUser,
  getOptionalCurrentUser,
  passwordResetRequest,
  resetPassword,
} from "../providers/auth";
import { z } from "zod";
import { LOGIN_SESSION_COOKIE_NAME } from "../config";

export const router = Router();

export async function registerController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const data: RegisterData = RegisterSchema.parse(req.body);
    const result = await register(data);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Registration failed",
    });
  }
}

export async function verifyAccountController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { token, sessionId } = z
      .object({
        token: z.string(),
        sessionId: z.string(),
      })
      .parse(req.body);

    const result = await verifyAccount({ sessionId, token });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Account verification failed",
    });
  }
}

export async function loginController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { email, password }: LoginData = LoginSchema.parse(req.body);
    const result = await login({ email, password, response: res });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.UNAUTHORIZED).json({
      message: error.message || "Login failed",
    });
  }
}

export async function authenticateController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { token } = z
      .object({
        token: z.string().length(6, "OTP token must be exactly 6 characters"),
      })
      .parse(req.body);

    const result = await authenticate({ token, req, res });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.UNAUTHORIZED).json({
      message: error.message || "Authentication failed",
    });
  }
}

export async function getCurrentUserController(req: Request, res: Response) {
  try {
    const user = await getCurrentUser(req);
    res.status(StatusCodes.OK).json({
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(error.status || StatusCodes.UNAUTHORIZED).json({
      message: error.message || "Not authenticated",
    });
  }
}

export async function getOptionalCurrentUserController(
  req: Request,
  res: Response,
) {
  try {
    const user = await getOptionalCurrentUser(req);
    if (user) {
      res.status(StatusCodes.OK).json({
        user: {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          verified: user.verified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } else {
      res.status(StatusCodes.OK).json({ user: null });
    }
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Internal server error",
    });
  }
}

export async function logoutController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    res.clearCookie(LOGIN_SESSION_COOKIE_NAME);

    res.status(StatusCodes.OK).json({
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Logout failed",
    });
  }
}

export async function passwordResetRequestController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const result = await passwordResetRequest(email);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Password reset request failed",
    });
  }
}

export async function resetPasswordController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { resetSessionId, token, newPassword } = z.object({
      resetSessionId: z.string(),
      token: z.string(),
      newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    }).parse(req.body);
    
    const result = await resetPassword({ resetSessionId, token, newPassword });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Password reset failed",
    });
  }
}

// Express Routes
router.post("/register", registerController);
router.post("/verify", verifyAccountController);
router.post("/login", loginController);
router.post("/authenticate", authenticateController);
router.get("/me", getCurrentUserController);
router.get("/me/optional", getOptionalCurrentUserController);
router.post("/logout", logoutController);
router.post("/password-reset-request", passwordResetRequestController);
router.post("/reset-password", resetPasswordController);
