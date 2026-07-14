import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

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

  return NextResponse.json({ comments, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const { guestId, message, confirm, turnstileToken } = await req.json();

  if (TURNSTILE_SECRET && process.env.NODE_ENV !== "development") {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: turnstileToken ?? "" }),
    });
    const data = await r.json();
    if (!data.success) {
      return NextResponse.json({ error: "Verifikasi captcha gagal" }, { status: 400 });
    }
  }

  const comment = await prisma.comment.create({
    data: { guestId, message, confirm: confirm ?? "" },
    include: { guest: { select: { name: true, title: true } } },
  });
  return NextResponse.json(comment, { status: 201 });
}
