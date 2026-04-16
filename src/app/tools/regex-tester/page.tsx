import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import RegexTesterClient from "./RegexTesterClient";

export const metadata = generateToolMetadata({
  toolName: "Regex Tester",
  slug: "regex-tester",
  description: "Test and debug regular expressions online with live match highlighting. Supports all JavaScript regex flags (g, i, m, s, u). Free, real-time, browser-based regex tester.",
  keywords: ["regex tester", "regular expression tester", "regex online", "regex checker", "test regex", "regex debugger", "regex validator", "javascript regex"],
});

export default function RegexTesterPage() {
  const faqs = [
    { question: "What regex flavour does this tester support?", answer: "JavaScript RegExp. This covers the vast majority of modern regex patterns and all standard flags: g (global), i (case-insensitive), m (multiline), s (dotAll), and u (unicode)." },
    { question: "How are matches highlighted?", answer: "All matches in the test string are highlighted in real time as you type your pattern. The match count and each matched substring is shown clearly." },
    { question: "Can I test multiple matches at once?", answer: "Yes. Use the 'g' (global) flag to find all matches in the string simultaneously." },
    { question: "Why is there a 'too soon' warning on my regex?", answer: "Some zero-length patterns in global mode can cause infinite loops. The tester detects this and warns you rather than hanging your browser." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Regex Tester", slug: "regex-tester", description: "Test JavaScript regular expressions with live match highlighting. Free, real-time, browser-based.", faqs }) }}
      />
      <RegexTesterClient />
    </>
  );
}
