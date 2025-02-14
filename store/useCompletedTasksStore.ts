import { create } from "zustand";

import { Task } from "@/types/types";

interface CompletedTasksState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const useCompletedTasksStore = create<CompletedTasksState>((set) => ({
  tasks: [],
  setTasks: (tasks) => {
    set({ tasks });

    
    setTimeout(() => {
      set({ tasks: [] });
    }, 60000);
  },
}));
