import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const wb = XLSX.utils.book_new();
  const data = [
    { Nama: "Contoh Tamu 1", Panggilan: "Bapak", NoWA: "6281234567890" },
    { Nama: "Contoh Tamu 2", Panggilan: "Ibu", NoWA: "6281234567891" },
  ];
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Tamu");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=template-tamu.xlsx",
    },
  });
}
