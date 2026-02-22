// Conditional Prisma client - works in build and runtime
let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      prisma = new PrismaClient();
    } catch {
      console.warn("Prisma client not available - using mock");
      prisma = createMockPrisma();
    }
  }
  return prisma;
}

function createMockPrisma() {
  const mockData = {
    agents: [],
    projects: [],
    tasks: [],
  };
  
  return {
    agent: {
      findMany: async () => mockData.agents,
      findUnique: async () => null,
      create: async (data: any) => ({ id: crypto.randomUUID(), ...data.data }),
      update: async (data: any) => data.data,
      delete: async () => ({}),
    },
    project: {
      findMany: async () => mockData.projects,
      findUnique: async () => null,
      create: async (data: any) => ({ id: crypto.randomUUID(), ...data.data }),
      update: async (data: any) => data.data,
      delete: async () => ({}),
    },
    task: {
      findMany: async () => mockData.tasks,
      findUnique: async () => null,
      create: async (data: any) => ({ id: crypto.randomUUID(), ...data.data }),
      update: async (data: any) => data.data,
      delete: async () => ({}),
    },
  };
}

export { getPrisma };
export default { getPrisma };
