import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import CodeBeautifierClient from "./CodeBeautifierClient";

export const metadata = generateToolMetadata({
  toolName: "Code Beautifier & Formatter",
  slug: "code-beautifier",
  description: "Beautify, format and indent code online free. Supports HTML, CSS, JavaScript, JSON, Python and more. Instant code formatting with syntax highlighting on CosmoxHub.",
  keywords: ["code beautifier", "code formatter online", "html formatter", "js formatter", "css formatter", "code pretty printer", "indent code online free"],
});

export default function CodeBeautifierPage() {
  const faqs = [
    { question: "What programming languages are supported?", answer: "CosmoxHub's Code Beautifier supports HTML, CSS, JavaScript, TypeScript, JSON, Python, SQL, XML, and more." },
    { question: "Does it work for minified code?", answer: "Yes. You can paste minified (single-line) code and the beautifier will properly expand and indent it for readability." },
    { question: "Is my code ever sent to a server?", answer: "No. All formatting is done entirely in your browser using Prettier and Babel parser. Your code never leaves your device." },
    { question: "Can I download the formatted code?", answer: "Yes. Click copy to clipboard or use the download button to save the beautified file locally." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Code Beautifier & Formatter", slug: "code-beautifier", description: "Format and beautify code online. HTML, CSS, JS, JSON, Python. Free.", faqs }) }}
      />
      <CodeBeautifierClient />
    </>
  );
}
