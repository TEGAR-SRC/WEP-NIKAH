import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get("days") ?? "0") || 0;
  const since = days > 0 ? new Date(Date.now() - days * 86400000) : new Date(0);

  const [guests, logs] = await Promise.all([
    prisma.guest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.log.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "desc" } }),
  ]);

  const visits = logs.filter((l) => l.type === "visit");
  const pageviews = logs.filter((l) => l.type === "pageview");
  const waLogs = logs.filter((l) => l.type === "sent_wa");

  const guestStats = guests.map((g) => {
    const gv = visits.filter((v) => v.guestId === g.id);
    return {
      id: g.id, name: g.name, title: g.title, slug: g.slug, phone: g.phone,
      opened: gv.length > 0, visitCount: gv.length,
      lastVisit: gv.length > 0 ? gv[0].createdAt : null,
      waSent: waLogs.some((w) => w.guestId === g.id),
    };
  });

  // Chart — hourly granularity for last 48h, daily beyond
  const all = [...visits, ...pageviews];
  const isShortRange = days > 0 && days <= 3;
  const timeFmt = isShortRange
    ? (d: Date) => `${d.getHours().toString().padStart(2, "0")}:00`
    : (d: Date) => d.toISOString().slice(0, 10);

  const countMap: Record<string, number> = {};
  const uniqMap: Record<string, Set<string>> = {};
  for (const l of all) {
    const k = timeFmt(new Date(l.createdAt));
    countMap[k] = (countMap[k] || 0) + 1;
    if (!uniqMap[k]) uniqMap[k] = new Set();
    if (l.ip) uniqMap[k].add(l.ip);
    if (l.guestId) uniqMap[k].add(l.guestId);
  }

  const chart = Object.entries(countMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-(isShortRange ? 48 : 30))
    .map(([label, count]) => ({ label, count, unique: uniqMap[label]?.size || 0 }));

  // Page breakdown
  const pathCount: Record<string, number> = {};
  for (const l of all) { const p = l.path || "/"; pathCount[p] = (pathCount[p] || 0) + 1; }
  const topPaths = Object.entries(pathCount).sort(([, a], [, b]) => b - a).slice(0, 20).map(([path, count]) => ({ path, count }));

  // Recent
  const recent = all.slice(0, 100).map((l) => ({
    id: l.id, type: l.type, guestId: l.guestId, ip: l.ip || "—", ua: l.ua || "—", path: l.path || "/", time: l.createdAt,
  }));

  return NextResponse.json({
    totalGuests: guests.length,
    totalVisits: visits.length,
    totalPageviews: pageviews.length,
    uniqueVisitors: new Set(all.map((l) => l.ip || l.guestId).filter(Boolean)).size,
    openedCount: guestStats.filter((g) => g.opened).length,
    notOpenedCount: guestStats.filter((g) => !g.opened).length,
    guestStats, chart, topPaths, recent,
    filterDays: days,
  });
}
