import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For portfolio/demo - use SQLite with adapter (required for Prisma 7)
const DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const sqlitePath = DATABASE_URL.replace(/^file:/, '');

// Create SQLite database instance
const sqlite = new Database(sqlitePath);

// Create SQLite adapter for Prisma 7
const adapter = new PrismaBetterSqlite3(sqlite);

const db = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
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
