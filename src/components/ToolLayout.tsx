"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Lock, Sparkles, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { LucideIcon } from "lucide-react";
import AdBanner from "./AdBanner";
import RelatedTools from "./RelatedTools";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  children: React.ReactNode;
}

const colorMap: Record<string, { iconBg: string, iconBorder: string }> = {
  "#ef4444": { iconBg: "bg-red-500/15", iconBorder: "border-red-500/30" },
  "#f59e0b": { iconBg: "bg-amber-500/15", iconBorder: "border-amber-500/30" },
  "#10b981": { iconBg: "bg-emerald-500/15", iconBorder: "border-emerald-500/30" },
  "#06b6d4": { iconBg: "bg-cyan-500/15", iconBorder: "border-cyan-500/30" },
  "#3b82f6": { iconBg: "bg-blue-500/15", iconBorder: "border-blue-500/30" },
  "#6366f1": { iconBg: "bg-indigo-500/15", iconBorder: "border-indigo-500/30" },
  "#8b5cf6": { iconBg: "bg-violet-500/15", iconBorder: "border-violet-500/30" },
  "#ec4899": { iconBg: "bg-pink-500/15", iconBorder: "border-pink-500/30" },
  "#0ea5e9": { iconBg: "bg-sky-500/15", iconBorder: "border-sky-500/30" },
  "default": { iconBg: "bg-indigo-500/15", iconBorder: "border-indigo-500/30" }
};

export default function ToolLayout({ title, description, icon: Icon, color = "#6366f1", children }: ToolLayoutProps) {
  const styles = colorMap[color] || colorMap["default"];
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] text-[#f1f5f9]">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 max-w-6xl py-12">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 no-underline text-sm font-medium mb-8 transition-colors duration-200 hover:text-slate-200"
          >
            <ArrowLeft size={16} /> Back to All Tools
          </Link>

          {/* Tool Header */}
          <div className="flex items-start gap-4 mb-10">
            <div 
              className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${styles.iconBg} ${styles.iconBorder}`}
            >
              <Icon size={28} color={color} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="font-space text-3xl font-bold text-slate-100 mb-1.5 tracking-tight">
                {title}
              </h1>
              <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>
          </div>
          
          <AdBanner type="native" label="Sponsored Tool" className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              {/* Tool content */}
              <div className="bg-[#0f111a] border border-indigo-500/10 rounded-2xl shadow-xl overflow-hidden">
                {children}
              </div>

              {/* Privacy note */}
              <div className="mt-8 px-6 py-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Lock size={18} className="text-emerald-500" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed m-0">
                  <strong className="text-slate-200 font-semibold">100% Private.</strong> All processing happens in your browser. No files are uploaded to any server. Your data never leaves your device.
                </p>
              </div>
            </div>

            {/* Sidebar for Desktop */}
            <aside className="lg:col-span-3 space-y-6">
               {/* Sustainability Note: Emotional Engagement */}
               <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={40} className="text-amber-500" />
                  </div>
                  <h4 className="font-space text-[11px] font-black uppercase tracking-[0.2em] text-amber-500 mb-3 flex items-center gap-2">
                    <AlertCircle size={14} /> Support Our Mission
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    "Sorry for any annoyance caused by ads. We run minimal ads only to cover server & AI costs, keeping these elite tools <span className="text-amber-500/80">100% free</span> for you forever."
                  </p>
               </div>

               {/* Monetized Sponsored CTA */}
               <a 
                 href="https://omg10.com/4/10812784"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="block bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-6 group hover:border-indigo-500/40 transition-all hover:-translate-y-0.5"
               >
                 <h4 className="font-space text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">
                   🔥 Trending Resources
                 </h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                   Discover premium tools and resources curated for creators and developers.
                 </p>
                 <span className="mt-3 inline-block text-[10px] font-black uppercase tracking-widest text-indigo-500 group-hover:text-indigo-400">
                   Explore Now →
                 </span>
               </a>

               <div className="bg-[#0f111a] border border-indigo-500/10 rounded-2xl p-6 sticky top-24">
                  <h3 className="font-space text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">
                    Quick Access
                  </h3>
                  <div className="space-y-4">
                    <RelatedTools currentPath={pathname} isSidebar={true} />
                  </div>
               </div>
               <AdBanner type="native" label="Hot Utility" className="rounded-2xl" />
            </aside>
          </div>

          <AdBanner type="leaderboard" label="Discover More Tools" className="mt-12" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
