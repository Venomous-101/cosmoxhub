import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import WordCounterClient from "./WordCounterClient";

export const metadata = generateToolMetadata({
  toolName: "Word Counter",
  slug: "word-counter",
  description: "Count words, characters, sentences and paragraphs online free. Includes reading time, keyword density, and SEO analysis. Instant real-time text stats on CosmoxHub.",
  keywords: ["word counter", "character counter", "online word counter", "count words online", "text analyzer", "reading time calculator", "word count checker"],
});

export default function WordCounterPage() {
  const faqs = [
    { question: "Does the word counter include spaces in character count?", answer: "Yes, CosmoxHub's word counter shows two character counts: one with spaces and one without spaces, so you can use whichever is required." },
    { question: "Can it calculate reading time?", answer: "Yes. The tool estimates reading time based on an average adult reading speed of 200-250 words per minute, and speaking time at 130 words per minute." },
    { question: "Is there a word limit?", answer: "No. You can paste and analyze text of any length. The counter handles full-length novels, legal documents, and code files." },
    { question: "Is my pasted text stored anywhere?", answer: "Never. All text analysis happens locally in your browser. Your text drafts and documents are completely private." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Word Counter", slug: "word-counter", description: "Count words, characters, sentences online free. Real-time text analysis.", faqs }) }}
      />
      <WordCounterClient />
    </>
  );
}
