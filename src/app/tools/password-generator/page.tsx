import { Metadata } from "next";
import PasswordGeneratorClient from "./PasswordGeneratorClient";

export const metadata: Metadata = {
  title: "Password Generator - Free Online Utility Tool | CosmoXHub",
  description: "Create strong, secure passwords instantly with our high-speed free online tool. Generate random passwords with custom length and character sets. 100% private and secure.",
  keywords: ["password generator", "strong password maker", "secure password generator", "random password creator", "cosmoxhub"],
  openGraph: {
    title: "Password Generator - Free Online Utility Tool | CosmoXHub",
    description: "Generate cryptographically secure passwords instantly with our elite developer-grade tool. 100% free.",
    type: "website",
  }
};

export default function PasswordGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Password Vault & Generator",
    "operatingSystem": "Any",
    "applicationCategory": "SecurityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Cryptographically secure randomness",
       "High-precision entropy analyzer",
       "Custom character set orchestration",
       "One-tap secure vault copy",
       "Zero-latency client-side generation"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PasswordGeneratorClient />
    </>
  );
}
