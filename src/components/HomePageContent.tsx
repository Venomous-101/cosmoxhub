"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles, Clock, ArrowRight, Shield, Zap } from "lucide-react";
import SearchableToolGrid from "@/components/SearchableToolGrid";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";
import OSINTHeroCard from "./OSINTHeroCard";

// Animated counter hook
function useCountUp(target: number, duration = 1200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function getPostMeta(slug: string, title: string) {
  const t = title.toLowerCase() + slug.toLowerCase();
  if (t.includes('pdf') || t.includes('compress') || t.includes('merge') || t.includes('split') || t.includes('unlock') || t.includes('print') || t.includes('bypass')) {
    return { cover: '/blog-covers/pdf.png', category: 'PDF Tools', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  }
  if (t.includes('image') || t.includes('photo') || t.includes('png') || t.includes('jpg') || t.includes('webp') || t.includes('heic') || t.includes('upscale') || t.includes('resize') || t.includes('remove.bg') || t.includes('background') || t.includes('thumbnail') || t.includes('midjourney')) {
    return { cover: '/blog-covers/image.png', category: 'Image Tools', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
  }
  if (t.includes('password') || t.includes('security') || t.includes('safe') || t.includes('privacy') || t.includes('secure') || t.includes('hack') || t.includes('encrypt')) {
    return { cover: '/blog-covers/security.png', category: 'Security', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  }
  if (t.includes('api') || t.includes('cors') || t.includes('webhook') || t.includes('postman') || t.includes('json') || t.includes('regex') || t.includes('zapier') || t.includes('make') || t.includes('developer')) {
    return { cover: '/blog-covers/developer.png', category: 'Developer', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
  }
  return { cover: '/blog-covers/text.png', category: 'Productivity', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
}

const latestPosts = [...blogPosts].reverse().slice(0, 3);

export default function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const toolsCount = useCountUp(35, 1400, statsVisible);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#050510]">

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="w-full pt-12 pb-10 relative">
        {/* Glow ambient background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
          
          {/* Badge */}
          <div className="animate-fade-down delay-75 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1.5 mb-6 shadow-sm shadow-indigo-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
            </span>
            <span className="text-xs font-bold tracking-widest text-indigo-300 uppercase">
              35+ Verified Tools · 100% Client-Side · No Signup
            </span>
            <Sparkles size={14} className="text-indigo-400" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] tracking-tight mb-6 text-white max-w-4xl">
            <span className="inline-block animate-fade-up delay-100">Free Online Tools for</span>
            {" "}
            <span className="whitespace-nowrap inline-block animate-fade-up delay-200">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                PDF, Image &amp; AI
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-300 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
            35+ high-performance browser-based utilities for developers, creators, and professionals.
            Zero server uploads. No signup. <span className="text-indigo-300 font-semibold">100% Private.</span>
          </p>

          {/* Search Bar */}
          <div className="animate-fade-up delay-400 w-full max-w-2xl mb-10">
            <div className="relative flex items-center bg-slate-900/90 backdrop-blur-md border-2 border-indigo-500/30 hover:border-indigo-500/60 focus-within:border-indigo-500 rounded-2xl px-5 py-4 shadow-xl shadow-indigo-500/10 transition-all duration-300">
              <Search className="text-indigo-400 shrink-0" size={22} strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search 35+ tools — PDF, Image, AI, JSON, Regex..."
                className="w-full bg-transparent border-none outline-none px-4 text-slate-100 placeholder:text-slate-500 font-medium text-base appearance-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for online tools"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                  aria-label="Clear search"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              ) : (
                <span className="hidden sm:inline-flex text-[11px] font-mono font-bold text-slate-500 bg-slate-800/80 border border-slate-700/50 px-2 py-1 rounded-md shrink-0">
                  ⌘K
                </span>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── Stats Counter Bar ─────────────────────────────────────────── */}
      <section ref={statsRef} className="w-full border-y border-white/5 bg-slate-950/40 py-8 my-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-space">
                {statsVisible ? `${toolsCount}+` : '35+'}
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Verified Free Tools</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 font-space">0 Login</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Instant Browser Execution</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-400 font-space">100%</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Client-Side Privacy</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Searchable Tool Grid ──────────────────────────────────────── */}
      <section className="w-full my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchableToolGrid searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </section>

      {/* ── OSINT Dashboard Section ───────────────────────────────────── */}
      <section className="w-full my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#00ff88] uppercase mb-1">
                <Shield size={14} />
                Restricted Access Intelligence
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                OSINT &amp; Reconnaissance Suite
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              LIVE API ENGINE
            </span>
          </div>

          <div className="w-full">
            <OSINTHeroCard />
          </div>
        </div>
      </section>

      {/* ── Blog Preview Section ──────────────────────────────────────── */}
      <section className="w-full my-16 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 uppercase mb-1">
                <Zap size={14} />
                Tutorials &amp; Guides
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Latest Articles</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 px-5 py-2.5 rounded-xl transition-all hover:bg-indigo-500/10"
            >
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => {
              const meta = getPostMeta(post.slug, post.title);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={meta.cover}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md ${meta.bg} ${meta.color} ${meta.border}`}>
                      {meta.category}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">{post.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readingTime}</span>
                      <span className={`flex items-center gap-1 font-bold ${meta.color} group-hover:gap-2 transition-all`}>
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner Section ────────────────────────────────────────── */}
      <section className="w-full my-16 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 bg-indigo-500/15 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-5 text-2xl shadow-lg shadow-indigo-500/10">
              ⚡
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Need a custom tool for your workflow?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              We update CosmoxHub regularly with high-performance browser utilities. Suggest a tool or report feedback directly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="mailto:eclipsonai@gmail.com"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Request a Tool
              </a>
              <a
                href="#pdf-tools"
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-7 py-3 rounded-xl text-sm border border-slate-800 hover:border-slate-700 transition-all"
              >
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
