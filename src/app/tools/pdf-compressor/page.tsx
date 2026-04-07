import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import PdfCompressorClient from "./PdfCompressorClient";

export const metadata = generateToolMetadata({
  toolName: "PDF Compressor",
  slug: "pdf-compressor",
  description: "Compress PDF files online for free. Reduce PDF size by up to 70% without losing quality. Bulk PDF compression, 100% private — no server upload, no signup on CosmoxHub.",
  keywords: ["pdf compressor", "compress pdf online", "reduce pdf size", "pdf file size reducer", "shrink pdf", "compress pdf free", "pdf optimizer"],
});

export default function PdfCompressorPage() {
  const faqs = [
    { question: "How much can I reduce a PDF's size?", answer: "Depending on the content, PDF compression can reduce file size by 30-70%. PDFs with large images see the most reduction." },
    { question: "Will compression reduce the visual quality?", answer: "Our tool uses lossless object stream optimization where possible. For image-heavy PDFs, compression is applied intelligently to balance quality and size." },
    { question: "Can I compress multiple PDFs at once?", answer: "Yes! CosmoxHub supports bulk PDF compression. Upload multiple files and they will be processed in parallel, with a ZIP download at the end." },
    { question: "Is my PDF safe?", answer: "100%. All compression happens locally in your browser using pdf-lib. Your documents are never uploaded to any server." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "PDF Compressor", slug: "pdf-compressor", description: "Compress PDF files free online. Bulk processing, no server upload.", faqs }) }}
      />
      <PdfCompressorClient />
    </>
  );
}
