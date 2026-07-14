import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvitationPage from "@/components/InvitationPage";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nikah.tegar-src.xyz";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guest = await prisma.guest.findUnique({ where: { slug } });
  if (!guest) return { title: "Undangan Tidak Ditemukan" };

  const title = `Undangan Pernikahan Tegar & Vebiza - ${guest.title} ${guest.name}`;
  const description = `Undangan pernikahan Tegar Arrahman & Vebiza Juinda Putri Zahara. ${guest.title} ${guest.name} dihormati untuk hadir.`;
  const url = `${BASE}/undangan/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Nikah Tegar & Vebiza",
      images: [{ url: `${BASE}/api/r2/public/images/satumomen/ilustrasi.webp`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function UndanganPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guest = await prisma.guest.findUnique({ where: { slug } });
  if (!guest) return notFound();
  return <InvitationPage guest={{ id: guest.id, name: guest.name, title: guest.title, slug: guest.slug }} />;
}
