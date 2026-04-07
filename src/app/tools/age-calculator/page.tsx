import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import AgeCalculatorClient from "./AgeCalculatorClient";

export const metadata = generateToolMetadata({
  toolName: "Age Calculator",
  slug: "age-calculator",
  description: "Calculate your exact age in years, months, days, hours and minutes online free. Find the age difference between dates. Instant results on CosmoxHub.",
  keywords: ["age calculator", "calculate age online", "how old am i", "age from date of birth", "birthday calculator", "age difference calculator", "years months days calculator"],
});

export default function AgeCalculatorPage() {
  const faqs = [
    { question: "How accurate is the age calculation?", answer: "Extremely precise. CosmoxHub calculates your age down to exact years, months, days, hours, and minutes based on the real-world calendar including leap years." },
    { question: "Can I calculate the age difference between two people?", answer: "Yes. Enter two different dates of birth and the tool will show you the exact difference in years, months, and days." },
    { question: "Does it account for leap years?", answer: "Yes. Our JavaScript-based calculation uses native Date objects that correctly account for all leap years automatically." },
    { question: "Is my birth date stored?", answer: "Never. All calculations happen instantly in your browser. No dates or personal information are logged." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Age Calculator", slug: "age-calculator", description: "Calculate exact age in years, months, days. Free, instant, private.", faqs }) }}
      />
      <AgeCalculatorClient />
    </>
  );
}
