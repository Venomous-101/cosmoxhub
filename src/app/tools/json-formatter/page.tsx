import { Metadata } from "next";
import JsonFormatterClient from "./JsonFormatterClient";

export const metadata: Metadata = {
  title: "JSON Formatter - Free Online Utility Tool | CosmoXHub",
  description: "Format, validate, and beautify your JSON data instantly with our secure free online tool. Professional-grade JSON viewer with 100% private local processing.",
  keywords: ["json formatter", "json viewer", "json validator", "beautify json online", "minify json", "json parser secure", "cosmoxhub"],
  openGraph: {
    title: "JSON Formatter - Free Online Utility Tool | CosmoXHub",
    description: "Format, validate, and beautify your JSON data instantly with our elite developer-grade tool. 100% private and secure.",
    type: "website",
  }
};

export default function JSONFormatterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite JSON Formatter & Validator",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Real-time JSON validation",
       "High-fidelity beautification",
       "Aggressive minification for APIs",
       "Elite collapsible code view",
       "Zero-latency client-side processing"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonFormatterClient />
    </>
  );
}
