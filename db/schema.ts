import { pgTable, serial, text, timestamp, integer, uuid, pgEnum } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), 
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  priority: priorityEnum("priority").notNull().default("medium"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Using Clerk's userId (string)
  name: text("name").unique().notNull(),
});

export const taskCategories = pgTable("task_categories", {
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
});

export const taskArchive = pgTable("task_archive", {
  id: uuid("id").primaryKey(),
  userId: text("user_id").notNull(), 
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("completed"),
  archivedAt: timestamp("archived_at").defaultNow(),
});

export type Task = InferInsertModel<typeof tasks>;
export type Category = InferInsertModel<typeof categories>;

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(categories, {
    fields: [tasks.userId],
    references: [categories.userId],
  }),
}));

export const categoriesRelations = relations(categories, ({ one }) => ({
  user: one(tasks, {
    fields: [categories.userId],
    references: [tasks.userId],
  }),
}));
