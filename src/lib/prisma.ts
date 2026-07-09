import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

// DATABASE_URL debe ser la conexión "pooled" (p. ej. el pooler de Neon o el
// puerto 6543 de Supabase) — la conexión directa vive en DIRECT_URL y solo la
// usa el CLI de Prisma para migraciones (ver prisma.config.ts).
const pool =
  globalForPrisma.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pool;
}

// Evita que Vercel congele/recicle la función antes de que el pool cierre
// las conexiones ociosas (necesario en Fluid Compute con pools serverless).
attachDatabasePool(pool);

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
