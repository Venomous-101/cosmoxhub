import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ApiTesterClient from "./ApiTesterClient";

export const metadata = generateToolMetadata({
  toolName: "API & Webhook Tester",
  slug: "api-tester",
  description: "Test REST APIs and webhooks instantly in your browser. Full HTTP method support, JSON inspector, custom headers. Free Postman alternative — no signup needed.",
  keywords: [
    "api tester online free",
    "webhook tester",
    "rest api tester",
    "postman alternative free",
    "test api online",
    "http request tester",
    "json api playground",
    "cors bypass api tester",
  ],
});

export default function ApiTesterPage() {
  const faqs = [
    { question: "What is an API Playground?", answer: "An API Playground is a browser-based testing environment that lets you send HTTP requests (GET, POST, PUT, DELETE, PATCH) and inspect JSON responses instantly — no heavy software like Postman needed." },
    { question: "Do I need to create an account to use the API Tester?", answer: "No. CosmoxHub's API Tester is 100% free and requires zero setup. Open the page and start testing your APIs or webhooks immediately." },
    { question: "Can I test JSON payloads and Authentication headers?", answer: "Yes. You can add custom headers, Authorization Bearer tokens, API keys, and raw JSON payloads directly mapped to your endpoints." },
    { question: "How does CORS work with browser-based API testing?", answer: "We use a secure, stateless edge proxy to forward your requests. Your headers and payloads are sent directly to your target URL and never stored or logged." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateWebAppJsonLd({
            toolName: "API & Webhook Tester",
            slug: "api-tester",
            description: "Browser-based REST API and webhook testing playground. No signup, free forever.",
            faqs,
          }),
        }}
      />
      <ApiTesterClient />
    </>
  );
}
