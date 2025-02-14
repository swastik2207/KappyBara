CREATE TABLE "task_archive" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'completed',
	"archived_at" timestamp DEFAULT now()
);
