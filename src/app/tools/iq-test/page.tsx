import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import IQTestClient from "./IQTestClient";

export const metadata = generateToolMetadata({
  toolName: "Free IQ Test",
  slug: "iq-test",
  description: "Take a scientifically calibrated IQ test covering 7 cognitive domains: pattern recognition, verbal reasoning, numerical logic, spatial intelligence, working memory, and more. 100% private.",
  keywords: ["free iq test", "iq test online", "iq test accurate", "online iq score", "cognitive test", "intelligence test", "iq test no signup"],
});

export default function IQTestPage() {
  const faqs = [
    { question: "Is this IQ test accurate?", answer: "This test is calibrated across 7 cognitive domains using established psychometric methods. Results correlate with standard IQ distribution. For clinical diagnosis, consult a licensed psychologist." },
    { question: "How many questions are in the test?", answer: "The test contains 30 questions covering pattern recognition, verbal reasoning, numerical logic, spatial intelligence, working memory, logical deduction, and processing speed." },
    { question: "Is my data saved or shared?", answer: "No. All test processing happens entirely in your browser. Your answers and score are never sent to any server." },
    { question: "How long does the test take?", answer: "Most users complete it in 15–25 minutes. There is no time limit per question, though response speed may factor into some domain scores." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Free IQ Test", slug: "iq-test", description: "Scientifically calibrated IQ test covering 7 cognitive domains. 30 questions, 100% private.", faqs }) }}
      />
      <IQTestClient />
    </>
  );
}
