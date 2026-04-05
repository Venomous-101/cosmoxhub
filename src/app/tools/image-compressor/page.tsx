import { Metadata } from "next";
import ImageCompressorClient from "./ImageCompressorClient";

export const metadata: Metadata = {
  title: "Smart Image Compressor - Free Online Bulk Tool | CosmoXHub",
  description: "Compress images instantly to KB without losing quality. Bulk upload JPG, PNG, and WebP files. Custom settings, 100% private, processing inside your browser.",
  keywords: ["image compressor", "compress image to 50kb", "bulk image optimizer", "reduce image size online", "free compressor utility", "cosmoxhub"],
  openGraph: {
    title: "Smart Image Compressor - Free Online Bulk Tool | CosmoXHub",
    description: "Shrink image files from MB to KB with elite precision. 100% private and runs locally.",
    type: "website",
  }
};

export default function ImageCompressorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Image Compressor",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Bulk batch processing up to 50 images",
      "Custom MB/KB target size",
      "Auto-detect best format",
      "100% Client-side privacy",
      "Lightning fast Web Worker compression",
      "Bulk ZIP download"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressorClient />
    </>
  );
}
