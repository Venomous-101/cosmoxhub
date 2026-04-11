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
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 text-white">
          Free Online Tools —{' '}
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
      <div className="flex items-center justify-center gap-8 md:gap-16 py-6 border-y border-white/5 mb-16 px-4">
        {[
          { value: '28+', label: 'Free Utilities' },
          { value: 'Zero', label: 'Signup Needed' },
          { value: '100%', label: 'Secure & Private' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-4xl md:text-5xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tool Grid ────────────────────────────────────────────────────── */}
      <SearchableToolGrid searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Support Section — replaces all ads */}
      <section className="border-t border-b border-white/5 py-10 px-4 my-8">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-2xl mb-3">☕</p>
          <h3 className="text-white font-semibold text-base mb-2">
            CosmoxHub is 100% free — forever.
          </h3>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            No ads, no tracking, no paywalls. If these tools saved you time, 
            a coffee keeps us building more.
          </p>
          <a
            href="https://www.buymeacoffee.com/cosmoxhub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFDD00] hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            ☕ Buy me a coffee
          </a>
          <p className="text-gray-600 text-xs mt-3">
            Completely optional. Tools are free regardless.
          </p>
        </div>
      </section>

      {/* ── CHANGE 6: Clean Bottom CTA ───────────────────────────────────── */}
      <section className="text-center py-16 px-4 border-t border-white/5 mt-8">
        <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">⚡</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          More tools coming <span className="text-[#7C3AED]">every week.</span>
        </h2>
        <p className="text-gray-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
          High-performance browser tools that never compromise on 
          privacy or speed. Free for everyone, always.
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
            Explore All Tools &uarr;
          </a>
        </div>
      </section>

    </main>
  );
}
