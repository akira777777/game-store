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
    // For Neon pooled connections, migrations need directUrl
    ...(directUrl && { directUrl }),
  },
});

export default config;
