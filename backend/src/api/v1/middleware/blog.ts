import type { NextFunction, Request } from "express";
import { getCurrentUser, getOptionalCurrentUser } from "../providers/auth";
import { PermissionChecker } from "@/core/security/permissions";
import { safeQuery } from "./drizzle";
import { db } from "@/core/db/db";
import { rolesTable, usersRolesTable } from "@/core/db/schema/security";
import { blogPostsTable, type BlogPost } from "@/core/db/schema/blogPost";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";
import type { User } from "@/core/db/schema/user";

export async function canCreatePost(req: Request, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const roles = (
      await safeQuery(() =>
        db
          .select({ role: rolesTable })
          .from(rolesTable)
          .innerJoin(usersRolesTable, eq(usersRolesTable.roleId, rolesTable.id))
          .where(eq(usersRolesTable.userId, user.id)),
      )
    ).map((q) => q.role);

    await new PermissionChecker(
      roles,
      [
        {
          resource: "blogPost",
          action: "rw",
        },
      ],
      ["admin", "superadmin"],
    ).check();

    next();
  } catch (error) {
    next(
      createHttpError(
        StatusCodes.FORBIDDEN,
        "Insufficient permissions to create blog posts",
      ),
    );
  }
}

export async function canEditPost(req: Request, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const postId = req.params.id;

    const [post] = await safeQuery(() =>
      db.select().from(blogPostsTable).where(eq(blogPostsTable.id, postId)),
    );

    if (!post) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "Blog post not found"),
      );
    }

    if (post.authorId === user.id) {
      return next();
    }

    const roles = (
      await safeQuery(() =>
        db
          .select({ role: rolesTable })
          .from(rolesTable)
          .innerJoin(usersRolesTable, eq(usersRolesTable.roleId, rolesTable.id))
          .where(eq(usersRolesTable.userId, user.id)),
      )
    ).map((q) => q.role);

    await new PermissionChecker(
      roles,
      [
        {
          resource: "blogPost",
          action: "rw",
          resourceId: postId,
        },
      ],
      ["admin", "superadmin"],
    ).check();

    next();
  } catch (error) {
    next(
      createHttpError(
        StatusCodes.FORBIDDEN,
        "Insufficient permissions to edit this blog post",
      ),
    );
  }
}

export async function canDeletePost(req: Request, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const postId = req.params.id;

    const [post] = await safeQuery(() =>
      db.select().from(blogPostsTable).where(eq(blogPostsTable.id, postId)),
    );

    if (!post) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "Blog post not found"),
      );
    }

    if (post.authorId === user.id) {
      return next();
    }

    const roles = (
      await safeQuery(() =>
        db
          .select({ role: rolesTable })
          .from(rolesTable)
          .innerJoin(usersRolesTable, eq(usersRolesTable.roleId, rolesTable.id))
          .where(eq(usersRolesTable.userId, user.id)),
      )
    ).map((q) => q.role);

    await new PermissionChecker(
      roles,
      [
        {
          resource: "blogPost",
          action: "rw",
          resourceId: postId,
        },
      ],
      ["admin", "superadmin"],
    ).check();

    next();
  } catch (error) {
    next(
      createHttpError(
        StatusCodes.FORBIDDEN,
        "Insufficient permissions to delete this blog post",
      ),
    );
  }
}

export async function canManageCategories(req: Request, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const roles = (
      await safeQuery(() =>
        db
          .select({ role: rolesTable })
          .from(rolesTable)
          .innerJoin(usersRolesTable, eq(usersRolesTable.roleId, rolesTable.id))
          .where(eq(usersRolesTable.userId, user.id)),
      )
    ).map((q) => q.role);

    await new PermissionChecker(
      roles,
      [
        {
          resource: "blogPostCategory",
          action: "rw",
        },
      ],
      ["admin", "superadmin"],
    ).check();

    next();
  } catch (error) {
    next(
      createHttpError(
        StatusCodes.FORBIDDEN,
        "Insufficient permissions to manage categories",
      ),
    );
  }
}

export async function canManageTags(req: Request, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const roles = (
      await safeQuery(() =>
        db
          .select({ role: rolesTable })
          .from(rolesTable)
          .innerJoin(usersRolesTable, eq(usersRolesTable.roleId, rolesTable.id))
          .where(eq(usersRolesTable.userId, user.id)),
      )
    ).map((q) => q.role);

    await new PermissionChecker(
      roles,
      [
        {
          resource: "blogPostTag",
          action: "rw",
        },
      ],
      ["admin", "superadmin"],
    ).check();

    next();
  } catch (error) {
    next(
      createHttpError(
        StatusCodes.FORBIDDEN,
        "Insufficient permissions to manage tags",
      ),
    );
  }
}

export async function optionalAuth(req: Request, next: NextFunction) {
  try {
    const user = await getOptionalCurrentUser(req);
    req.user = user;
    next();
  } catch (error) {
    next();
  }
}

export async function validatePostAccess(req: Request, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const postId = req.params.id;

    if (!postId) {
      return next(
        createHttpError(StatusCodes.BAD_REQUEST, "Post ID is required"),
      );
    }

    const [post] = await safeQuery(() =>
      db.select().from(blogPostsTable).where(eq(blogPostsTable.id, postId)),
    );

    if (!post) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "Blog post not found"),
      );
    }

    req.blogPost = post;

    if (post.authorId === user.id) {
      req.isPostAuthor = true;
      return next();
    }

    const roles = (
      await safeQuery(() =>
        db
          .select({ role: rolesTable })
          .from(rolesTable)
          .innerJoin(usersRolesTable, eq(usersRolesTable.roleId, rolesTable.id))
          .where(eq(usersRolesTable.userId, user.id)),
      )
    ).map((q) => q.role);

    const hasAdminAccess = roles.some((role) =>
      ["admin", "superadmin"].includes(role.name || ""),
    );

    if (hasAdminAccess) {
      req.isPostAuthor = false;
      req.hasAdminAccess = true;
      return next();
    }

    next(
      createHttpError(
        StatusCodes.FORBIDDEN,
        "Insufficient permissions to access this blog post",
      ),
    );
  } catch (error) {
    next(error);
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
      blogPost?: BlogPost;
      isPostAuthor?: boolean;
      hasAdminAccess?: boolean;
    }
  }
}
