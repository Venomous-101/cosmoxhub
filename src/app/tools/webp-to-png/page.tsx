import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import WebpToPngClient from "./WebpToPngClient";

export const metadata = generateToolMetadata({
  toolName: "WebP to PNG Converter",
  slug: "webp-to-png",
  description: "Convert WebP images to PNG online free. Preserves transparency (alpha channel). Bulk convert up to 20 WebP files. No signup, 100% private on CosmoxHub.",
  keywords: ["webp to png", "convert webp to png", "webp converter online", "webp to png free", "bulk webp to png", "webp image converter"],
});

export default function WebpToPngPage() {
  const faqs = [
    { question: "Why convert WebP to PNG?", answer: "While WebP is great for web performance, many design tools, print workflows, and older apps do not support WebP. Converting to PNG ensures maximum compatibility." },
    { question: "Is transparency (alpha channel) preserved?", answer: "Yes. CosmoxHub's WebP to PNG converter fully preserves the alpha channel, so transparent backgrounds remain perfectly clear in the PNG output." },
    { question: "Can I convert multiple WebP files at once?", answer: "Yes! Upload up to 20 WebP images simultaneously and download all PNGs as a single ZIP file." },
    { question: "Is there any quality loss when converting?", answer: "No. PNG is a lossless format, so the conversion from WebP to PNG preserves all visual detail without any compression artifacts." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "WebP to PNG Converter", slug: "webp-to-png", description: "Convert WebP to PNG free. Bulk, lossless, preserves transparency.", faqs }) }}
      />
      <WebpToPngClient />
    </>
  );
}
