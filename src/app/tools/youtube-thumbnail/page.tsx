import { Metadata } from "next";
import YoutubeThumbnailClient from "./YoutubeThumbnailClient";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader - Free Online Utility Tool | CosmoXHub",
  description: "Download high-quality YouTube video thumbnails instantly with our high-speed free online tool. Support for HD, HQ, and default resolutions. 100% free and easy to use.",
  keywords: ["youtube thumbnail downloader", "get youtube thumbnail", "yt thumbnail grabber", "download youtube cover", "cosmoxhub"],
  openGraph: {
    title: "YouTube Thumbnail Downloader - Free Online Utility Tool | CosmoXHub",
    description: "Extract high-resolution YouTube thumbnails instantly with our elite developer-grade tool. 100% free.",
    type: "website",
  }
};

export default function YouTubeThumbnailPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite YouTube Thumbnail Downloader",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Real-time YouTube URL ID extraction",
       "High-res maxresdefault fetch engine",
       "Multi-resolution visual asset gallery",
       "Elite one-tap discovery/download protocol",
       "Zero-latency client-side parsing"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YoutubeThumbnailClient />
    </>
  );
}
