ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigned_to_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "assigned_to";