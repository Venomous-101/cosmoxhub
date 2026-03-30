import { Metadata } from "next";
import WhitespaceRemoverClient from "./WhitespaceRemoverClient";

export const metadata: Metadata = {
  title: "Whitespace Remover - Free Online Utility Tool | CosmoXHub",
  description: "Remove extra spaces, tabs, and line breaks from your text instantly with our high-speed free online tool. Clean and compress your text or code. 100% private.",
  keywords: ["whitespace remover", "remove extra spaces", "clean text online", "remove line breaks", "text compressor", "online text cleaner", "cosmoxhub"],
  openGraph: {
    title: "Whitespace Remover - Free Online Utility Tool | CosmoXHub",
    description: "Clean and compress your text or code. Strip redundant spaces and line breaks with our high-precision free online tool.",
    type: "website",
  }
};

export default function WhitespaceRemoverPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Whitespace Remover",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Remove all redundant spaces",
       "Strip empty line breaks",
       "Convert multi-line to single-line",
       "Real-time space saving analytics",
       "Elite code-ready formatting"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WhitespaceRemoverClient />
    </>
  );
}
