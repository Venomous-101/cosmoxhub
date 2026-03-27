import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AdScripts from "@/components/AdScripts";
import AdBanner from "@/components/AdBanner";

import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata = {
  title: {
    default: "CosmoxHub — Free Online Tools for Everyone",
    template: "%s | CosmoxHub",
  },
  description:
    "CosmoxHub offers 15+ free online tools: PDF Merger, Word Counter, QR Generator, Image Converter, Password Generator, Age Calculator and more. No signup required.",
  keywords: [
    "free online tools",
    "pdf merger",
    "word counter",
    "qr code generator",
    "image converter",
    "pdf to image",
    "age calculator",
    "password generator",
    "case converter",
    "whatsapp link generator",
    "ai agent skills creator",
    "claude skills.md generator",
    "text to pdf converter",
    "online document creator",
    "youtube thumbnail downloader",
    "download youtube thumbnails hd",
    "json formatter online",
    "validate json online",
    "image upscaler online",
    "increase image resolution",
  ],
  authors: [{ name: "CosmoxHub" }],
  creator: "CosmoxHub",
  metadataBase: new URL("https://cosmoxhub.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cosmoxhub.com",
    siteName: "CosmoxHub",
    title: "CosmoxHub — Free Online Tools for Everyone",
    description:
      "15+ free online tools in one place. No signup, no limits, lightning fast.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CosmoxHub — Free Online Tools for Everyone",
    description: "15+ free online tools in one place. No signup, no limits.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "PoHYF0-TjyxN82OKUTqt20r7RSjcZaqN2RC_lS5vKwI",
    other: {
      monetag: ["bec947b201f5e3c59c393dc3844b496f"],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <meta name="monetag" content="41be868d494955b9e8eb3be434a97efb" />
      </head>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        {children}
        <AdScripts />
        <AdBanner type="social-bar" />
      </body>
    </html>
  );
}
