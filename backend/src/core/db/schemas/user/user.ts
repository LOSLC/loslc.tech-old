import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { randString } from "src/core/utils/random";

export const usersTable = pgTable("user", {
	id: pg
		.varchar("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => randString()),
	email: pg.varchar("email").notNull().unique(),
	username: pg.varchar("username").notNull().unique(),
	fullName: pg.varchar("full_name").notNull(),
	profilePictureFileId: pg.uuid(),
	hashedPassword: pg.varchar("hashed_password").notNull(),
	joinedAt: pg.timestamp("joined_at").notNull().defaultNow(),
	lastUpdated: pg.timestamp("last_updated").defaultNow(),
	isBanned: pg.boolean("is_banned").notNull().default(false),
	isVerified: pg.boolean("is_verified").notNull().default(false),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
