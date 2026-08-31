import Link from "next/link";
import { Zap } from "lucide-react";
import { categories } from "@/lib/tools-data";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 pt-16 pb-10 px-4 bg-[#050510]">
      <div className="container mx-auto max-w-7xl">

        {/* Brand & Category Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-12 gap-y-12 mb-16">

          {/* Brand & Mission */}
          <div className="lg:col-span-2 lg:pr-8">
            <Link href="/" className="flex items-center gap-2 mb-4 no-underline group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Zap size={16} color="white" className="stroke-[2.5]" />
              </div>
              <span className="font-space font-bold text-xl text-slate-100">
                Cosmox<span className="text-indigo-500">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              35+ enterprise-grade, browser-based online tools for PDF, image, developer, and text automation.
              100% Client-side privacy. Zero server uploads.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Tools 100% Free Forever
            </div>
          </div>

          {/* Category Columns */}
          {categories.slice(0, 4).map((category) => (
            <div key={category.id}>
              <h4 className="text-slate-200 text-xs font-bold tracking-[0.2em] uppercase mb-5 flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full" />
                {category.label}
              </h4>
              <ul className="space-y-2.5">
                {category.tools.slice(0, 6).map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-slate-400 text-xs hover:text-white transition-all duration-200 hover:pl-1 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-1.5" />
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal & Footer Links */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} CosmoxHub. Secure. Client-Side. Fast.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
