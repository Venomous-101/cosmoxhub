import { Metadata } from "next";
import PdfToImageClient from "./PdfToImageClient";

export const metadata: Metadata = {
  title: "PDF to PNG/JPG Bulk Converter - Free Online Tool | CosmoXHub",
  description: "Convert single or multiple PDFs to high-quality PNG or JPG images instantly. Bulk upload, vector-precision rendering, and 100% private browser-side processing.",
  keywords: ["pdf to png", "pdf to jpg", "pdf to image", "bulk pdf converter", "pdf page to png", "batch pdf to image", "free pdf tools", "cosmoxhub"],
  openGraph: {
    title: "PDF to PNG/JPG Bulk Converter - Free Online Tool | CosmoXHub",
    description: "Convert bulk PDFs to high-resolution PNG or JPG images. Supports multi-file upload with vector-precision. 100% secure and private.",
    type: "website",
  }
};

export default function PDFToImagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub PDF to PNG/JPG Bulk Converter",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Bulk PDF to PNG/JPG conversion",
      "Vector-precision PDF rendering",
      "High-res up to 3x Ultra scale",
      "Multi-file drag-and-drop upload",
      "Zero-server browser-side processing"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfToImageClient />
    </>
  );
}
