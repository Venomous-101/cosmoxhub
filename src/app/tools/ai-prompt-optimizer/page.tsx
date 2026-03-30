import { Metadata } from "next";
import PromptOptimizerClient from "./PromptOptimizerClient";

export const metadata: Metadata = {
  title: "AI Prompt Optimizer - Free Online Utility Tool | CosmoXHub",
  description: "Optimize your AI prompts for ChatGPT, Claude, and Midjourney with our elite prompt engineering tool. 100% private, secure, and free online utility.",
  keywords: ["ai prompt optimizer", "prompt engineering tool", "chatgpt prompt optimizer", "claude prompt generator", "midjourney prompt helper", "secure prompt engineering", "cosmoxhub"],
  openGraph: {
    title: "AI Prompt Optimizer - Free Online Utility Tool | CosmoXHub",
    description: "Refine and optimize your AI prompts for ChatGPT, Claude, and Midjourney using elite frameworks like RTF, RISEN, and COSTAR. 100% private and secure.",
    type: "website",
  }
};

export default function AIPromptOptimizerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite AI Prompt Optimizer",
    "operatingSystem": "Any",
    "applicationCategory": "AIUtility",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "5 Expert frameworks (RTF, RISEN, COSTAR, CARE, EXPERT)",
      "Model-specific targeting (ChatGPT, Claude, Gemini)",
      "Tone and style control",
      "100% Client-side privacy",
      "One-click copy to clipboard"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PromptOptimizerClient />
    </>
  );
}
