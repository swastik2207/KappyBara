import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { taskArchive } from "@/db/schema";
import {redis} from "@/lib/redis";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
  
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const cacheKey = `completed_tasks:${userId}`;
    const cachedTasks = await redis.get(cacheKey);

    if (cachedTasks && typeof cachedTasks==="string") {
      return NextResponse.json({ success: true, tasks: JSON.parse(cachedTasks), cached: true }, { status: 200 });
    }

    const allTasks = await db.select().from(taskArchive).where(eq(taskArchive.userId, userId));

    await redis.set(cacheKey, JSON.stringify(allTasks), { ex: 60 });


    return NextResponse.json({ success: true, tasks: allTasks, cached: false }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
