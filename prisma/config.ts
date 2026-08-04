import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local first (Next.js convention), then fall back to .env
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || env("DIRECT_URL"),
  },
});
