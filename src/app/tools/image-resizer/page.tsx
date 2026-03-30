import { Metadata } from "next";
import ImageResizerClient from "./ImageResizerClient";

export const metadata: Metadata = {
  title: "Image Resizer - Free Online Utility Tool | CosmoXHub",
  description: "Resize images to custom dimensions or social media presets with our high-speed free online tool. Maintain aspect ratio, batch process photos, and ensure 100% privacy with local processing.",
  keywords: ["image resizer", "resize image online", "free utility tool", "social media image resizer", "bulk image resizer", "cosmoxhub"],
  openGraph: {
    title: "Image Resizer - Free Online Utility Tool | CosmoXHub",
    description: "High-speed, private image resizing with social media presets. 100% free.",
    type: "website",
  }
};

export default function ImageResizerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Image Resizer & Crop Tool",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": ["Precision crop tool", "Bulk resizing", "Aspect ratio locking", "Social media presets", "100% Client-Side Privacy"]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageResizerClient />
    </>
  );
}
