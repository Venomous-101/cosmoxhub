"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import SearchableToolGrid from "@/components/SearchableToolGrid";

export default function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen">

      {/* ── CHANGE 2: Clean Hero Section ─────────────────────────────────── */}
      <section className="text-center py-20 px-4 pt-32">
        <p className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-4">
          100% Free. No Email Required.
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4">
          Free Online Tools —
          <br />
          <span className="text-[#7C3AED]">PDF, Image, AI</span>
          <span className="text-white"> &amp; More</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          26+ powerful browser-based utilities for PDF, image, AI &amp; text tasks.
          No signup. No limits. 100% private.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mx-auto relative">
          <div className="relative flex items-center bg-white border-2 border-[#7C3AED]/30 hover:border-[#7C3AED]/60 focus-within:border-[#7C3AED] rounded-2xl pl-5 pr-4 py-4 shadow-lg shadow-[#7C3AED]/10 transition-all duration-200">
            <Search className="text-[#7C3AED] shrink-0" size={22} strokeWidth={2.5} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search tools — PDF, Image, AI, Code..."
              className="w-full bg-transparent border-none outline-none px-4 text-slate-900 placeholder:text-slate-400 font-semibold text-base focus:ring-0 appearance-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for tools"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer shrink-0"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CHANGE 3: Premium Stats Bar ──────────────────────────────────── */}
      <div className="flex items-center justify-center gap-8 md:gap-12 py-6 border-y border-white/5 mb-16 px-4">
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-black text-white">26+</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Free Utilities</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-black text-white">Zero</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Signup Needed</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-black text-white">100%</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Secure &amp; Private</p>
        </div>
      </div>

      {/* ── Tool Grid ────────────────────────────────────────────────────── */}
      <SearchableToolGrid searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ── CHANGE 1: Single Bottom Ad (moved from between sections) ──────── */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <a
          href="https://www.profitablecpmratenetwork.com/ijdcjcbjbu?key=95dadbf472e8f7896aec68822c9bfeca"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-between gap-4 w-full px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all group"
        >
          <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
            <span className="text-gray-500 font-medium">Sponsored —</span>{" "}
            Discover premium tools and resources curated for creators &amp; developers.
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors shrink-0">
            Explore →
          </span>
        </a>
      </div>

      {/* ── CHANGE 6: Clean Bottom CTA ───────────────────────────────────── */}
      <section className="text-center py-20 px-4 border-t border-white/5 mt-8">
        <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚡</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          More tools coming <span className="text-[#7C3AED]">every week.</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          High-performance tools that don&apos;t compromise on privacy or speed.
          Built for professionals, free for everyone.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="mailto:eclipsonai@gmail.com"
            className="bg-[#7C3AED] hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Suggest a Tool
          </a>
          <a
            href="#pdf-tools"
            className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors border border-white/10"
          >
            Explore All Tools
          </a>
        </div>
      </section>

    </main>
  );
}
