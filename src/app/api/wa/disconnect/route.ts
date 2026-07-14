import { NextResponse } from "next/server";
import { disconnectWA, deleteSession } from "@/lib/wa";

export async function POST(req: Request) {
  const { deleteSession: del } = await req.json();
  if (del) deleteSession();
  else disconnectWA();
  return NextResponse.json({ ok: true });
}
