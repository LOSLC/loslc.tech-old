import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { AUTH_SESSION_COOKIE_NAME } from "./auth.config";
import { db } from "@/core/db/db";
import { eq } from "drizzle-orm";
import { authSessionsTable } from "@/core/db/schemas/auth/sessions";
import { checkConditions } from "@/common/checkers/utils";
import { usersTable } from "@/core/db/schema";
import { AuthenticatedRequest } from "@/common/types/authRequest.type";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const userSessionId: string = request.cookies[AUTH_SESSION_COOKIE_NAME];
    checkConditions({
      conditions: [!!userSessionId],
      statusCode: 401,
      message: "Unauthorized",
      either: false,
    });
    const authSession = await db
      .select()
      .from(authSessionsTable)
      .where(eq(authSessionsTable.id, userSessionId))
      .limit(1);
    checkConditions({
      conditions: [
        authSession.length > 0,
        authSession[0].expiresAt > new Date(),
        !authSession[0].expired,
      ],
      statusCode: 401,
      message: "Unauthorized",
      either: false,
    });
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, authSession[0].userId));
    checkConditions({
      conditions: [!!user],
      statusCode: 401,
      message: "Unauthorized",
      either: false,
    });
    (request as AuthenticatedRequest).user = user;
    return true;
  }
}
