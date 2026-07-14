import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId, message, phone } = await req.json();
  if (!message) return NextResponse.json({ error: "Pesan diperlukan" }, { status: 400 });

  let targetPhone = phone;

  if (guestId && guestId !== "manual") {
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest || !guest.phone) {
      return NextResponse.json({ error: "Tamu tidak ditemukan atau nomor WA tidak ada" }, { status: 400 });
    }
    targetPhone = guest.phone;
  }

  if (!targetPhone) return NextResponse.json({ error: "Nomor WA diperlukan" }, { status: 400 });

  try {
    await sendMessage(targetPhone, message);
    if (guestId && guestId !== "manual") {
      await prisma.log.create({ data: { type: "sent_wa", guestId, detail: `WA ke ${targetPhone} berhasil` } });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (guestId && guestId !== "manual") {
      await prisma.log.create({ data: { type: "sent_wa", guestId, detail: `WA ke ${targetPhone} gagal: ${e?.message}` } });
    }
    return NextResponse.json({ error: e?.message || "Gagal mengirim" }, { status: 500 });
  }
}
