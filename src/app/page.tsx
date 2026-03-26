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

          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center max-w-4xl">
            {/* Minimalist Badge */}
            <div className="inline-flex items-center justify-center gap-2 mb-8 bg-[#050510] border border-indigo-500/20 text-indigo-400 px-5 py-2 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              100% Free Utilities • No Signup Required
            </div>

            {/* Typography focused Header */}
            <h1 className="font-space font-bold text-5xl md:text-7xl text-slate-100 text-center leading-[1.1] mb-6 tracking-tight">
              The ultimate toolkit, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                all in one place.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 text-center max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              CosmoxHub provides 15+ powerful, completely free online tools for PDF manipulation, text formatting, image conversion, and productivity. Processed securely in your browser.
            </p>

            {/* Clean CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#pdf-tools" className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">
                Explore Tools
              </a>
              <a href="#utilities" className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl font-medium transition-all hover:text-white">
                View Utilities
              </a>
            </div>
          </div>
        </section>

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

          {/* Bottom Clean CTA */}
          <div className="mt-24 max-w-4xl mx-auto flex flex-col items-center text-center p-12 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl">
            <h3 className="font-space text-2xl md:text-3xl font-bold text-slate-100 mb-4">
              More tools coming every week 🚀
            </h3>
            <p className="text-slate-400 text-center max-w-lg mx-auto mb-8">
              We&apos;re constantly expanding CosmoxHub based on your needs. Have a tool request? Drop us a message!
            </p>
            <a href="mailto:contact@cosmoxhub.com" className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl font-medium transition-all hover:text-white">
              Suggest a Tool
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
