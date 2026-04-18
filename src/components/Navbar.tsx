"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "PDF Tools",   href: "/#pdf-tools" },
  { label: "Text Tools",  href: "/#text-tools" },
  { label: "Image Tools", href: "/#image-tools" },
  { label: "Utilities",   href: "/#utilities" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-[#050510]/95 backdrop-blur-[24px] border-b border-indigo-500/20 shadow-lg shadow-black/20"
          : "bg-[#050510]/80 backdrop-blur-[16px] border-b border-indigo-500/8"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
            <Zap size={18} color="white" className="stroke-[2.5]" />
            {/* Subtle pulse ring on logo hover */}
            <span className="absolute inset-0 rounded-lg bg-indigo-500/30 opacity-0 group-hover:opacity-100 group-hover:scale-[1.4] transition-all duration-500 pointer-events-none" />
          </div>
          <span className="font-space font-bold text-xl text-slate-100">
            Cosmox<span className="text-indigo-500">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-slate-400 no-underline text-sm font-medium transition-colors duration-200 hover:text-slate-100 group/link py-1"
            >
              {link.label}
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-indigo-500 to-violet-500 group-hover/link:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="badge badge-green flex items-center">
            <span className="relative flex h-1.5 w-1.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            All Tools Free
          </span>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close mobile menu" : "Open mobile menu"}
            className="md:hidden relative bg-transparent border-none text-slate-400 hover:text-slate-100 cursor-pointer p-1 transition-colors duration-200"
          >
            <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
              <X size={22} />
            </span>
            <span className={`flex items-center justify-center transition-all duration-200 ${menuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
              <Menu size={22} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu — slide down animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 border-t border-indigo-500/10 flex flex-col gap-1 bg-[#050510]/98 backdrop-blur-md shadow-xl">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 no-underline font-medium text-base hover:text-white hover:bg-white/5 py-3 px-3 rounded-xl border-b border-white/[0.04] transition-all duration-150"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
