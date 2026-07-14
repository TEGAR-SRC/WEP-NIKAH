import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { hash } from "argon2";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const c = await cookies();
  if (!c.has("dash-auth")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { email, password } = await req.json();

  const data: Record<string, string> = {};
  if (email) data.email = email;
  if (password) {
    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }
    data.password = await hash(password, { type: 2 });
  }

  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });
  }

  const admin = await prisma.admin.update({
    where: { id },
    data,
    select: { id: true, email: true, createdAt: true },
  });
  return NextResponse.json(admin);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const c = await cookies();
  if (!c.has("dash-auth")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
