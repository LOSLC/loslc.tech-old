import { db } from "@/core/db/db";
import { StatusCodes } from "http-status-codes";
import { usersTable } from "@/core/db/schema/user";
import { checkConditions, check } from "@/core/security/checkers";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { RegisterSchema, type RegisterData } from "../dto/auth";
import bcrypt, { compareSync } from "bcrypt";
import VerifyAccountEmail from "@/core/services/email/templates/verify-account";
import PasswordResetEmail from "@/core/services/email/templates/password-reset";
import type { MessageResponse } from "../dto/message";
import { safeQuery } from "../middleware/drizzle";
import {
  accountVerificationTable,
  authSessionsTable,
  loginSessionsTable,
  passwordResetRequestSessionsTable,
} from "@/core/db/schema/auth";
import { sendEmail } from "@/core/services/email/mailer";
import { getEnv } from "@/core/env";
import type { Request, Response } from "express";
import { AUTH_SESSION_COOKIE_NAME, LOGIN_SESSION_COOKIE_NAME } from "../config";
import LoginOtpEmail from "@/core/services/email/templates/login-otp";
import {
  permissionsTable,
  rolesPermissionsTable,
  rolesTable,
  usersRolesTable,
} from "@/core/db/schema/security";
import {
  ActionTypes,
  bypassRoleNames,
  ResourceTypes,
} from "@/core/security/permissions";

export async function getCurrentUser(req: Request) {
  const sessionId = req.cookies?.[LOGIN_SESSION_COOKIE_NAME] as string;
  const query = await safeQuery(() =>
    db
      .select({ user: usersTable })
      .from(usersTable)
      .innerJoin(loginSessionsTable, eq(usersTable.id, loginSessionsTable.userId))
      .where(eq(loginSessionsTable.id, sessionId))
      .limit(1)
  );
  checkConditions(
    [{ condition: query.length > 0 }, { condition: query[0].user.verified }],
    "Not authenticated",
    StatusCodes.UNAUTHORIZED,
  );
  return query[0].user;
}

export async function getOptionalCurrentUser(req: Request) {
  const sessionId = req.cookies?.[LOGIN_SESSION_COOKIE_NAME] as string;
  const query = await safeQuery(() =>
    db
      .select({ user: usersTable })
      .from(usersTable)
      .innerJoin(loginSessionsTable, eq(usersTable.id, loginSessionsTable.userId))
      .where(eq(loginSessionsTable.id, sessionId))
      .limit(1)
  );
  if (query.length > 0 && query[0].user.verified) {
    return query[0].user;
  }
  return null;
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  const existingUser = await safeQuery(() =>
    db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1)
  );
  return existingUser.length > 0;
}

const Email = z.email();

export async function checkEmailExists(email: string): Promise<boolean> {
  const parsedEmail = Email.parse(email);
  const existingUser = await safeQuery(() =>
    db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, parsedEmail))
      .limit(1)
  );
  return existingUser.length > 0;
}

