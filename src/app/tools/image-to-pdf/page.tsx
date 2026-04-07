import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ImageToPdfClient from "./ImageToPdfClient";

export const metadata = generateToolMetadata({
  toolName: "Image to PDF Converter",
  slug: "image-to-pdf",
  description: "Convert JPG, PNG or WebP images to PDF online free. Combine multiple images into one PDF document. Custom page size and orientation. No signup on CosmoxHub.",
  keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert image to pdf", "photos to pdf", "combine images to pdf", "picture to pdf converter"],
});

export default function ImageToPdfPage() {
  const faqs = [
    { question: "Can I combine multiple images into one PDF?", answer: "Yes! You can upload multiple images and they will all be combined into a single, multi-page PDF document in the order you arrange them." },
    { question: "What image formats can I convert?", answer: "You can convert JPG, JPEG, PNG, and WebP images to PDF." },
    { question: "Can I choose the PDF page size?", answer: "Yes. You can choose A4, Letter, or fit-to-image page size. You can also set portrait or landscape orientation." },
    { question: "Is this tool secure?", answer: "Yes. All conversion happens locally in your browser using pdf-lib. Your images are never uploaded to any server." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Image to PDF Converter", slug: "image-to-pdf", description: "Convert images to PDF free. Combine multiple images, custom page size.", faqs }) }}
      />
      <ImageToPdfClient />
    </>
  );
}
