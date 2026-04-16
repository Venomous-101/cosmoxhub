import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import InvoiceGeneratorClient from "./InvoiceGeneratorClient";

export const metadata = generateToolMetadata({
  toolName: "Invoice Number Generator",
  slug: "invoice-generator",
  description: "Generate sequential invoice numbers in bulk with custom prefix, suffix, padding, and start number. Copy all in one click. Free online invoice number creator.",
  keywords: ["invoice number generator", "generate invoice numbers", "bulk invoice numbers", "invoice number format", "sequential invoice", "invoice numbering system", "invoice id generator"],
});

export default function InvoiceGeneratorPage() {
  const faqs = [
    { question: "What is an invoice number generator?", answer: "It's a tool that creates sequential, professionally formatted invoice numbers in bulk — like INV-0001-2026, INV-0002-2026, etc. — so you don't have to create them manually." },
    { question: "Can I customize the format?", answer: "Yes. You can set a custom prefix (e.g. INV-, PO-, RCV-), suffix (e.g. -2026, -US), starting number, zero-padding length, and total quantity to generate." },
    { question: "What is the maximum number of invoice numbers I can generate?", answer: "Up to 10,000 invoice numbers can be generated in a single batch." },
    { question: "Can I copy all the numbers at once?", answer: "Yes. Click 'Copy All List' to copy every generated number to your clipboard, ready to paste into Excel, accounting software, or any other tool." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Invoice Number Generator", slug: "invoice-generator", description: "Generate bulk sequential invoice numbers with custom format. Free, browser-based.", faqs }) }}
      />
      <InvoiceGeneratorClient />
    </>
  );
}
