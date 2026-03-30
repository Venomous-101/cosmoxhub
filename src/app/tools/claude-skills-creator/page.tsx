import { Metadata } from "next";
import ClaudeSkillsClient from "./ClaudeSkillsClient";

export const metadata: Metadata = {
  title: "Claude Skills Creator - Free Online Utility Tool | CosmoXHub",
  description: "Generate professional SKILLS.md definitions for Claude and other AI agents with our secure free online tool. 100% private and secure browser-side skill engineering.",
  keywords: ["claude skills creator", "ai agent builder", "skills.md generator", "agent persona creator", "ai prompt engineering", "secure agent builder", "cosmoxhub"],
  openGraph: {
    title: "Claude Skills Creator - Free Online Utility Tool | CosmoXHub",
    description: "Design professional SKILLS.md files for Claude, GPT-4, and Gemini with our elite agent builder. 100% private and secure.",
    type: "website",
  }
};

export default function ClaudeSkillsCreatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite AI Agent Skills Builder",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "SKILLS.md generator",
      "Skill presets for various roles",
      "Live preview with markdown formatting",
      "Multi-model compatibility (Claude, GPT, Gemini)",
      "One-click markdown export"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClaudeSkillsClient />
    </>
  );
}
