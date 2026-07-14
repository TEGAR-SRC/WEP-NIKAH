import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const guests = await prisma.guest.findMany({ orderBy: { createdAt: "desc" } });
  const logs = await prisma.log.findMany({ orderBy: { createdAt: "desc" } });

  const visits = logs.filter((l) => l.type === "visit");
  const pageviews = logs.filter((l) => l.type === "pageview");
  const waLogs = logs.filter((l) => l.type === "sent_wa");

  // Per-guest stats
  const guestStats = guests.map((g) => {
    const gv = visits.filter((v) => v.guestId === g.id);
    return {
      id: g.id, name: g.name, title: g.title, slug: g.slug, phone: g.phone,
      opened: gv.length > 0, visitCount: gv.length,
      lastVisit: gv.length > 0 ? gv[0].createdAt : null,
      waSent: waLogs.some((w) => w.guestId === g.id),
    };
  });

  // Per-day chart data (last 14 days)
  const dayMap: Record<string, number> = {};
  const dayMapUq: Record<string, Set<string>> = {};
  for (const l of [...visits, ...pageviews]) {
    const d = new Date(l.createdAt).toISOString().slice(0, 10);
    dayMap[d] = (dayMap[d] || 0) + 1;
    if (!dayMapUq[d]) dayMapUq[d] = new Set();
    if (l.ip) dayMapUq[d].add(l.ip);
    if (l.guestId) dayMapUq[d].add(l.guestId);
  }
  const chart = Object.entries(dayMap).sort(([a], [b]) => a.localeCompare(b)).slice(-14).map(([date, count]) => ({
    date, count, unique: dayMapUq[date]?.size || 0,
  }));

  // Page breakdown
  const pathCount: Record<string, number> = {};
  for (const l of [...visits, ...pageviews]) {
    const p = l.path || "/";
    pathCount[p] = (pathCount[p] || 0) + 1;
  }
  const topPaths = Object.entries(pathCount).sort(([, a], [, b]) => b - a).slice(0, 20).map(([path, count]) => ({ path, count }));

  // Recent visits with IP
  const recent = [...visits, ...pageviews].slice(0, 50).map((l) => ({
    id: l.id, type: l.type, guestId: l.guestId, ip: l.ip || "—", ua: l.ua || "—", path: l.path || "/", time: l.createdAt,
  }));

  return NextResponse.json({
    totalGuests: guests.length,
    totalVisits: visits.length,
    totalPageviews: pageviews.length,
    uniqueVisitors: new Set([...visits, ...pageviews].map((l) => l.ip || l.guestId).filter(Boolean)).size,
    openedCount: guestStats.filter((g) => g.opened).length,
    notOpenedCount: guestStats.filter((g) => !g.opened).length,
    guestStats, chart, topPaths, recent,
  });
}
