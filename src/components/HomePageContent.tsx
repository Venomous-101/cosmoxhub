"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles } from "lucide-react";
import SearchableToolGrid from "@/components/SearchableToolGrid";

// Animated counter hook
function useCountUp(target: number, duration = 1200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

export default function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Trigger counter when stats bar scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const tools = useCountUp(28, 1400, statsVisible);

  return (
    <main className="min-h-screen w-full">

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="w-full px-4 pt-16 pb-14 relative overflow-hidden">

        {/* Ambient floating orbs */}
        <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-[#7C3AED]/6 blur-3xl pointer-events-none animate-float [animation-delay:0s]" />
        <div className="absolute top-10 right-1/5 w-48 h-48 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none animate-float [animation-delay:1.5s]" />

        <div className="flex flex-col items-center w-full relative z-10">

          {/* Badge pill */}
          <div className="animate-fade-down delay-75 relative inline-flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/25 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A78BFA]"></span>
            </span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#A78BFA] uppercase">
              28+ Tools · 100% Free · No Signup
            </span>
            <Sparkles size={12} className="text-[#A78BFA]" />
          </div>

          {/* H1 — staggered word animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-white text-center">
            <span className="inline-block animate-fade-up delay-100">Free Online Tools</span>
            {' '}
            <span className="inline-block animate-fade-up delay-200">—</span>
            {' '}
            <span className="whitespace-nowrap inline-block animate-fade-up delay-300">
              <span className="text-[#7C3AED]">PDF, Image, AI</span>
              <span className="text-white"> &amp; More</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-400 text-gray-400 text-base sm:text-lg max-w-lg text-center leading-relaxed mt-2 mb-10">
            28+ powerful browser-based utilities for PDF, image, AI &amp; text tasks.
            No signup. No limits. <span className="text-[#A78BFA] font-semibold">100% private.</span>
          </p>

          {/* Search Bar — dark glassmorphism */}
          <div className="animate-fade-up delay-500 relative w-full max-w-xl mb-12">
            <div className="relative flex items-center bg-[#0d0d24]/80 backdrop-blur-sm border-2 border-[#7C3AED]/25 hover:border-[#7C3AED]/50 focus-within:border-[#7C3AED] rounded-2xl pl-5 pr-4 py-4 shadow-lg shadow-[#7C3AED]/10 transition-all duration-300 group">
              {/* Glow on focus */}
              <div className="absolute inset-0 rounded-2xl bg-[#7C3AED]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <Search className="text-[#7C3AED] shrink-0 relative z-10" size={22} strokeWidth={2.5} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search tools — PDF, Image, AI, Code..."
                className="w-full bg-transparent border-none outline-none px-4 text-slate-100 placeholder:text-slate-500 font-semibold text-base focus:ring-0 appearance-none relative z-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for tools"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-slate-100 transition-all cursor-pointer shrink-0 relative z-10"
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

      {/* ── Stats Bar — animated counters ───────────────────────────────── */}
      <div
        ref={statsRef}
        className="w-full grid grid-cols-3 py-10 border-y border-white/5 mb-16"
      >
        <div className="text-center px-4 border-r border-white/10">
          <p className={`text-4xl sm:text-5xl font-black text-white transition-all duration-300 ${statsVisible ? 'animate-fade-up' : 'opacity-0'}`}>
            {statsVisible ? `${tools}+` : '0+'}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">
            Free Utilities
          </p>
        </div>
        <div className="text-center px-4 border-r border-white/10">
          <p className={`text-4xl sm:text-5xl font-black text-white ${statsVisible ? 'animate-fade-up delay-150' : 'opacity-0'}`}>
            Zero
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">
            Signup Needed
          </p>
        </div>
        <div className="text-center px-4">
          <p className={`text-4xl sm:text-5xl font-black text-white ${statsVisible ? 'animate-fade-up delay-300' : 'opacity-0'}`}>
            100%
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">
            Secure &amp; Private
          </p>
        </div>
      </div>

      {/* ── Tool Grid ────────────────────────────────────────────────────── */}
      <SearchableToolGrid searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ── CTA Section ─────────────────────────────────────────────────── */}
      <section className="w-full py-24 px-4 border-t border-white/5 mt-16">
        <div className="flex flex-col items-center w-full">
          <div className="animate-float w-14 h-14 bg-[#7C3AED]/15 border border-[#7C3AED]/25 rounded-2xl flex items-center justify-center mb-5 relative">
            <span className="text-2xl">⚡</span>
            <span className="absolute inset-0 rounded-2xl border border-[#7C3AED]/40 animate-ping opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 text-center">
            More tools coming{' '}
            <span className="text-[#7C3AED]">every week.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm text-center">
            High-performance browser tools that never compromise on privacy or speed.
            Free for everyone, always.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="mailto:eclipsonai@gmail.com"
              className="bg-[#7C3AED] hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7C3AED]/30"
            >
              Suggest a Tool
            </a>
            <a
              href="#pdf-tools"
              className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 border border-white/10 hover:border-white/20 hover:-translate-y-0.5"
            >
              Explore All Tools ↑
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
