import { Metadata } from "next";
import WordCounterClient from "./WordCounterClient";

export const metadata: Metadata = {
  title: "Word Counter - Free Online Utility Tool | CosmoXHub",
  description: "Count words, characters, and sentences in real-time with our high-speed free online tool. Track reading time and text density. 100% private and secure.",
  keywords: ["word counter", "character count", "sentence counter", "word count tool", "online word counter", "cosmoxhub"],
  openGraph: {
    title: "Word Counter - Free Online Utility Tool | CosmoXHub",
    description: "Advanced text analytics for professionals. Track words, reading time, and structural density with our signature elite engine. 100% free.",
    type: "website",
  }
};

export default function WordCounterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Word Counter & Text Analytics",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Real-time word and character counting",
       "Reading and Speaking time estimations",
       "Paragraph and sentence extraction",
       "Privacy-focused text analysis",
       "Elite glassmorphic status deck"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WordCounterClient />
    </>
  );
}
