"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import TaskCalendar from "@/components/taskCalendar";
import { Task } from "@/types/types";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useFetchRecentTasks } from "@/hooks/useFetchRecentTasks";

const TaskForm = dynamic(() => import("@/components/Forms/taskform"), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const { mutate, isPending } = useCreateTask();
  const { data: recentTasks = [], isLoading, isError, refetch } = useFetchRecentTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addTask = (task: Task) => {
    if (task) setTasks([...tasks, task]);

    mutate(task, {
      onSuccess: () => {
        refetch();
        setIsFormOpen(false);
      },
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto relative">
      <h1 className="text-3xl font-bold text-center">Your Own Platform for Daily Task Management</h1>
      <p className="text-center text-gray-600">Organize your tasks efficiently, track deadlines, and enhance productivity.</p>
      
      <Button onClick={() => setIsFormOpen(true)} className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} Add Task
      </Button>

      {isFormOpen && <TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onAddTask={addTask} />}

      <Tabs defaultValue="all">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => router.push("/tasks/completed")}>
            Completed
          </TabsTrigger>
          <TabsTrigger value="pending" onClick={() => router.push("/tasks/pending")}>
            Pending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading && <p className="text-gray-500">Loading tasks...</p>}
          {isError && <p className="text-red-500">Failed to load tasks</p>}
          {recentTasks.length === 0 && !isLoading && !isError && (
            <p className="text-gray-400">No recent tasks</p>
          )}

          <h2 className="text-xl font-semibold mt-4">Upcoming Task Deadlines (Within Next 5 Days)</h2>
          <p className="text-gray-600">Stay ahead by tracking your upcoming task deadlines efficiently.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTasks.map(({ id, title, priority, status, description, dueDate }) => (
              <Card key={id}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-gray-800">Priority: {priority}</p>
                  <p className="text-gray-600">{description}</p>
                  <p className="text-sm text-gray-500">Due Date: {new Date(dueDate).toLocaleDateString()}</p>
                  <Progress value={status === "completed" ? 100 : status === "in-progress" ? 50 : 0} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="flex items-center justify-center flex-col p-4">
          <h2 className="text-lg font-semibold mb-2">Task Calendar</h2>
          <p className="text-gray-600 text-center">Visualize your deadlines and manage your projects effectively.</p>
          <TaskCalendar />
        </CardContent>
      </Card>
    </div>
  );
}
