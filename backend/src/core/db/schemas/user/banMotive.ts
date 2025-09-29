import { randString } from "@/core/utils/random";
import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const banMotivesTable = pgTable("ban_motive", {
	id: pg
		.varchar("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => randString()),
	userId: pg
		.varchar("user_id")
		.notNull()
		.unique()
		.references((): pg.AnyPgColumn => usersTable.id),
	banBy: pg
		.varchar("ban_by")
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id),
	motive: pg.text("motive").notNull(),
	createdAt: pg.timestamp("created_at").defaultNow().notNull(),
});
