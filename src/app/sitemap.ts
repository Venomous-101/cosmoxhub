import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogPosts";

// Hardcoded tool slugs — ensures sitemap is always correct
// regardless of tools-data structure changes
const TOOL_SLUGS = [
  // PDF Tools
  "merge-pdf", "split-pdf", "pdf-compressor", "pdf-unlocker",
  "image-to-pdf", "pdf-to-image",
  // Text Intelligence
  "word-counter", "case-converter", "whitespace-remover",
  "lorem-ipsum", "text-to-pdf",
  // AI & Developer
  "ai-prompt-optimizer", "code-beautifier", "claude-skills-creator",
  "markdown-to-html", "text-diff", "regex-tester", "font-pairing", "text-to-word",
  "csv-to-json", "text-case-pro", "emi-calculator", "aspect-ratio-calculator", "unit-converter",
  "screen-tester", "contrast-checker", "api-tester",
  // Image Tools
  "image-compressor", "bg-remover", "png-to-jpg", "jpg-to-png",
  "heic-to-jpg", "webp-to-png", "image-resizer", "image-upscaler",
  "color-palette", "favicon-generator", "video-to-gif", "svg-to-png",
  // Utilities
  "whatsapp-link", "qr-generator", "youtube-thumbnail",
  "age-calculator", "password-generator", "invoice-generator",
  "iq-test", "mind-forge", "signature-creator", "pomodoro-timer", "countdown-timer", "resume-builder",
];

const BASE = "https://www.cosmoxhub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages: MetadataRoute.Sitemap = TOOL_SLUGS.map((slug) => ({
    url: `${BASE}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date), // Using date from blogPosts to signal freshness
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE,           lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/blog`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...toolPages,
    ...blogPages,
  ];
}
