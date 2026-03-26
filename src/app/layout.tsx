import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
