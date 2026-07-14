import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const guests = await prisma.guest.findMany({
    where: { name: { contains: q } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(guests);
}
