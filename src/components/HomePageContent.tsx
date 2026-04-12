"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import SearchableToolGrid from "@/components/SearchableToolGrid";

export default function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen w-full">

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="w-full px-4 pt-16 pb-14">
        <div className="flex flex-col items-center w-full">

          <p className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-5">
            100% Free. No Email Required.
          </p>

          {/* BUG 5 FIX: whitespace-nowrap prevents "More" orphaning on any screen */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-white text-center">
            Free Online Tools —{' '}
            <span className="whitespace-nowrap">
              <span className="text-[#7C3AED]">PDF, Image, AI</span>
              <span className="text-white"> &amp; More</span>
            </span>
          </h1>

          {/* Subtitle — centered with breathing room */}
          <p className="text-gray-400 text-base sm:text-lg max-w-lg text-center leading-relaxed mt-2 mb-10">
            26+ powerful browser-based utilities for PDF, image, AI &amp; text tasks.
            No signup. No limits. 100% private.
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-xl mb-12">
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

        </div>
      </section>

      {/* ── BUG 1 FIX: Stats Bar — true full-width grid, no inner max-w wrapper ── */}
      <div className="w-full grid grid-cols-3 py-10 border-y border-white/5 mb-16">
        <div className="text-center px-4 border-r border-white/10">
          <p className="text-4xl sm:text-5xl font-black text-white">28+</p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">
            Free Utilities
          </p>
        </div>
        <div className="text-center px-4 border-r border-white/10">
          <p className="text-4xl sm:text-5xl font-black text-white">Zero</p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">
            Signup Needed
          </p>
        </div>
        <div className="text-center px-4">
          <p className="text-4xl sm:text-5xl font-black text-white">100%</p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">
            Secure &amp; Private
          </p>
        </div>
      </div>

      {/* ── Tool Grid ────────────────────────────────────────────────────── */}
      <SearchableToolGrid searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ── BUG 3 FIX: CTA section — Footer is outside this in page.tsx ─── */}
      <section className="w-full text-center py-20 px-4 border-t border-white/5 mt-8">
        <div className="max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">⚡</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            More tools coming{' '}
            <span className="text-[#7C3AED]">every week.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            High-performance browser tools that never compromise on privacy or speed.
            Free for everyone, always.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="mailto:eclipsonai@gmail.com"
              className="bg-[#7C3AED] hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200"
            >
              Suggest a Tool
            </a>
            <a
              href="#pdf-tools"
              className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 border border-white/10"
            >
              Explore All Tools ↑
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
