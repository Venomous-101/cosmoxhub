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
      <div className="container mx-auto px-4 pb-16 min-h-[40vh]">

        {/* CHANGE 1: No ads between categories — clean browsing only */}
        {filteredCategories.length > 0 ? (
          <div className="max-w-7xl mx-auto flex flex-col gap-20">
            {filteredCategories.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                {/* CHANGE 5: Fixed category names from tools-data labels */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-white/5">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {cat.label}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
                  </div>
                </div>

                {/* CHANGE 4: Cards with hover glow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.title} {...tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-6" aria-hidden="true">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No tools found for &quot;{searchQuery}&quot;</h3>
            <p className="text-gray-500">Try searching for something else like &quot;AI&quot; or &quot;PDF&quot;.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 text-[#A78BFA] hover:text-violet-300 font-bold underline"
            >
              Show all tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
