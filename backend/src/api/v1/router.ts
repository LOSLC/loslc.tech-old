import { Router } from "express";
import { router as authRouter } from "./controllers/auth";
import { router as accessMgtRouter } from "./controllers/accessmgt";
import { router as blogRouter } from "./controllers/blog";

export const router = Router();

router.use("/auth", authRouter);
router.use("/access", accessMgtRouter);
router.use("/blog", blogRouter);
