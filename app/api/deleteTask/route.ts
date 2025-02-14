import { NextResponse } from "next/server";
import { db } from "@/db"; // Import your Drizzle instance
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
  
      const deletedTask = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  
      if (!deletedTask.length) {
        return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: "Task deleted" });
    } catch (error) {
      return NextResponse.json({ success: false, message: "Error deleting task" }, { status: 500 });
    }
  }