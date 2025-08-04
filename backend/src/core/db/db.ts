import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { getEnv } from "../env";

export const db = drizzle(getEnv("DATABASE_URL") || "", {
  schema: { ...schema },
});
