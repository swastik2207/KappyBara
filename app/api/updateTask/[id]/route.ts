import { NextResponse , NextRequest} from "next/server";
import { db } from "@/db";
import { tasks, taskArchive } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";


export async function PATCH(
  req: NextRequest,
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
    let parsedDueDate: Date | null = null;
    if (body.dueDate) {
      const tempDate = new Date(body.dueDate);
      if (!isNaN(tempDate.getTime())) {
        parsedDueDate = tempDate;
      } else {
        return NextResponse.json({ success: false, message: "Invalid dueDate format" }, { status: 400 });
      }
    }
    const parsedData=body;

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
      title: parsedData.title ?? existingTask[0].title,
      description: parsedData.description ?? existingTask[0].description,
      priority: parsedData.priority ?? existingTask[0].priority,
      status: parsedData.status ?? existingTask[0].status,
      dueDate: parsedDueDate ? parsedDueDate : null
    };

    if (parsedData.status === "completed") {
      const taskToArchive = {
        id: existingTask[0].id,
        userId: existingTask[0].userId,
        ...taskToUpdate,
        archivedAt:new Date() , // ✅ Add archivedAt only when moving to archive
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
