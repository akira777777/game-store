import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For portfolio/demo - use simple Prisma Client without adapters
const DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db';

// Simple Prisma Client for portfolio demo - no adapters needed
// DATABASE_URL is automatically read from environment by Prisma
const db = globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

export { db };

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  const shutdown = async () => {
    await db.$disconnect()
  }

  process.on('beforeExit', shutdown)
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
