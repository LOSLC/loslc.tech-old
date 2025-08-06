CREATE TABLE "ban_motive" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"ban_by" varchar NOT NULL,
	"motive" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ban_motive_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "ban_motive" ADD CONSTRAINT "ban_motive_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ban_motive" ADD CONSTRAINT "ban_motive_ban_by_user_id_fk" FOREIGN KEY ("ban_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;