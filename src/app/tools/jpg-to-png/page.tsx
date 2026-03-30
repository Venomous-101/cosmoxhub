import { Metadata } from "next";
import JpgToPngClient from "./JpgToPngClient";

export const metadata: Metadata = {
  title: "JPG to PNG - Free Online Utility Tool | CosmoXHub",
  description: "Convert JPG images to high-quality PNG format instantly with our high-speed free online tool. Support for bulk conversion, 100% privacy with browser-side processing, and zero quality loss.",
  keywords: ["jpg to png", "convert jpg to png", "free online tool", "bulk jpg to png", "cosmoxhub"],
  openGraph: {
    title: "JPG to PNG - Free Online Utility Tool | CosmoXHub",
    description: "High-speed, private JPG to PNG conversion with zero quality loss. 100% free.",
    type: "website",
  }
};

export default function JPGToPNGPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite JPG to PNG Converter",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Lossless PNG output",
      "Bulk processing",
      "No signup required",
      "100% Client-side",
      "Privacy focused"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JpgToPngClient />
    </>
  );
}
