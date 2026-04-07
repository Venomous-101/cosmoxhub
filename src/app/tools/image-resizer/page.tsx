import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ImageResizerClient from "./ImageResizerClient";

export const metadata = generateToolMetadata({
  toolName: "Image Resizer",
  slug: "image-resizer",
  description: "Resize images to exact pixel dimensions online free. Set custom width and height, maintain aspect ratio, and export JPG, PNG or WebP. Bulk resize on CosmoxHub.",
  keywords: ["image resizer", "resize image online", "change image size", "resize photo free", "image dimensions changer", "bulk image resizer", "resize jpg online"],
});

export default function ImageResizerPage() {
  const faqs = [
    { question: "Can I resize images to specific pixel dimensions?", answer: "Yes. Enter the exact width and height in pixels. You can also lock the aspect ratio to resize proportionally." },
    { question: "Can I resize multiple images at once?", answer: "Yes! CosmoxHub's Image Resizer supports bulk processing of multiple images simultaneously." },
    { question: "What output formats are supported?", answer: "You can export resized images as JPG, PNG, or WebP. WebP offers the best balance of quality and file size for web use." },
    { question: "Is my image data private?", answer: "Yes. All resizing happens locally in your browser using the Canvas API. Your images are never uploaded to any server." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Image Resizer", slug: "image-resizer", description: "Resize images to exact dimensions online free. Bulk, custom size, private.", faqs }) }}
      />
      <ImageResizerClient />
    </>
  );
}
