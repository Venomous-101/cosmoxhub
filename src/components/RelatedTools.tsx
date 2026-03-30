"use client";

import Link from "next/link";
import { categories, Tool } from "@/lib/tools-data";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface RelatedToolsProps {
  currentPath: string;
  isSidebar?: boolean;
}

export default function RelatedTools({ currentPath, isSidebar = false }: RelatedToolsProps) {
  // 1. Find the current category
  const currentCategory = categories.find(cat => 
    cat.tools.some(tool => tool.href === currentPath)
  );

  // 2. Get tools from the same category (excluding current)
  let suggestedTools: Tool[] = [];
  
  if (currentCategory) {
    suggestedTools = currentCategory.tools.filter(tool => tool.href !== currentPath);
  }

  // 3. If category has fewer than 4 tools, add tools from other categories (STABLE selection)
  if (suggestedTools.length < 4) {
    const otherTools = categories
      .filter(cat => cat.id !== currentCategory?.id)
      .flatMap(cat => cat.tools)
      // Pick based on pathname to ensure stability for SEO/Hydration
      .slice(0, 8); // Grab a pool
    
    // Fill until we have 4
    for (const tool of otherTools) {
      if (suggestedTools.length >= 4) break;
      if (tool.href !== currentPath && !suggestedTools.find(t => t.href === tool.href)) {
        suggestedTools.push(tool);
      }
    }
  }

  // 4. Limit to 4 tools
  const finalTools = suggestedTools.slice(0, 4);

  if (isSidebar) {
    return (
      <div className="space-y-3">
        {finalTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <tool.icon size={16} className="text-indigo-400" />
            </div>
            <div className="min-w-0">
               <h4 className="text-[11px] font-bold text-slate-200 truncate group-hover:text-white transition-colors">
                 {tool.title}
               </h4>
               <p className="text-[10px] text-slate-500 truncate lowercase">
                 {tool.description}
               </p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <section className="mt-20 pt-16 border-t border-white/5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-space text-2xl font-bold text-white tracking-tight">
            You Might Also Need…
          </h2>
          <p className="text-slate-500 text-sm mt-1">Explore more elite utilities for your workflow.</p>
        </div>
        <Link 
          href="/"
          className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
        >
          View All Tools <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {finalTools.map((tool, idx) => (
          <motion.div
            key={tool.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={tool.href}
              className="group block p-5 rounded-2xl bg-[#0a0a1f]/50 border border-white/5 hover:border-indigo-500/20 hover:bg-[#0a0a1f] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <tool.icon size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-space font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
