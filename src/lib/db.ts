import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const getPrismaClient = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  return prisma;
};

export const db = getPrismaClient();
