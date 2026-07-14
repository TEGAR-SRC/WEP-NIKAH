import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId } = await req.json();
  if (!guestId) return NextResponse.json({ error: "guestId diperlukan" }, { status: 400 });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) return NextResponse.json({ ok: true }); // skip if no phone

  try {
    const msg = `Terima kasih ${guest.title} ${guest.name} sudah membuka undangan pernikahan kami 🤵👰

Tegar Arrahman & Vebiza Juinda Putri Zahara
📍 KUA Batu Aji, Batam
📅 20 Juli 2026

Jangan lupa konfirmasi kehadiran ya 😊🙏`;
    await sendMessage(guest.phone, msg);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // silent fail
  }
}
