import * as pg from "drizzle-orm/pg-core";

export const notificationsTable = pg.pgTable("notifications", {
	id: pg.uuid("id").primaryKey().defaultRandom().notNull(),
	userId: pg.varchar("user_id").notNull(),
	type: pg.varchar("type").notNull(),
	message: pg.text("message").notNull(),
	isRead: pg.boolean("is_read").default(false).notNull(),
	createdAt: pg.timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notificationsTable.$inferSelect;
export type NewNotification = typeof notificationsTable.$inferInsert;
