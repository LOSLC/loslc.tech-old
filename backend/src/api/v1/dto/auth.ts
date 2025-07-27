import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .max(20)
    .min(3)
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric or underscore"),
  fullName: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters"),
  passwordConfirm: z.string().min(8, "Password confirmation is required"),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters"),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
