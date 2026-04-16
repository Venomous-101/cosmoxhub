import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import AspectRatioClient from "./AspectRatioClient";

export const metadata = generateToolMetadata({
  toolName: "Aspect Ratio Calculator",
  slug: "aspect-ratio-calculator",
  description: "Calculate image and video dimensions while maintaining the perfect aspect ratio. Works for 16:9, 4:3, 1:1, and custom ratios instantly.",
  keywords: ["aspect ratio calculator", "image ratio calculator", "video aspect ratio", "calculate width height", "16:9 calculator", "maintain aspect ratio"],
});

export default function AspectRatioPage() {
  const faqs = [
    { question: "What is an Aspect Ratio?", answer: "An aspect ratio describes the proportional relationship between its width and its height. It is commonly expressed as two numbers separated by a colon, such as 16:9." },
    { question: "How do I use this calculator?", answer: "Enter your original dimensions (W1 and H1) to define the ratio, then enter either the new width or height to find the corresponding dimension while locked." },
    { question: "Can I use custom ratios?", answer: "Yes! Simply enter any width and height values, and the tool will detect the ratio and allow you to scale based on those exact proportions." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Aspect Ratio Calculator", slug: "aspect-ratio-calculator", description: "Maintain perfect proportions for your images and videos.", faqs }) }}
      />
      <AspectRatioClient />
    </>
  );
}
