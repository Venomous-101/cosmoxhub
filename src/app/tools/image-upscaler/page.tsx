import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ImageUpscalerClient from "./ImageUpscalerClient";

export const metadata = generateToolMetadata({
  toolName: "AI Image Upscaler",
  slug: "image-upscaler",
  description: "Upscale images 2x, 3x or 4x using ESRGAN AI neural network — same tech as Topaz Labs. Free, no upload, no signup. Works entirely in your browser on CosmoxHub.",
  keywords: ["image upscaler", "ai image upscaler", "upscale image online", "increase image resolution", "esrgan upscaler", "4k image upscaler", "enhance image quality free"],
});

export default function ImageUpscalerPage() {
  const faqs = [
    { question: "Is the AI Image Upscaler free?", answer: "Yes, completely free. No signup, no limits, no watermarks. All processing happens in your browser." },
    { question: "What AI model does the upscaler use?", answer: "CosmoxHub uses ESRGAN (Enhanced Super-Resolution GAN) — the same technology used by Topaz Gigapixel AI and Let's Enhance, powered by TensorFlow.js." },
    { question: "Is my image uploaded to any server?", answer: "Never. All upscaling happens locally in your browser. Your images are never sent to any server, ensuring 100% privacy." },
    { question: "What is the maximum upscale factor?", answer: "You can upscale images 2x, 3x, or 4x. For 4x, a 500x500px image becomes 2000x2000px." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "AI Image Upscaler", slug: "image-upscaler", description: "Upscale images 2x or 4x using ESRGAN AI. Free, private, browser-based.", faqs }) }}
      />
      <ImageUpscalerClient />
    </>
  );
}
