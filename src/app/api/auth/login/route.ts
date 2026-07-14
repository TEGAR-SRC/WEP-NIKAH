import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { verify as argonVerify } from "argon2";

const JWT_SECRET = process.env.JWT_SECRET || "nikah-jwt-secret-change-in-production";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

export async function POST(req: Request) {
  const { email, password, turnstileToken } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password diperlukan" }, { status: 400 });
  }

  // Skip Turnstile di local development
  if (TURNSTILE_SECRET && process.env.NODE_ENV !== "development") {
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
  if (!admin) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  let valid = false;
  try { valid = await argonVerify(admin.password, password); } catch {}
  if (!valid) {
    // Fallback SHA256 untuk admin lama
    valid = admin.password === createHash("sha256").update(password).digest("hex");
  }
  if (!valid) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  // JWT token with 12-hour expiry
  const token = sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "12h" });

  const c = await cookies();
  c.set("dash-auth", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 43200 }); // 12 jam
  return NextResponse.json({ ok: true, token });
}
