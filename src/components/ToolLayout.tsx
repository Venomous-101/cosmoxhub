"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedTools from "./RelatedTools";
import type { LucideIcon } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
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
  icon: Icon,
  color = "#6366f1",
  badge,
  children,
}: ToolLayoutProps) {
  const styles = colorMap[color] || colorMap["default"];
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] text-[#f1f5f9]">
      <Navbar />

      <main className="flex-grow">
        {/* ── Tool Header ─────────────────────────────────────────── */}
        <div className="border-b border-white/5 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="text-gray-500 hover:text-white text-sm flex items-center gap-2 mb-6 transition-colors w-fit"
            >
              ← Back to All Tools
            </Link>

            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 ${styles.iconBg} rounded-xl flex items-center justify-center shrink-0`}
              >
                <Icon size={22} className={styles.iconText} strokeWidth={1.8} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">{title}</h1>
                  {badge && (
                    <span className="text-xs font-semibold bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tool UI Area ─────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          {children}
        </div>

        {/* ── Privacy Badge ────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-6 border-t border-white/5">
          <p className="text-xs text-gray-600 text-center">
            🔒{" "}
            <span className="text-gray-500">100% private.</span> All processing
            happens in your browser. Your files are never uploaded to any server.
          </p>
        </div>

        {/* ── Related Tools ─────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-10 border-t border-white/5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Related Tools
          </h3>
          <RelatedTools currentPath={pathname} isSidebar={false} />
        </div>

        {/* Small support line - bottom of every tool page */}
        <div className="max-w-4xl mx-auto px-4 py-4 pb-12 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            CosmoxHub is free forever. If it helped you,{' '}
            <a href="https://www.buymeacoffee.com/cosmoxhub" target="_blank" rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 transition-colors">
              buy us a coffee ☕
            </a>
            {' '}— completely optional.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
