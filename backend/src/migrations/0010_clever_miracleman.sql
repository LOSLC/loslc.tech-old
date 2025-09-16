CREATE TABLE "forum_comment_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"vote_type" integer NOT NULL,
	"voted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forum_comment_votes" ADD CONSTRAINT "forum_comment_votes_comment_id_forum_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."forum_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_comment_votes" ADD CONSTRAINT "forum_comment_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;