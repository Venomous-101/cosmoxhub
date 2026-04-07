import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import LoremIpsumClient from "./LoremIpsumClient";

export const metadata = generateToolMetadata({
  toolName: "Lorem Ipsum Generator",
  slug: "lorem-ipsum",
  description: "Generate Lorem Ipsum placeholder text online free. Choose number of paragraphs, words or sentences. Copy instantly for design mockups, UI testing and prototyping on CosmoxHub.",
  keywords: ["lorem ipsum generator", "placeholder text generator", "dummy text generator", "lorem ipsum online", "fake text generator", "lipsum generator"],
});

export default function LoremIpsumPage() {
  const faqs = [
    { question: "What is Lorem Ipsum?", answer: "Lorem Ipsum is standard placeholder text used in design and typesetting since the 1500s. It has a natural distribution of letters, making it look like readable English for layout mockups." },
    { question: "Can I generate a specific number of words?", answer: "Yes. You can generate placeholder text by paragraphs, sentences, or exact word count." },
    { question: "Can I start with 'Lorem ipsum dolor sit amet'?", answer: "Yes! Toggle the 'Begin with Lorem ipsum' option to always start your generated text with the classic opening phrase." },
    { question: "Is there a limit to how much I can generate?", answer: "No. Generate as many paragraphs and sentences as your project needs." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Lorem Ipsum Generator", slug: "lorem-ipsum", description: "Generate Lorem Ipsum placeholder text. Paragraphs, words, sentences. Free.", faqs }) }}
      />
      <LoremIpsumClient />
    </>
  );
}
