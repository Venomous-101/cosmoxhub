import { Metadata } from "next";
import PdfUnlockerClient from "./PdfUnlockerClient";

export const metadata: Metadata = {
  title: "PDF Password Remover - Free Online Utility Tool | CosmoXHub",
  description: "Remove passwords and restrictions from your PDF files instantly with our secure free online tool. 100% private browser-side decryption. Unlock PDF files fast.",
  keywords: ["pdf unlocker", "remove pdf password", "unlock pdf", "pdf decryption", "pdf restriction remover", "free pdf tools", "secure pdf unlock", "cosmoxhub"],
  openGraph: {
    title: "PDF Password Remover - Free Online Utility Tool | CosmoXHub",
    description: "Unlock protected PDF files instantly. 100% Functional Client-Side Decryption with total privacy. Fastest and most secure PDF password remover.",
    type: "website",
  }
};

export default function PDFUnlockerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite PDF Unlocker",
    "operatingSystem": "Any",
    "applicationCategory": "PDFTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Standard-compliant PDF decryption",
      "Secure browser-side key management",
      "Privacy-first document handling",
      "Elite functional user experience",
      "Zero-latency processing architecture"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfUnlockerClient />
    </>
  );
}
