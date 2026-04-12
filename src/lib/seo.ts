// ============================================================
// CosmoxHub — SEO Helper Library
// Provides JSON-LD schema generators for all tool pages
// ============================================================

export interface ToolSchemaParams {
  name: string;
  url: string;
  description: string;
  features?: string[];
}

/** WebApplication schema for tool pages */
export function generateToolSchema(params: ToolSchemaParams) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: params.name,
    url: params.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: params.description,
    featureList: params.features ?? [
      "No signup required",
      "100% browser-based",
      "No file upload to server",
      "Free forever",
    ],
    provider: {
      "@type": "Organization",
      name: "CosmoxHub",
      url: "https://www.cosmoxhub.com",
    },
  };
}

/** FAQPage schema for tool pages */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** BreadcrumbList schema */
export function generateBreadcrumbSchema(toolName: string, toolSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.cosmoxhub.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://www.cosmoxhub.com/#pdf-tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: toolName,
        item: `https://www.cosmoxhub.com/tools/${toolSlug}`,
      },
    ],
  };
}

/** Speakable + WebPage schema for AI overview optimization */
export function generateWebPageSchema(toolName: string, toolSlug: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: toolName,
    url: `https://www.cosmoxhub.com/tools/${toolSlug}`,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: "CosmoxHub",
      url: "https://www.cosmoxhub.com",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".tool-definition"],
    },
    lastReviewed: new Date().toISOString().split("T")[0],
  };
}
