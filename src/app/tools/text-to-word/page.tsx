import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import TextToWordClient from "./TextToWordClient";

export const metadata = generateToolMetadata({
  toolName: "Text to Word Converter",
  slug: "text-to-word",
  description: "Type or paste text and download as a .docx Word file instantly. Supports rich text formatting, .txt upload, bold, italic, alignment. Free, private, no upload.",
  keywords: ["text to word", "convert text to word", "text to docx", "create word document online", "text to word converter free", "make word file online", "doc creator"],
});

export default function TextToWordPage() {
  const faqs = [
    { question: "How do I convert text to a Word document?", answer: "Type or paste your text in the editor, optionally format it using the toolbar, then click 'Download .docx'. Your Word file downloads instantly." },
    { question: "Can I format the text before downloading?", answer: "Yes. The toolbar supports bold, italic, font size, text alignment (left/center/right), bullet lists, and custom text colors." },
    { question: "Can I upload an existing text file?", answer: "Yes. Click 'Upload .txt' to import an existing plain text file into the editor. You can then format and download it as a .docx." },
    { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser using the JSZip library. Your text never leaves your device." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Text to Word Converter", slug: "text-to-word", description: "Type or paste text and download as a .docx Word file. Free, browser-based, private.", faqs }) }}
      />
      <TextToWordClient />
    </>
  );
}
