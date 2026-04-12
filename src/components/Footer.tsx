import Link from "next/link";
import { Zap } from "lucide-react";
import { categories } from "@/lib/tools-data";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 pt-12 pb-8 px-4 bg-[#050510]/90">
      <div className="container mx-auto max-w-7xl">

        {/* Internal Linking Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-12 gap-y-16 mb-24">

          {/* Brand & Mission */}
          <div className="lg:col-span-2 lg:pr-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-md flex items-center justify-center">
                <Zap size={16} color="white" className="stroke-[2.5]" />
              </div>
              <span className="font-space font-bold text-xl text-slate-100">
                Cosmox<span className="text-indigo-500">Hub</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">
              28+ free online tools for image, PDF, AI and text processing. No signup. 100% private. Runs in your browser.
            </p>
          </div>

          {/* Dynamic Category Columns — full label, no stripping */}
          {categories.slice(0, 4).map((category) => (
            <div key={category.id}>
              <h4 className="text-slate-200 text-xs font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                {category.label}
              </h4>
              <ul className="space-y-3">
                {category.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-slate-500 text-sm transition-all duration-200 hover:text-indigo-400 hover:pl-1 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-2"></span>
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global Tools Explore Section (SEO Crawl Links) */}
        <div className="pt-16 border-t border-indigo-500/5 mb-20">
          <h4 className="text-slate-400 text-[11px] font-bold tracking-[0.3em] uppercase mb-10 text-center bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent py-3">
            Explore All 28 Free Online Tools
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-5 max-w-6xl mx-auto px-4">
            {categories[4].tools.concat(categories.slice(0, 4).flatMap(c => c.tools)).map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="text-slate-500 text-[13px] hover:text-indigo-400 transition-colors"
              >
                {tool.title}
              </Link>
            ))}
            <Link href="/about" className="text-slate-400 text-[13px] hover:text-white transition-colors underline decoration-indigo-500/30">About Us</Link>
            <Link href="/privacy" className="text-slate-400 text-[13px] hover:text-white transition-colors underline decoration-indigo-500/30">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 text-[13px] hover:text-white transition-colors underline decoration-indigo-500/30">Terms of Service</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-indigo-500/10 gap-6 opacity-60">
          <p className="text-slate-500 text-xs font-medium">
            © {new Date().getFullYear()} CosmoxHub. Secure. Private. Fast.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600 text-[10px] tracking-widest uppercase">No Cookies</span>
            <span className="text-slate-600 text-[10px] tracking-widest uppercase">No Tracking</span>
            <span className="text-slate-600 text-[10px] tracking-widest uppercase">No Cloud Storage</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
