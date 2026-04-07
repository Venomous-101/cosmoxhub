import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import PngToJpgClient from "./PngToJpgClient";

export const metadata = generateToolMetadata({
  toolName: "PNG to JPG Converter",
  slug: "png-to-jpg",
  description: "Convert PNG images to JPG online for free. Bulk convert up to 20 PNGs with custom quality slider. Browser-based, no signup, 100% private on CosmoxHub.",
  keywords: ["png to jpg", "convert png to jpeg", "png to jpg online", "batch png to jpg", "png converter free", "change png to jpg", "image format converter"],
});

export default function PngToJpgPage() {
  const faqs = [
    { question: "Does converting PNG to JPG lose quality?", answer: "Some quality loss is unavoidable when converting to JPG since it is a lossy format. However, at 85%+ quality setting, the difference is imperceptible to the human eye." },
    { question: "Why convert PNG to JPG?", answer: "JPG files are typically 50-80% smaller than PNG at equivalent quality, making them ideal for web use, email attachments, and social media uploads." },
    { question: "Can I convert multiple PNGs at once?", answer: "Yes! CosmoxHub lets you bulk convert up to 20 PNG images simultaneously and download them all as a ZIP file." },
    { question: "Will transparent PNG backgrounds become white in JPG?", answer: "Yes, since JPG does not support transparency, any transparent areas will be filled with a white background. Use WebP if you need transparency with small file size." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "PNG to JPG Converter", slug: "png-to-jpg", description: "Convert PNG to JPG free online. Bulk, custom quality, no signup.", faqs }) }}
      />
      <PngToJpgClient />
    </>
  );
}
