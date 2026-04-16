import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import MarkdownToHtmlClient from "./MarkdownToHtmlClient";

export const metadata = generateToolMetadata({
  toolName: "Markdown to HTML Converter",
  slug: "markdown-to-html",
  description: "Convert Markdown to clean HTML instantly with live preview. Paste your .md content and get ready-to-use HTML. Free, browser-based, no data uploaded.",
  keywords: ["markdown to html", "md to html converter", "markdown converter", "markdown preview", "convert markdown online", "html from markdown", "markdown editor"],
});

export default function MarkdownToHtmlPage() {
  const faqs = [
    { question: "What Markdown syntax is supported?", answer: "All standard CommonMark syntax: headings (#), bold (**), italic (*), lists, links, images, blockquotes, code blocks, inline code, horizontal rules, and tables." },
    { question: "Can I preview the rendered HTML?", answer: "Yes. Toggle between the HTML source view and the live rendered preview using the tabs in the output panel." },
    { question: "Can I copy the HTML output?", answer: "Yes. Click 'Copy HTML' to copy the generated HTML to your clipboard in one click." },
    { question: "Is my content saved anywhere?", answer: "No. Everything runs in your browser. Your Markdown is never sent to any server or stored anywhere." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Markdown to HTML Converter", slug: "markdown-to-html", description: "Convert Markdown to clean HTML with live preview. Free, instant, browser-based.", faqs }) }}
      />
      <MarkdownToHtmlClient />
    </>
  );
}
