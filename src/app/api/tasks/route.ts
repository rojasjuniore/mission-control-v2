import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const agentId = searchParams.get("agentId");
  const projectId = searchParams.get("projectId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (agentId) where.agentId = agentId;
  if (projectId) where.projectId = projectId;

  const tasks = await prisma.task.findMany({
    where,
    include: { agent: true, project: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: tasks });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, status, priority, projectId, agentId, dueDate } = body;

  if (!title) {
    return NextResponse.json(
      { success: false, error: { code: "MISSING_TITLE", message: "Title is required" } },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      projectId,
      agentId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: { agent: true, project: true },
  });

  return NextResponse.json({ success: true, data: task });
}
