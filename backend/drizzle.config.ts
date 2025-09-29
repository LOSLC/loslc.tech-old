import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/core/db/schema.ts",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
	verbose: true,
});
