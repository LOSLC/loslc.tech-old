ALTER TABLE "roles_permissions" DROP CONSTRAINT "roles_permissions_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "roles_permissions" DROP CONSTRAINT "roles_permissions_permission_id_permissions_id_fk";
--> statement-breakpoint
ALTER TABLE "users_roles" DROP CONSTRAINT "users_roles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_roles" DROP CONSTRAINT "users_roles_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;