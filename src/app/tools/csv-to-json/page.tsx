import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import CsvToJsonClient from "./CsvToJsonClient";

export const metadata = generateToolMetadata({
  toolName: "CSV to JSON Converter",
  slug: "csv-to-json",
  description: "Convert CSV arrays into valid structured JSON format online. Secure, fast, and entirely client-side. Free to use with no hidden limits.",
  keywords: ["csv to json", "convert csv to json", "csv json converter", "parse csv", "json format", "online csv converter"],
});

export default function CsvToJsonPage() {
  const faqs = [
    { question: "Is this CSV converter secure?", answer: "Yes, our converter is 100% secure. Everything runs client-side in your browser, meaning your data never leaves your device or touches any servers." },
    { question: "Do I need to sign up to use it?", answer: "No, CosmoxHub tools are completely free to use with no account required and no limits on the amount of text you can convert." },
    { question: "Can I download the JSON file?", answer: "Yes, you can download the generated output directly as a .json file or instantly copy it to your clipboard." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "CSV to JSON Converter", slug: "csv-to-json", description: "Convert CSV to JSON instantly and securely in your browser.", faqs }) }}
      />
      <CsvToJsonClient />
    </>
  );
}
