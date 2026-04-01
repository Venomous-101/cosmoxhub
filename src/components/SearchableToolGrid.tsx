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
      {/* Search Bar Section - Isolated completely from Hero */}
      <div className="flex flex-col items-center mt-24 pt-16 mb-16 px-4 relative z-20 w-full border-t border-indigo-500/10">
         <div className="w-full max-w-3xl relative group">
           {/* Huge glow behind the input */}
           <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[25px] opacity-30 group-hover:opacity-75 transition-all duration-700 pointer-events-none"></div>

           <div className="relative flex items-center bg-[#0a0a20]/60 hover:bg-[#0a0a20]/80 backdrop-blur-3xl border-2 border-indigo-500/40 group-focus-within:border-indigo-400 group-hover:border-indigo-400/60 group-focus-within:bg-[#0a0a20]/90 rounded-full pl-6 pr-3 py-3 shadow-[0_8px_40px_-12px_rgba(99,102,241,0.5)] transition-all overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20">
             {/* Large clean icon */}
             <Search className="text-indigo-400 shrink-0 ml-2" size={28} strokeWidth={2.5} aria-hidden="true" />
             
             {/* Huge input field */}
             <input 
               type="text"
               placeholder="Search for any tool (e.g. PDF, Editor, Code)..."
               className="w-full bg-transparent border-none outline-none px-6 text-white placeholder:text-slate-400/80 font-bold text-lg md:text-xl min-h-[50px] focus:ring-0 appearance-none"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               aria-label="Search for tools"
             />

             {/* Clear button */}
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery("")}
                 className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-300 hover:text-white transition-all cursor-pointer border border-red-500/30 shrink-0 shadow-lg"
                 title="Clear search"
                 aria-label="Clear search"
               >
                 <X size={24} strokeWidth={3} />
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
