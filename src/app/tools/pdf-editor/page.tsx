import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import dynamic from "next/dynamic";

const PDFEditorClient = dynamic(() => import("./PDFEditorClient"), { ssr: false });

export const metadata = generateToolMetadata({
  toolName: "PDF Editor",
  slug: "pdf-editor",
  description: "Edit PDFs online for free — add text, draw, highlight, sign, stamp, and annotate. No upload required. Works entirely in your browser. No signup.",
  keywords: [
    "pdf editor online free",
    "edit pdf online",
    "annotate pdf",
    "sign pdf online",
    "add text to pdf",
    "highlight pdf",
    "pdf annotation tool",
    "free pdf editor no signup",
  ],
});

export default function PDFEditorPage() {
  const faqs = [
    { question: "Is this PDF editor really free?", answer: "Yes, 100% free. No signup, no watermark, no file size limits. All processing happens in your browser." },
    { question: "Is my PDF file safe?", answer: "Completely. Your PDF never leaves your device — it is processed entirely in your browser using PDF.js and pdf-lib. Zero data is sent to any server." },
    { question: "Can I sign a PDF without printing it?", answer: "Yes. Use the Signature tool to draw, type, or upload your signature and place it anywhere on any page. The signature is embedded into the exported PDF." },
    { question: "What can I do with the PDF Editor?", answer: "You can add and edit text, draw freehand, highlight content in multiple colors, add shapes (rectangles, ellipses, arrows), place stamps, remove content with whiteout, add watermarks, and insert signatures." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateWebAppJsonLd({
            toolName: "PDF Editor",
            slug: "pdf-editor",
            description: "Free online PDF editor. Annotate, sign, highlight and edit PDFs directly in your browser with no signup.",
            faqs,
          }),
        }}
      />
      <PDFEditorClient />
    </>
  );
}
