import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File;
  if (!file) return NextResponse.json({ error: "File diperlukan" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(ws);

  let ok = 0, fail = 0;
  for (const row of rows) {
    const name = (row.Nama || row.nama || row.NAMA || "").toString().trim();
    const title = (row.Title || row.title || row.Panggilan || "Bapak/Ibu").toString().trim();
    const phone = (row.Phone || row.phone || row.NoWA || row.Telepon || "").toString().trim().replace(/[^0-9]/g, "");
    if (!name || !phone) { fail++; continue; }
    const slug = slugify(name);
    try {
      await prisma.guest.upsert({
        where: { slug },
        update: { name, title, phone },
        create: { name, slug, title, phone },
      });
      ok++;
    } catch { fail++; }
  }

  return NextResponse.json({ ok, fail, total: rows.length });
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
