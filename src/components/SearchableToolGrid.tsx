"use client";

import ToolCard from "./ToolCard";
import { categories } from "@/lib/tools-data";

interface SearchableToolGridProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function SearchableToolGrid({ searchQuery, setSearchQuery }: SearchableToolGridProps) {

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="w-full">
      {filteredCategories.length > 0 ? (
        <div className="flex flex-col gap-16">
          {filteredCategories.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-bold text-white font-space flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.label}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">{cat.description}</p>
                </div>
                <span className="text-xs font-mono text-slate-500 font-semibold bg-white/[0.03] border border-white/5 px-3 py-1 rounded-full w-fit">
                  {cat.tools.length} Tools Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cat.tools.map((tool, i) => (
                  <ToolCard key={tool.title} {...tool} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-3xl p-8 max-w-xl mx-auto">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No tools found for &quot;{searchQuery}&quot;</h3>
          <p className="text-slate-400 text-sm">Try searching for keywords like &quot;PDF&quot;, &quot;AI&quot;, or &quot;Image&quot;.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-6 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 border border-indigo-500/30 px-5 py-2.5 rounded-xl transition-all"
          >
            Clear Search &amp; Show All Tools
          </button>
        </div>
      )}
    </div>
  );
}
