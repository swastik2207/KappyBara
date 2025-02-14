ALTER TABLE "tasks" DROP CONSTRAINT "tasks_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "project_id";