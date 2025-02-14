ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "projects" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "task_archive" DROP CONSTRAINT "task_archive_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "task_archive" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "user_id" SET DATA TYPE text;