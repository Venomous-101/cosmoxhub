import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import PasswordGeneratorClient from "./PasswordGeneratorClient";

export const metadata = generateToolMetadata({
  toolName: "Password Generator",
  slug: "password-generator",
  description: "Generate strong, secure random passwords instantly. Customize length, numbers, symbols and uppercase. Zero-knowledge — passwords never touch any server on CosmoxHub.",
  keywords: ["password generator", "strong password generator", "random password generator", "secure password creator", "free password generator", "complex password generator"],
});

export default function PasswordGeneratorPage() {
  const faqs = [
    { question: "Are my generated passwords saved or logged?", answer: "Never. CosmoxHub uses a zero-knowledge architecture. All password generation happens locally in your browser's memory. Even we cannot see generated passwords." },
    { question: "What makes a strong password?", answer: "A strong password is at least 16 characters long and contains a mix of uppercase letters, lowercase letters, numbers, and special symbols. Our tool generates these by default." },
    { question: "Can I use this for my business?", answer: "Yes! You can generate passwords for all your business accounts. Use our strength indicator to ensure each password meets enterprise security standards." },
    { question: "Is a browser-based generator safer than offline?", answer: "When the tool is fully client-side (like CosmoxHub), yes. Unlike server-side generators, the password is only ever known to your local browser." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Password Generator", slug: "password-generator", description: "Generate strong secure passwords. Zero-knowledge, browser-only, free.", faqs }) }}
      />
      <PasswordGeneratorClient />
    </>
  );
}
