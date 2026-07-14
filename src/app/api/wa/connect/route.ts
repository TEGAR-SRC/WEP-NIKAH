import { NextResponse } from "next/server";
import { connectWA } from "@/lib/wa";

export async function POST() {
  connectWA();
  return NextResponse.json({ ok: true });
}
