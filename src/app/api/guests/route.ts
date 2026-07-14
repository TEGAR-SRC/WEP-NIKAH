import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const guests = await prisma.guest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(guests);
}

export async function POST(req: NextRequest) {
  const { name, slug, phone, title } = await req.json();
  const guest = await prisma.guest.create({
    data: { name, slug, phone, title },
  });
  return NextResponse.json(guest, { status: 201 });
}
