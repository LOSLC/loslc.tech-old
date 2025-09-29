import { randNumericString, randString } from "@/core/utils/random";
import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";
import { addDays, addHours, addMinutes } from "date-fns";
import { getEnv } from "@/core/env";

const AUTH_SESSION_EXPIRATION_DAYS =
	Number.parseInt(getEnv("AUTH_SESSION_EXPIRATION_DAYS")) || 30;
export const authSessionsTable = pgTable("auth_session", {
	id: pg
		.varchar("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => randString()),
	userId: pg
		.varchar("user_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	expiresAt: pg
		.timestamp("expires_at")
		.notNull()
		.$defaultFn(() => addDays(new Date(), AUTH_SESSION_EXPIRATION_DAYS)),
	expired: pg.boolean("expired").notNull().default(false),
});

const OTP_EXPIRATION_MINUTES =
	Number.parseInt(getEnv("OTP_EXPIRATION_MINUTES")) || 5;
export const otpSessionsTable = pgTable("otp_session", {
	id: pg
		.varchar("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => randString()),
	userId: pg
		.varchar("user_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
	token: pg
		.varchar("token")
		.$defaultFn(() => randNumericString(6))
		.notNull(),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	expiresAt: pg
		.timestamp("expires_at")
		.notNull()
		.$defaultFn(() => addMinutes(new Date(), OTP_EXPIRATION_MINUTES)),
	expired: pg.boolean("expired").notNull().default(false),
});

const EMAIL_VERIFICATION_EXPIRATION_HOURS =
	Number.parseInt(getEnv("EMAIL_VERIFICATION_EXPIRATION_HOURS")) || 24;
export const accountVerificationSessionsTable = pgTable(
	"account_verification_session",
	{
		id: pg
			.varchar("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => randString()),
		userId: pg
			.varchar("user_id")
			.notNull()
			.references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
		token: pg
			.varchar("token")
			.$defaultFn(() => randNumericString(6))
			.notNull(),
		createdAt: pg.timestamp("created_at").notNull().defaultNow(),
		expiresAt: pg
			.timestamp("expires_at")
			.notNull()
			.$defaultFn(() =>
				addHours(new Date(), EMAIL_VERIFICATION_EXPIRATION_HOURS),
			),
		expired: pg.boolean("expired").notNull().default(false),
	},
);

const PASSWORD_RESET_EXPIRATION_MINUTES =
	Number.parseInt(getEnv("PASSWORD_RESET_EXPIRATION_MINUTES")) | 5;
export const passwordResetSessionsTable = pgTable("password_reset_session", {
	id: pg
		.varchar("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => randString()),
	userId: pg
		.varchar("user_id")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
	token: pg
		.varchar("token")
		.$defaultFn(() => randNumericString(6))
		.notNull(),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	expiresAt: pg
		.timestamp("expires_at")
		.notNull()
		.$defaultFn(() =>
			addMinutes(new Date(), PASSWORD_RESET_EXPIRATION_MINUTES),
		),
	expired: pg.boolean("expired").notNull().default(false),
});

export type AuthSession = typeof authSessionsTable.$inferSelect;
export type OtpSession = typeof otpSessionsTable.$inferSelect;
export type AccountVerificationSession =
	typeof accountVerificationSessionsTable.$inferSelect;
export type PasswordResetSession =
	typeof passwordResetSessionsTable.$inferSelect;
export type NewAuthSession = typeof authSessionsTable.$inferInsert;
export type NewOtpSession = typeof otpSessionsTable.$inferInsert;
export type NewAccountVerificationSession =
	typeof accountVerificationSessionsTable.$inferInsert;
export type NewPasswordResetSession =
	typeof passwordResetSessionsTable.$inferInsert;
