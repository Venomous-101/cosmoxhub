"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import SearchableToolGrid from "@/components/SearchableToolGrid";

export default function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen">

      {/* ── Hero Section (MASSIVE BREATHING SPACE) ─────────────────────────── */}
      <section className="pt-36 pb-32 md:pt-48 md:pb-40 text-center relative flex flex-col items-center justify-center">

        {/* Subtle Glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none bg-[radial-gradient(ellipse,rgba(99,102,241,0.1)_0%,transparent_60%)]" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center max-w-5xl">

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#13132b] border border-indigo-500/30 text-indigo-200 text-sm md:text-base font-bold mb-14 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            100% Free. No Email Required.
          </div>

          {/* H1 */}
          <h1 className="font-space font-extrabold text-[4rem] md:text-[6.5rem] text-slate-100 text-center leading-[1.05] mb-12 tracking-tight">
            All the tools you need,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              in one single place.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 text-center max-w-3xl mx-auto mb-24 leading-relaxed font-light">
            26+ powerful online utilities for AI image reconstruction, PDF manipulation, and developer workflows.{" "}
            <span className="text-slate-200 font-semibold">100% Free. No Signups. No Limits.</span>
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl bg-[#0a0a1f] border border-slate-800 rounded-[2.5rem] p-12 mt-4 shadow-2xl">
            <div className="flex flex-col items-center justify-center gap-3">
              <span className="text-5xl md:text-6xl font-space font-black text-white">26+</span>
              <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.2em]">Free Utilities</span>
            </div>
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-10 md:pt-0 gap-3">
              <span className="text-5xl md:text-6xl font-space font-black text-white">Zero</span>
              <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.2em]">Signup Needed</span>
            </div>
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-10 md:pt-0 gap-3">
              <span className="text-5xl md:text-6xl font-space font-black text-white">100%</span>
              <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.2em]">Secure &amp; Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Completely Separate Search Section (NEW THEME) ────────────────── */}
      <section className="py-24 w-full bg-[#050510] border-y border-indigo-500/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-4 flex flex-col items-center">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-space font-black text-white mb-4 tracking-wide">Find Your Tool</h2>
            <p className="text-xl text-slate-500">Search instantly across all 26+ utilities.</p>
          </div>

          <div className="w-full max-w-4xl relative group">
            {/* The new Search Bar Theme - Clean, High Contrast, White on Dark */}
            <div className="relative flex items-center bg-white border-4 border-indigo-500/30 hover:border-indigo-500/60 focus-within:border-indigo-500 rounded-full pl-8 pr-4 py-4 md:py-6 shadow-[0_10px_50px_-10px_rgba(99,102,241,0.5)] transition-all duration-300">
              
              <Search className="text-indigo-600 shrink-0" size={32} strokeWidth={3} aria-hidden="true" />

              <input
                type="text"
                placeholder="Type 'PDF', 'Image', 'AI', or 'Code'..."
                className="w-full bg-transparent border-none outline-none px-6 text-slate-900 placeholder:text-slate-400 font-bold text-xl md:text-2xl focus:ring-0 appearance-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for tools"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-all cursor-pointer shrink-0"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={24} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── Huge GAP space before grid ── */}
      <div className="h-28"></div>

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
