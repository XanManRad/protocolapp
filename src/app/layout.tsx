import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Protocol — Reverse-Engineer Your Goals",
  description: "You don't rise to the level of your goals; you fall to the level of your systems. Protocol takes your massive visions and reverse-engineers them into automated daily protocols.",
  keywords: ["goal tracking", "habit tracker", "productivity", "AI coach", "protocol"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navigation />
          <main style={{ flex: 1 }}>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
