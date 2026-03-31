import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import SearchableToolGrid from "@/components/SearchableToolGrid";

export const metadata: Metadata = {
  title: "CosmoxHub — 26+ Free Online Tools | AI, PDF, Image, Text & More",
  description: "All the tools you need in one place. AI Image Upscaler, BG Remover, PDF Merger, QR Generator, Image Converter. All free, 100% private, no signup.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Sleek Premium Hero */}
        <section className="pt-24 pb-20 md:pt-32 md:pb-28 text-center relative overflow-hidden flex flex-col items-center justify-center">
          {/* Subtle Glows */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] pointer-events-none bg-[radial-gradient(ellipse,rgba(239,68,68,0.05)_0%,transparent_60%)]" />

          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center max-w-5xl">
            {/* Minimalist Badge */}
            <div className="inline-flex items-center justify-center gap-2 mb-8 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-5 py-2.5 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              CosmoxHub V1.0 is Live
            </div>

            {/* Typography focused Header */}
            <h1 className="font-space font-extrabold text-[3.5rem] md:text-[5.5rem] text-slate-100 text-center leading-[1.05] mb-6 tracking-tight">
              All the tools you need,<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                in one single place.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
              26+ powerful online utilities for AI image reconstruction, PDF manipulation, and developer workflows. <span className="text-slate-200 font-medium">100% Free. No Signups. No Limits.</span>
            </p>

            {/* Glassmorphic Stats Bar (Server rendered) */}
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
                  <span className="text-indigo-300/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Secure & Private</span>
                </div>
            </div>
          </div>
        </section>

        {/* Ad Placement: Top Leaderboard */}
        <div className="container mx-auto px-4 mt-8">
          <AdBanner type="leaderboard" label="Top Trending Tools" />
        </div>

        {/* Searchable Grid Integration (Data moved inside) */}
        <SearchableToolGrid />

        <div className="container mx-auto px-4 pb-24">
          {/* Ad Placement: Middle Native Banner */}
          <div className="mt-20">
            <AdBanner type="native" label="Recommended for you" />
          </div>

          {/* Bottom Clean CTA */}
          <div className="mt-32 w-full relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-[#050510] border border-indigo-500/20 p-12 md:p-20 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-[0_0_40px_rgba(99,102,241,0.5)] transform -rotate-12">
                🚀
              </div>
              <h3 className="font-space text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                More tools coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">every week.</span>
              </h3>
              <p className="text-lg md:text-xl text-indigo-200/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Everything you need to grow your productivity. High-performance tools that don&apos;t compromise on privacy or speed.
              </p>
              <a href="mailto:eclipsonai@gmail.com" className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span className="relative z-10">Suggest a Tool Feature</span>
              </a>
              <a 
                href="https://omg10.com/4/10812796" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white bg-gradient-to-r from-indigo-500/20 to-violet-500/20 backdrop-blur-md border border-indigo-500/30 rounded-2xl hover:from-indigo-500/30 hover:to-violet-500/30 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 mt-4 md:mt-0 md:ml-4"
              >
                <span className="relative z-10">🔥 Explore Resources</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
