import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Directly access process.env to avoid Prisma's strict env() check failing build
    url: process.env.DATABASE_URL ?? "postgresql://dummy:dummy@localhost:5432/dummy",
  },
});
