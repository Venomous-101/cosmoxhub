import { Metadata } from "next";
import TextToPdfClient from "./TextToPdfClient";

export const metadata: Metadata = {
  title: "Text to PDF - Free Online Utility Tool | CosmoXHub",
  description: "Convert plain text into professional PDF documents instantly with our high-speed free online tool. Support for custom fonts and paper sizes. 100% private.",
  keywords: ["text to pdf", "convert text to pdf", "txt to pdf converter", "online text to pdf", "professional pdf creator", "cosmoxhub"],
  openGraph: {
    title: "Text to PDF - Free Online Utility Tool | CosmoXHub",
    description: "Convert plain text into professional PDF documents instantly with our high-speed free online tool. Support for custom fonts and paper sizes.",
    type: "website",
  }
};

export default function TextToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Text to PDF Generator",
    "operatingSystem": "Any",
    "applicationCategory": "Utility",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Bold/Italic/Underline formatting",
      "Multiple font families",
      "Alignment control",
      "Multi-page auto flow",
      "100% Client-side privacy"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextToPdfClient />
    </>
  );
}
