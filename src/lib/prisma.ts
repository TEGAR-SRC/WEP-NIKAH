import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalPrisma = globalThis as unknown as { prisma: PrismaClient };

export function createPrisma() {
  return new PrismaClient({
    adapter: new PrismaLibSql({ url: "file:./prisma/dev.db" }),
  });
}

export const prisma = globalPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
