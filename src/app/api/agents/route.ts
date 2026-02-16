import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const agents = await prisma.agent.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return NextResponse.json({ success: true, data: agents });
}
