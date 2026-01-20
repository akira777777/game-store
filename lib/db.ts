import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool?: Pool
}

function createPrismaClient() {
  const DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db';

  // Check if it's a SQLite database
  const isSQLite = DATABASE_URL.startsWith('file:');

  if (isSQLite) {
    let sqlitePath = DATABASE_URL.replace(/^file:/, '');

    // Make path absolute if relative
    if (!path.isAbsolute(sqlitePath)) {
      sqlitePath = path.join(process.cwd(), sqlitePath);
    }

    // Ensure directory exists
    const dbDir = path.dirname(sqlitePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Create SQLite database instance and adapter for Prisma 7
    const sqlite = new Database(sqlitePath);
    const adapter = new PrismaBetterSqlite3({ url: sqlitePath });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });
  } else {
    // PostgreSQL - use pg adapter (required for Prisma 7)
    const pool = new Pool({ connectionString: DATABASE_URL });
    const adapter = new PrismaPg(pool);

    // Store pool for cleanup
    globalForPrisma.pool = pool;

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });
  }
}

const db = globalForPrisma.prisma ?? createPrismaClient();

export { db };

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  const shutdown = async () => {
    await db.$disconnect()
    // Close pg pool if it exists
    if (globalForPrisma.pool) {
      await globalForPrisma.pool.end()
    }
  }

  process.on('beforeExit', shutdown)
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
