CREATE TABLE "blogpost" (
	"id" varchar PRIMARY KEY NOT NULL,
	"authorId" varchar NOT NULL,
	"category_id" uuid,
	"coverImageId" uuid,
	"title" varchar(500) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"content" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "blogpost_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" varchar NOT NULL,
	"author_id" varchar NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogpost_like" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"likerId" varchar NOT NULL,
	"post_id" varchar NOT NULL,
	"likedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogpost_view" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viewerId" varchar,
	"viewedAt" timestamp DEFAULT now() NOT NULL,
	"post_id" varchar NOT NULL,
	"viewTime" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogpost_tag_link" (
	"post_id" varchar NOT NULL,
	"tag_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_tag" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"user_id" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogpost_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blogpost" ADD CONSTRAINT "blogpost_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost" ADD CONSTRAINT "blogpost_category_id_blogpost_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blogpost_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost" ADD CONSTRAINT "blogpost_coverImageId_file_id_fk" FOREIGN KEY ("coverImageId") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_comment" ADD CONSTRAINT "blogpost_comment_post_id_blogpost_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blogpost"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_comment" ADD CONSTRAINT "blogpost_comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_comment" ADD CONSTRAINT "blogpost_comment_parent_id_blogpost_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blogpost_comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_like" ADD CONSTRAINT "blogpost_like_likerId_user_id_fk" FOREIGN KEY ("likerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_like" ADD CONSTRAINT "blogpost_like_post_id_blogpost_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blogpost"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_view" ADD CONSTRAINT "blogpost_view_viewerId_user_id_fk" FOREIGN KEY ("viewerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_view" ADD CONSTRAINT "blogpost_view_post_id_blogpost_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blogpost"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_tag_link" ADD CONSTRAINT "blogpost_tag_link_post_id_blogpost_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blogpost"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogpost_tag_link" ADD CONSTRAINT "blogpost_tag_link_tag_id_blog_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_tag" ADD CONSTRAINT "blog_tag_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;