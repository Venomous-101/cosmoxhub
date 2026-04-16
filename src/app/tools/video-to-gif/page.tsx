import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import VideoToGifClient from "./VideoToGifClient";

export const metadata = generateToolMetadata({
  toolName: "Video to GIF Converter",
  slug: "video-to-gif",
  description: "Convert MP4, WebM, or MOV video clips to animated GIF files directly in your browser. No upload required. Set custom start/end, FPS, and size. Free, private, fast.",
  keywords: ["video to gif", "convert mp4 to gif", "video to gif converter", "make gif from video", "mp4 to gif online", "free gif maker", "gif converter"],
  // Keep the prefetch hints from the original page
});

export default function VideoToGifPage() {
  const faqs = [
    { question: "What video formats are supported?", answer: "MP4, WebM, MOV, and most other web-compatible video formats are supported. The conversion uses FFmpeg WebAssembly running entirely in your browser." },
    { question: "Is the video uploaded to a server?", answer: "No. FFmpeg runs entirely inside your browser (WebAssembly). Your video file never leaves your device." },
    { question: "Can I trim the video before converting?", answer: "Yes. Set the start and end timestamps to extract only the specific clip you want to convert to GIF." },
    { question: "How do I reduce the GIF file size?", answer: "Lower the FPS (frames per second) or reduce the output resolution. These two settings have the biggest impact on final file size." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Video to GIF Converter", slug: "video-to-gif", description: "Convert any video to animated GIF in your browser. No upload, free, fast.", faqs }) }}
      />
      <VideoToGifClient />
    </>
  );
}
