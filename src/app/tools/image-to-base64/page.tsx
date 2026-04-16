import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ImageToBase64Client from "./ImageToBase64Client";

export const metadata = generateToolMetadata({
  toolName: "Image to Base64 Converter",
  slug: "image-to-base64",
  description: "Convert any image (PNG, JPG, SVG, WebP, GIF) to Base64 encoded string instantly. Embed images directly in HTML or CSS without hosting. Free, browser-based, private.",
  keywords: ["image to base64", "base64 encoder", "convert image to base64", "base64 image converter", "encode image", "html inline image", "base64 string"],
});

export default function ImageToBase64Page() {
  const faqs = [
    { question: "What is Base64 encoding for images?", answer: "Base64 converts binary image data into a text string that can be embedded directly in HTML, CSS, or JSON without needing a separate file URL." },
    { question: "What image formats are supported?", answer: "PNG, JPG/JPEG, GIF, WebP, SVG, BMP, and most other common image formats are supported." },
    { question: "Is there a file size limit?", answer: "No hard limit, but very large images may cause browser slowdowns. For best performance, keep files under 5MB." },
    { question: "How do I use the Base64 output in HTML?", answer: "Use it as an image src: <img src=\"data:image/png;base64,YOUR_STRING\" />. The same format works in CSS background-image properties." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Image to Base64 Converter", slug: "image-to-base64", description: "Convert any image to Base64 string instantly. Free, private, browser-based.", faqs }) }}
      />
      <ImageToBase64Client />
    </>
  );
}
