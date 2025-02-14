import { NextResponse } from "next/server";
import { db } from "@/db"; // Import your Drizzle instance
import { tasks,Task } from "@/db/schema";
import {auth}from "@clerk/nextjs/server"
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
     const {userId}=await auth();
     const body = await req.json();
     if(!userId){
        throw new Error("Access Denied")
      }

    let parsedDueDate: Date | null = null;
    if (body.dueDate) {
      const tempDate = new Date(body.dueDate);
      if (!isNaN(tempDate.getTime())) {
        parsedDueDate = tempDate;
      } else {
        return NextResponse.json({ success: false, message: "Invalid dueDate format" }, { status: 400 });
      }
    }

    // Construct the task object
    const newTask: Task = {
      title: body.title,
      userId:"user_2sr4kJtqQ7bgZeNIPaW7S9gd28q",
      description: body.description || null,
      status: body.status || "pending",
      priority:body.priority,
      dueDate: parsedDueDate
    };

    // Insert the task into the database
    await db.insert(tasks).values(newTask).returning();
    await redis.del(`all_tasks:${userId}`,);
    await redis.del(`upcoming_tasks:${userId}`);

    return NextResponse.json({ success: true, message:"Task successfully created" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Error creating task" }, { status: 500 });
  }
}