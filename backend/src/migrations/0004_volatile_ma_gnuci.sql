ALTER TABLE "permission" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "permission" ADD COLUMN "action" varchar NOT NULL;