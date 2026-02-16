"use client";

import { Stats } from "@/lib/types";
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";

interface StatsBarProps {
  stats: Stats | null;
}

export function StatsBar({ stats }: StatsBarProps) {
  if (!stats) return null;

  return (
    <div className="flex items-center gap-6 px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 text-sm">
        <Circle className="w-4 h-4 text-zinc-400" />
        <span className="text-zinc-600 dark:text-zinc-400">To Do</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {stats.todoTasks}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-amber-500" />
        <span className="text-zinc-600 dark:text-zinc-400">In Progress</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {stats.inProgressTasks}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="text-zinc-600 dark:text-zinc-400">Done</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {stats.doneTasks}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2 text-sm">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <span className="text-zinc-600 dark:text-zinc-400">Velocity</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {stats.velocity}/day
        </span>
      </div>
    </div>
  );
}
