import { NextResponse } from "next/server";
import { getStatus, sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId, message } = await req.json();
  if (!guestId || !message) {
    return NextResponse.json({ error: "guestId dan message diperlukan" }, { status: 400 });
  }

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) {
    return NextResponse.json({ error: "Tamu tidak ditemukan atau nomor WA tidak ada" }, { status: 400 });
  }

  const { connected } = await getStatus();
  if (!connected) {
    return NextResponse.json({ error: "WhatsApp belum terhubung" }, { status: 400 });
  }

  try {
    await sendMessage(guest.phone, message);
    await prisma.log.create({
      data: { type: "sent_wa", guestId: guest.id, detail: `WA ke ${guest.phone} berhasil` },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await prisma.log.create({
      data: { type: "sent_wa", guestId: guest.id, detail: `WA ke ${guest.phone} gagal: ${e?.message}` },
    });
    return NextResponse.json({ error: e?.message || "Gagal mengirim" }, { status: 500 });
  }
}
