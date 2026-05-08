import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildPrismaClient() {
  const dbPath = path.join(process.cwd(), "prisma", "database.sqlite");
  // PrismaLibSql v7 takes a config object with url, not a client instance
  const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter: adapter as any });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? buildPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
