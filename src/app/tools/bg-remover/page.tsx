import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import BGRemoverClient from "./BGRemoverClient";

export const metadata = generateToolMetadata({
  toolName: "Background Remover",
  slug: "bg-remover",
  description: "Remove image background instantly using AI. Free, no signup, 100% private — processed in your browser. Perfect for photos, product images & profile pictures on CosmoxHub.",
  keywords: ["background remover", "remove background free", "ai background remover", "transparent background", "remove bg online", "background eraser", "photo background removal"],
});

export default function BGRemoverPage() {
  const faqs = [
    { question: "Is the background remover free?", answer: "Yes, 100% free. No signup, no watermarks, no limits. Remove backgrounds from unlimited images." },
    { question: "What AI model does it use?", answer: "CosmoxHub uses @imgly/background-removal, a state-of-the-art WASM-based AI model that runs entirely in your browser." },
    { question: "Does it work on product images?", answer: "Yes. It works great on people, products, logos, animals, and complex backgrounds with fine edges like hair or fur." },
    { question: "What format is the output?", answer: "The output is a high-quality PNG with a transparent background, ready to use on any color background." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "AI Background Remover", slug: "bg-remover", description: "Remove image backgrounds instantly with AI. Free, private, no signup.", faqs }) }}
      />
      <BGRemoverClient />
    </>
  );
}
