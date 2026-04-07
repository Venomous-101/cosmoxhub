import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import WhitespaceRemoverClient from "./WhitespaceRemoverClient";

export const metadata = generateToolMetadata({
  toolName: "Whitespace Remover",
  slug: "whitespace-remover",
  description: "Remove extra spaces, blank lines and tabs from text online free. Clean up messy copy-paste text, JSON, code and more instantly. Private, no signup on CosmoxHub.",
  keywords: ["whitespace remover", "remove extra spaces", "clean text online", "remove blank lines", "trim whitespace", "text cleaner tool", "remove duplicate spaces"],
});

export default function WhitespaceRemoverPage() {
  const faqs = [
    { question: "What exactly does the whitespace remover clean?", answer: "It removes leading/trailing spaces, multiple consecutive spaces (collapses to single), empty lines, and tabs, depending on your selected options." },
    { question: "Can I convert the entire text to a single line?", answer: "Yes. Enable 'Single Line Conversion' to remove all line breaks and compress your text into one continuous line — perfect for JSON minification." },
    { question: "Is this useful for developers?", answer: "Yes. Developers use it to clean up pasted data, remove extra whitespace from SQL queries, minify strings, and prepare data for clipboard storage." },
    { question: "Is my text uploaded anywhere?", answer: "No. All text processing happens locally in your browser. Your data is 100% private." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Whitespace Remover", slug: "whitespace-remover", description: "Remove extra spaces, blank lines and tabs free. Instant text cleaner.", faqs }) }}
      />
      <WhitespaceRemoverClient />
    </>
  );
}