export async function register(data: RegisterData) {
  const { username, fullName, email, password, passwordConfirm } =
    RegisterSchema.parse(data);
  checkConditions(
    [
      { condition: !(await checkUsernameExists(username)) },
      { condition: !(await checkEmailExists(email)) },
    ],
    "Username or email already exists",
  );
  checkConditions([
    {
      condition: password === passwordConfirm,
      message: "Passwords do not match",
      status: StatusCodes.BAD_REQUEST,
    },
  ]);
  const user = await safeQuery(() =>
    db
      .insert(usersTable)
      .values({
        username: username,
        fullname: fullName,
        email: email,
        hashedPassword: bcrypt.hashSync(password, 10),
      })
      .returning()
  );

  const mainRole = await safeQuery(() =>
    db
      .insert(rolesTable)
      .values({ name: user[0].username })
      .returning()
  );

  if (getEnv("SADMIN_EMAIL") === user[0].email) {
    const superAdminRole = (
      await safeQuery(() =>
        db
          .insert(rolesTable)
          .values({
            name: bypassRoleNames.superadmin,
          })
          .returning()
      )
    )[0];
    await safeQuery(() =>
      db.insert(usersRolesTable).values({
        userId: user[0].id,
        roleId: superAdminRole.id,
      })
    );
  }

  await safeQuery(() =>
    db.insert(usersRolesTable).values({
      userId: user[0].id,
      roleId: mainRole[0].id,
    })
  );

  const accountRWPermission = await safeQuery(() =>
    db
      .insert(permissionsTable)
      .values({
        name: ResourceTypes.user,
        resource: ResourceTypes.user,
        action: ActionTypes.rw,
        resourceId: user[0].id,
      })
      .returning()
  );

  await safeQuery(() =>
    db.insert(rolesPermissionsTable).values({
      roleId: mainRole[0].id,
      permissionId: accountRWPermission[0].id,
    })
  );

  const accountVerificationSession = await safeQuery(() =>
    db
      .insert(accountVerificationTable)
      .values({
        userId: user[0].id,
      })
      .returning()
  );

  setImmediate(async () => {
    sendEmail({
      from: { email: getEnv("APP_EMAIL"), name: "LOSL-C's Team" },
      subject: "Verify your account",
      to: user[0].email,
      component: VerifyAccountEmail,
      props: {
        userName: user[0].fullname,
        verificationLink: `${getEnv("APP_URL")}/auth/verify-account?token=${accountVerificationSession[0].id}`,
        verificationToken: accountVerificationSession[0].token,
      },
    });
  });
  const response: MessageResponse = {
    message: "Account created successfully. Please verify your email.",
  };
  return response;
}

export async function verifyAccount({
  sessionId,
  token,
}: { sessionId: string; token: string }) {
  const verificationSession = (
    await safeQuery(() =>
      db
        .select()
        .from(accountVerificationTable)
        .where(eq(accountVerificationTable.id, sessionId))
        .limit(1)
    )
  )[0];
  checkConditions(
    [
      { condition: verificationSession.token === token },
      { condition: verificationSession.expired === false },
      { condition: verificationSession.expiresAt > new Date() },
    ],
    "Invalid or expired verification token",
    StatusCodes.BAD_REQUEST,
  );
  const updatedUser = await safeQuery(() =>
    db
      .update(usersTable)
      .set({ verified: true })
      .where(eq(usersTable.id, verificationSession.userId))
      .returning()
  );

  await safeQuery(() =>
    db
      .update(accountVerificationTable)
      .set({ expired: true })
      .where(eq(accountVerificationTable.id, sessionId))
  );

  check([updatedUser.length > 0], "User not found", StatusCodes.NOT_FOUND);

  const response: MessageResponse = {
    message: "Account verified successfully.",
  };
  return response;
}

export async function login({
  email: e,
  password,
  response: res,
}: { email: string; password: string; response: Response }) {
  const email = Email.parse(e);
  const query = await safeQuery(() =>
    db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)
  );
  checkConditions([
    {
      condition: query.length > 0,
      message: "Invalid email or password",
      status: StatusCodes.UNAUTHORIZED,
    },
    {
      condition: compareSync(password, query[0].hashedPassword),
      message: "Invalid email or password",
      status: StatusCodes.UNAUTHORIZED,
    },
    {
      condition: query[0].verified,
      message: "Account not verified",
      status: StatusCodes.FORBIDDEN,
    },
  ]);
  const authSession = (
    await safeQuery(() =>
      db
        .insert(authSessionsTable)
        .values({ userId: query[0].id })
        .returning()
    )
  )[0];
  res.cookie(AUTH_SESSION_COOKIE_NAME, authSession.id, {
    httpOnly: true,
    secure: getEnv("DEBUG") !== "true",
  });
  setImmediate(async () => {
    const AUTH_SESSION_EXPIRES_IN_MINUTES = 30;
    sendEmail({
      from: { email: getEnv("APP_EMAIL"), name: "LOSL-C's Team" },
      to: query[0].email,
      subject: "Login Notification",
      component: LoginOtpEmail,
      props: {
        userName: query[0].fullname,
        otpCode: authSession.token,
        expirationMinutes: AUTH_SESSION_EXPIRES_IN_MINUTES,
      },
    });
  });
  const response: MessageResponse = {
    message: "Login successful. Please check your email for the OTP.",
  };
  return response;
}

