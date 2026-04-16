import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import TextCaseProClient from "./TextCaseProClient";

export const metadata = generateToolMetadata({
  toolName: "Text Case Pro",
  slug: "text-case-pro",
  description: "Advanced text case converter for developers and writers. Convert to camelCase, snake_case, kebab-case, UPPERCASE, and lowercase online instantly.",
  keywords: ["text case converter", "camelcase converter", "snake case converter", "kebab case converter", "change text case", "uppercase to lowercase"],
});

export default function TextCaseProPage() {
  const faqs = [
    { question: "What is camelCase?", answer: "camelCase is a naming convention where the first letter of each word (except the first) is capitalized, and there are no spaces. Example: myFirstName." },
    { question: "What is snake_case?", answer: "snake_case separates words with an underscore instead of a space. Example: my_first_name. It is often used in Python and database architectures." },
    { question: "Is my text data stored?", answer: "No, Text Case Pro performs all text conversions directly in your browser. None of your data is ever uploaded to our servers or logged." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Text Case Pro", slug: "text-case-pro", description: "Advanced text case conversions including developer formats.", faqs }) }}
      />
      <TextCaseProClient />
    </>
  );
}
