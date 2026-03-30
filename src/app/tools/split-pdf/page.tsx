import { Metadata } from "next";
import SplitPdfClient from "./SplitPdfClient";

export const metadata: Metadata = {
  title: "Split PDF - Free Online Utility Tool | CosmoXHub",
  description: "Split any PDF file into multiple documents or extract specific pages instantly with our free online tool. 100% private, secure, and browser-side processing.",
  keywords: ["split pdf", "extract pdf pages", "pdf splitter", "cut pdf", "separate pdf pages", "free pdf tools", "secure pdf split", "cosmoxhub"],
  openGraph: {
    title: "Split PDF - Free Online Utility Tool | CosmoXHub",
    description: "Extract specific pages or ranges from any PDF document with precision. 100% private client-side processing. Fastest and most secure PDF splitting.",
    type: "website",
  }
};

export default function SplitPDFPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite PDF Splitter",
    "operatingSystem": "Any",
    "applicationCategory": "PDFTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Precision range-based PDF extraction",
       "High-res client-side byte splitting",
       "Secure no-upload workflow",
       "Elite document metadata analysis",
       "Zero-latency processing architecture"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitPdfClient />
    </>
  );
}
