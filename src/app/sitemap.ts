import { MetadataRoute } from "next";
import { categories } from "@/lib/tools-data";
import { pseoData } from "@/lib/pseo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.cosmoxhub.com";

  // Core static routes
  const staticRoutes = [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/claude-skills-creator",
  ];

  // Map all tools from our data library
  const toolRoutes = categories.flatMap(category => 
    category.tools.map(tool => tool.href)
  );

  // Map programmatic SEO pages
  const pseoRoutes = pseoData.map(page => `/tool/${page.slug}`);

  const allRoutes = [...staticRoutes, ...toolRoutes, ...pseoRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/tools/") ? 0.9 : route.startsWith("/tool/") ? 0.7 : 0.5,
  }));
}
