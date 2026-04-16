import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import SignatureCreatorClient from "./SignatureCreatorClient";

export const metadata = generateToolMetadata({
  toolName: "Online Signature Creator",
  slug: "signature-creator",
  description: "Create a free digital signature online. Draw with mouse/touchscreen, type in cursive fonts, or upload an image. Download as transparent PNG or SVG. No signup needed.",
  keywords: ["signature creator", "online signature maker", "digital signature", "electronic signature", "draw signature online", "create signature", "free signature generator", "e-signature"],
});

export default function SignatureCreatorPage() {
  const faqs = [
    { question: "Can I create a legal e-signature with this tool?", answer: "This tool creates signature images (PNG/SVG). For legally binding electronic signatures on contracts, you need a certified platform like DocuSign. However, for most business documents, a signature PNG works fine." },
    { question: "Is my signature saved on your server?", answer: "No. Your signature is created entirely in your browser using the HTML Canvas API. Nothing is sent to any server — it disappears when you close the tab." },
    { question: "What fonts are available for typed signatures?", answer: "Dancing Script, Pacifico, Great Vibes, Caveat, Sacramento, and Allura — all professional cursive/script Google Fonts." },
    { question: "Can I make the signature background transparent?", answer: "Yes. Toggle 'Transparent BG' in the settings panel. When you download as PNG, the background will be fully transparent." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Online Signature Creator", slug: "signature-creator", description: "Create free digital signatures online. Draw, type, or upload. Download as transparent PNG or SVG.", faqs }) }}
      />
      <SignatureCreatorClient />
    </>
  );
}
