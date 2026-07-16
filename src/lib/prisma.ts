import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { Pool } from "pg";

const globalPrisma = globalThis as unknown as { prisma: PrismaClient };

function resolvePrisma() {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("file:"))
    return new PrismaClient({ adapter: new PrismaLibSql({ url }) });
  const pool = new Pool({
    connectionString: url,
    max: 5,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 15000,
  });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

export const prisma = globalPrisma.prisma ?? resolvePrisma();
if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
