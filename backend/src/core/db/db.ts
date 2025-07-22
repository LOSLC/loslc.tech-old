import { drizzle } from "drizzle-orm/postgres-js";
import * as users from "@/core/db/schema/user";
import * as auth from "@/core/db/schema/auth";
import * as security from "@/core/db/schema/security";

export const db = drizzle(process.env.DATABASE_URL as string, {
  schema: {
    ...users,
    ...auth,
    ...security,
  },
});
