import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Vairavimas — Vairavimo mokyklos valdymo platforma",
  description:
    "Moderni vairavimo mokyklos valdymo sistema. Pamokų planavimas, instruktorių valdymas, mokėjimų sekimas ir ataskaitos — viskas vienoje vietoje.",
  keywords: [
    "vairavimo mokykla",
    "vairavimo pamokos",
    "instruktorių valdymas",
    "mokyklos valdymas",
  ],
  openGraph: {
    title: "Vairavimas — Vairavimo mokyklos valdymo platforma",
    description:
      "Moderni vairavimo mokyklos valdymo sistema. Pamokų planavimas, instruktorių valdymas ir daugiau.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
