import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PASSWORD = process.env.DASHBOARD_PASSWORD ?? "admin123";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const c = await cookies();
  c.set("dash-auth", "1", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 * 7 });
  return NextResponse.json({ ok: true });
}
