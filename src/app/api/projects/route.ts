import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { archived: false },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return NextResponse.json({ success: true, data: projects });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, color } = body;

  if (!name) {
    return NextResponse.json(
      { success: false, error: { code: "MISSING_NAME", message: "Name is required" } },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: { name, description, color },
  });

  return NextResponse.json({ success: true, data: project });
}
