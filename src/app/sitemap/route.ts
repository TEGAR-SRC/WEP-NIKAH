import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nikah.tegar-src.xyz";

export const dynamic = "force-dynamic";

export async function GET() {
  const guests = await prisma.guest.findMany({ select: { slug: true, updatedAt: true } });

  const urls = [
    `<url><loc>${BASE}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    ...guests.map(
      (g) =>
        `<url><loc>${BASE}/undangan/${g.slug}</loc><lastmod>${g.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
