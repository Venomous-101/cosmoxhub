import React from 'react';
import { Metadata } from 'next';
import ApiTesterClient from './ApiTesterClient';
import { generateWebAppJsonLd } from '@/lib/seo-helpers';

export const metadata: Metadata = {
  title: 'Free API & Webhook Tester Playground | CosmoxHub',
  description: 'Test REST APIs and Webhooks instantly without Postman. Full HTTP support, JSON inspector, custom headers. 100% free browser-based API playground. No signups.',
  keywords: ['api tester online', 'webhook tester', 'postman alternative free', 'test rest api browser', 'api playground'],
  alternates: {
    canonical: 'https://www.cosmoxhub.com/tools/api-tester'
  }
};

const faqs = [
  {
    question: "What is an API Playground?",
    answer: "An API Playground is a browser-based testing environment that allows developers to send HTTP requests (GET, POST, PUT, DELETE) and inspect the JSON responses instantly without needing to download heavy software like Postman."
  },
  {
    question: "Do I need to create an account to use the API Tester?",
    answer: "No. CosmoxHub's API Tester is 100% free and requires zero setup. You just open the page and start testing your APIs or webhooks instantly."
  },
  {
    question: "Can I test JSON payloads and Authentication headers?",
    answer: "Yes, you have full control. You can add custom headers, Authorization Bearer tokens, API keys, and raw JSON payloads mapped directly to your endpoints."
  },
  {
    question: "How do you bypass browser CORS limits?",
    answer: "We use a highly secure, stateless edge proxy. Your headers and payloads are forwarded directly to your target URL and instantly destroyed. We do not store, log, or track your API requests."
  }
];

export default function ApiTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "API & Webhook Tester", slug: "api-tester", description: "Browser-based API testing playground.", faqs }) }}
      />
      <ApiTesterClient />
    </>
  );
}
