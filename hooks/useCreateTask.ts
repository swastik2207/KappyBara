import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Task } from "@/types/types";



const createTask = async (task: Task, token: string | null): Promise<Task> => {
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("/api/createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.task;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth(); //  Use useAuth inside the hook

  return useMutation({
    mutationFn: async (task:Task) => {
      const token = await getToken(); //  Fetch the token inside the function
      return createTask(task, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      queryClient.invalidateQueries({queryKey:["recenttasks"]})//  Refresh the task list
    },
  });
};
