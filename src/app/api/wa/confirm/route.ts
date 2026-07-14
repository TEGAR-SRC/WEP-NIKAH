import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId, confirm } = await req.json();
  if (!guestId) return NextResponse.json({ error: "guestId diperlukan" }, { status: 400 });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) return NextResponse.json({ ok: true });

  // Cari template konfirmasi active, fallback ke pertama
  let tmpl = await prisma.template.findFirst({ where: { name: "konfirmasi (active)" } });
  if (!tmpl) tmpl = await prisma.template.findFirst({ where: { name: { startsWith: "konfirmasi" } } });

  const body = tmpl?.body ?? "Terima kasih {title} {name}, konfirmasi Anda: {confirm}";
  const label = confirm === "hadir" ? "✅ Hadir" : confirm === "tidak hadir" ? "❌ Tidak Hadir" : "🤔 Ragu";
  const msg = body.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name).replace(/\{confirm\}/g, label);

  try { await sendMessage(guest.phone, msg); } catch {}
  return NextResponse.json({ ok: true });
}
