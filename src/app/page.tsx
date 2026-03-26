import type { Metadata } from "next";
import {
  FileStack, Scissors, ImagePlus, FileImage,
  Type, CaseSensitive, RemoveFormatting, AlignLeft,
  Image, FileDown, Maximize2,
  MessageSquare, QrCode, CalendarDays, KeyRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "CosmoxHub — 15+ Free Online Tools | PDF, Image, Text & More",
  description: "All the tools you need in one place. Merge PDF, convert images, count words, generate QR codes, calculate age, create passwords — all free, no signup.",
};

const categories = [
  {
    id: "pdf-tools",
    label: "📄 PDF Tools",
    description: "Process PDFs instantly in your browser. No upload required.",
    color: "#ef4444",
    tools: [
      { title: "Merge PDF", description: "Combine multiple PDF files into one document in seconds.", href: "/tools/merge-pdf", icon: FileStack, badge: "Popular" },
      { title: "Split PDF", description: "Extract specific pages from a PDF or split into multiple files.", href: "/tools/split-pdf", icon: Scissors },
      { title: "Image to PDF", description: "Convert JPG, PNG, or any image into a PDF document.", href: "/tools/image-to-pdf", icon: ImagePlus, badge: "Hot" },
      { title: "PDF to Image", description: "Export every page of a PDF as a high-quality image.", href: "/tools/pdf-to-image", icon: FileImage },
    ],
  },
  {
    id: "text-tools",
    label: "✍️ Text Tools",
    description: "Powerful text utilities for writers, students, and developers.",
    color: "#6366f1",
    tools: [
      { title: "Word Counter", description: "Count words, characters, sentences & reading time instantly.", href: "/tools/word-counter", icon: Type, badge: "Popular" },
      { title: "Case Converter", description: "Convert text to UPPERCASE, lowercase, Title Case and more.", href: "/tools/case-converter", icon: CaseSensitive },
      { title: "Whitespace Remover", description: "Remove extra spaces, tabs, and blank lines from any text.", href: "/tools/whitespace-remover", icon: RemoveFormatting },
      { title: "Lorem Ipsum Generator", description: "Generate dummy placeholder text for designs and prototypes.", href: "/tools/lorem-ipsum", icon: AlignLeft },
    ],
  },
  {
    id: "image-tools",
    label: "🖼️ Image Tools",
    description: "Convert and resize images without any quality loss.",
    color: "#10b981",
    tools: [
      { title: "PNG to JPG", description: "Convert PNG images to JPG format instantly in your browser.", href: "/tools/png-to-jpg", icon: Image, badge: "Fast" },
      { title: "JPG to PNG", description: "Convert JPG images to PNG (with transparency support).", href: "/tools/jpg-to-png", icon: FileDown },
      { title: "Image Resizer", description: "Resize images to any dimension while preserving quality.", href: "/tools/image-resizer", icon: Maximize2 },
    ],
  },
  {
    id: "utilities",
    label: "🛠️ Everyday Utilities",
    description: "Quick-access tools for daily tasks and productivity.",
    color: "#f59e0b",
    tools: [
      { title: "WhatsApp Link Generator", description: "Create a WhatsApp chat link without saving the number.", href: "/tools/whatsapp-link", icon: MessageSquare, badge: "Useful" },
      { title: "QR Code Generator", description: "Generate a QR code for any URL, text, WiFi or contact.", href: "/tools/qr-generator", icon: QrCode, badge: "Popular" },
      { title: "Age Calculator", description: "Calculate exact age in years, months, days and hours.", href: "/tools/age-calculator", icon: CalendarDays },
      { title: "Password Generator", description: "Generate strong, secure, random passwords instantly.", href: "/tools/password-generator", icon: KeyRound },
    ],
  },
];

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
              15+ powerful online utilities for PDF manipulation, text formatting, and image conversion. <span className="text-slate-200 font-medium">100% Free. No Signups. No Limits.</span>
            </p>

            {/* Clean CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
              <a href="#pdf-tools" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-1 text-lg">
                Start Using Tools
              </a>
            </div>

            {/* Glassmorphic Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl bg-[#0a0a1f]/80 backdrop-blur-xl border border-indigo-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
              
              <div className="flex flex-col items-center justify-center relative z-10">
                <span className="text-4xl md:text-5xl font-space font-black text-white mb-2">15+</span>
                <span className="text-indigo-300/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Free Utilities</span>
              </div>
              <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-indigo-500/20 pt-6 md:pt-0 relative z-10">
                <span className="text-4xl md:text-5xl font-space font-black text-white mb-2">Zero</span>
                <span className="text-indigo-300/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Signup Needed</span>
              </div>
              <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-indigo-500/20 pt-6 md:pt-0 relative z-10">
                <span className="text-4xl md:text-5xl font-space font-black text-white mb-2">100%</span>
                <span className="text-indigo-300/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Secure & Private</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placement: Top Leaderboard */}
        <div className="container mx-auto px-4 mt-8">
          <AdBanner type="leaderboard" label="Top Trending Tools" />
        </div>

        {/* Organized Tool Categories */}
        <div className="container mx-auto px-4 pb-24">
          <div className="max-w-7xl mx-auto flex flex-col gap-24">
            {categories.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                {/* Clean Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="font-space text-3xl font-bold text-slate-100 flex items-center gap-3">
                      {cat.label}
                    </h2>
                    <p className="text-slate-400 text-left mt-2 font-light">{cat.description}</p>
                  </div>
                </div>

                {/* Grid with improved gap and sizing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.title} {...tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>

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
                We're constantly expanding CosmoxHub based on your real-world needs. Can't find the tool you are looking for?
              </p>
              <a href="mailto:contact@cosmoxhub.com" className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span className="relative z-10">Suggest a Tool Feature</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
