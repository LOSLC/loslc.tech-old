import * as pg from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";

export const itemsTable = pg.pgTable("items", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	name: pg.text("name").notNull(),
	description: pg.text("description").notNull(),
	images: pg.text().array().default([]).notNull(),
	price: pg.integer("price").notNull(),
	createdBy: pg.varchar("created_by").notNull(),
	published: pg.boolean().default(false).notNull(),
	featured: pg.boolean("featured").default(false).notNull(),
	createdAt: pg.timestamp("created_at").defaultNow().notNull(),
	updatedAt: pg.timestamp("updated_at").defaultNow().notNull(),
});

export const itemCaracteristicsTable = pg.pgTable("item_characteristics", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	itemId: pg
		.uuid("item_id")
		.references((): pg.AnyPgColumn => itemsTable.id, { onDelete: "cascade" })
		.notNull(),
	name: pg.text("name").notNull(),
});

export const itemCaracteristicVariantsTable = pg.pgTable(
	"item_characteristic_variants",
	{
		id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
		caracteristicId: pg
			.uuid("caracteristic_id")
			.references((): pg.AnyPgColumn => itemCaracteristicsTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		value: pg.text("value").notNull(),
	},
);

export const orderedItemVariantLinkTable = pg.pgTable(
	"ordered_item_variants_link",
	{
		orderedItemsId: pg
			.uuid("ordered_items_id")
			.references((): pg.AnyPgColumn => orderedItemsTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		variantIds: pg
			.uuid()
			.references((): pg.AnyPgColumn => itemCaracteristicVariantsTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
	},
);

export const orderedItemsTable = pg.pgTable("ordered_items", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	itemId: pg
		.uuid("item_id")
		.references((): pg.AnyPgColumn => itemsTable.id, { onDelete: "cascade" })
		.notNull(),
	cartId: pg
		.uuid("cart_id")
		.references((): pg.AnyPgColumn => shoppingCartsTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	quantity: pg.integer("quantity").default(1).notNull(),
});

export const shoppingCartsTable = pg.pgTable("shopping_carts", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	userId: pg
		.varchar("user_id")
		.references((): pg.AnyPgColumn => usersTable.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: pg.timestamp("created_at").defaultNow().notNull(),
	updatedAt: pg.timestamp("updated_at").defaultNow().notNull(),
});

export const ordersTable = pg.pgTable("orders", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	userId: pg
		.varchar("user_id")
		.references((): pg.AnyPgColumn => usersTable.id)
		.notNull(),
	cartId: pg
		.uuid("cart_id")
		.references((): pg.AnyPgColumn => shoppingCartsTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	createdAt: pg.timestamp("created_at").defaultNow().notNull(),
	paidAt: pg.timestamp("paid_at"),
	confirmed: pg.boolean("confirmed").default(false).notNull(),
	accepted: pg.boolean("accepted").default(false).notNull(),
	paid: pg.boolean("paid").default(false).notNull(),
});

export type Order = typeof ordersTable.$inferSelect;
export type Item = typeof itemsTable.$inferSelect;
