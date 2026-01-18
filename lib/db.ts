import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// #region agent log
const logPath = 'c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log';
const logData = { location: 'lib/db.ts:8', message: 'DB init start', data: { hasDbUrl: !!process.env.DATABASE_URL, nodeEnv: process.env.NODE_ENV, dbUrlPreview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' };
require('fs').appendFileSync(logPath, JSON.stringify(logData) + '\n');
// #endregion

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection pool
// #region agent log
const dbUrlForPool = process.env.DATABASE_URL?.trim().split('#')[0].trim() || process.env.DATABASE_URL; // Remove inline comments
const logDataPool = { location: 'lib/db.ts:19', message: 'Creating pool', data: { originalUrlLength: process.env.DATABASE_URL?.length || 0, cleanedUrlLength: dbUrlForPool?.length || 0, urlHasComment: process.env.DATABASE_URL?.includes('#') || false }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' };
require('fs').appendFileSync(logPath, JSON.stringify(logDataPool) + '\n');
// #endregion

const pool = new Pool({
  connectionString: dbUrlForPool,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// #region agent log
const logDataAdapter = { location: 'lib/db.ts:28', message: 'Adapter created', data: { hasAdapter: !!adapter, hasPool: !!pool }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' };
require('fs').appendFileSync(logPath, JSON.stringify(logDataAdapter) + '\n');
// #endregion

// Test connection
// #region agent log
pool.connect().then((client) => {
  const logDataConn = { location: 'lib/db.ts:33', message: 'Pool connection test success', data: { connected: true }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' };
  require('fs').appendFileSync(logPath, JSON.stringify(logDataConn) + '\n');
  client.release();
}).catch((error) => {
  const logDataConnErr = { location: 'lib/db.ts:36', message: 'Pool connection test failed', data: { errorMessage: error?.message || String(error), errorCode: error?.code || 'unknown' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' };
  require('fs').appendFileSync(logPath, JSON.stringify(logDataConnErr) + '\n');
});
// #endregion

let db: PrismaClient;
try {
  db = globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    })

  // #region agent log
  const logData2 = { location: 'lib/db.ts:30', message: 'PrismaClient created', data: { isGlobal: !!globalForPrisma.prisma, clientCreated: true }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' };
  require('fs').appendFileSync(logPath, JSON.stringify(logData2) + '\n');
  // #endregion
} catch (error: any) {
  // #region agent log
  const logData3 = { location: 'lib/db.ts:33', message: 'PrismaClient creation error', data: { errorMessage: error?.message || String(error), errorName: error?.name || 'unknown', errorCode: error?.code || 'unknown' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' };
  require('fs').appendFileSync(logPath, JSON.stringify(logData3) + '\n');
  // #endregion
  throw error;
}

export { db };

// #region agent log
fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/db.ts:19', message: 'DB client created', data: { isGlobal: !!globalForPrisma.prisma }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
// #endregion

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
