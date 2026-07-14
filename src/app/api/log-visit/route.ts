import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { guestId } = await req.json();
    if (!guestId) return NextResponse.json({ ok: false }, { status: 400 });
    await prisma.log.create({ data: { type: "visit", guestId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
