"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useFetchTasks } from "@/hooks/useFetchTasks";
import UpdateTaskForm from "@/components/Forms/updatetaskform";
import { Task } from "@/types/types";
import { useUpdateTask } from "@/hooks/useTaskUpdate";

export default function PendingTasksPage() {
  const { data: tasks, isLoading, isError, refetch } = useFetchTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const { mutate, isPending } = useUpdateTask();

  const getProgressValue = (status: string) => {
    switch (status) {
      case "completed":
        return 100;
      case "in-progress":
        return 50;
      default:
        return 0;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  const handleUpdateClick = (task:Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedTask:Task) => {
    // Perform update logic here
    
    mutate({
      taskId: updatedTask.id, taskData: { ...updatedTask }
    },
    {
      onSuccess: () => {
        refetch() // Fetch updated tasks instead of clearing them
      },
    });
    setIsModalOpen(false);
    
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Pending Tasks</h1>

      <Button onClick={() => refetch()} className="w-full">
        Refresh Tasks
      </Button>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      )}

      {isError && <p className="text-red-500 text-center">Failed to load tasks</p>}

      {tasks?.length === 0 && <p className="text-gray-500 text-center">No pending tasks</p>}

      {tasks?.map((task) => (
        <Card key={task.id} className="border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              DeadLine: {new Date(task.dueDate).toLocaleDateString()}
            </p>

            <div className="mt-4">
              <Progress
                value={getProgressValue(task.status)}
                className={`h-3 rounded-md transition-all duration-500 ${getProgressColor(task.status)}`}
              />
            </div>
            
            <Button onClick={() => handleUpdateClick(task)} className="mt-4 w-full">
              Update Task
            </Button>
          </CardContent>
        </Card>
      ))}

      {isModalOpen && selectedTask && (
        <UpdateTaskForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
