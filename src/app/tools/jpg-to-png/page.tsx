import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import JpgToPngClient from "./JpgToPngClient";

export const metadata = generateToolMetadata({
  toolName: "JPG to PNG Converter",
  slug: "jpg-to-png",
  description: "Convert JPG and JPEG images to PNG format online free. Lossless output, transparent background support, bulk conversion. No signup, private on CosmoxHub.",
  keywords: ["jpg to png", "jpeg to png", "convert jpg to png", "jpg to png online free", "bulk jpg to png", "jpg converter", "change jpg to png"],
});

export default function JpgToPngPage() {
  const faqs = [
    { question: "Why convert JPG to PNG?", answer: "PNG is a lossless format that supports transparency (alpha channel). Convert to PNG when you need to edit an image for design work, or when you need a transparent background." },
    { question: "Will the conversion improve image quality?", answer: "Converting JPG to PNG prevents further quality loss from re-saving, but cannot recover quality already lost during initial JPG compression." },
    { question: "Can I convert multiple JPGs at once?", answer: "Yes! CosmoxHub allows bulk conversion of multiple JPG files simultaneously with individual download or ZIP options." },
    { question: "Are my images kept private?", answer: "Yes. All conversion is done in your browser's Canvas API. No images are uploaded to any server." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "JPG to PNG Converter", slug: "jpg-to-png", description: "Convert JPG to PNG free online. Lossless, bulk, transparency support.", faqs }) }}
      />
      <JpgToPngClient />
    </>
  );
}
