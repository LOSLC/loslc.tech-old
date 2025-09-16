import { HttpStatus, Injectable } from "@nestjs/common";
import { Response } from "express";
import {
  AccountVerificationDTO,
  LoginDTO,
  OtpVerificationDTO,
  PasswordResetDTO,
  PasswordResetRequestDTO,
  RegisterDTO,
} from "./auth.dto";
import { db } from "@/core/db/db";
import {
  NewUser,
  permissionsTable,
  rolePermissionsTable,
  rolesTable,
  userRolesTable,
  usersTable,
} from "@/core/db/schema";
import { eq, or } from "drizzle-orm";
import { checkConditions } from "@/common/checkers/utils";
import { compareHash, hashString } from "@/core/utils/crypto";
import { sendEmail } from "@/core/services/email/mailer";
import { getEnv } from "@/core/env";
import VerifyAccountEmail from "@/core/services/email/templates/verify-account";
import {
  accountVerificationSessionsTable,
  authSessionsTable,
  otpSessionsTable,
  passwordResetSessionsTable,
} from "@/core/db/schemas/auth/sessions";
import { Message } from "@/common/dto/message";
import LoginOtpEmail from "@/core/services/email/templates/login-otp";
import {
  AUTH_SESSION_COOKIE_NAME,
  OTP_SESSION_COOKIE_NAME,
} from "./auth.config";
import PasswordResetEmail from "@/core/services/email/templates/password-reset";
import { addMinutes } from "date-fns";

@Injectable()
export class AuthService {
  async register(data: RegisterDTO): Promise<Message> {
    const userExists =
      (
        await db
          .select()
          .from(usersTable)
          .where(
            or(
              eq(usersTable.email, data.email),
              eq(usersTable.username, data.username),
            ),
          )
      ).length > 0;
    checkConditions({
      conditions: [!userExists],
      message: "User already exists",
      statusCode: HttpStatus.CONFLICT,
      either: false,
    });
    checkConditions({
      conditions: [
        data.password === data.confirmPassword,
        data.password.length >= 8,
      ],
      message: "Passwords do not match or are too short",
      statusCode: HttpStatus.BAD_REQUEST,
      either: false,
    });
    const newUser: NewUser = {
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
      fullName: data.fullName,
      hashedPassword: await hashString(data.password),
    };
    const [user] = await db.insert(usersTable).values(newUser).returning();
    const [userRole] = await db
      .insert(rolesTable)
      .values({ name: `User: ${user.username}` })
      .returning();
    const [userAccountPermission] = await db
      .insert(permissionsTable)
      .values({
        name: `${user.username}-account management permission`,
        description: `Permission for ${user.username} to manage his/her account`,
        action: "rw",
        resource: "user",
        resourceId: user.id,
      })
      .returning();
    await db.insert(userRolesTable).values({
      roleId: userRole.id,
      userId: user.id,
    });
    await db.insert(rolePermissionsTable).values({
      roleId: userRole.id,
      permissionId: userAccountPermission.id,
    });
    // Admin role
    if (user.email.toLowerCase() === getEnv("SADMIN_EMAIL").toLowerCase()) {
      const [adminRole] = await db
        .insert(rolesTable)
        .values({ name: "superadmin", description: "Administrator role" })
        .returning();
      await db.insert(userRolesTable).values({
        roleId: adminRole.id,
        userId: user.id,
      });
    }
    const [accountVerificationToken] = await db
      .insert(accountVerificationSessionsTable)
      .values({
        userId: user.id,
      })
      .returning();
    sendEmail({
      from: {
        email: getEnv("APP_EMAIL"),
        name: "LOSL-C's Team",
      },
      to: newUser.email,
      subject: "Welcome to LOSL-C!",
      component: VerifyAccountEmail,
      props: {
        userName: newUser.fullName,
        verificationLink: `${getEnv("APP_URL")}/verify-email?token=${accountVerificationToken.id}`,
        verificationToken: accountVerificationToken.token,
      },
    });
    const response: Message = {
      message:
        "User registered successfully. Please check your email to verify your account.",
    };
    return response;
  }

