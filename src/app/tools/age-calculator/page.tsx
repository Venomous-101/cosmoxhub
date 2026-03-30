import { Metadata } from "next";
import AgeCalculatorClient from "./AgeCalculatorClient";

export const metadata: Metadata = {
  title: "Age Calculator - Free Online Utility Tool | CosmoXHub",
  description: "Calculate your exact age in years, months, days, hours, and minutes with our high-speed free online tool. Perfect for birthdays and milestones. 100% private.",
  keywords: ["age calculator", "calculate age online", "exact age finder", "birthday calculator", "cosmoxhub"],
  openGraph: {
    title: "Age Calculator - Free Online Utility Tool | CosmoXHub",
    description: "Calculate your exact age and life breakdown instantly with our elite developer-grade tool. 100% free.",
    type: "website",
  }
};

export default function AgeCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Age Calculator",
    "operatingSystem": "Any",
    "applicationCategory": "ToolApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Exact Age Calculation (Years, Months, Days)",
       "Detailed life breakdown in hours and seconds",
       "Next Birthday Countdown Timer",
       "Zero-latency client-side processing"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgeCalculatorClient />
    </>
  );
}
