export interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  active: boolean;
  _count?: { tasks: number };
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  archived: boolean;
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  projectId: string | null;
  project: Project | null;
  agentId: string | null;
  agent: Agent | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  agents: number;
  projects: number;
  completedThisWeek: number;
  velocity: number;
}

export type Column = {
  id: "todo" | "in_progress" | "done";
  title: string;
  color: string;
};

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do", color: "#6b7280" },
  { id: "in_progress", title: "In Progress", color: "#f59e0b" },
  { id: "done", title: "Done", color: "#10b981" },
];

export const PRIORITIES = [
  { id: "low", label: "Low", color: "#6b7280" },
  { id: "medium", label: "Medium", color: "#3b82f6" },
  { id: "high", label: "High", color: "#f59e0b" },
  { id: "urgent", label: "Urgent", color: "#ef4444" },
];
