import type { Request, Response } from "express";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
} from "../providers/accessmgt";
import { isAdmin } from "../middleware/isAdmin";
import type { MessageResponse } from "../dto/message";

export const router = Router();

router.use(isAdmin);

// Role Management Routes
router.post("/roles", createRoleController);
router.get("/roles", getAllRolesController);
router.get("/roles/:id", getRoleByIdController);
router.put("/roles/:id", updateRoleController);
router.delete("/roles/:id", deleteRoleController);

// Permission Management Routes
router.post("/permissions", createPermissionController);
router.get("/permissions", getAllPermissionsController);
router.get("/permissions/:id", getPermissionByIdController);
router.put("/permissions/:id", updatePermissionController);
router.delete("/permissions/:id", deletePermissionController);

// Role Assignment Routes
router.post("/users/:userId/roles", assignRoleToUserController);
router.delete("/users/:userId/roles/:roleId", removeRoleFromUserController);
router.get("/users/:userId/roles", getUserRolesController);

// Permission Assignment Routes
router.post("/roles/:roleId/permissions", assignPermissionToRoleController);
router.delete(
  "/roles/:roleId/permissions/:permissionId",
  removePermissionFromRoleController,
);
router.get("/roles/:roleId/permissions", getRolePermissionsController);

// Validation schemas
const RoleCreationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const RoleUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

const PermissionCreationSchema = z.object({
  name: z.string().optional(),
  resource: z.string(),
  resourceId: z.string().optional(),
  action: z.string(),
  description: z.string().optional(),
});

const PermissionUpdateSchema = z.object({
  name: z.string().optional(),
  resource: z.string().optional(),
  resourceId: z.string().optional(),
  action: z.string().optional(),
  description: z.string().optional(),
});

// Role Controllers
export async function createRoleController(req: Request, res: Response) {
  try {
    const data = RoleCreationSchema.parse(req.body);
    const result = await createRole(data);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to create role",
    });
  }
}

export async function getAllRolesController(req: Request, res: Response) {
  try {
    const roles = await getAllRoles();
    res.status(StatusCodes.OK).json(roles);
  } catch (error: any) {
    res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Failed to fetch roles",
    });
  }
}

export async function getRoleByIdController(req: Request, res: Response) {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const role = await getRoleById(id);
    res.status(StatusCodes.OK).json(role);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to fetch role",
    });
  }
}

export async function updateRoleController(req: Request, res: Response) {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const data = RoleUpdateSchema.parse(req.body);
    const result = await updateRole(id, data);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to update role",
    });
  }
}

export async function deleteRoleController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const result = await deleteRole(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to delete role",
    });
  }
}

// Permission Controllers
export async function createPermissionController(req: Request, res: Response) {
  try {
    const data = PermissionCreationSchema.parse(req.body);
    const result = await createPermission(data);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to create permission",
    });
  }
}

export async function getAllPermissionsController(_: Request, res: Response) {
  try {
    const permissions = await getAllPermissions();
    res.status(StatusCodes.OK).json(permissions);
  } catch (error: any) {
    res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Failed to fetch permissions",
    });
  }
}

export async function getPermissionByIdController(req: Request, res: Response) {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const permission = await getPermissionById(id);
    res.status(StatusCodes.OK).json(permission);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to fetch permission",
    });
  }
}

export async function updatePermissionController(req: Request, res: Response) {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const data = PermissionUpdateSchema.parse(req.body);
    const result = await updatePermission(id, data);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to update permission",
    });
  }
}

export async function deletePermissionController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const result = await deletePermission(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to delete permission",
    });
  }
}

// Role Assignment Controllers
export async function assignRoleToUserController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { userId } = z.object({ userId: z.string() }).parse(req.params);
    const { roleId } = z.object({ roleId: z.string() }).parse(req.body);
    const result = await assignRoleToUser({ userId, roleId });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to assign role to user",
    });
  }
}

export async function removeRoleFromUserController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { userId, roleId } = z
      .object({
        userId: z.string(),
        roleId: z.string(),
      })
      .parse(req.params);
    const result = await removeRoleFromUser({ userId, roleId });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to remove role from user",
    });
  }
}

export async function getUserRolesController(req: Request, res: Response) {
  try {
    const { userId } = z.object({ userId: z.string() }).parse(req.params);
    const roles = await getUserRoles(userId);
    res.status(StatusCodes.OK).json(roles);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to fetch user roles",
    });
  }
}

// Permission Assignment Controllers
export async function assignPermissionToRoleController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { roleId } = z.object({ roleId: z.string() }).parse(req.params);
    const { permissionId } = z
      .object({ permissionId: z.string() })
      .parse(req.body);
    const result = await assignPermissionToRole({ roleId, permissionId });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to assign permission to role",
    });
  }
}

export async function removePermissionFromRoleController(
  req: Request,
  res: Response<MessageResponse>,
) {
  try {
    const { roleId, permissionId } = z
      .object({
        roleId: z.string(),
        permissionId: z.string(),
      })
      .parse(req.params);
    const result = await removePermissionFromRole({ roleId, permissionId });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to remove permission from role",
    });
  }
}

export async function getRolePermissionsController(
  req: Request,
  res: Response,
) {
  try {
    const { roleId } = z.object({ roleId: z.string() }).parse(req.params);
    const permissions = await getRolePermissions(roleId);
    res.status(StatusCodes.OK).json(permissions);
  } catch (error: any) {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({
      message: error.message || "Failed to fetch role permissions",
    });
  }
}

