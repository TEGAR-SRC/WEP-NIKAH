import type { Metadata } from "next";
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
  title: "Undangan Pernikahan Tegar & Vebiza",
  description:
    "Undangan pernikahan Tegar Arrahman & Vebiza Juinda Putri Zahara. Akad & Syukuran 20 Juli 2026.",
  openGraph: {
    title: "Undangan Pernikahan Tegar & Vebiza",
    description: "Akad & Syukuran 20 Juli 2026.",
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
      <body className="font-base">{children}</body>
    </html>
  );
}
