import { Metadata } from "next";
import CodeBeautifierClient from "./CodeBeautifierClient";

export const metadata: Metadata = {
  title: "Code Beautifier - Free Online Utility Tool | CosmoXHub",
  description: "Format and beautify your code instantly with our secure free online tool. Professional-grade HTML, CSS, and JS formatting with 100% private local processing.",
  keywords: ["code beautifier", "code formatter", "html beautifier", "css formatter", "javascript beautifier", "online code formatter", "secure code formatting", "cosmoxhub"],
  openGraph: {
    title: "Code Beautifier - Free Online Utility Tool | CosmoXHub",
    description: "Format and beautify your code instantly with our elite developer-grade tool. Supports HTML, CSS, and JS. 100% private and secure.",
    type: "website",
  }
};

export default function CodeBeautifierPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Code Beautifier",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Precision HTML/CSS/JS beautification",
       "Custom indent size (2/4 spaces)",
       "One-tap code reorganization",
       "Elite developer-grade editor",
       "Zero-latency client-side processing"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeBeautifierClient />
    </>
  );
}
