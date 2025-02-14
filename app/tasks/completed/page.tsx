"use client";
import { useEffect } from "react";
import { useCompletedTasksStore } from "@/store/useCompletedTasksStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchCompletedTasks } from "@/hooks/useFetchCompletedTasks";

export default function CompletedTasks() {



  const { data: fetchedTasks = [], isLoading, isError, refetch } = useFetchCompletedTasks();
  console.log(fetchedTasks)

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Completed Tasks</h2>

      <Button onClick={() => refetch()} className="mb-4">
        Refresh Completed Tasks
      </Button>

      {isLoading && <p className="text-gray-500">Loading tasks...</p>}
      {isError && <p className="text-red-500">Failed to load tasks</p>}
      {fetchedTasks.length === 0 && !isLoading && !isError && (
        <p className="text-gray-400">No completed tasks</p>
      )}

      {fetchedTasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Completed on: {new Date(task.archivedAt!).toLocaleDateString()  }
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
