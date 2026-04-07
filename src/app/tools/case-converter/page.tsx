import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import CaseConverterClient from "./CaseConverterClient";

export const metadata = generateToolMetadata({
  toolName: "Case Converter",
  slug: "case-converter",
  description: "Convert text to uppercase, lowercase, title case, sentence case and camelCase online free. Instant results, paste any text. Privacy-first on CosmoxHub.",
  keywords: ["case converter", "text case converter", "uppercase converter", "lowercase converter", "title case converter", "camelcase converter", "text transformer"],
});

export default function CaseConverterPage() {
  const faqs = [
    { question: "What case formats does the converter support?", answer: "CosmoxHub's Case Converter supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case." },
    { question: "Is there a character limit?", answer: "No artificial limit. You can convert entire documents, blog posts, or code files at once." },
    { question: "Is my text stored?", answer: "No. Text transformation happens instantly in your browser with no network requests. Nothing is stored or transmitted." },
    { question: "Can I use it for code variable names?", answer: "Yes! camelCase, PascalCase, snake_case and kebab-case converters are specifically useful for transforming variable names in code." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Case Converter", slug: "case-converter", description: "Convert text to any case: uppercase, lowercase, title case, camelCase. Free.", faqs }) }}
      />
      <CaseConverterClient />
    </>
  );
}
