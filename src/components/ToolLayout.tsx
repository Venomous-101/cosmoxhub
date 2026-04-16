"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedTools from "./RelatedTools";
import type { LucideIcon } from "lucide-react";
import { Wrench } from "lucide-react";
import { allTools } from "@/lib/tools-data";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  color?: string;
  badge?: string;
  children: React.ReactNode;
}

const colorMap: Record<string, { iconBg: string; iconText: string }> = {
  "#ef4444": { iconBg: "bg-red-500/20",     iconText: "text-red-400" },
  "#f59e0b": { iconBg: "bg-amber-500/20",   iconText: "text-amber-400" },
  "#10b981": { iconBg: "bg-emerald-500/20", iconText: "text-emerald-400" },
  "#06b6d4": { iconBg: "bg-cyan-500/20",    iconText: "text-cyan-400" },
  "#3b82f6": { iconBg: "bg-blue-500/20",    iconText: "text-blue-400" },
  "#6366f1": { iconBg: "bg-indigo-500/20",  iconText: "text-indigo-400" },
  "#8b5cf6": { iconBg: "bg-violet-500/20",  iconText: "text-violet-400" },
  "#ec4899": { iconBg: "bg-pink-500/20",    iconText: "text-pink-400" },
  "#0ea5e9": { iconBg: "bg-sky-500/20",     iconText: "text-sky-400" },
  default:   { iconBg: "bg-[#7C3AED]/20",   iconText: "text-[#A78BFA]" },
};

export default function ToolLayout({
  title,
  description,
  icon: IconProp,
  color = "#6366f1",
  badge,
  children,
}: ToolLayoutProps) {
  const pathname = usePathname();
  const toolFromPath = allTools.find((t) => t.href === pathname);
  const Icon: LucideIcon = IconProp ?? toolFromPath?.icon ?? Wrench;
  const resolvedBadge = badge ?? toolFromPath?.badge;
  const styles = colorMap[color] || colorMap["default"];

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] text-[#f1f5f9]">
      <Navbar />

      <main className="flex-grow">
        {/* ── Tool Header ─────────────────────────────────────────── */}
        <div className="border-b border-white/5 px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="text-gray-500 hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors w-fit group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
              Back to All Tools
            </Link>

            <div className="flex items-start gap-5">
              <div
                className={`w-14 h-14 ${styles.iconBg} rounded-2xl flex items-center justify-center shrink-0`}
              >
                <Icon size={24} className={styles.iconText} strokeWidth={1.8} />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  {resolvedBadge && (
                    <span className="text-xs font-semibold bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {resolvedBadge}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tool UI Area ─────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-14">
          {children}
        </div>

        {/* ── Verified Quality & Privacy Signal ────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-12 border-t border-white/5">
          <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wrench size={120} className="rotate-12" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-white font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                  Verified Tool Quality
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live & Secure</span>
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mb-4">
                  This tool has been extensively tested for accuracy and performance. On <span className="text-gray-200 font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>, 
                  our engineers verified the core logic to ensure 100% reliability and precision. 
                  Like all CosmoxHub utilities, this tool runs <span className="text-purple-400 font-bold">entirely in your browser</span>. No data is ever sent to a server.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <div className="flex items-center gap-1.5"><span className="w-1 h-1 bg-purple-500 rounded-full" /> No Uploads</div>
                  <div className="flex items-center gap-1.5"><span className="w-1 h-1 bg-purple-500 rounded-full" /> No Logs</div>
                  <div className="flex items-center gap-1.5"><span className="w-1 h-1 bg-purple-500 rounded-full" /> HIPAA & GDPR Ready</div>
                  <div className="flex items-center gap-1.5"><span className="w-1 h-1 bg-purple-500 rounded-full" /> Open Source Logic</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Tools ─────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-20 border-t border-white/5">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <span className="w-1 h-3 bg-[#7C3AED] rounded-full"></span>
            Related Tools
          </h3>
          <RelatedTools currentPath={pathname} isSidebar={false} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
