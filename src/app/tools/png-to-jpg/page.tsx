import { Metadata } from "next";
import PngToJpgClient from "./PngToJpgClient";

export const metadata: Metadata = {
  title: "PNG to JPG - Free Online Utility Tool | CosmoXHub",
  description: "Convert PNG images to JPG format instantly with our high-speed free online tool. Adjust quality, handle bulk uploads, and maintain 100% privacy with browser-side processing.",
  keywords: ["png to jpg", "convert png to jpg", "free image converter", "bulk png to jpg", "cosmoxhub"],
  openGraph: {
    title: "PNG to JPG - Free Online Utility Tool | CosmoXHub",
    description: "High-speed, private PNG to JPG conversion with custom quality settings. 100% free.",
    type: "website",
  }
};

export default function PNGToJPGPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite PNG to JPG Converter",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Bulk batch processing",
      "Custom background color for transparency",
      "Adjustable JPG quality (1-100%)",
      "100% Client-side privacy",
      "Lightning fast generation"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PngToJpgClient />
    </>
  );
}
