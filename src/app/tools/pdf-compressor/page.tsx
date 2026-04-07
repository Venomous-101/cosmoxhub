import { Metadata } from "next";
import PdfCompressorClient from "./PdfCompressorClient";

export const metadata: Metadata = {
  title: "PDF Compressor - Free Bulk PDF Size Reducer | CosmoXHub",
  description: "Compress and reduce PDF file size instantly online. Bulk compress multiple PDFs at once. 100% private browser-side processing — no server uploads.",
  keywords: ["pdf compressor", "compress pdf", "reduce pdf size", "bulk pdf compressor", "pdf size reducer", "free pdf compressor", "cosmoxhub"],
  openGraph: {
    title: "PDF Compressor - Free Bulk PDF Size Reducer | CosmoXHub",
    description: "Reduce PDF file size instantly. Supports bulk compression of multiple PDFs. Fast, private, and free.",
    type: "website",
  },
};

export default function PdfCompressorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub PDF Compressor",
    "operatingSystem": "Any",
    "applicationCategory": "UtilitiesApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Bulk PDF compression",
      "3 compression levels",
      "Parallel processing",
      "Zero server uploads",
      "Instant browser-side processing"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PdfCompressorClient />
    </>
  );
}
