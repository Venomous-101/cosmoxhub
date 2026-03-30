import { Metadata } from "next";
import WebpToPngClient from "./WebpToPngClient";

export const metadata: Metadata = {
  title: "WebP to PNG - Free Online Utility Tool | CosmoXHub",
  description: "Convert WebP images to lossless PNG format instantly with our free online tool. 100% private, free, and bulk processing in your browser with full transparency support. Perfect for developers and designers.",
  keywords: ["webp to png", "convert webp to png", "image converter online", "bulk webp converter", "free online tool", "cosmoxhub"],
  openGraph: {
    title: "WebP to PNG - Free Online Utility Tool | CosmoXHub",
    description: "High-speed, private WebP to PNG conversion with zero quality loss and full transparency support.",
    type: "website",
  }
};

export default function WebPToPNGPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite WebP to PNG Converter",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Lossless bulk processing",
      "Full Alpha-channel transparency preservation",
      "100% Client-side local processing",
      "Privacy-first engineering",
      "High-speed browser execution"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebpToPngClient />
    </>
  );
}
