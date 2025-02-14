"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Modal from "react-modal";
import { Task } from "@/types/types";

export default function UpdateTaskForm({ isOpen, onClose, task, onUpdate }: { isOpen: boolean; onClose: () => void; task: Task; onUpdate: (task: Task) => void }) {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedTask.title.trim()) return;
    
    onUpdate(updatedTask);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Update Task"
      ariaHideApp={false}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button onClick={onClose} className="absolute top-3 right-3">
        <X size={18} />
      </button>

      <h2 className="text-lg font-semibold mb-4">Update Task</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Task Title"
          value={updatedTask.title}
          onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
          required
        />

        <Input
          type="text"
          placeholder="Task Description"
          value={updatedTask.description}
          onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
          required
        />

        <select
          value={updatedTask.priority}
          onChange={(e) => setUpdatedTask({ ...updatedTask, priority: e.target.value as "high" | "medium" | "low" })}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="high">🔥 High Priority</option>
          <option value="medium">⚡ Medium Priority</option>
          <option value="low">🌱 Low Priority</option>
        </select>

        <Input
         type="date"
         value={updatedTask.dueDate ? new Date(updatedTask.dueDate).toISOString().split("T")[0] : ""} // Convert Date to YYYY-MM-DD format
         onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate:(e.target.value as string) })} // Convert back to Date object
         required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={updatedTask.status === "completed"}
            onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.checked ? "completed" : "pending" })}
          />
          Mark as Completed
        </label>

        <Button type="submit" className="w-full">
          Update Task
        </Button>
      </form>
    </Modal>
  );
}
