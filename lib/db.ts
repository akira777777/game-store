import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection pool
// Remove inline comments from DATABASE_URL if present
const dbUrlForPool = process.env.DATABASE_URL?.trim().split('#')[0].trim() || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: dbUrlForPool,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

let db: PrismaClient;
try {
  db = globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    })
} catch (error: any) {
  throw error;
}

export { db };

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Graceful shutdown for all environments
if (typeof process !== 'undefined') {
  const shutdown = async () => {
    await db.$disconnect()
    await pool.end()
  }

  process.on('beforeExit', shutdown)
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
