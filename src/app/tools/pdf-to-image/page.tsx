import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import PdfToImageClient from "./PdfToImageClient";

export const metadata = generateToolMetadata({
  toolName: "PDF to Image Converter",
  slug: "pdf-to-image",
  description: "Convert PDF pages to high-quality PNG or JPG images online for free. Bulk PDF conversion, custom DPI, ZIP download. No server upload, 100% private on CosmoxHub.",
  keywords: ["pdf to image", "pdf to png", "pdf to jpg", "convert pdf to image", "pdf page to image", "extract images from pdf", "pdf converter"],
});

export default function PdfToImagePage() {
  const faqs = [
    { question: "What image formats does the converter output?", answer: "You can export PDF pages as high-quality PNG or JPEG images. PNG is recommended for documents with sharp text, while JPEG is better for photos." },
    { question: "Can I convert multiple PDFs at once?", answer: "Yes! CosmoxHub's PDF to Image converter supports bulk conversion of multiple PDF files simultaneously, with a ZIP download of all outputs." },
    { question: "Is my PDF uploaded to a server?", answer: "Absolutely not. All conversion happens locally in your browser using PDF.js. Your documents never leave your device." },
    { question: "What DPI quality can I choose?", answer: "You can select from standard (72 DPI), high (150 DPI) and ultra (300 DPI) quality settings, suitable for both screen and print use." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "PDF to Image Converter", slug: "pdf-to-image", description: "Convert PDF pages to PNG or JPG images. Free, bulk, private.", faqs }) }}
      />
      <PdfToImageClient />
    </>
  );
}
