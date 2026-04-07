import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import HeicToJpgClient from "./HeicToJpgClient";

export const metadata = generateToolMetadata({
  toolName: "HEIC to JPG Converter",
  slug: "heic-to-jpg",
  description: "Convert HEIC and HEIF images to JPG or PNG online free. iPhone photos made compatible instantly. Bulk convert, high quality, no signup, private on CosmoxHub.",
  keywords: ["heic to jpg", "heic converter", "heif to jpg", "convert iphone photos", "heic to jpeg online", "heic to png", "apple heic converter"],
});

export default function HeicToJpgPage() {
  const faqs = [
    { question: "What is a HEIC file?", answer: "HEIC (High Efficiency Image Container) is the default photo format used by iPhones running iOS 11 and later. It offers better quality than JPEG at smaller file sizes, but isn't widely supported on Windows and Android." },
    { question: "How do I convert HEIC to JPG on Windows?", answer: "Simply use CosmoxHub's free HEIC to JPG converter. Upload your HEIC files, click convert, and download the JPG output. No software installation needed." },
    { question: "Can I convert multiple HEIC files at once?", answer: "Yes! Our bulk converter handles multiple HEIC file uploads simultaneously." },
    { question: "Is this tool safe for private iPhone photos?", answer: "Completely safe. All conversion happens in your browser using heic2any library. Your photos never leave your device." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "HEIC to JPG Converter", slug: "heic-to-jpg", description: "Convert HEIC/HEIF iPhone photos to JPG free. Bulk, private, no signup.", faqs }) }}
      />
      <HeicToJpgClient />
    </>
  );
}
