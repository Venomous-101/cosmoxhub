import { Metadata } from "next";
import CaseConverterClient from "./CaseConverterClient";

export const metadata: Metadata = {
  title: "Case Converter - Free Online Utility Tool | CosmoXHub",
  description: "Transform your text into UPPERCASE, lowercase, Title Case, Sentence case, and more with our high-speed free online tool. 100% private and instant.",
  keywords: ["case converter", "uppercase to lowercase", "title case converter", "sentence case tool", "text transformer", "cosmoxhub"],
  openGraph: {
    title: "Case Converter - Free Online Utility Tool | CosmoXHub",
    description: "Transform text between different casings. Perfect for developers, writers, and designers. 100% free.",
    type: "website",
  }
};

export default function CaseConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Case Converter",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert Sentence, Title, Lower, Upper",
      "Developer focus: snake_case, camelCase, PascalCase",
      "Real-time live formatting",
      "Batch text transformations",
      "Secure client-side execution"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseConverterClient />
    </>
  );
}
