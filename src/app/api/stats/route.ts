import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const guests = await prisma.guest.findMany({ orderBy: { createdAt: "desc" } });

  const logs = await prisma.log.findMany({ orderBy: { createdAt: "desc" } });
  const visits = logs.filter((l) => l.type === "visit");
  const waLogs = logs.filter((l) => l.type === "sent_wa");

  const totalVisits = visits.length;
  const uniqueVisitors = new Set(visits.map((v) => v.guestId)).size;

  const guestStats = guests.map((g) => {
    const gVisits = visits.filter((v) => v.guestId === g.id);
    return {
      id: g.id,
      name: g.name,
      title: g.title,
      slug: g.slug,
      phone: g.phone,
      opened: gVisits.length > 0,
      visitCount: gVisits.length,
      lastVisit: gVisits.length > 0 ? gVisits[0].createdAt : null,
      waSent: waLogs.some((w) => w.guestId === g.id),
    };
  });

  return NextResponse.json({
    totalGuests: guests.length,
    totalVisits,
    uniqueVisitors,
    openedCount: guestStats.filter((g) => g.opened).length,
    notOpenedCount: guestStats.filter((g) => !g.opened).length,
    guestStats,
  });
}
