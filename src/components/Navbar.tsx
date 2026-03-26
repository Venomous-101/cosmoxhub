"use client";
import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "PDF Tools", href: "/#pdf-tools" },
  { label: "Text Tools", href: "/#text-tools" },
  { label: "Image Tools", href: "/#image-tools" },
  { label: "Utilities", href: "/#utilities" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[100] bg-[#050510]/85 backdrop-blur-[20px] border-b border-indigo-500/10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Zap size={18} color="white" className="stroke-[2.5]" />
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
              className="text-slate-400 no-underline text-sm font-medium transition-colors duration-200 hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <span className="badge badge-green flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
            All Tools Free
          </span>
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close mobile menu" : "Open mobile menu"}
            className="md:hidden bg-transparent border-none text-slate-400 cursor-pointer p-1"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 border-t border-indigo-500/10 flex flex-col gap-4 bg-[#050510]/95 backdrop-blur-md absolute w-full shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 no-underline font-medium text-base hover:text-slate-100 py-2 border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
