"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/types";

const fetchRecentTasks = async (token: string | null): Promise<Task[]> => {
  try {
    const response = await fetch("/api/getrecentTasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to fetch tasks");
    }

    return data.tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Custom Hook using React Query
export const useFetchRecentTasks = () => {
  const { getToken } = useAuth(); //  Get the token inside the hook
  return useQuery({
    queryKey: ["recenttasks"],
    queryFn: async () => {
      const token = await getToken(); // Fetch the token dynamically
      return fetchRecentTasks(token);
    },
  });
};
