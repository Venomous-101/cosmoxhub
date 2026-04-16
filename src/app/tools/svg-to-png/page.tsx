import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import SvgToPngClient from "./SvgToPngClient";

export const metadata = generateToolMetadata({
  toolName: "SVG to PNG Converter",
  slug: "svg-to-png",
  description: "Convert SVG files to high-resolution PNG images online. Upload an SVG or paste code, set custom width, and download. Free, browser-based, no files uploaded.",
  keywords: ["svg to png", "convert svg to png", "svg converter", "svg to image", "export svg as png", "svg rasterizer", "svg png converter online"],
});

export default function SvgToPngPage() {
  const faqs = [
    { question: "How do I convert an SVG to PNG?", answer: "Upload your SVG file using the drop zone, or paste SVG code directly. Set your desired output width and click Download PNG." },
    { question: "Can I set a custom output resolution?", answer: "Yes. Use the width slider to set any output width from 16px to 4096px. The height auto-adjusts to maintain the original aspect ratio." },
    { question: "Does the converter support SVG animations?", answer: "No. Animated SVGs are rasterized as a static frame (the first frame). For animated output, use a dedicated GIF or APNG converter." },
    { question: "Are my SVG files uploaded to a server?", answer: "No. The entire conversion happens in your browser using the HTML Canvas API. Your files never leave your device." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "SVG to PNG Converter", slug: "svg-to-png", description: "Convert SVG to high-resolution PNG online. Custom dimensions, free, browser-based.", faqs }) }}
      />
      <SvgToPngClient />
    </>
  );
}
