import type { Request, Response, NextFunction } from "express";
import { getCurrentUser } from "../providers/auth";
import { db } from "@/core/db/db";
import { rolesTable, usersRolesTable } from "@/core/db/schema/security";
import { and, eq, or } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";
import { safeQuery } from "./drizzle";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = await getCurrentUser(req);

    const userRoles = await safeQuery(() =>
      db
        .select({ role: rolesTable })
        .from(rolesTable)
        .innerJoin(
          usersRolesTable,
          and(
            eq(usersRolesTable.roleId, rolesTable.id),
            eq(usersRolesTable.userId, currentUser.id),
          ),
        ),
    );

    const roleNames = userRoles.map((r) => r.role.name);

    const hasAdminRole =
      roleNames.includes("admin") || roleNames.includes("superadmin");

    if (!hasAdminRole) {
      throw createHttpError(StatusCodes.FORBIDDEN, "Admin access required");
    }

    next();
  } catch (error: any) {
    res.status(error.status || StatusCodes.UNAUTHORIZED).json({
      message: error.message || "Authentication failed",
    });
  }
}
