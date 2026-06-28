import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "My Transfer — Roadmap",
  description: "SEO placement roadmap manager for My Transfer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
