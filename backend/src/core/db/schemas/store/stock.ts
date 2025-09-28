import * as pg from "drizzle-orm/pg-core";
import { itemsTable } from "./store";

export const itemStock = pg.pgTable("item_stock", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	itemId: pg
		.uuid("item_id")
		.references((): pg.AnyPgColumn => itemsTable.id, { onDelete: "cascade" })
		.notNull(),
	quantity: pg.integer("quantity").default(0).notNull(),
});
