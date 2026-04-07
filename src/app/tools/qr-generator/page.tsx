import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import QRGeneratorClient from "./QRGeneratorClient";

export const metadata = generateToolMetadata({
  toolName: "QR Code Generator",
  slug: "qr-generator",
  description: "Generate custom QR codes for URLs, text, WiFi & more. Customize colors, add logos, choose shapes. Download HD PNG/SVG. Free, no signup, 100% private on CosmoxHub.",
  keywords: ["qr code generator", "qr generator free", "custom qr code", "create qr code", "qr code with logo", "colored qr code", "qr code maker"],
});

export default function QRGeneratorPage() {
  const faqs = [
    { question: "Can I add my logo to the QR code?", answer: "Yes! You can upload any image as a logo overlay in the centre of your QR code. The tool adjusts error correction to ensure the code remains scannable." },
    { question: "What file formats can I download?", answer: "You can download your QR code as a high-resolution PNG or as a scalable SVG vector file, perfect for print." },
    { question: "Is my URL tracked or logged?", answer: "Never. CosmoxHub generates static QR codes locally in your browser. Your destination URLs are never sent to any server." },
    { question: "What types of QR codes can I create?", answer: "You can create QR codes for URLs, plain text, WiFi credentials (SSID + password), phone numbers, and email addresses." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "QR Code Generator", slug: "qr-generator", description: "Generate custom QR codes for URLs, text, WiFi. Free, private, no signup.", faqs }) }}
      />
      <QRGeneratorClient />
    </>
  );
}
