import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import VisitTracker from "@/components/VisitTracker";
import { Marcellus, DM_Serif_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-base",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-accent",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-latin",
});

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nikah.tegar-src.xyz";

export const metadata: Metadata = {
  title: "Undangan Pernikahan Tegar & Vebiza - 20 Juli 2026",
  description:
    "Undangan pernikahan online Tegar Arrahman & Vebiza Juinda Putri Zahara. Informasi akad nikah, syukuran, lokasi di KUA Batu Aji Batam, dan RSVP.",
  keywords: [
    "undangan pernikahan online", "undangan digital", "undangan nikah",
    "Tegar Arrahman", "Vebiza Juinda Putri Zahara", "nikah 2026",
    "akad nikah Batam", "undangan pernikahan Batam", "wedding invitation",
    "undangan online gratis", "situs undangan nikah",
  ],
  openGraph: {
    title: "Undangan Pernikahan Tegar & Vebiza - 20 Juli 2026",
    description: "Akad & Syukuran 20 Juli 2026. KUA Batu Aji, Batam.",
    siteName: "Nikah Tegar & Vebiza",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${marcellus.variable} ${dmSerifDisplay.variable} ${greatVibes.variable}`}
    >
      <body className="font-base">{children}<VisitTracker /><Analytics /></body>
    </html>
  );
}
