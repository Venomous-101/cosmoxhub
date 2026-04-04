"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import SearchableToolGrid from "@/components/SearchableToolGrid";

export default function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen">

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-28 text-center relative overflow-hidden flex flex-col items-center justify-center">

        {/* Subtle Glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] pointer-events-none bg-[radial-gradient(ellipse,rgba(239,68,68,0.05)_0%,transparent_60%)]" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center max-w-5xl">

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm md:text-base font-bold mb-8 backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            100% Free. No Email Required.
          </div>

          {/* H1 */}
          <h1 className="font-space font-extrabold text-[3.5rem] md:text-[5.5rem] text-slate-100 text-center leading-[1.05] mb-6 tracking-tight">
            All the tools you need,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              in one single place.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            26+ powerful online utilities for AI image reconstruction, PDF manipulation, and developer workflows.{" "}
            <span className="text-slate-200 font-medium">100% Free. No Signups. No Limits.</span>
          </p>

          {/* ── Search Bar — Hero Position (between subtitle & stats) ── */}
          <div className="w-full max-w-2xl mb-12 relative group">
            {/* Ambient glow ring */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-[20px] opacity-20 group-hover:opacity-50 group-focus-within:opacity-65 transition-all duration-700 pointer-events-none" />

            <div className="relative flex items-center bg-[#0d0d24]/90 border border-indigo-500/40 group-focus-within:border-indigo-400/80 rounded-2xl pl-5 pr-3 py-[15px] shadow-[0_8px_40px_-12px_rgba(99,102,241,0.4)] backdrop-blur-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/25">

              <Search className="text-indigo-400 shrink-0" size={22} strokeWidth={2.5} aria-hidden="true" />

              <input
                type="text"
                placeholder="Search any tool — PDF, Image, AI, Code…"
                className="w-full bg-transparent border-none outline-none px-4 text-slate-100 placeholder:text-slate-500 font-medium text-base md:text-lg focus:ring-0 appearance-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for tools"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-2 bg-slate-700/50 hover:bg-red-500/30 rounded-xl text-slate-400 hover:text-red-300 transition-all cursor-pointer shrink-0"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Helper hint below search bar */}
            <p className="text-center text-slate-600 text-xs mt-3 tracking-wide">
              Try &quot;PDF&quot;, &quot;Image&quot;, &quot;AI&quot;, or &quot;Generator&quot;
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl bg-[#0a0a1f]/80 backdrop-blur-xl border border-indigo-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
            <div className="flex flex-col items-center justify-center relative z-10 gap-1">
              <span className="text-4xl md:text-5xl font-space font-black text-white">26+</span>
              <span className="text-indigo-300/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Free Utilities</span>
            </div>
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-indigo-500/20 pt-6 md:pt-0 relative z-10 gap-1">
              <span className="text-4xl md:text-5xl font-space font-black text-white">Zero</span>
              <span className="text-indigo-300/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Signup Needed</span>
            </div>
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-indigo-500/20 pt-6 md:pt-0 relative z-10 gap-1">
              <span className="text-4xl md:text-5xl font-space font-black text-white">100%</span>
              <span className="text-indigo-300/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Secure &amp; Private</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Tool Grid (search state passed as props) ────────────────────────── */}
      <SearchableToolGrid searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ── Ads + Footer CTA ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-20">
          <AdBanner type="native" label="Recommended for you" />
        </div>
        <div className="mt-16 flex justify-center">
          <AdBanner type="leaderboard" label="Sponsored" />
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 w-full relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-[#050510] border border-indigo-500/20 p-12 md:p-20 text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-[0_0_40px_rgba(99,102,241,0.5)] transform -rotate-12">
              ⚡
            </div>
            <h3 className="font-space text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              More tools coming{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">every week.</span>
            </h3>
            <p className="text-lg md:text-xl text-indigo-200/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Everything you need to grow your productivity. High-performance tools that don&apos;t compromise on privacy or speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full mt-4">
              <a href="mailto:eclipsonai@gmail.com" className="w-full sm:w-auto group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span className="relative z-10">Suggest a Tool Feature</span>
              </a>
              <a
                href="https://omg10.com/4/10812796"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white bg-gradient-to-r from-indigo-500/20 to-violet-500/20 backdrop-blur-md border border-indigo-500/30 rounded-2xl hover:from-indigo-500/30 hover:to-violet-500/30 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="relative z-10">Explore Resources</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
