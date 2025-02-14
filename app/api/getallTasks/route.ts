import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import {eq} from  "drizzle-orm"
import { redis } from "@/lib/redis";


export async function GET() {
  try {
    const {userId}=await auth();
    
    if(userId){

      const cacheKey = `all_tasks:${userId}`;
      const cachedTasks = await redis.get(cacheKey);
  
      if (cachedTasks && typeof cachedTasks==="string") {
        return NextResponse.json({ success: true, tasks: JSON.parse(cachedTasks), cached: true }, { status: 200 });
      }
  
      const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
  
      await redis.set(cacheKey, JSON.stringify(allTasks), { ex: 60 });

  


     return NextResponse.json({ success: true, tasks: allTasks }, { status: 200 });
    }
    else{
      return NextResponse.json({ success: false, message: "UnAuthorized Access" }, { status:404 });

    }

  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
