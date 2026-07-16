import type { Metadata } from "next";
import { cookies } from "next/headers";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
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
  // Read the theme cookie server-side so the correct palette is in the very
  // first HTML byte stream (no flash of wrong theme). Default to dark.
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme = themeCookie === "light" ? "light" : "dark";

  return (
    <html lang="zh-CN" data-theme={initialTheme} className="h-full antialiased" suppressHydrationWarning>
      <body className="font-body min-h-full">
        <I18nProvider>
          <ThemeProvider initialTheme={initialTheme}>
            <Nav />
            <main className="relative z-10">{children}</main>
            <Footer />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
