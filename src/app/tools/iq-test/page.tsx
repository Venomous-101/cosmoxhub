import type { Metadata } from "next";
import IQTestClient from "./IQTestClient";

export const metadata: Metadata = {
  title: "Free IQ Test — Multi-Domain Cognitive Assessment | CosmoxHub",
  description:
    "Take a scientifically calibrated IQ test covering 7 cognitive domains: pattern recognition, verbal reasoning, numerical logic, spatial intelligence, working memory, logical deduction, and processing speed. 100% private, browser-based.",
  alternates: { canonical: "https://www.cosmoxhub.com/tools/iq-test" },
  openGraph: {
    title: "Free IQ Test | CosmoxHub",
    description: "30 questions. 7 cognitive domains. Real difficulty. Honest score.",
    url: "https://www.cosmoxhub.com/tools/iq-test",
    siteName: "CosmoxHub",
    type: "website",
  },
};

export default function IQTestPage() {
  return <IQTestClient />;
}
