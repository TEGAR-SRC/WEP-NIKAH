import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalPrisma = globalThis as unknown as { prisma: PrismaClient };

function resolvePrisma() {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("file:"))
    return new PrismaClient({ adapter: new PrismaLibSql({ url }) });
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

export const prisma = globalPrisma.prisma ?? resolvePrisma();
if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
