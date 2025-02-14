export interface Task {
    id: string;
    title: string;
    description:string;
    status:string
    priority: "high" | "medium" | "low";
    dueDate: string;
  }
  
export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
}