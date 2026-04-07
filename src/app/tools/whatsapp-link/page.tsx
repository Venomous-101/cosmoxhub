import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import WhatsAppLinkClient from "./WhatsAppLinkClient";

export const metadata = generateToolMetadata({
  toolName: "WhatsApp Link Generator",
  slug: "whatsapp-link",
  description: "Generate a direct WhatsApp chat link with a pre-filled message online free. Perfect for business CTAs, portfolios and contact forms. No phone number saved on CosmoxHub.",
  keywords: ["whatsapp link generator", "whatsapp chat link", "wa.me link generator", "create whatsapp link", "whatsapp click to chat", "whatsapp business link"],
});

export default function WhatsAppLinkPage() {
  const faqs = [
    { question: "What is a WhatsApp chat link?", answer: "A WhatsApp chat link (wa.me link) lets anyone click it to start a WhatsApp conversation with a specific phone number. It can include a pre-filled message, making it ideal for business CTAs." },
    { question: "Does the generator save my phone number?", answer: "No. CosmoxHub is a zero-tracking platform. Your phone number and message are only used locally in your browser to construct the link — nothing is logged or stored." },
    { question: "Can I add a custom message to the link?", answer: "Yes! When someone clicks your link, the custom message you set will be pre-filled in their WhatsApp chat window, saving them time." },
    { question: "Does it work internationally?", answer: "Yes. As long as you include the country code (e.g., +1 for USA, +92 for Pakistan), the link works for any phone number worldwide." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "WhatsApp Link Generator", slug: "whatsapp-link", description: "Generate WhatsApp chat links with pre-filled messages. Free, private.", faqs }) }}
      />
      <WhatsAppLinkClient />
    </>
  );
}
