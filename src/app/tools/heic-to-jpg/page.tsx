import { Metadata } from "next";
import HeicToJpgClient from "./HeicToJpgClient";

export const metadata: Metadata = {
  title: "HEIC to JPG - Free Online Utility Tool | CosmoXHub",
  description: "Convert Apple HEIC photos to JPG format instantly with our high-speed free online tool. Batch process iPhone photos, adjust quality, and maintain 100% privacy with local conversion.",
  keywords: ["heic to jpg", "convert heic to jpg", "iphone photo converter", "free online tool", "heic converter", "cosmoxhub"],
  openGraph: {
    title: "HEIC to JPG - Free Online Utility Tool | CosmoXHub",
    description: "High-speed, private HEIC to JPG conversion with local processing. 100% free.",
    type: "website",
  }
};

export default function HEICToJPGPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite HEIC to JPG Converter",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "IPhone HEIC/HEIF format support",
      "Bulk background conversion",
      "Output to JPG, PNG, or WebP",
      "High-fidelity quality preservation",
      "100% Client-side local processing"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeicToJpgClient />
    </>
  );
}
