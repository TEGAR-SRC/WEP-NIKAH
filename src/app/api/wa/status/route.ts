import { NextResponse } from "next/server";
import { getInstances } from "@/lib/wa";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const instances = await getInstances();
    return NextResponse.json({ instances });
  } catch (e: any) {
    return NextResponse.json({ instances: [], error: e?.message });
  }
}
