ALTER TABLE "categories" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "task_archive" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_archive" ADD CONSTRAINT "task_archive_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;