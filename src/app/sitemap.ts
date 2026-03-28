import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cosmoxhub.com";

  // Core Tools (already checked)
  const coreTools = [
    "",
    "/tools/word-counter",
    "/tools/case-converter",
    "/tools/age-calculator",
    "/tools/image-resizer",
    "/tools/password-generator",
    "/tools/merge-pdf",
    "/tools/split-pdf",
    "/tools/qr-generator",
    "/tools/whitespace-remover",
    "/tools/lorem-ipsum",
    "/tools/jpg-to-png",
    "/tools/png-to-jpg",
    "/tools/json-formatter",
    "/tools/youtube-thumbnail",
    "/tools/whatsapp-link",
    "/tools/text-to-pdf",
    "/tools/pdf-to-image",
    "/tools/image-to-pdf",
    "/tools/image-upscaler",
    // New Elite Tools
    "/tools/code-beautifier",
    "/tools/pdf-unlocker",
    "/tools/ai-prompt-optimizer",
    "/tools/bg-remover",
    // Legal Pages
    "/about",
    "/privacy",
    "/terms",
  ];

  return coreTools.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
