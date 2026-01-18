import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const databaseUrl = env("DATABASE_URL");

// Validate DATABASE_URL format for PostgreSQL
// Note: If you want to use SQLite locally, change provider in schema.prisma to "sqlite"
// Accept both postgresql:// and postgres:// formats
if (!/^postgres(ql)?:\/\/.+:.+@.+/.test(databaseUrl)) {
  const errorMessage =
    "Invalid DATABASE_URL format. Please provide a valid PostgreSQL connection string.\n" +
    "Expected format: postgresql://user:password@host:port/database?sslmode=require\n" +
    "Or: postgres://user:password@host:port/database?sslmode=require";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Check if using pooled connection (Neon pooler)
const isPooledConnection = databaseUrl.includes('pooler');
let directUrl: string | undefined;

if (isPooledConnection) {
  // For pooled connections, migrations need directUrl (non-pooled)
  // Convert pooled URL to direct URL by removing '-pooler' from hostname
  directUrl = databaseUrl.replace('-pooler', '').replace('.c-', '.');
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

export default config;
