import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import FaviconGeneratorClient from "./FaviconGeneratorClient";

export const metadata = generateToolMetadata({
  toolName: "Favicon Generator",
  slug: "favicon-generator",
  description: "Generate favicons in all required sizes (16x16 to 512x512) from any image or text. Download ICO, PNG, and SVG. Free online favicon maker — no signup required.",
  keywords: ["favicon generator", "favicon maker", "create favicon", "ico generator", "favicon from image", "website favicon", "favicon creator free"],
});

export default function FaviconGeneratorPage() {
  const faqs = [
    { question: "What sizes does the favicon generator create?", answer: "It generates all standard sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 192x192, and 512x512 pixels — covering all browser and PWA requirements." },
    { question: "What file formats can I upload?", answer: "You can upload PNG, JPG, SVG, or WebP images. Square images work best for favicons." },
    { question: "Can I create a favicon from text or emoji?", answer: "Yes! Switch to the text/emoji tab and type your character. Choose a background color and font to generate a text-based favicon instantly." },
    { question: "How do I add a favicon to my website?", answer: "Download the files and add them to your site's root directory. Then place the provided HTML link tags in your <head> section." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Favicon Generator", slug: "favicon-generator", description: "Generate favicons in all sizes from any image. Free, browser-based, instant download.", faqs }) }}
      />
      <FaviconGeneratorClient />
    </>
  );
}
