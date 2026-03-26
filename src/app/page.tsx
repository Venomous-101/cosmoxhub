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
      <main>
        {/* Hero */}
        <section className="pt-20 pb-16 text-center relative overflow-hidden">
          {/* Glow orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse,rgba(99,102,241,0.12)_0%,transparent_70%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="badge badge-purple">✦ 100% Free — No Signup Required</span>
            </div>

            <h1 className="font-space font-extrabold text-[clamp(2.2rem,5vw,3.8rem)] text-slate-100 leading-[1.15] mb-5 tracking-tight">
              All the Tools You Need,<br />
              <span className="gradient-text">In One Place.</span>
            </h1>

            <p className="text-slate-500 text-[clamp(1rem,2vw,1.2rem)] max-w-[550px] mx-auto mb-10 leading-relaxed">
              15+ powerful online tools for PDF, images, text, and productivity.
              No account needed. Works in your browser. Always free.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-10 flex-wrap">
              {[
                { value: "15+", label: "Free Tools" },
                { value: "0", label: "Signup Required" },
                { value: "100%", label: "Browser-Based" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="stat-value">{stat.value}</div>
                  <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool Categories */}
        <div className="container mx-auto px-4 pb-20">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.id} className="mb-16">
              <div className="mb-7">
                <h2 className="section-title mb-1.5">{cat.label}</h2>
                <p className="text-slate-500 text-sm">{cat.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.tools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </section>
          ))}

          {/* Bottom CTA */}
          <div className="text-center p-12 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/15 rounded-[20px]">
            <h3 className="font-space text-2xl font-bold text-slate-100 mb-3">
              ⚡ More tools coming every week
            </h3>
            <p className="text-slate-500 text-sm">
              We&apos;re always adding new tools based on what users need most.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
