import { MetadataRoute } from "next";
import { categories } from "@/lib/tools-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cosmoxhub.com";

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

  const allRoutes = [...staticRoutes, ...toolRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