  async login({ res, data }: { res: Response; data: LoginDTO }) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email.toLowerCase()))
      .limit(1);
    checkConditions({
      conditions: [!!user],
      message: "Invalid email or password",
      statusCode: HttpStatus.NOT_FOUND,
      either: false,
    });
    checkConditions({
      conditions: [!user.isBanned],
      message: "User has been banned",
      statusCode: HttpStatus.FORBIDDEN,
      either: false,
    });
    checkConditions({
      conditions: [user.isVerified],
      message: "User is not verified",
      statusCode: HttpStatus.UNAUTHORIZED,
      either: false,
    });
    checkConditions({
      conditions: [await compareHash(data.password, user.hashedPassword)],
      message: "Invalid email or password",
      statusCode: HttpStatus.UNAUTHORIZED,
      either: false,
    });

    // const [otpSession] = await db
    //   .insert(otpSessionsTable)
    //   .values({
    //     userId: user.id,
    //   })
    //   .returning();
    // sendEmail({
    //   from: {
    //     email: getEnv("APP_EMAIL"),
    //     name: "LOSL-C's Team",
    //   },
    //   to: user.email,
    //   subject: "Someone is trying to log in to your account",
    //   component: LoginOtpEmail,
    //   props: {
    //     userName: user.fullName,
    //     otpCode: otpSession.token,
    //     expirationMinutes:
    //       Number.parseInt(getEnv("OTP_EXPIRATION_MINUTES")) || 5,
    //   },
    // });
    // res.cookie(OTP_SESSION_COOKIE_NAME, otpSession.id, {
    //   httpOnly: true,
    //   secure: getEnv("DEBUG").toLowerCase() !== "true",
    //   maxAge: 1000 * 60 * 5,
    // });
    // const response: Message = {
    //   message: "Login successful. Please check your email.",
    // };
    // return response;

    const [authSession] = await db
      .insert(authSessionsTable)
      .values({
        userId: user.id,
      })
      .returning();

    res.cookie(AUTH_SESSION_COOKIE_NAME, authSession.id, {
      httpOnly: true,
      secure: getEnv("DEBUG") !== "true",
      maxAge:
        1000 *
        60 *
        60 *
        24 *
        (Number.parseInt(getEnv("AUTH_SESSION_EXPIRATION_DAYS")) || 30),
    });

    const response: Message = {
      message: "Authentication successful",
    };
    return response;
  }

  async logout(res: Response) {
    res.clearCookie(AUTH_SESSION_COOKIE_NAME);
    const response: Message = {
      message: "Logout successful",
    };
    return response;
  }

  async verifyEmail(data: AccountVerificationDTO): Promise<Message> {
    const { authSessionId, authSessionToken } = data;
    const [session] = await db
      .select()
      .from(accountVerificationSessionsTable)
      .where(eq(accountVerificationSessionsTable.id, authSessionId))
      .limit(1);
    checkConditions({
      conditions: [!!session, !session.expired, new Date() < session.expiresAt],
      message: "Invalid or expired verification session",
      statusCode: HttpStatus.BAD_REQUEST,
      either: false,
    });
    checkConditions({
      conditions: [session.token === authSessionToken],
      message: "Invalid token",
      statusCode: HttpStatus.UNAUTHORIZED,
      either: false,
    });
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))
      .limit(1);
    checkConditions({
      conditions: [!user.isVerified],
      message: "User is already verified",
      statusCode: HttpStatus.CONFLICT,
      either: false,
    });
    await db
      .update(usersTable)
      .set({
        isVerified: true,
        lastUpdated: new Date(),
      })
      .where(eq(usersTable.id, user.id));

    await db
      .update(accountVerificationSessionsTable)
      .set({ expired: true })
      .where(eq(accountVerificationSessionsTable.id, session.id));

    const response: Message = {
      message: "Account verified successfully",
    };
    return response;
  }

  async authenticate({
    res,
    data,
    otpSessionIdCookie,
  }: { res: Response; otpSessionIdCookie: string; data: OtpVerificationDTO }) {
    const [otpSession] = await db
      .select()
      .from(otpSessionsTable)
      .where(eq(otpSessionsTable.id, otpSessionIdCookie))
      .limit(1);
    checkConditions({
      conditions: [
        !!otpSession,
        !otpSession.expired,
        new Date() < otpSession.expiresAt,
      ],
      message: "Invalid or expired token",
      statusCode: HttpStatus.BAD_REQUEST,
      either: false,
    });
    checkConditions({
      conditions: [otpSession.token === data.token],
      message: "Invalid token",
      statusCode: HttpStatus.UNAUTHORIZED,
      either: false,
    });
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, otpSession.userId))
      .limit(1);
    checkConditions({
      conditions: [!user.isBanned],
      message: "User has been banned",
      statusCode: HttpStatus.FORBIDDEN,
      either: false,
    });

    const [authSession] = await db
      .insert(authSessionsTable)
      .values({
        userId: user.id,
      })
      .returning();

    res.cookie(AUTH_SESSION_COOKIE_NAME, authSession.id, {
      httpOnly: true,
      secure: getEnv("DEBUG") !== "true",
      maxAge:
        1000 *
        60 *
        60 *
        24 *
        (Number.parseInt(getEnv("AUTH_SESSION_EXPIRATION_DAYS")) || 24),
    });

    await db
      .update(otpSessionsTable)
      .set({ expired: true })
      .where(eq(otpSessionsTable.id, otpSessionIdCookie));

    const response: Message = {
      message: "Authentication successful",
    };
    return response;
  }

  async requestNewOtp({ otpSessionIdCookie }: { otpSessionIdCookie: string }) {
    const [otpSession] = await db
      .select()
      .from(otpSessionsTable)
      .where(eq(otpSessionsTable.id, otpSessionIdCookie))
      .limit(1);
    checkConditions({
      conditions: [
        !!otpSession,
        !otpSession.expired,
        new Date() < addMinutes(otpSession.expiresAt, 5),
        new Date() > addMinutes(otpSession.createdAt, 1),
      ],
      message: "An error occurred while requesting a new OTP code",
      statusCode: HttpStatus.BAD_REQUEST,
      either: false,
    });
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, otpSession.userId))
      .limit(1);

    checkConditions({
      conditions: [!!user],
      message: "User not found",
      statusCode: HttpStatus.NOT_FOUND,
      either: false,
    });
    const [newOtpSession] = await db
      .insert(otpSessionsTable)
      .values({
        userId: user.id,
      })
      .returning();

    await db
      .update(otpSessionsTable)
      .set({
        expired: true,
      })
      .where(eq(otpSessionsTable.id, otpSessionIdCookie));

    sendEmail({
      from: {
        email: getEnv("APP_EMAIL"),
        name: "LOSL-C's Team",
      },
      to: user.email,
      subject: "New OTP Code",
      component: LoginOtpEmail,
      props: {
        userName: user.fullName,
        otpCode: newOtpSession.token,
        expirationMinutes:
          Number.parseInt(getEnv("OTP_EXPIRATION_MINUTES")) || 5,
      },
    });
    const response: Message & { newSessionId?: string } = {
      message: "New OTP code sent successfully",
      newSessionId: newOtpSession.id,
    };
    return response;
  }

  async requestPasswordReset(data: PasswordResetRequestDTO) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email.toLowerCase()));
    checkConditions({
      conditions: [!!user],
      message: "User not found",
      statusCode: HttpStatus.NOT_FOUND,
      either: false,
    });
    const [resetSession] = await db
      .insert(passwordResetSessionsTable)
      .values({ userId: user.id })
      .returning();
    sendEmail({
      from: {
        email: getEnv("APP_EMAIL"),
        name: "LOSL-C's Team",
      },
      to: user.email,
      subject: "Password Reset Request",
      component: PasswordResetEmail,
      props: {
        userName: user.fullName,
        expirationMinutes:
          Number.parseInt(getEnv("PASSWORD_RESET_EXPIRATION_MINUTES")) || 5,
        resetLink: `${getEnv("APP_URL")}/reset-password?token=${resetSession.id}`,
        resetToken: resetSession.token,
      },
    });
    const response: Message = {
      message: "Request successful. Please check your email.",
    };
    return response;
  }

  async resetPassword(data: PasswordResetDTO) {
    const { token, newPassword, confirmNewPassword, sessionId } = data;
    checkConditions({
      conditions: [newPassword === confirmNewPassword],
      message: "Passwords do not match",
      statusCode: HttpStatus.BAD_REQUEST,
      either: false,
    });
    const [resetSession] = await db
      .select()
      .from(passwordResetSessionsTable)
      .where(eq(passwordResetSessionsTable.id, sessionId))
      .limit(1);
    checkConditions({
      conditions: [
        !!resetSession,
        !resetSession.expired,
        new Date() < resetSession.expiresAt,
        resetSession.token === token,
      ],
      message: "Invalid or expired password reset session",
      statusCode: HttpStatus.BAD_REQUEST,
      either: false,
    });
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, resetSession.userId))
      .limit(1);
    checkConditions({
      conditions: [!!user],
      message: "User not found",
      statusCode: HttpStatus.NOT_FOUND,
      either: false,
    });
    checkConditions({
      conditions: [newPassword === confirmNewPassword],
      message: "Passwords do not match",
      statusCode: HttpStatus.BAD_REQUEST,
      either: false,
    });
    await db
      .update(usersTable)
      .set({
        hashedPassword: await hashString(newPassword),
        lastUpdated: new Date(),
      })
      .where(eq(usersTable.id, user.id));

    await db
      .update(passwordResetSessionsTable)
      .set({ expired: true })
      .where(eq(passwordResetSessionsTable.id, sessionId));

    const response: Message = {
      message: "Password reset successfully",
    };
    return response;
  }

  // Check services
  async checkEmailExists(email: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);
    return !!user;
  }
  async checkUsernameExists(username: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username.toLowerCase()))
      .limit(1);
    return !!user;
  }
}
