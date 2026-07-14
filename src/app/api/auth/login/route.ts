import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

export async function POST(req: Request) {
  const { email, password, turnstileToken } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password diperlukan" }, { status: 400 });
  }

  // Verify Turnstile
  if (TURNSTILE_SECRET) {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: turnstileToken ?? "" }),
    });
    const data = await res.json();
    if (!data.success) {
      return NextResponse.json({ error: "Verifikasi captcha gagal" }, { status: 400 });
    }
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || admin.password !== createHash("sha256").update(password).digest("hex")) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const c = await cookies();
  c.set("dash-auth", admin.id, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 * 7 });
  return NextResponse.json({ ok: true });
}
