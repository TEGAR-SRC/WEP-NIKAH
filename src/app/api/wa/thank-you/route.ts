import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId } = await req.json();
  if (!guestId) return NextResponse.json({ error: "guestId diperlukan" }, { status: 400 });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) return NextResponse.json({ ok: true });

  // Look for thank-you template, fallback to default
  let body = `Terima kasih {title} {name} sudah membuka undangan pernikahan kami 🙏

Tegar Arrahman & Vebiza Juinda Putri Zahara
📍 KUA Batu Aji, Batam
📅 20 Juli 2026

Jangan lupa konfirmasi kehadiran di halaman undangan ya 😊`;
  const tmpl = await prisma.template.findFirst({ where: { name: { contains: "terima kasih" } } });
  if (tmpl) body = tmpl.body;

  const msg = body.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name);
  try {
    await sendMessage(guest.phone, msg);
  } catch {}
  return NextResponse.json({ ok: true });
}
