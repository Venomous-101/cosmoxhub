"use client";

import { useState } from "react";
import { 
  Search, X, LucideIcon,
  FileStack, Scissors, ImagePlus, FileImage,
  Type, CaseSensitive, RemoveFormatting, AlignLeft,
  Image, FileDown, Maximize2,
  MessageSquare, QrCode,
  CalendarDays,
  KeyRound,
  Brain,
  FileText,
  Video,
  Code,
  Maximize
} from "lucide-react";
import ToolCard from "./ToolCard";

interface Tool {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface Category {
  id: string;
  label: string;
  description: string;
  color: string;
  tools: Tool[];
}

const categories: Category[] = [
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
      { title: "Text to PDF", description: "Convert plain text into a professional PDF document.", href: "/tools/text-to-pdf", icon: FileText, badge: "New" },
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
      { title: "Image Upscaler", description: "Enhance image resolution (2x, 4x) in the browser.", href: "/tools/image-upscaler", icon: Maximize, badge: "New" },
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
      { title: "YouTube Thumbnail Downloader", description: "Download HD thumbnails from any YouTube video.", href: "/tools/youtube-thumbnail", icon: Video, badge: "New" },
      { title: "Age Calculator", description: "Calculate exact age in years, months, days and hours.", href: "/tools/age-calculator", icon: CalendarDays },
      { title: "Password Generator", description: "Generate strong, secure, random passwords instantly.", href: "/tools/password-generator", icon: KeyRound },
      { title: "AI Agent Skills Creator", description: "Generate a professional skills.md file for AI agents.", href: "/tools/claude-skills-creator", icon: Brain, badge: "New" },
      { title: "JSON Formatter", description: "Clean, prettify and validate JSON data instantly.", href: "/tools/json-formatter", icon: Code, badge: "New" },
    ],
  },
];

export default function SearchableToolGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="w-full">
      {/* Search Bar Section */}
      <div className="flex flex-col items-center mb-16 px-4">
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 rounded-full"></div>
          <div className="relative flex items-center bg-[#0a0a1f]/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-2 pl-6 shadow-2xl overflow-hidden group-focus-within:border-indigo-400 transition-all">
            <Search className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={22} aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search for a tool (e.g. PDF, Image, JPG)..."
              className="w-full bg-transparent border-none outline-none px-4 py-3 text-slate-100 placeholder:text-slate-600 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for tools"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all mr-2"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="container mx-auto px-4 pb-24 min-h-[40vh]">
        {filteredCategories.length > 0 ? (
          <div className="max-w-7xl mx-auto flex flex-col gap-24">
            {filteredCategories.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="font-space text-3xl font-bold text-slate-100 flex items-center gap-3">
                      {cat.label}
                    </h2>
                    <p className="text-slate-500 text-sm">Powerful utilities designed for speed and privacy.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.title} {...tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6" aria-hidden="true">🔍</div>
            <h3 className="text-2xl font-space font-bold text-white mb-2">No tools found for &quot;{searchQuery}&quot;</h3>
            <p className="text-slate-500">Try searching for something else like &quot;PDF&quot; or &quot;PNG&quot;.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-6 text-indigo-400 hover:text-indigo-300 font-bold underline"
            >
              Show all tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
