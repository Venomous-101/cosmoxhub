import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { LucideIcon } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] text-[#f1f5f9]">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 max-w-4xl py-12">
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

          {/* Tool content */}
          <div className="bg-[#0f111a] border border-indigo-500/10 rounded-2xl shadow-xl overflow-hidden">
            {children}
          </div>

          {/* Privacy note */}
          <div className="mt-10 px-6 py-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Lock size={18} className="text-emerald-500" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed m-0">
              <strong className="text-slate-200 font-semibold">100% Private.</strong> All processing happens in your browser. No files are uploaded to any server. Your data never leaves your device.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
