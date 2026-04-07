import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import YoutubeThumbnailClient from "./YoutubeThumbnailClient";

export const metadata = generateToolMetadata({
  toolName: "YouTube Thumbnail Downloader",
  slug: "youtube-thumbnail",
  description: "Download YouTube thumbnails in HD, Full HD and 4K quality for free. Works with all YouTube URLs including Shorts. No signup, instant download on CosmoxHub.",
  keywords: ["youtube thumbnail downloader", "download youtube thumbnail", "youtube thumbnail hd", "yt thumbnail grabber", "get youtube thumbnail", "youtube cover image", "youtube thumbnail 4k"],
});

export default function YoutubeThumbnailPage() {
  const faqs = [
    { question: "What resolutions can I download YouTube thumbnails in?", answer: "You can download YouTube thumbnails in Standard (480p), High Definition (720p), Full HD (1080p) and Max Resolution quality, depending on what the video uploader provided." },
    { question: "Does it work with YouTube Shorts?", answer: "Yes! CosmoxHub's YouTube thumbnail downloader automatically detects and works with all YouTube URL formats including Shorts, youtu.be links, and standard watch URLs." },
    { question: "Is this free?", answer: "100% free. No signup, no watermarks, no download limits." },
    { question: "Can I download thumbnails from private videos?", answer: "No. You can only download thumbnails from public YouTube videos. Private and unlisted video thumbnails are not accessible." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "YouTube Thumbnail Downloader", slug: "youtube-thumbnail", description: "Download YouTube video thumbnails in HD quality free. Works with all URLs.", faqs }) }}
      />
      <YoutubeThumbnailClient />
    </>
  );
}
