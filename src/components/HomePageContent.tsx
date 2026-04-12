"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import SearchableToolGrid from "@/components/SearchableToolGrid";

export default function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen w-full">

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0A0A0A] text-center px-4 pt-14 pb-8">
        <div className="max-w-5xl mx-auto w-full">

          <p className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-5">
            100% Free. No Email Required.
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-center text-white mb-4 w-full">
            Free Online Tools —{' '}
            <span className="text-[#7C3AED]">PDF, Image, AI</span>
            <span className="text-white"> &amp; More</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto text-center leading-relaxed mb-8">
            26+ powerful browser-based utilities for PDF, image, AI &amp; text tasks.
            No signup. No limits. 100% private.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto w-full mb-8">
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

      {/* ── Stats Bar — own section, full width, separate from hero ─────── */}
      <div className="w-full border-y border-white/5 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-white/10">
          <div className="text-center px-4">
            <p className="text-4xl sm:text-5xl font-black text-white">28+</p>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1.5 font-medium">Free Utilities</p>
          </div>
          <div className="text-center px-4">
            <p className="text-4xl sm:text-5xl font-black text-white">Zero</p>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1.5 font-medium">Signup Needed</p>
          </div>
          <div className="text-center px-4">
            <p className="text-4xl sm:text-5xl font-black text-white">100%</p>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1.5 font-medium">Secure &amp; Private</p>
          </div>
        </div>
      </div>

      {/* ── Tool Grid ────────────────────────────────────────────────────── */}
      <SearchableToolGrid searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ── "More tools coming" CTA ──────────────────────────────────────── */}
      <section className="w-full border-t border-white/5 mt-16 pt-16 pb-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚡</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
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
              className="bg-[#7C3AED] hover:bg-violet-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200"
            >
              Suggest a Tool
            </a>
            <a
              href="#pdf-tools"
              className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 border border-white/10"
            >
              Explore All Tools ↑
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
