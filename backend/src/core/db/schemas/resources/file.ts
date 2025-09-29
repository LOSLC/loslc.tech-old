import { pgTable } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";

export const filesTable = pgTable("file", {
	id: pg.uuid().defaultRandom().primaryKey().notNull(),
	userId: pg
		.varchar()
		.notNull()
		.references((): pg.AnyPgColumn => usersTable.id),
	name: pg.varchar().notNull(),
	size: pg.doublePrecision().notNull(),
	fileType: pg.varchar().notNull(),
	protected: pg.boolean().default(false).notNull(),
	createdAt: pg.timestamp().defaultNow().notNull(),
});

export type File = typeof filesTable.$inferInsert;
export type NewFile = typeof filesTable.$inferInsert;
