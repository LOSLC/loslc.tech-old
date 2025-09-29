import { User } from "@/core/db/schema";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
	user?: User;
}
