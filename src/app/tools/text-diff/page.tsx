import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import TextDiffClient from "./TextDiffClient";

export const metadata = generateToolMetadata({
  toolName: "Text Diff Checker",
  slug: "text-diff",
  description: "Compare two texts side-by-side and highlight differences instantly. Find added, removed, and changed lines with color-coded diff. Free online text comparison tool.",
  keywords: ["text diff checker", "text comparison tool", "compare two texts", "find text differences", "diff tool online", "text diffing", "compare strings online"],
});

export default function TextDiffPage() {
  const faqs = [
    { question: "How does the text diff checker work?", answer: "Paste your original text in the left panel and the modified text in the right panel. Differences are highlighted automatically — green for additions, red for deletions." },
    { question: "Can I compare code files?", answer: "Yes. The diff checker is plain-text based and works perfectly for comparing code, JSON, YAML, HTML, or any text-based file content." },
    { question: "Is the comparison case-sensitive?", answer: "Yes, by default. This means 'Hello' and 'hello' will be treated as different. This is the standard behavior for code and technical text diffing." },
    { question: "Is my text data private?", answer: "Completely. All comparison happens in your browser. Your text is never sent to any server." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Text Diff Checker", slug: "text-diff", description: "Compare two texts and highlight differences instantly. Free, browser-based, private.", faqs }) }}
      />
      <TextDiffClient />
    </>
  );
}
