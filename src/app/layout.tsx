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

export const metadata: Metadata = {
  title: "Wedding - Javanese",
  description:
    "adat jawa warna crema tanpa foto - Undangan Online: Undangan digital modern untuk pernikahan dan acara spesial lainnya.",
  openGraph: {
    title: "Wedding - Javanese",
    description:
      "adat jawa warna crema tanpa foto - Undangan Online",
    url: "https://satumomen.com/preview/javanese",
    siteName: "Satu Momen",
    images: [{ url: "https://satumomen.com/themes/javanese/javanese.jpg" }],
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
