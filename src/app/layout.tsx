import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "福康AI中心 — BFCEC AI Center",
  description: "以AI驱动数字化转型",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="font-body min-h-full">
        <I18nProvider>
          <Nav />
          <main className="relative z-10">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
