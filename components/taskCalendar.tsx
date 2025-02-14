"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchTasks } from "@/hooks/useFetchTasks";

type CalendarValue = Date | null | [Date | null, Date | null];

export default function TaskCalendar() {
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date());
  const { data: tasks = [], isLoading, isError, refetch } = useFetchTasks(); // ✅ Destructure refetch properly
  
  const getTileContent = ({ date }: { date: Date }) => {
    console.log(tasks)
    if (!tasks) return null; // ✅ Prevents errors if tasks are undefined
       
    const formattedDate = format(date, "yyyy-MM-dd");
    const taskForDay = tasks.find((task) => task.dueDate?.startsWith(formattedDate));

    return taskForDay ? (
      <div className="mt-1 flex justify-center">
        <span className="h-2 w-2 bg-red-500 rounded-full"></span>
      </div>
    ) : null;
  };

  return (
    <Card className="p-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Task Calendar</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && <p className="text-gray-500">Loading tasks...</p>}
        {isError && <p className="text-red-500">Failed to load tasks</p>}

        <Calendar
          onChange={(value) => setSelectedDate(value as CalendarValue)}
          value={selectedDate}
          tileContent={getTileContent}
          className="w-full border rounded-md shadow-sm"
        />

        <Button onClick={() => refetch()} className="mt-3 w-full">
          Refresh Tasks
        </Button>
      </CardContent>
    </Card>
  );
}
