import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId } = await req.json();
  if (!guestId) return NextResponse.json({ error: "guestId diperlukan" }, { status: 400 });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) return NextResponse.json({ ok: true });

  // Cari template active terlebih dahulu, fallback ke template terima kasih pertama
  let tmpl = await prisma.template.findFirst({ where: { name: "terima kasih (active)" } });
  if (!tmpl) tmpl = await prisma.template.findFirst({ where: { name: { startsWith: "terima kasih" } } });

  const body = tmpl?.body ?? `Terima kasih {title} {name} sudah membuka undangan pernikahan kami 🙏`;
  const msg = body.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name);

  try { await sendMessage(guest.phone, msg); } catch {}
  return NextResponse.json({ ok: true });
}
