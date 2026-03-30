import { Metadata } from "next";
import PdfToImageClient from "./PdfToImageClient";

export const metadata: Metadata = {
  title: "PDF to Image Converter - Free Online Utility Tool | CosmoXHub",
  description: "Convert PDF to high-quality JPG or PNG images instantly with our secure free online tool. Extract pages with vector-precision and 100% private local processing.",
  keywords: ["pdf to image", "pdf to jpg", "pdf to png", "extract images from pdf", "pdf page to image", "free pdf tools", "secure pdf to image", "cosmoxhub"],
  openGraph: {
    title: "PDF to Image Converter - Free Online Utility Tool | CosmoXHub",
    description: "Extract high-resolution images from your PDF pages with vector-precision. Perfect for social media and presentations. 100% secure and private.",
    type: "website",
  }
};

export default function PDFToImagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite PDF to Image",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Vector-precision PDF rendering",
      "High-res JPG/PNG extraction",
      "Secure browser-side state management",
      "Elite quality up to 3x scale",
      "Zero-server-risk architecture"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfToImageClient />
    </>
  );
}
