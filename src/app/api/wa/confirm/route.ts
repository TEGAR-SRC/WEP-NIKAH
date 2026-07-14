import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

async function getTmpl(nameLike: string, fallback: string): Promise<string> {
  let tmpl = await prisma.template.findFirst({ where: { name: `${nameLike} (active)` } });
  if (!tmpl) tmpl = await prisma.template.findFirst({ where: { name: { startsWith: nameLike } } });
  return tmpl?.body ?? fallback;
}

export async function POST(req: Request) {
  const { guestId, confirm } = await req.json();
  if (!guestId) return NextResponse.json({ error: "guestId diperlukan" }, { status: 400 });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) return NextResponse.json({ ok: true });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://nikah.tegar-src.xyz";

  if (!confirm) {
    // Follow-up — guest didn't select confirm
    const body = await getTmpl("follow-up", "Yth. {title} {name}, mohon konfirmasi kehadiran: {BASE_URL}/undangan/{slug}");
    const msg = body.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name).replace(/\{slug\}/g, guest.slug).replace(/\{BASE_URL\}/g, baseUrl);
    try { await sendMessage(guest.phone, msg); } catch {}
    await prisma.log.create({ data: { type: "sent_wa_followup", guestId, detail: `Follow-up ke ${guest.phone}` } });
    return NextResponse.json({ ok: true });
  }

  // Hadir / Tidak Hadir
  const prefix = confirm === "hadir" ? "hadir" : confirm === "tidak hadir" ? "tidak hadir" : "konfirmasi";
  const logType = confirm === "hadir" ? "sent_wa_hadir" : confirm === "tidak hadir" ? "sent_wa_tidak_hadir" : "sent_wa_confirm";
  const label = confirm === "hadir" ? "✅ Hadir" : confirm === "tidak hadir" ? "❌ Tidak Hadir" : "🤔 Ragu";
  const body = await getTmpl(prefix, `Terima kasih {title} {name}, konfirmasi Anda: ${label}`);

  const msg = body.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name).replace(/\{confirm\}/g, label).replace(/\{BASE_URL\}/g, baseUrl).replace(/\{slug\}/g, guest.slug).replace(/\{TEGAR_SRC\}/g, "github.com/TEGAR-SRC");
  try { await sendMessage(guest.phone, msg); } catch {}
  await prisma.log.create({ data: { type: logType, guestId, detail: `${label} - ${guest.phone}` } });
  return NextResponse.json({ ok: true });
}
