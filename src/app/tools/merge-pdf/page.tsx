import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import MergePdfClient from "./MergePdfClient";

export const metadata = generateToolMetadata({
  toolName: "PDF Merger",
  slug: "merge-pdf",
  description: "Merge multiple PDF files into one online for free. Drag, reorder and combine PDFs instantly. No upload to server, 100% private, no size limits on CosmoxHub.",
  keywords: ["pdf merger", "merge pdf online", "combine pdf files", "join pdf", "pdf joiner free", "merge multiple pdfs", "combine pdf pages"],
});

export default function MergePdfPage() {
  const faqs = [
    { question: "How many PDF files can I merge at once?", answer: "You can merge unlimited PDF files at once. There are no artificial limits on file count or total file size." },
    { question: "Is my PDF uploaded to any server?", answer: "No. CosmoxHub uses pdf-lib to process everything locally in your browser. Your confidential documents never leave your device." },
    { question: "Will the merged PDF have a watermark?", answer: "Never. CosmoxHub tools are completely free and will never force a watermark onto your documents." },
    { question: "Can I reorder pages before merging?", answer: "Yes. You can drag and drop the files to reorder them exactly as you want before merging." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "PDF Merger", slug: "merge-pdf", description: "Merge multiple PDFs into one. Free, private, no server upload.", faqs }) }}
      />
      <MergePdfClient />
    </>
  );
}
