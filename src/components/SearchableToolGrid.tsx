"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import ToolCard from "./ToolCard";
import { categories } from "@/lib/tools-data";

export default function SearchableToolGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="w-full">
      {/* Search Bar Section */}
      <div className="flex flex-col items-center mb-16 px-4">
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 rounded-full"></div>
          <div className="relative flex items-center bg-[#0a0a1f]/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-2 pl-6 shadow-2xl overflow-hidden group-focus-within:border-indigo-400 transition-all">
            <Search className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={22} aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search for a tool (e.g. PDF, AI, Code)..."
              className="w-full bg-transparent border-none outline-none px-4 py-3 text-slate-100 placeholder:text-slate-600 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for tools"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all mr-2"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="container mx-auto px-4 pb-24 min-h-[40vh]">
        {filteredCategories.length > 0 ? (
          <div className="max-w-7xl mx-auto flex flex-col gap-24">
            {filteredCategories.map((cat, index) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="font-space text-3xl font-bold text-slate-100 flex items-center gap-3">
                      {cat.label}
                    </h2>
                    <p className="text-slate-500 text-sm">Powerful utilities designed for speed and privacy.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.title} {...tool} />
                  ))}
                </div>

                {/* Smartlink CTA — appears after 2nd category */}
                {index === 1 && (
                  <a
                    href="https://www.profitablecpmratenetwork.com/ijdcjcbjbu?key=95dadbf472e8f7896aec68822c9bfeca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-12 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl px-8 py-5 group hover:border-indigo-500/40 transition-all hover:-translate-y-0.5"
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
          <div className="text-center py-20">
            <div className="text-6xl mb-6" aria-hidden="true">🔍</div>
            <h3 className="text-2xl font-space font-bold text-white mb-2">No tools found for &quot;{searchQuery}&quot;</h3>
            <p className="text-slate-500">Try searching for something else like &quot;AI&quot; or &quot;Elite&quot;.</p>
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
