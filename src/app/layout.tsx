import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "My Transfer — Roadmap",
  description: "SEO placement roadmap manager for My Transfer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className={manrope.className}>
        <div className="site-content">{children}</div>
        <footer className="site-footer">
          <Link href="/closed-services">Закриті сервіси</Link>
        </footer>
      </body>
    </html>
  );
}
