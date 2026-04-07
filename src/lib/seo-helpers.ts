import { Metadata } from "next";

const BASE_URL = "https://www.cosmoxhub.com";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

interface ToolMetadataParams {
  toolName: string;
  slug: string;
  description: string; // 150-160 chars recommended
  keywords: string[];
}

/**
 * generateToolMetadata — Elite SEO Metadata Generator
 * Creates consistent, keyword-rich, schema-complete metadata for every tool page.
 * Fixes: brand consistency, canonical tags, OG images, Twitter Cards.
 */
export function generateToolMetadata({
  toolName,
  slug,
  description,
  keywords,
}: ToolMetadataParams): Metadata {
  const canonicalUrl = `${BASE_URL}/tools/${slug}`;
  const title = `${toolName} — Free Online Tool | CosmoxHub`;

  return {
    title,
    description,
    keywords: [...keywords, "free online tool", "cosmoxhub", "no signup", "browser based"],
    authors: [{ name: "CosmoxHub" }],
    creator: "CosmoxHub",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "CosmoxHub",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${toolName} — Free Online Tool | CosmoxHub`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

/**
 * generateWebAppJsonLd — WebApplication + FAQPage Schema Generator
 * Produces rich schema markup to qualify for Google Rich Results.
 */
export function generateWebAppJsonLd({
  toolName,
  slug,
  description,
  faqs,
}: {
  toolName: string;
  slug: string;
  description: string;
  faqs?: { question: string; answer: string }[];
}) {
  const canonicalUrl = `${BASE_URL}/tools/${slug}`;

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${canonicalUrl}#app`,
    name: toolName,
    url: canonicalUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description,
    featureList: [
      "No signup required",
      "100% browser-based processing",
      "Private — files never uploaded to servers",
      "Free forever",
    ],
    provider: {
      "@type": "Organization",
      "@id": "https://www.cosmoxhub.com/#organization",
      name: "CosmoxHub",
      url: "https://www.cosmoxhub.com",
    },
    isPartOf: {
      "@id": "https://www.cosmoxhub.com/#website",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "CosmoxHub",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: `${BASE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: toolName,
          item: canonicalUrl,
        },
      ],
    },
  };

  if (!faqs || faqs.length === 0) {
    return JSON.stringify(webAppSchema);
  }

  const faqSchema = {
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

  return JSON.stringify([webAppSchema, faqSchema]);
}
