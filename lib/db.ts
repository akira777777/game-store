import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Определяем тип базы данных по DATABASE_URL
const databaseUrl = process.env.DATABASE_URL.trim();
const isPostgreSQL = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');
const isSQLite = databaseUrl.startsWith('file:');

// Remove inline comments from DATABASE_URL if present
const dbUrlForPool = databaseUrl.split('#')[0].trim();

let db: PrismaClient;
let pool: Pool | undefined;

try {
  if (isPostgreSQL) {
    // PostgreSQL configuration with connection pooling
    pool = new Pool({
      connectionString: dbUrlForPool,
    });

    // Create Prisma adapter for PostgreSQL
    const adapter = new PrismaPg(pool);

    db = globalForPrisma.prisma ??
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        errorFormat: 'pretty',
      });
  } else if (isSQLite) {
    // SQLite configuration with adapter (required in Prisma 7 when using prisma.config.ts)
    // Extract file path from file:// URL
    const sqlitePath = dbUrlForPool.replace(/^file:/, '');

    // Create Prisma adapter for SQLite (constructor takes config object with url)
    const adapter = new PrismaBetterSqlite3({
      url: sqlitePath,
    });

    db = globalForPrisma.prisma ??
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        errorFormat: 'pretty',
      });
  } else {
    throw new Error(
      `Unsupported DATABASE_URL format. Expected postgresql://, postgres://, or file://. ` +
      `Got: ${databaseUrl.substring(0, 20)}...`
    );
  }
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
    if (pool) {
      await pool.end()
    }
  }

  process.on('beforeExit', shutdown)
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
