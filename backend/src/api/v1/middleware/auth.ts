import type { NextFunction, Request, Response } from "express";
import { getCurrentUser } from "../providers/auth";

export async function isAuthentication(req: Request, next: NextFunction) {
  await getCurrentUser(req);
  next();
}
