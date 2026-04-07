import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import JsonFormatterClient from "./JsonFormatterClient";

export const metadata = generateToolMetadata({
  toolName: "JSON Formatter & Validator",
  slug: "json-formatter",
  description: "Format, validate and beautify JSON online free. Fix JSON errors, minify JSON, syntax highlight and tree view. Instant parsing — no server upload on CosmoxHub.",
  keywords: ["json formatter", "json validator", "format json online", "json beautifier", "json pretty print", "validate json", "json minifier"],
});

export default function JsonFormatterPage() {
  const faqs = [
    { question: "Can the JSON formatter fix broken JSON?", answer: "Yes. The validator highlights exactly where JSON syntax errors occur and what type of error it is, making it easy to fix malformed JSON." },
    { question: "Can I minify JSON to reduce file size?", answer: "Yes! Use the minify button to strip all whitespace and produce a compact, production-ready JSON string." },
    { question: "What is the maximum JSON file size it supports?", answer: "There is no artificial limit. The parser handles files with tens of thousands of lines depending on your device's memory." },
    { question: "Is my JSON data private?", answer: "Completely. All formatting and validation happens in your browser using native JavaScript. No data is sent to any server." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "JSON Formatter & Validator", slug: "json-formatter", description: "Format, validate and beautify JSON online free. Instant, private.", faqs }) }}
      />
      <JsonFormatterClient />
    </>
  );
}
