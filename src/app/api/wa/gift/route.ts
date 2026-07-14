import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/wa";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { guestId, type } = await req.json();
  if (!guestId || !type) return NextResponse.json({ error: "guestId dan type diperlukan" }, { status: 400 });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest || !guest.phone) return NextResponse.json({ ok: true });

  const prefix = type === "hadiah" ? "gift" : "kado";
  let tmpl = await prisma.template.findFirst({ where: { name: `${prefix} (active)` } });
  if (!tmpl) tmpl = await prisma.template.findFirst({ where: { name: { startsWith: prefix } } });

  const body = tmpl?.body ?? "Terima kasih {title} {name} atas hadiahnya 🙏";
  const msg = body.replace(/\{title\}/g, guest.title).replace(/\{name\}/g, guest.name);
  try { await sendMessage(guest.phone, msg); } catch {}
  await prisma.log.create({ data: { type: `sent_wa_${type}`, guestId, detail: `${type} - ${guest.phone}` } });
  return NextResponse.json({ ok: true });
}
