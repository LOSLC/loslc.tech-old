import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { randId } from "@/core/utils/crypto";

const userTable = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  fullname: varchar("fullname", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const loginSessionsTable = pgTable("login_sessions", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randId(50)),
  userId: uuid("user_id").references()
});
