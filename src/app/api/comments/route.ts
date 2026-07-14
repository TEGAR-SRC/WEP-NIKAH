import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guestId = searchParams.get("guestId");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10)));
  const where = guestId ? { guestId } : {};

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: { guest: { select: { name: true, title: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({
    comments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const { guestId, message, confirm } = await req.json();
  const comment = await prisma.comment.create({
    data: { guestId, message, confirm: confirm ?? "" },
    include: { guest: { select: { name: true, title: true } } },
  });
  return NextResponse.json(comment, { status: 201 });
}
