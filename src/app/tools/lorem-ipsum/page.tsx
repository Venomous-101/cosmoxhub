import { Metadata } from "next";
import LoremIpsumClient from "./LoremIpsumClient";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Free Online Utility Tool | CosmoXHub",
  description: "Generate professional placeholder text instantly with our high-speed free online tool. Choose between paragraphs, words, or lists. Perfect for designers and devs.",
  keywords: ["lorem ipsum generator", "placeholder text generator", "filler text", "latin text generator", "dummy text", "cosmoxhub"],
  openGraph: {
    title: "Lorem Ipsum Generator - Free Online Utility Tool | CosmoXHub",
    description: "Generate premium placeholder text for your designs. Fully customizable length, HTML formatting, and instant export. 100% free.",
    type: "website",
  }
};

export default function LoremIpsumPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Lorem Ipsum Generator",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Custom paragraphs/words/sentences",
      "HTML tag wrapping support",
      "Instant copy to clipboard",
      "Download as TXT",
      "Premium glassmorphic preview"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoremIpsumClient />
    </>
  );
}
