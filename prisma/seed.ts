import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const agents = [
  { name: "Junior Claw", emoji: "🦞", role: "CTO/Strategy", color: "#ef4444" },
  { name: "Hunter", emoji: "🎯", role: "Business Dev", color: "#f97316" },
  { name: "Scope", emoji: "🔭", role: "Proposals", color: "#eab308" },
  { name: "Forge", emoji: "⚒️", role: "Tech Lead", color: "#84cc16" },
  { name: "Vox", emoji: "📢", role: "Content", color: "#22c55e" },
  { name: "Sentinel", emoji: "👁️", role: "Ops", color: "#14b8a6" },
  { name: "Atlas", emoji: "📋", role: "Project Manager", color: "#06b6d4" },
  { name: "Pixel", emoji: "🎨", role: "Frontend", color: "#3b82f6" },
  { name: "Stack", emoji: "🔌", role: "Backend", color: "#6366f1" },
  { name: "Shield", emoji: "🛡️", role: "QA/Security", color: "#8b5cf6" },
  { name: "Pipeline", emoji: "🚀", role: "DevOps", color: "#a855f7" },
  { name: "Echo", emoji: "🤝", role: "Client Success", color: "#d946ef" },
  { name: "Ledger", emoji: "💰", role: "Finance", color: "#ec4899" },
];

async function main() {
  console.log("Seeding agents...");

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { id: agent.name.toLowerCase().replace(/\s+/g, "-") },
      update: agent,
      create: { id: agent.name.toLowerCase().replace(/\s+/g, "-"), ...agent },
    });
  }

  console.log("✅ Seeded 13 agents");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
