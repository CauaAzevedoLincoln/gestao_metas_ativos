import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7: URLs de conexão definidas aqui, não no schema.prisma
// - url: pooled connection (PgBouncer) — para runtime do app
// - directUrl: conexão direta — obrigatória para o Prisma Migrate no Neon
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
