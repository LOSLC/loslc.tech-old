CREATE TABLE "role" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" varchar NOT NULL,
	"roleId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"resource" varchar NOT NULL,
	"resource_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permission" (
	"role_id" varchar NOT NULL,
	"permission_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_verification_session" DROP CONSTRAINT "account_verification_session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "auth_session" DROP CONSTRAINT "auth_session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "otp_session" DROP CONSTRAINT "otp_session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "password_reset_session" DROP CONSTRAINT "password_reset_session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_role_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_verification_session" ADD CONSTRAINT "account_verification_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otp_session" ADD CONSTRAINT "otp_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_session" ADD CONSTRAINT "password_reset_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;