import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const guests = await prisma.guest.findMany({ orderBy: { createdAt: "desc" } });
  const logs = await prisma.log.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  const visits = logs.filter((l) => l.type === "visit");
  const confirms = logs.filter((l) => l.type.startsWith("sent_wa_confirm") || l.type.startsWith("sent_wa_hadir") || l.type.startsWith("sent_wa_tidak_hadir"));
  const followups = logs.filter((l) => l.type === "sent_wa_followup");
  const gifts = logs.filter((l) => l.type.startsWith("sent_wa_gift") || l.type.startsWith("sent_wa_kado"));

  const now = Date.now();

  const guestStats = guests.map((g) => {
    const gVisits = visits.filter((v) => v.guestId === g.id);
    const gConfirm = confirms.filter((v) => v.guestId === g.id);
    const gFollow = followups.filter((v) => v.guestId === g.id);
    const gGift = gifts.filter((v) => v.guestId === g.id);

    const opened = gVisits.length > 0;
    const openTime = gVisits.length > 0 ? new Date(gVisits[0].createdAt).getTime() : null;
    const minsSinceOpen = openTime ? Math.floor((now - openTime) / 60000) : null;
    const reminderSent = gFollow.length > 0;
    const confirmed = gConfirm.length > 0;

    // Pending reminder: opened > 30 min ago, not confirmed, not yet reminded
    const pendingReminder = opened && !confirmed && !reminderSent && minsSinceOpen !== null && minsSinceOpen >= 30;

    return {
      id: g.id, name: g.name, title: g.title, slug: g.slug, phone: g.phone,
      opened, openTime: openTime ? new Date(openTime).toISOString() : null,
      minsSinceOpen,
      confirmed, reminderSent, pendingReminder,
      followupCount: gFollow.length,
      giftCount: gGift.length,
    };
  });

  return NextResponse.json({
    total: guests.length,
    opened: guestStats.filter((g) => g.opened).length,
    confirmed: guestStats.filter((g) => g.confirmed).length,
    pendingReminder: guestStats.filter((g) => g.pendingReminder).length,
    reminderSent: guestStats.filter((g) => g.reminderSent).length,
    guestStats: guestStats.sort((a, b) => (b.minsSinceOpen ?? 0) - (a.minsSinceOpen ?? 0)),
  });
}
