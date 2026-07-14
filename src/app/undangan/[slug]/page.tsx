import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvitationPage from "@/components/InvitationPage";

export default async function UndanganPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guest = await prisma.guest.findUnique({ where: { slug } });
  if (!guest) return notFound();
  return <InvitationPage guest={{ id: guest.id, name: guest.name, title: guest.title, slug: guest.slug }} />;
}
