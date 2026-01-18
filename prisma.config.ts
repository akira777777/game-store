import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// #region agent log
const logPath = 'c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log';
const logData = { location: 'prisma.config.ts:4', message: 'Loading DATABASE_URL', data: { hasProcessEnv: !!process.env.DATABASE_URL, processEnvValue: process.env.DATABASE_URL ? (process.env.DATABASE_URL.substring(0, 30) + '...') : 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' };
require('fs').appendFileSync(logPath, JSON.stringify(logData) + '\n');
// #endregion

const databaseUrl = env("DATABASE_URL");

// #region agent log
const logData2 = { location: 'prisma.config.ts:11', message: 'DATABASE_URL loaded', data: { urlLength: databaseUrl?.length || 0, urlStart: databaseUrl ? databaseUrl.substring(0, 50) : 'undefined', hasUser: databaseUrl?.includes('@') || false, hasPassword: databaseUrl?.match(/:\/\/[^:]+:[^@]+@/) ? true : false }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' };
require('fs').appendFileSync(logPath, JSON.stringify(logData2) + '\n');
// #endregion

// Validate DATABASE_URL format for PostgreSQL
// Note: If you want to use SQLite locally, change provider in schema.prisma to "sqlite"
// Accept both postgresql:// and postgres:// formats
// #region agent log
const logData3 = { location: 'prisma.config.ts:15', message: 'Validating DATABASE_URL format', data: { urlFormat: databaseUrl ? databaseUrl.substring(0, 100) : 'undefined', matchesPattern: databaseUrl ? /^postgres(ql)?:\/\/.+:.+@.+/.test(databaseUrl) : false }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' };
require('fs').appendFileSync(logPath, JSON.stringify(logData3) + '\n');
// #endregion

if (!/^postgres(ql)?:\/\/.+:.+@.+/.test(databaseUrl)) {
  // #region agent log
  const logData4 = { location: 'prisma.config.ts:20', message: 'DATABASE_URL format validation failed', data: { url: databaseUrl ? databaseUrl.substring(0, 100) : 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' };
  require('fs').appendFileSync(logPath, JSON.stringify(logData4) + '\n');
  // #endregion
  const errorMessage =
    "Invalid DATABASE_URL format. Please provide a valid PostgreSQL connection string.\n" +
    "Expected format: postgresql://user:password@host:port/database?sslmode=require\n" +
    "Or: postgres://user:password@host:port/database?sslmode=require";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Parse URL to extract components for debugging
// #region agent log
try {
  const urlMatch = databaseUrl.match(/^postgres(ql)?:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)(\?.*)?$/);
  if (urlMatch) {
    const logDataUrl = {
      location: 'prisma.config.ts:38', message: 'URL parsed', data: {
        hasMatch: true,
        user: urlMatch[2] || 'unknown',
        passwordLength: urlMatch[3]?.length || 0,
        host: urlMatch[4] || 'unknown',
        database: urlMatch[5] || 'unknown',
        params: urlMatch[6] || 'none',
        isPooled: urlMatch[4]?.includes('pooler') || false,
        fullUrl: databaseUrl.substring(0, 80) + '...'
      }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E'
    };
    require('fs').appendFileSync(logPath, JSON.stringify(logDataUrl) + '\n');
  } else {
    const logDataUrlNoMatch = { location: 'prisma.config.ts:38', message: 'URL parse no match', data: { url: databaseUrl.substring(0, 100) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' };
    require('fs').appendFileSync(logPath, JSON.stringify(logDataUrlNoMatch) + '\n');
  }
} catch (e: any) {
  const logDataUrlErr = { location: 'prisma.config.ts:38', message: 'URL parse error', data: { error: e?.message || String(e) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' };
  require('fs').appendFileSync(logPath, JSON.stringify(logDataUrlErr) + '\n');
}
// #endregion

// Check if using pooled connection (Neon pooler)
const isPooledConnection = databaseUrl.includes('pooler');
let directUrl: string | undefined;

if (isPooledConnection) {
  // For pooled connections, migrations need directUrl (non-pooled)
  // Convert pooled URL to direct URL by removing '-pooler' from hostname
  directUrl = databaseUrl.replace('-pooler', '').replace('.c-', '.');

  // #region agent log
  const logDataPooler = {
    location: 'prisma.config.ts:66', message: 'Pooled connection detected', data: {
      isPooled: true,
      directUrlPreview: directUrl.substring(0, 80) + '...'
    }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D'
  };
  require('fs').appendFileSync(logPath, JSON.stringify(logDataPooler) + '\n');
  // #endregion
}

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: databaseUrl,
    // For Neon pooled connections, migrations need directUrl
    ...(directUrl && { directUrl }),
  },
});

// #region agent log
const logData5 = { location: 'prisma.config.ts:30', message: 'Prisma config created', data: { datasourceUrl: config.datasource?.url ? config.datasource.url.substring(0, 50) + '...' : 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' };
require('fs').appendFileSync(logPath, JSON.stringify(logData5) + '\n');
// #endregion

export default config;
