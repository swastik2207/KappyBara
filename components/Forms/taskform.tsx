"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Modal from "react-modal";
import { TaskFormProps, Task } from "@/types/types";

export default function TaskForm({ isOpen, onClose, onAddTask }: TaskFormProps) {
 
  const [newTask, setNewTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    onAddTask(newTask);
    setNewTask({
      id: "",
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Task"
      ariaHideApp={false}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button onClick={onClose} className="absolute top-3 right-3">
        <X size={18} />
      </button>

      <h2 className="text-lg font-semibold mb-4">Add New Task</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />

        <Input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />

        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "high" | "medium" | "low" })}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="high">🔥 High Priority</option>
          <option value="medium">⚡ Medium Priority</option>
          <option value="low">🌱 Low Priority</option>
        </select>

        <Input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newTask.status === "completed"}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.checked ? "completed" : "pending" })}
          />
          Mark as Completed
        </label>

        <Button type="submit" className="w-full">
          Add Task
        </Button>
      </form>
    </Modal>
  );
}
