import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password diperlukan" }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || admin.password !== createHash("sha256").update(password).digest("hex")) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const c = await cookies();
  c.set("dash-auth", admin.id, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 * 7 });
  return NextResponse.json({ ok: true });
}
