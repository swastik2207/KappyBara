import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Task } from "@/types/types";

const updateTask = async (taskId: string, taskData: Partial<Task>, token: string | null): Promise<Task> => {
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`/api/updateTask/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to update task");
  }

  return data.task;
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ taskId, taskData }: { taskId: string; taskData: Partial<Task> }) => {
      const token = await getToken();
      return updateTask(taskId, taskData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    
  });
};
