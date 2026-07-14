import { NextResponse } from "next/server";
import { getWA, getQR, isConnected } from "@/lib/wa";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getWA();
    const qr = getQR();
    return NextResponse.json({
      connected: isConnected(),
      qrCode: qr || null,
    });
  } catch {
    return NextResponse.json({ connected: false, qrCode: null, error: "WA service unavailable" });
  }
}
