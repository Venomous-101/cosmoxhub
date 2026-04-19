import Link from "next/link";
import { Zap } from "lucide-react";
import { categories } from "@/lib/tools-data";

// Keyword-rich anchor text map for footer links
const anchorText: Record<string, string> = {
  "/tools/merge-pdf":        "Merge PDF Online Free",
  "/tools/split-pdf":        "Split PDF Free",
  "/tools/pdf-compressor":   "Compress PDF Free",
  "/tools/pdf-unlocker":     "Remove PDF Password Free",
  "/tools/image-to-pdf":     "Convert Image to PDF",
  "/tools/pdf-to-image":     "PDF to Image Converter",
  "/tools/word-counter":     "Word Counter Online",
  "/tools/case-converter":   "Text Case Converter",
  "/tools/whitespace-remover": "Whitespace Remover",
  "/tools/lorem-ipsum":      "Lorem Ipsum Generator",
  "/tools/text-to-pdf":      "Text to PDF Free",
  "/tools/api-tester":       "Test API Online Free",
  "/tools/ai-prompt-optimizer": "AI Prompt Optimizer",
  "/tools/code-beautifier":  "Code Beautifier Online",
  "/tools/claude-skills-creator": "AI Agent Creator",
  "/tools/json-formatter":   "JSON Formatter Free",
  "/tools/url-encoder":      "URL Encoder Decoder Free",
  "/tools/image-to-base64":  "Image to Base64 Online",
  "/tools/markdown-to-html": "Markdown to HTML Free",
  "/tools/text-diff":        "Text Diff Checker Online",
  "/tools/regex-tester":     "Regex Tester Online Free",
  "/tools/font-pairing":     "Font Pairing Tool Free",
  "/tools/image-compressor": "Compress Images Free",
  "/tools/bg-remover":       "Remove Image Background Free",
  "/tools/png-to-jpg":       "PNG to JPG Converter Free",
  "/tools/jpg-to-png":       "JPG to PNG Converter",
  "/tools/heic-to-jpg":      "HEIC to JPG Converter Free",
  "/tools/webp-to-png":      "WebP to PNG Converter",
  "/tools/image-resizer":    "Resize Images Online Free",
  "/tools/image-upscaler":   "AI Image Upscaler 2x 4x Free",
  "/tools/color-palette":    "Color Palette Generator Free",
  "/tools/favicon-generator": "Favicon Generator Free",
  "/tools/video-to-gif":     "Video to GIF Converter Free",
  "/tools/svg-to-png":       "SVG to PNG Converter Free",
  "/tools/whatsapp-link":    "WhatsApp Link Generator",
  "/tools/qr-generator":     "QR Code Generator Free",
  "/tools/youtube-thumbnail": "YouTube Thumbnail Downloader HD",
  "/tools/age-calculator":   "Age Calculator Online",
  "/tools/password-generator": "Secure Password Generator Free",
  "/tools/invoice-generator": "Invoice Number Generator",
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 pt-16 pb-10 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto max-w-7xl">

        {/* Internal Linking Grid — category columns */}
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
              28+ free online tools for image, PDF, AI and text processing.
              No signup. 100% private. Runs in your browser.
            </p>
          </div>

          {/* Category Columns — keyword-rich anchor text */}
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
                      {anchorText[tool.href] ?? tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal & About Links */}
        <div className="pt-10 mb-10 border-t border-indigo-500/5 mt-10 lg:mt-0">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-5 max-w-6xl mx-auto px-4 pt-10">
            <Link href="/about"   className="text-slate-400 text-[13px] hover:text-white transition-colors underline decoration-indigo-500/30">About CosmoxHub</Link>
            <Link href="/privacy" className="text-slate-400 text-[13px] hover:text-white transition-colors underline decoration-indigo-500/30">Privacy Policy</Link>
            <Link href="/terms"   className="text-slate-400 text-[13px] hover:text-white transition-colors underline decoration-indigo-500/30">Terms of Service</Link>
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
