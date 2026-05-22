import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient | undefined };

let prismaClient: PrismaClient | undefined;

if (process.env.DATABASE_URL) {
  try {
    prismaClient = globalForPrisma.prisma ?? new PrismaClient({ log: ['query', 'warn', 'error'] });
  } catch (error) {
    console.warn('Prisma client failed to initialize; continuing without database:', error);
    prismaClient = undefined;
  }
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient;
}
