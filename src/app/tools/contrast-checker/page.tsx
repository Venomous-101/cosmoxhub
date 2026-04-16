import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ContrastCheckerClient from "./ContrastCheckerClient";

export const metadata = generateToolMetadata({
  toolName: "Contrast Checker (WCAG)",
  slug: "contrast-checker",
  description: "Check color contrast ratios for web accessibility (WCAG 2.1). Ensure your text is readable and compliant with AA and AAA standards.",
  keywords: ["contrast checker", "wcag contrast", "accessibility checker", "color contrast ratio", "web accessibility tool", "color ratio analyzer"],
});

export default function ContrastCheckerPage() {
  const faqs = [
    { question: "What is WCAG?", answer: "The Web Content Accessibility Guidelines (WCAG) are a series of guidelines for making web content more accessible to people with disabilities." },
    { question: "What contrast ratio do I need?", answer: "WCAG Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Level AAA requires 7:1 for normal text and 4.5:1 for large text." },
    { question: "Why is contrast important?", answer: "Good contrast ensures that users with visual impairments, color blindness, or those using screens in bright environments can read your content easily." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Contrast Checker (WCAG)", slug: "contrast-checker", description: "Verify accessibility compliance with our professional contrast checker.", faqs }) }}
      />
      <ContrastCheckerClient />
    </>
  );
}
