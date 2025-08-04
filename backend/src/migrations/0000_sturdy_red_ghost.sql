CREATE TABLE "user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"username" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"hashed_password" varchar NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"is_banned" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
