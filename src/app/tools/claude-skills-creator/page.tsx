import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ClaudeSkillsClient from "./ClaudeSkillsClient";

export const metadata = generateToolMetadata({
  toolName: "Claude Skills Creator",
  slug: "claude-skills-creator",
  description: "Generate professional SKILL.md files for Claude AI agents online free. Build custom instructions files for Anthropic Claude with domain expertise and best practices on CosmoxHub.",
  keywords: ["claude skills creator", "skills.md generator", "claude agent builder", "anthropic claude skills", "ai agent instructions", "claude prompt file generator"],
});

export default function ClaudeSkillsCreatorPage() {
  const faqs = [
    { question: "What is a SKILL.md file?", answer: "A SKILL.md file is an instruction file that tells Claude AI how to behave as a specialized agent in a specific domain. It defines the agent's persona, capabilities, and response patterns." },
    { question: "Who should use the Claude Skills Creator?", answer: "Developers, AI engineers, and advanced Claude users who want to create custom domain-expert agents for coding, writing, research, customer support, or any specialized field." },
    { question: "Does the generated SKILL.md work with Antigravity?", answer: "Yes. The generated files follow the exact SKILL.md format used by Antigravity (Google DeepMind's coding assistant) and compatible Claude agents." },
    { question: "Is this tool free?", answer: "Yes, completely free. No signup or API key required." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Claude Skills Creator", slug: "claude-skills-creator", description: "Generate SKILL.md files for Claude AI agents. Free, expert-level instructions.", faqs }) }}
      />
      <ClaudeSkillsClient />
    </>
  );
}
