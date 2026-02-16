"use client";

import { useState, useEffect, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task, Agent, Project, Stats, COLUMNS } from "@/lib/types";
import { Column } from "./Column";
import { TaskModal } from "./TaskModal";
import { StatsBar } from "./StatsBar";
import { RefreshCw, Plus, Filter } from "lucide-react";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<string>("todo");
  const [filterAgent, setFilterAgent] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, agentsRes, projectsRes, statsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/agents"),
        fetch("/api/projects"),
        fetch("/api/stats"),
      ]);

      const [tasksData, agentsData, projectsData, statsData] = await Promise.all([
        tasksRes.json(),
        agentsRes.json(),
        projectsRes.json(),
        statsRes.json(),
      ]);

      setTasks(tasksData.data || []);
      setAgents(agentsData.data || []);
      setProjects(projectsData.data || []);
      setStats(statsData.data || null);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Task["status"];

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    // API update
    try {
      await fetch(`/api/tasks/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // Refresh stats
      const statsRes = await fetch("/api/stats");
      const statsData = await statsRes.json();
      setStats(statsData.data);
    } catch (error) {
      console.error("Failed to update task:", error);
      fetchData(); // Revert on error
    }
  };

  const handleSaveTask = async (data: Partial<Task>) => {
    try {
      if (data.id) {
        // Update existing
        const res = await fetch(`/api/tasks/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === data.id ? updated.data : task))
        );
      } else {
        // Create new
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, status: newTaskStatus }),
        });
        const created = await res.json();
        setTasks((prev) => [created.data, ...prev]);
      }
      setShowModal(false);
      setSelectedTask(null);
      // Refresh stats
      const statsRes = await fetch("/api/stats");
      const statsData = await statsRes.json();
      setStats(statsData.data);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;

    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setShowModal(false);
      setSelectedTask(null);
      // Refresh stats
      const statsRes = await fetch("/api/stats");
      const statsData = await statsRes.json();
      setStats(statsData.data);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const openNewTaskModal = (status: string = "todo") => {
    setSelectedTask(null);
    setNewTaskStatus(status);
    setShowModal(true);
  };

  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterAgent && task.agentId !== filterAgent) return false;
    if (filterProject && task.projectId !== filterProject) return false;
    return true;
  });

  const getColumnTasks = (status: string) =>
    filteredTasks.filter((task) => task.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦞</span>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Mission Control
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="text-sm px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.emoji} {agent.name}
                </option>
              ))}
            </select>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="text-sm px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => openNewTaskModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </header>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full">
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getColumnTasks(column.id)}
                onTaskClick={openEditTaskModal}
                onAddTask={() => openNewTaskModal(column.id)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={selectedTask}
          agents={agents}
          projects={projects}
          defaultStatus={newTaskStatus}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
          onDelete={selectedTask ? handleDeleteTask : undefined}
        />
      )}
    </div>
  );
}
