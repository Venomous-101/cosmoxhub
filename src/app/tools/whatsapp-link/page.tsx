import { Metadata } from "next";
import WhatsAppLinkClient from "./WhatsAppLinkClient";

export const metadata: Metadata = {
  title: "WhatsApp Link Generator - Free Online Utility Tool | CosmoXHub",
  description: "Create custom WhatsApp click-to-chat links with pre-filled messages instantly. Use our high-speed free online tool for business marketing and personal use. 100% private.",
  keywords: ["whatsapp link generator", "wa link creator", "whatsapp message link", "direct chat link", "cosmoxhub"],
  openGraph: {
    title: "WhatsApp Link Generator - Free Online Utility Tool | CosmoXHub",
    description: "Generate personalized WhatsApp chat links with custom messages instantly. 100% free.",
    type: "website",
  }
};

export default function WhatsAppLinkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite WhatsApp Link Generator",
    "operatingSystem": "Any",
    "applicationCategory": "ConnectivityTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Instant WhatsApp chat link generation",
       "Live message bubble preview",
       "Integrated QR code for direct scanning",
       "Professional contact card visualization",
       "Zero-latency link orchestration"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WhatsAppLinkClient />
    </>
  );
}
