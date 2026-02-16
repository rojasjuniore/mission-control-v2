import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const [totalTasks, todoTasks, inProgressTasks, doneTasks, agents, projects] =
    await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: "todo" } }),
      prisma.task.count({ where: { status: "in_progress" } }),
      prisma.task.count({ where: { status: "done" } }),
      prisma.agent.count({ where: { active: true } }),
      prisma.project.count({ where: { archived: false } }),
    ]);

  // Tasks completed in last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const completedThisWeek = await prisma.task.count({
    where: {
      status: "done",
      updatedAt: { gte: weekAgo },
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      agents,
      projects,
      completedThisWeek,
      velocity: Math.round(completedThisWeek / 7 * 10) / 10, // tasks per day
    },
  });
}
