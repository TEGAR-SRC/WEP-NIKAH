import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId, confirm } = await req.json();
  if (!guestId) return NextResponse.json({ error: "guestId diperlukan" }, { status: 400 });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) return NextResponse.json({ ok: true });

  if (!confirm) {
    // Guest didn't select confirm → send follow-up asking to confirm
    const msg = `Halo {title} {name} 👋

Terima kasih sudah mengirimkan ucapan untuk pernikahan kami 🙏

Kami ingin memastikan kehadiran Anda. Mohon balas pesan ini dengan:

1️⃣ Hadir
2️⃣ Tidak Hadir
3️⃣ Ragu

Atau klik link undangan untuk konfirmasi langsung:
{BASE_URL}/undangan/{slug}

Terima kasih 🙏
Tegar & Vebiza`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://nikah.tegar-src.xyz";
    const body = msg.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name).replace(/\{slug\}/g, guest.slug).replace(/\{BASE_URL\}/g, baseUrl);
    try { await sendMessage(guest.phone, body); } catch {}
    await prisma.log.create({ data: { type: "sent_wa_followup", guestId, detail: `Follow-up konfirmasi ke ${guest.phone}` } });
    return NextResponse.json({ ok: true });
  }

  // Guest confirmed → send thank you with template
  let tmpl = await prisma.template.findFirst({ where: { name: "konfirmasi (active)" } });
  if (!tmpl) tmpl = await prisma.template.findFirst({ where: { name: { startsWith: "konfirmasi" } } });
  const body = tmpl?.body ?? "Terima kasih {title} {name}, konfirmasi Anda: {confirm}";
  const label = confirm === "hadir" ? "✅ Hadir" : confirm === "tidak hadir" ? "❌ Tidak Hadir" : "🤔 Ragu";
  const msg = body.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name).replace(/\{confirm\}/g, label);
  try { await sendMessage(guest.phone, msg); } catch {}
  await prisma.log.create({ data: { type: "sent_wa_confirm", guestId, detail: `Konfirmasi ${confirm} ke ${guest.phone}` } });
  return NextResponse.json({ ok: true });
}
