import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, Task } from "@/db/schema";
import { gt, lte, asc,and } from "drizzle-orm";
import { redis } from "@/lib/redis";

const CACHE_KEY = "upcoming_tasks";


export async function GET() {
  try {
    //check cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData && typeof cachedData==="string") {
    
      return NextResponse.json({ success: true, tasks: JSON.parse(cachedData) });
    }




    const today = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(today.getDate() + 5);


    const upcomingTasks: Task[] = await db
      .select()
      .from(tasks)
      .where(and(gt(tasks.dueDate, today),
      lte(tasks.dueDate, fiveDaysLater)))
      .orderBy(asc(tasks.dueDate)); 


    await redis.set(CACHE_KEY, JSON.stringify(upcomingTasks), { ex: 60 });

    return NextResponse.json({ success: true, tasks: upcomingTasks });
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    return NextResponse.json({ success: false, message: "Error fetching tasks" }, { status: 500 });
  }
}
