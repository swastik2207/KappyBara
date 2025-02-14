import { NextResponse , NextRequest} from "next/server";
import { db } from "@/db";
import { tasks, taskArchive } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  dueDate: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { pathname } = req.nextUrl;
    const segments = pathname.split('/');
    const taskId = segments[segments.length - 1];
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Access Denied" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // ✅ Convert `dueDate` properly
    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate);
    }

    // ✅ Validate request data
    const parsedData = updateTaskSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, message: parsedData.error.errors },
        { status: 400 }
      );
    }

    const existingTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId));

    if (existingTask.length === 0) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    // ✅ Define separate objects for updating and archiving tasks
    const taskToUpdate = {
      title: parsedData.data.title ?? existingTask[0].title,
      description: parsedData.data.description ?? existingTask[0].description,
      priority: parsedData.data.priority ?? existingTask[0].priority,
      status: parsedData.data.status ?? existingTask[0].status,
      dueDate: parsedData.data.dueDate ? new Date(parsedData.data.dueDate) : null
    };

    if (parsedData.data.status === "completed") {
      const taskToArchive = {
        id: existingTask[0].id,
        userId: existingTask[0].userId,
        ...taskToUpdate,
        archivedAt: new Date(), // ✅ Add archivedAt only when moving to archive
      };

      await db.insert(taskArchive).values(taskToArchive);
      await db.delete(tasks).where(eq(tasks.id, taskId));

      return NextResponse.json(
        { success: true, message: "Task archived successfully" },
        { status: 200 }
      );
    }

    // ✅ Update task without `archivedAt`
    await db.update(tasks).set(taskToUpdate).where(eq(tasks.id, taskId));

    return NextResponse.json(
      { success: true, message: "Task updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Task Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
