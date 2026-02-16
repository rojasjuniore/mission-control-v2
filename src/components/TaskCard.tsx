"use client";

import { Task, PRIORITIES } from "@/lib/types";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, User } from "lucide-react";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const priority = PRIORITIES.find((p) => p.id === task.priority);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`p-3 mb-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-all ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-500" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {task.title}
            </h3>
            <span
              className="px-1.5 py-0.5 text-xs rounded font-medium shrink-0"
              style={{
                backgroundColor: `${priority?.color}20`,
                color: priority?.color,
              }}
            >
              {priority?.label}
            </span>
          </div>

          {task.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            {task.agent && (
              <div className="flex items-center gap-1">
                <span>{task.agent.emoji}</span>
                <span>{task.agent.name}</span>
              </div>
            )}
            {task.project && (
              <div
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  backgroundColor: `${task.project.color}20`,
                  color: task.project.color,
                }}
              >
                {task.project.name}
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 ml-auto">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
