import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const databaseUrl = env("DATABASE_URL");

// Определяем тип базы данных
const isPostgreSQL = /^postgres(ql)?:\/\/.+/.test(databaseUrl);
const isSQLite = /^file:/.test(databaseUrl);

// Validate DATABASE_URL format
if (!isPostgreSQL && !isSQLite) {
  const errorMessage =
    "Invalid DATABASE_URL format. Please provide a valid connection string.\n" +
    "PostgreSQL format: postgresql://user:password@host:port/database?sslmode=require\n" +
    "SQLite format: file:./prisma/dev.db\n" +
    `Got: ${databaseUrl.substring(0, 50)}...`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Check if using pooled connection (Neon pooler) - только для PostgreSQL
const isPooledConnection = isPostgreSQL && databaseUrl.includes('pooler');
let directUrl: string | undefined;

if (isPooledConnection) {
  // For pooled connections, migrations need directUrl (non-pooled)
  // Convert pooled URL to direct URL by modifying only the hostname portion
  try {
    const url = new URL(databaseUrl);
    let hostname = url.hostname;

    // Remove '-pooler' from hostname (e.g., 'ep-xxx-pooler' -> 'ep-xxx')
    hostname = hostname.replace(/-pooler(?=\.|$)/, '');

    // Replace '.c-' with '.' only in Neon-specific hostname patterns
    // This matches patterns like 'xxx.c-neon.tech' -> 'xxx.neon.tech'
    // but avoids false matches in other parts of the URL
    if (hostname.includes('.c-neon.') || hostname.includes('.c-') && hostname.includes('neon')) {
      hostname = hostname.replace(/\.c-(?=neon\.)/, '.');
    }

    // Reconstruct URL with modified hostname
    url.hostname = hostname;
    directUrl = url.toString();
  } catch (error) {
    // If URL parsing fails, fall back to simple string replacement
    // but only apply to the hostname portion (between @ and /)
    const atIndex = databaseUrl.indexOf('@');
    const slashIndex = databaseUrl.indexOf('/', atIndex);
    if (atIndex !== -1) {
      const beforeHost = databaseUrl.substring(0, atIndex + 1);
      const hostPart = slashIndex !== -1
        ? databaseUrl.substring(atIndex + 1, slashIndex)
        : databaseUrl.substring(atIndex + 1);
      const afterHost = slashIndex !== -1
        ? databaseUrl.substring(slashIndex)
        : '';

      let modifiedHost = hostPart.replace(/-pooler(?=\.|$)/, '');
      if (modifiedHost.includes('.c-neon.') || (modifiedHost.includes('.c-') && modifiedHost.includes('neon'))) {
        modifiedHost = modifiedHost.replace(/\.c-(?=neon\.)/, '.');
      }

      directUrl = beforeHost + modifiedHost + afterHost;
    } else {
      // Fallback: simple replacement (less safe but better than nothing)
      directUrl = databaseUrl.replace(/-pooler(?=\.|$)/, '').replace(/\.c-(?=neon\.)/, '.');
    }
  }
}

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: databaseUrl,
    // For Neon pooled PostgreSQL connections, migrations need directUrl
    // SQLite doesn't need directUrl
    ...(isPostgreSQL && directUrl && { directUrl }),
  },
});

export default config;
