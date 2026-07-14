import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { hash } from "argon2";

export async function GET() {
  const c = await cookies();
  if (!c.has("dash-auth")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admins = await prisma.admin.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const c = await cookies();
  if (!c.has("dash-auth")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password diperlukan" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
  }

  const hashed = await hash(password, { type: 2 }); // argon2id
  const admin = await prisma.admin.create({
    data: { email, password: hashed },
    select: { id: true, email: true, createdAt: true },
  });
  return NextResponse.json(admin, { status: 201 });
}
