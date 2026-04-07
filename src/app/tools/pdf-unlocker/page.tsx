import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import PdfUnlockerClient from "./PdfUnlockerClient";

export const metadata = generateToolMetadata({
  toolName: "PDF Password Remover",
  slug: "pdf-unlocker",
  description: "Remove password from PDF files instantly online for free. Unlock owner-password protected PDFs without any software. 100% private, browser-based on CosmoxHub.",
  keywords: ["pdf password remover", "unlock pdf", "remove pdf password", "pdf unlocker online", "pdf decrypter", "remove pdf protection", "unlock pdf free"],
});

export default function PdfUnlockerPage() {
  const faqs = [
    { question: "What types of PDF protection can be removed?", answer: "CosmoxHub can remove 'owner password' protection (restrictions on printing, copying and editing). User-level open passwords require the correct password to unlock." },
    { question: "Is unlocking PDFs on CosmoxHub secure?", answer: "Yes. All processing happens locally in your browser using pdf-lib. Your files and passwords are never uploaded to any server." },
    { question: "Can I unlock a PDF without knowing the password?", answer: "Owner-restriction passwords (the ones that prevent editing/printing) can often be removed without the password. Open passwords that lock viewing require the correct password." },
    { question: "Will unlocking a PDF change its quality?", answer: "No. Only the encryption layer is removed. The content, images, and layout of the PDF remain identical." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "PDF Password Remover", slug: "pdf-unlocker", description: "Remove PDF password protection free. Unlock PDFs online, private, no signup.", faqs }) }}
      />
      <PdfUnlockerClient />
    </>
  );
}
