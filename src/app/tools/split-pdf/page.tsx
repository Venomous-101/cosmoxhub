import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import SplitPdfClient from "./SplitPdfClient";

export const metadata = generateToolMetadata({
  toolName: "PDF Splitter",
  slug: "split-pdf",
  description: "Split a PDF into individual pages or extract specific page ranges online for free. No server upload, 100% private, instant download on CosmoxHub.",
  keywords: ["split pdf", "split pdf online", "extract pdf pages", "pdf splitter free", "separate pdf pages", "pdf page extractor", "cut pdf pages"],
});

export default function SplitPdfPage() {
  const faqs = [
    { question: "Can I extract specific page ranges from a PDF?", answer: "Yes. You can specify any custom page range (e.g., pages 3-7) or split the entire PDF into individual single-page files." },
    { question: "Is splitting PDFs on CosmoxHub private?", answer: "Absolutely. All PDF splitting happens locally in your browser using pdf-lib. Your documents are never uploaded to a server." },
    { question: "What is the maximum PDF size I can split?", answer: "There is no imposed limit. Larger PDFs may take longer depending on your device memory, but CosmoxHub handles multi-hundred page documents." },
    { question: "Can I split a password-protected PDF?", answer: "If the PDF has user-level password protection, you will need to unlock it first using CosmoxHub's PDF Password Remover tool." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "PDF Splitter", slug: "split-pdf", description: "Split PDF into pages or extract page ranges. Free, private, no signup.", faqs }) }}
      />
      <SplitPdfClient />
    </>
  );
}
