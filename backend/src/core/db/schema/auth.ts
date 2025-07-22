import {
  pgTable,
  timestamp,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { randId } from "@/core/utils/crypto";
import { usersTable } from "./user";
import { addDays, addMinutes } from "date-fns";

const LOGIN_SESSION_EXPIRES_IN_DAYS = 60;
const AUTH_SESSION_EXPIRES_IN_DAYS = 1;
const ACCOUNT_VERIFICATION_EXPIRES_IN_DAYS = 7;
const OTP_EXPIRES_IN_MINUTES = 10;

export const loginSessionsTable = pgTable("login_sessions", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randId(50)),
  userId: varchar("user_id").references((): AnyPgColumn => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
    .$defaultFn(() => addDays(new Date(), LOGIN_SESSION_EXPIRES_IN_DAYS))
    .notNull(),
});

export const authSessionsTable = pgTable("auth_sessions", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randId(50)),
  userId: varchar("user_id").references((): AnyPgColumn => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
    .$defaultFn(() => addDays(new Date(), AUTH_SESSION_EXPIRES_IN_DAYS))
    .notNull(),
});

export const accountVerificationTable = pgTable("account_verification", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randId(50)),
  userId: varchar("user_id").references((): AnyPgColumn => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
    .$defaultFn(() => addDays(new Date(), ACCOUNT_VERIFICATION_EXPIRES_IN_DAYS))
    .notNull(),
});

export const otpTable = pgTable("otp", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randId(50)),
  userId: varchar("user_id").references((): AnyPgColumn => usersTable.id),
  code: varchar("code", { length: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
    .$defaultFn(() => addMinutes(new Date(), OTP_EXPIRES_IN_MINUTES))
    .notNull(),
});

export type LoginSession = typeof loginSessionsTable.$inferSelect;
export type NewLoginSession = typeof loginSessionsTable.$inferInsert;
export type AuthSession = typeof authSessionsTable.$inferSelect;
export type NewAuthSession = typeof authSessionsTable.$inferInsert;
export type AccountVerification = typeof accountVerificationTable.$inferSelect;
export type NewAccountVerification =
  typeof accountVerificationTable.$inferInsert;
export type OTP = typeof otpTable.$inferSelect;
export type NewOTP = typeof otpTable.$inferInsert;
