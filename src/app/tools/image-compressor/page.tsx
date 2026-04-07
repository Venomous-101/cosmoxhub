import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ImageCompressorClient from "./ImageCompressorClient";

export const metadata = generateToolMetadata({
  toolName: "Image Compressor",
  slug: "image-compressor",
  description: "Compress JPEG, PNG and WebP images online for free. Reduce file size by up to 80% without losing quality. Bulk upload, custom MB/KB target, no signup on CosmoxHub.",
  keywords: ["image compressor", "compress image online", "reduce image size", "compress jpg free", "image optimizer", "bulk image compressor", "compress png online"],
});

export default function ImageCompressorPage() {
  const faqs = [
    { question: "How much can I compress an image?", answer: "Depending on the format and quality setting, you can reduce image size by 50-80%. WebP format typically achieves the best compression." },
    { question: "Does compression reduce image quality?", answer: "Our tool lets you control the quality slider from 10% to 100%. At 75-85%, most users cannot notice any quality difference while saving 50-70% file size." },
    { question: "Can I compress multiple images at once?", answer: "Yes! CosmoxHub's Image Compressor supports bulk uploads of up to 50 images simultaneously." },
    { question: "What formats are supported?", answer: "You can compress JPEG, PNG, and WebP images and output in any of these three formats." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Image Compressor", slug: "image-compressor", description: "Compress JPEG, PNG and WebP images for free. Bulk upload, custom target size, no signup.", faqs }) }}
      />
      <ImageCompressorClient />
    </>
  );
}
