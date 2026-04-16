import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import UrlEncoderClient from "./UrlEncoderClient";

export const metadata = generateToolMetadata({
  toolName: "URL Encoder & Decoder",
  slug: "url-encoder",
  description: "Encode or decode URLs and query strings online instantly. Convert special characters to percent-encoding and back. Free URL encoder/decoder tool — no signup.",
  keywords: ["url encoder", "url decoder", "percent encoding", "url encode online", "urlencode", "decode url", "url encoding tool", "query string encoder"],
});

export default function UrlEncoderPage() {
  const faqs = [
    { question: "What is URL encoding?", answer: "URL encoding (also called percent-encoding) converts special characters like spaces, &, ?, = into safe ASCII codes (e.g. space becomes %20) so they can be safely transmitted in URLs." },
    { question: "When do I need to URL encode?", answer: "When building query strings, passing parameters in URLs, or handling form submissions that contain special characters, spaces, or non-ASCII characters." },
    { question: "What is the difference between encode and decode?", answer: "Encoding converts plain text to percent-encoded format. Decoding reverses this — converting %20 back to a space, %26 back to &, etc." },
    { question: "Does this tool handle Unicode characters?", answer: "Yes. Non-ASCII characters like Arabic, Chinese, or emoji are first converted to UTF-8 bytes, then each byte is percent-encoded." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "URL Encoder & Decoder", slug: "url-encoder", description: "Encode or decode URLs and query strings instantly. Free, browser-based, no signup.", faqs }) }}
      />
      <UrlEncoderClient />
    </>
  );
}
