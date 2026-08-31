import { MetadataRoute } from "next";
import { allTools } from "@/lib/tools-data";
import { blogPosts } from "@/data/blogPosts";

const BASE = "https://www.cosmoxhub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: `${BASE}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
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
