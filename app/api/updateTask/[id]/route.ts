import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, taskArchive } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {auth}from "@clerk/nextjs/server"
const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  dueDate: z.date().optional(), // Accepts Date type for validation
});
export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const { params } = context; // Ensure params is properly accessed
    const taskId = params.id; 
    const {userId}=await auth();
   
    if(!userId){
    throw new Error("Access Denied");
   }
   
    const body = await req.json();

    // Convert `dueDate` to a Date object if it exists
    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate);
    }

    // Validate the transformed data using Zod
    const parsedData = updateTaskSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: parsedData.error.errors }, { status: 400 });
    }

    const existingTask = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (existingTask.length === 0) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

    if (parsedData.data.status === "completed") {
      // Ensure all required fields like `id`, `userId`, etc., are included
      const taskToArchive = {
        id: existingTask[0].id,
        userId: existingTask[0].userId,
        title: parsedData.data.title ?? existingTask[0].title,
        description: parsedData.data.description ?? existingTask[0].description,
        priority: parsedData.data.priority ?? existingTask[0].priority,
        status: parsedData.data.status,
        dueDate: parsedData.data.dueDate ?? existingTask[0].dueDate,
        archivedAt: new Date(), // Add timestamp for archival
      };

      await db.insert(taskArchive).values(taskToArchive);
      await db.delete(tasks).where(eq(tasks.id, taskId));
      return NextResponse.json({ success: true, message: "Task archived successfully" }, { status: 200 });
    }

    await db.update(tasks).set(parsedData.data).where(eq(tasks.id, taskId));

    return NextResponse.json({ success: true, message: "Task updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Task Update Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}