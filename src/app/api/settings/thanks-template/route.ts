import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: return all "terima kasih" templates + which one is active
export async function GET() {
  const all = await prisma.template.findMany({
    where: { name: { contains: "terima kasih" } },
    orderBy: { name: "asc" },
  });
  const active = all.find((t) => t.name === "terima kasih (active)");
  return NextResponse.json({ templates: all, activeId: active?.id || null });
}

// POST: set active template by copying its content to "terima kasih (active)"
export async function POST(req: Request) {
  const { templateId } = await req.json();
  if (!templateId) return NextResponse.json({ error: "templateId diperlukan" }, { status: 400 });

  const source = await prisma.template.findUnique({ where: { id: templateId } });
  if (!source) return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 404 });

  await prisma.template.upsert({
    where: { name: "terima kasih (active)" },
    update: { subject: source.subject, body: source.body },
    create: { name: "terima kasih (active)", subject: source.subject, body: source.body },
  });

  return NextResponse.json({ ok: true });
}
