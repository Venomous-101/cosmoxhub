import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AdScripts from "@/components/AdScripts";
import AdBanner from "@/components/AdBanner";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata = {
  title: {
    default: "CosmoxHub — Free Online Tools for Everyone",
    template: "%s | CosmoxHub",
  },
  description:
    "CosmoxHub offers 26+ free online tools: Image Upscaler, BG Remover, PDF Merger, QR Generator, Image Converter, Age Calculator and more. No signup required, 100% private.",
  keywords: [
    "free online tools",
    "ai image upscaler",
    "remove background free",
    "pdf merger",
    "word counter",
    "qr code generator",
    "image converter",
    "heic to jpg",
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
    "8k image upscaler",
  ],
  authors: [{ name: "CosmoxHub" }],
  creator: "CosmoxHub",
  metadataBase: new URL("https://cosmoxhub.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cosmoxhub.com",
    siteName: "CosmoxHub",
    title: "CosmoxHub — 26+ Free Online Tools for Everyone",
    description:
      "26+ free online tools in one place. AI Image Upscaler, PDF Merger, BG Remover, and more. No signup, no limits, lightning fast.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CosmoxHub — 26+ Free Online Tools for Everyone",
    description: "26+ free online tools in one place. No signup, no limits.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://cosmoxhub.com",
  },
  verification: {
    google: "vJAvqwICv8kMeZ7CaG4I0lhehtNQrbHPprc0HjxRM0E",
    other: {
      monetag: ["7a2e68c90b3a1bb51701daee982812a3"],
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
        <meta name="monetag" content="7a2e68c90b3a1bb51701daee982812a3" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "CosmoxHub",
              "operatingSystem": "All",
              "applicationCategory": "MultimediaApplication, UtilitiesApplication",
              "description": "All-in-one hub for 26+ high-performance online utilities including AI image tools, PDF processors, and high-fidelity text formatters.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              }
            })
          }}
        />
        {/* CPAGrip Content Locker — native script tag required because it uses document.write() */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script type="text/javascript" src="https://installyourfiles.com/script_include.php?id=1887499"></script>
      </head>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-HSL8QJ8VHK"} />
        <Analytics />
        {children}
        <AdScripts />
        <AdBanner type="social-bar" />
      </body>
    </html>
  );
}
