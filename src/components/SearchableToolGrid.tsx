"use client";

import { Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import ToolCard from "./ToolCard";
import { categories } from "@/lib/tools-data";

interface SearchableToolGridProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function SearchableToolGrid({ searchQuery, setSearchQuery }: SearchableToolGridProps) {

  const handleSponsoredClick = (e: React.MouseEvent<HTMLAnchorElement>, realLink: string, adLink: string) => {
    e.preventDefault();
    window.open(realLink, '_blank', 'noopener,noreferrer');
    window.location.href = adLink;
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 pb-32 min-h-[40vh]">

        {/* Compact Sponsored Pills */}
        {!searchQuery && (
          <div className="max-w-7xl mx-auto mb-32 flex flex-col md:flex-row gap-8">
            <a
              href="https://skillsmp.com"
              onClick={(e) => handleSponsoredClick(e, "https://skillsmp.com", "https://www.profitablecpmratenetwork.com/h43kkn7u?key=88c277e1a33e196352cd3357f6403fe4")}
              className="group flex items-center gap-4 flex-1 px-5 py-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-indigo-500/14 transition-all duration-250 cursor-pointer"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 group-hover:bg-indigo-500/30 transition-all">
                <Sparkles size={18} />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500/70 mb-0.5">Premium Resource</span>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white truncate transition-colors">AI Agent Skills Marketplace</span>
              </div>
              <ExternalLink size={14} className="text-indigo-500/50 group-hover:text-indigo-400 ml-auto shrink-0 transition-colors" />
            </a>

            <a
              href="https://anthropic.skilljar.com"
              onClick={(e) => handleSponsoredClick(e, "https://anthropic.skilljar.com", "https://omg10.com/4/10819596")}
              className="group flex items-center gap-4 flex-1 px-5 py-4 rounded-xl bg-rose-500/8 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/14 transition-all duration-250 cursor-pointer"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 group-hover:bg-rose-500/30 transition-all">
                <ShieldCheck size={18} />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-500/70 mb-0.5">Official Certification</span>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white truncate transition-colors">Claude Free Certification Courses</span>
              </div>
              <ExternalLink size={14} className="text-rose-500/50 group-hover:text-rose-400 ml-auto shrink-0 transition-colors" />
            </a>
          </div>
        )}

        {/* Tool Categories */}
        {filteredCategories.length > 0 ? (
          <div className="max-w-7xl mx-auto flex flex-col gap-32">
            {filteredCategories.map((cat, index) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/5">
                  <div>
                    <h2 className="font-space text-3xl font-bold text-slate-100 flex items-center gap-3">
                      {cat.label}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Powerful utilities designed for speed and privacy.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.title} {...tool} />
                  ))}
                </div>

                {index === 1 && (
                  <a
                    href="https://www.profitablecpmratenetwork.com/ijdcjcbjbu?key=95dadbf472e8f7896aec68822c9bfeca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-14 flex items-center justify-between bg-gradient-to-r from-indigo-500/8 via-purple-500/8 to-pink-500/8 border border-indigo-500/15 rounded-2xl px-8 py-5 group hover:border-indigo-500/35 transition-all hover:-translate-y-0.5"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 block mb-1">Sponsored Picks</span>
                      <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">Discover premium tools and resources curated for creators</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 whitespace-nowrap ml-4">Explore →</span>
                  </a>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-6" aria-hidden="true">🔍</div>
            <h3 className="text-2xl font-space font-bold text-white mb-2">No tools found for &quot;{searchQuery}&quot;</h3>
            <p className="text-slate-500">Try searching for something else like &quot;AI&quot; or &quot;PDF&quot;.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 text-indigo-400 hover:text-indigo-300 font-bold underline"
            >
              Show all tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
