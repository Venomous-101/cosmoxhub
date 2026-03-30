import { Metadata } from "next";
import ImageToPdfClient from "./ImageToPdfClient";

export const metadata: Metadata = {
  title: "Image to PDF Converter - Free Online Utility Tool | CosmoXHub",
  description: "Convert images to PDF instantly with our secure free online tool. Bulk JPG, PNG, and Photos to PDF conversion with 100% private browser-side processing.",
  keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert images to pdf", "photo to pdf", "free pdf tools", "bulk image to pdf", "cosmoxhub"],
  openGraph: {
    title: "Image to PDF Converter - Free Online Utility Tool | CosmoXHub",
    description: "Convert images to professional PDF documents with total privacy. Arranging pages, setting margins, and bulk processing—all in your browser.",
    type: "website",
  }
};

export default function ImageToPDFPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Image to PDF",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Drag-and-drop page reordering",
      "Multiple page sizes (Auto, A4, Letter)",
      "Margin and Orientation controls",
      "100% Client-side privacy",
      "Fast browser-native generation"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageToPdfClient />
    </>
  );
}