export async function authenticate({
  token,
  res,
  req,
}: { req: Request; token: string; res: Response }) {
  const authSessionId = req.cookies?.[AUTH_SESSION_COOKIE_NAME] as string;
  const query = await safeQuery(() =>
    db
      .select()
      .from(authSessionsTable)
      .where(eq(authSessionsTable.id, authSessionId))
  );
  check([query.length > 0], "Invalid session", StatusCodes.UNAUTHORIZED);
  const authSession = query[0];
  const MAX_TRIES = 3;
  checkConditions(
    [
      { condition: authSession.token === token },
      { condition: authSession.expired === false },
      { condition: authSession.expiresAt > new Date() },
      {
        condition: authSession.tries < MAX_TRIES,
        message: "Too many tries",
        status: StatusCodes.FORBIDDEN,
      },
    ],
    "Invalid or expired session",
    StatusCodes.UNAUTHORIZED,
  );
  const loginSession = (
    await safeQuery(() =>
      db
        .insert(loginSessionsTable)
        .values({
          userId: authSession.userId,
        })
        .returning()
    )
  )[0];
  res.cookie(LOGIN_SESSION_COOKIE_NAME, loginSession.id, {
    httpOnly: true,
    secure: getEnv("DEBUG") !== "true",
    expires: loginSession.expiresAt,
  });
  const response: MessageResponse = {
    message: "Authentication successful. You are now logged in.",
  };
  return response;
}

export async function passwordResetRequest(email: string) {
  const parsedEmail = Email.parse(email);
  const query = await safeQuery(() =>
    db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, parsedEmail))
      .limit(1),
  );
  check([query.length > 0], "User not found", StatusCodes.NOT_FOUND);
  const user = query[0];
  const resetSession = (
    await safeQuery(() =>
      db
        .insert(passwordResetRequestSessionsTable)
        .values({ userId: user.id })
        .returning(),
    )
  )[0];

  const RESET_EXPIRES_IN_MINUTES = 3;
  const resetLink = `${getEnv("APP_URL")}/reset-password?token=${resetSession.id}`;

  setImmediate(async () => {
    sendEmail({
      from: { email: getEnv("APP_EMAIL"), name: "LOSL-C's Team" },
      subject: "Password Reset Request",
      to: user.email,
      component: PasswordResetEmail,
      props: {
        userName: user.fullname,
        resetLink,
        resetToken: resetSession.token,
        expirationMinutes: RESET_EXPIRES_IN_MINUTES,
      },
    });
  });

  const response: MessageResponse = {
    message:
      "Password reset email sent. Please check your email for further instructions.",
  };
  return response;
}

export async function resetPassword({
  resetSessionId,
  token,
  newPassword,
}: { resetSessionId: string; token: string; newPassword: string }) {
  const query = await safeQuery(() =>
    db
      .select()
      .from(passwordResetRequestSessionsTable)
      .where(eq(passwordResetRequestSessionsTable.id, resetSessionId))
      .limit(1),
  );

  check([query.length > 0], "Invalid reset session", StatusCodes.BAD_REQUEST);
  const resetSession = query[0];
  checkConditions([
    {
      condition: resetSession.token === token,
      message: "Invalid or expired reset token",
      status: StatusCodes.BAD_REQUEST,
    },
    {
      condition: resetSession.expired === false,
      message: "Invalid or expired reset session",
      status: StatusCodes.BAD_REQUEST,
    },
    {
      condition: resetSession.expiresAt > new Date(),
      message: "Invalid or expired reset session",
      status: StatusCodes.BAD_REQUEST,
    },
  ]);
  const hashedPassword = bcrypt.hashSync(
    z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .parse(newPassword),
    10,
  );
  await safeQuery(() =>
    db
      .update(usersTable)
      .set({ hashedPassword: hashedPassword })
      .where(eq(usersTable.id, resetSession.userId))
  );

  const response: MessageResponse = {
    message:
      "Password reset successfully. You can now log in with your new password.",
  };
  return response;
}
