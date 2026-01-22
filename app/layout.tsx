import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileNav } from "@/components/mobile-nav";
import { PWAInit } from "@/components/pwa-init";

export const metadata: Metadata = {
  title: "Hybrid Training Tracker",
  description: "Advanced Hybrid Training Plan - Strength + Running tracker",
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FitTracker',
  },
};

export const viewport: Viewport = {
  themeColor: '#5B21B6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased pb-16">
        <PWAInit />
        <main className="min-h-screen">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
