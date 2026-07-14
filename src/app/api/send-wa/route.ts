import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { phone, message, guestId } = await req.json();

  await prisma.log.create({
    data: {
      type: "sent_wa",
      guestId: guestId ?? null,
      detail: JSON.stringify({ phone, message }),
    },
  });

  const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

  return NextResponse.json({ waUrl });
}
