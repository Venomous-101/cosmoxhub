import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import FontPairingClient from "./FontPairingClient";

export const metadata = generateToolMetadata({
  toolName: "Font Pairing Tool",
  slug: "font-pairing",
  description: "Find perfect Google Font combinations for your website or brand. Preview heading and body font pairings live with real content. Free font pairing generator.",
  keywords: ["font pairing tool", "google fonts pairing", "font combinations", "best font pairs", "typography tool", "font matcher", "web font generator"],
});

export default function FontPairingPage() {
  const faqs = [
    { question: "How does the font pairing tool work?", answer: "Select a heading font and a body font from Google Fonts. The tool renders a live preview with real content so you can judge how the combination looks instantly." },
    { question: "Are all fonts free to use?", answer: "Yes. All fonts in the tool are from Google Fonts and are free to use in personal and commercial projects under the Open Font License." },
    { question: "Can I use these fonts in my website?", answer: "Absolutely. Click the 'Copy Link' button to get the Google Fonts import URL, then paste it in your CSS or HTML head." },
    { question: "How do I find good font pairings?", answer: "As a rule, pair high-contrast fonts: a strong serif or display font for headings with a clean, readable sans-serif for body text. Use the preview to judge." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Font Pairing Tool", slug: "font-pairing", description: "Find perfect Google Font combinations. Live preview, free to use.", faqs }) }}
      />
      <FontPairingClient />
    </>
  );
}
