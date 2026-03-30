import { Metadata } from "next";
import QRGeneratorClient from "./QRGeneratorClient";

export const metadata: Metadata = {
  title: "QR Generator - Free Online Utility Tool | CosmoXHub",
  description: "Create custom QR codes instantly with our high-speed free online tool. Generate QR codes for URLs, text, and WiFi. Customize colors, add frames, and ensure 100% privacy.",
  keywords: ["qr generator", "create qr code free", "online qr maker", "custom qr code", "cosmoxhub"],
  openGraph: {
    title: "QR Generator - Free Online Utility Tool | CosmoXHub",
    description: "Generate professional QR codes with custom branding and 100% privacy. 100% free.",
    type: "website",
  }
};

export default function QRGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Branding QR Generator",
    "operatingSystem": "Any",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Custom business logo integration",
       "Elite dot & eye style customization",
       "High-fidelity transparent background support",
       "Premium branding color orchestration",
       "Instant high-res PNG/SVG export"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QRGeneratorClient />
    </>
  );
}
