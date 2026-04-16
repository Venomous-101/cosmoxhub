"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pseoData, PseoPage } from "@/lib/pseo-data";

/**
 * Employs deep "spider-web" linking to trap crawler bots and distribute internal PageRank 
 * powerfully across the massive programmatic SEO index. It pulls pseudo-random related tools.
 */
export default function SpiderWebLinks() {
  const [links, setLinks] = useState<PseoPage[]>([]);

  useEffect(() => {
    // Select 12 random pages from the massive data index on client-side to prevent hydration mismatch 
    // but ensure standard bots running JS get caught in the mesh.
    const shuffled = [...pseoData].sort(() => 0.5 - Math.random());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLinks(shuffled.slice(0, 12));
  }, []);

  if (links.length === 0) return null;

  return (
    <div className="mt-16 w-full max-w-4xl mx-auto opacity-90">
      <div className="border-t border-white/10 pt-8 pb-12">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6 text-center">
          Explore Related High-Performance Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {links.map((page, idx) => (
            <Link
              key={idx}
              href={`/tool/${page.slug}`}
              className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg bg-black/20 border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all duration-300 text-center line-clamp-1 flex items-center justify-center"
              title={page.title}
            >
              {page.h1.replace("Instantly ", "").replace("Easily ", "").slice(0, 35)}...
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
