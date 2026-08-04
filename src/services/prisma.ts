/**
 * Prisma 7 client singleton.
 *
 * Prisma 7 uses driver adapters (@prisma/adapter-pg + pg Pool).
 * SSL settings rejectUnauthorized: false ensures seamless connection with Supabase Pooler.
 * Lazy getter pattern prevents premature client instantiation before env variables are loaded.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    const adapter = new PrismaPg(pool);

    const client = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    } else {
      return client;
    }
  }

  return globalForPrisma.prisma;
}

/** Proxy export so existing `prisma.user...` calls continue to work seamlessly */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
