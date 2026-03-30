import { Metadata } from "next";
import MergePdfClient from "./MergePdfClient";

export const metadata: Metadata = {
  title: "Merge PDF - Free Online Utility Tool | CosmoXHub",
  description: "Merge multiple PDF files into a single document instantly with our high-speed free online tool. 100% private, secure, and browser-side processing. No-upload merging.",
  keywords: ["merge pdf", "combine pdf", "pdf joiner", "merge pdf files", "free pdf tools", "secure pdf merge", "cosmoxhub"],
  openGraph: {
    title: "Merge PDF - Free Online Utility Tool | CosmoXHub",
    description: "Combine multiple PDF documents into a single high-fidelity file with 100% client-side security. Fastest and most secure PDF merging.",
    type: "website",
  }
};

export default function MergePDFPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite PDF Merger",
    "operatingSystem": "Any",
    "applicationCategory": "PDFTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "No-upload client-side PDF merging",
      "High-fidelity document combination",
      "Precision reordering manifest",
      "Zero-server-risk architecture",
      "Elite byte-level manipulation"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MergePdfClient />
    </>
  );
}
