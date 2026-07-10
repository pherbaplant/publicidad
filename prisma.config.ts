import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // El CLI (migrate/generate) necesita una conexión directa, no la pooled
    // que usa la app en runtime (ver src/lib/prisma.ts) — con Neon/Supabase
    // esto evita fallos de migración por el pooler en modo transacción.
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
