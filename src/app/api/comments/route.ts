import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guestId = searchParams.get("guestId");
  const where = guestId ? { guestId } : {};
  const comments = await prisma.comment.findMany({
    where,
    include: { guest: { select: { name: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const { guestId, message, confirm } = await req.json();
  const comment = await prisma.comment.create({
    data: { guestId, message, confirm: confirm ?? "" },
    include: { guest: { select: { name: true, title: true } } },
  });
  return NextResponse.json(comment, { status: 201 });
}
