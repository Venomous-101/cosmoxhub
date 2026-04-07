import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import PromptOptimizerClient from "./PromptOptimizerClient";

export const metadata = generateToolMetadata({
  toolName: "AI Prompt Optimizer",
  slug: "ai-prompt-optimizer",
  description: "Optimize and enhance AI prompts for ChatGPT, Claude, Gemini and Midjourney online free. Transform basic prompts into expert-level instructions on CosmoxHub.",
  keywords: ["ai prompt optimizer", "prompt enhancer", "chatgpt prompt generator", "claude prompt optimizer", "ai prompt engineering tool", "improve ai prompts", "prompt generator free"],
});

export default function AiPromptOptimizerPage() {
  const faqs = [
    { question: "Which AI models does the prompt optimizer support?", answer: "CosmoxHub's prompt optimizer supports ChatGPT (GPT-4), Claude (Anthropic), Google Gemini, and image models like Midjourney and DALL-E." },
    { question: "How does it improve my prompts?", answer: "It adds persona definitions, structured XML tags, chain-of-thought reasoning, negative constraints, and output format specifications to maximize AI response quality." },
    { question: "Is this tool based on real prompt engineering principles?", answer: "Yes. It applies documented prompt engineering techniques from Anthropic's Claude prompting guide and OpenAI's best practices documentation." },
    { question: "Are my prompts stored or used for AI training?", answer: "No. All optimization happens in your browser. Your prompts are never sent to any server or used for training." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "AI Prompt Optimizer", slug: "ai-prompt-optimizer", description: "Optimize AI prompts for ChatGPT, Claude and Gemini. Free, expert-level.", faqs }) }}
      />
      <PromptOptimizerClient />
    </>
  );
}
