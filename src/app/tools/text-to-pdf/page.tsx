import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import TextToPdfClient from "./TextToPdfClient";

export const metadata = generateToolMetadata({
  toolName: "Text to PDF Converter",
  slug: "text-to-pdf",
  description: "Convert plain text to PDF online for free. Format your text, set fonts and margins and download a professional PDF document instantly. No signup on CosmoxHub.",
  keywords: ["text to pdf", "convert text to pdf", "txt to pdf online", "create pdf from text", "text to pdf converter free", "plain text to pdf"],
});

export default function TextToPdfPage() {
  const faqs = [
    { question: "Can I customize fonts and margins?", answer: "Yes. You can select from multiple professional fonts, adjust font size, set page margins, and choose A4 or Letter page size." },
    { question: "Is there a text length limit?", answer: "No. Multi-page PDFs are generated automatically when your text exceeds a single page." },
    { question: "Is my document content private?", answer: "Yes. All conversion happens locally in your browser. Your text is never uploaded to any server." },
    { question: "What PDF version is created?", answer: "CosmoxHub generates standard PDF 1.4 compatible documents that can be opened by all PDF readers including Adobe Acrobat, Preview, and browser viewers." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Text to PDF Converter", slug: "text-to-pdf", description: "Convert plain text to PDF free. Custom fonts, margins, instant download.", faqs }) }}
      />
      <TextToPdfClient />
    </>
  );
}
