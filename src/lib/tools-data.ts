import { 
  FileStack, Scissors, ImagePlus, FileImage,
  Type, CaseSensitive, RemoveFormatting, AlignLeft,
  Image, FileDown, Maximize2,
  MessageSquare, QrCode,
  KeyRound,
  FileText,
  Video,
  Code,
  Unlock,
  Sparkles,
  Eraser,
  Code2,
  Minimize,
  FileArchive,
  LucideIcon,
  Link, FileCode, GitCompare, Search, Palette, ImageIcon, Pen, Clock, FileJson,
  Calculator, Ruler, FileUser
} from "lucide-react";

export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  color?: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  color: string;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    id: "pdf-tools",
    label: "PDF Suite",
    description: "Enterprise PDF processing directly in your browser. 100% Client-side privacy.",
    color: "#ef4444",
    tools: [
      { title: "PDF Editor Pro", description: "Edit, annotate, draw, sign, highlight, and place stamps on PDFs.", href: "/tools/pdf-editor", icon: Pen, badge: "Elite", color: "#ef4444" },
      { title: "Merge PDF", description: "Combine multiple PDF files into a single structured document.", href: "/tools/merge-pdf", icon: FileStack, badge: "Popular", color: "#ef4444" },
      { title: "Split PDF", description: "Extract pages or split a PDF into separate files instantly.", href: "/tools/split-pdf", icon: Scissors, color: "#ef4444" },
      { title: "PDF Compressor", description: "Compress and optimize PDF file sizes without quality loss.", href: "/tools/pdf-compressor", icon: FileArchive, badge: "Fast", color: "#ef4444" },
      { title: "PDF Unlocker", description: "Remove owner passwords and restrictions from PDF files.", href: "/tools/pdf-unlocker", icon: Unlock, badge: "Secure", color: "#ef4444" },
      { title: "Image to PDF", description: "Convert JPG, PNG, WebP, or HEIC images into a PDF document.", href: "/tools/image-to-pdf", icon: ImagePlus, color: "#ef4444" },
      { title: "PDF to Image", description: "Export PDF pages as high-resolution PNG or JPG images.", href: "/tools/pdf-to-image", icon: FileImage, color: "#ef4444" },
    ],
  },
  {
    id: "image-tools",
    label: "Image Lab",
    description: "Compress, convert, resize, and remove backgrounds with zero quality loss.",
    color: "#10b981",
    tools: [
      { title: "Smart Image Compressor", description: "Compress images instantly in your browser without quality loss.", href: "/tools/image-compressor", icon: Minimize, badge: "Hot", color: "#10b981" },
      { title: "AI Background Remover", description: "Remove image backgrounds automatically with WebAssembly AI.", href: "/tools/bg-remover", icon: Eraser, badge: "Elite", color: "#10b981" },
      { title: "Image Resizer", description: "Resize images to exact pixel dimensions or aspect ratios.", href: "/tools/image-resizer", icon: Maximize2, color: "#10b981" },
      { title: "PNG to JPG", description: "Convert PNG images to compressed JPG format instantly.", href: "/tools/png-to-jpg", icon: Image, color: "#10b981" },
      { title: "JPG to PNG", description: "Convert JPG photos to PNG format with alpha support.", href: "/tools/jpg-to-png", icon: FileDown, color: "#10b981" },
      { title: "HEIC to JPG", description: "Convert Apple HEIC photos to standard JPG format.", href: "/tools/heic-to-jpg", icon: FileImage, badge: "Useful", color: "#10b981" },
      { title: "WebP to PNG", description: "Convert WebP images to PNG with full transparency support.", href: "/tools/webp-to-png", icon: ImagePlus, color: "#10b981" },
      { title: "Color Palette Generator", description: "Extract vibrant color palettes and hex codes from any image.", href: "/tools/color-palette", icon: Palette, color: "#10b981" },
      { title: "Favicon Generator", description: "Generate favicons for websites from text, emoji, or images.", href: "/tools/favicon-generator", icon: ImageIcon, color: "#10b981" },
    ],
  },
  {
    id: "ai-dev-tools",
    label: "AI & Developer Focus",
    description: "Next-generation developer utilities, API testers, and AI prompt tools.",
    color: "#8b5cf6",
    tools: [
      { title: "API Tester Playground", description: "Test REST APIs, webhooks, and HTTP endpoints right from your browser.", href: "/tools/api-tester", icon: Code2, badge: "Elite", color: "#8b5cf6" },
      { title: "AI Prompt Optimizer", description: "Transform basic ideas into 10x better engineered AI prompts.", href: "/tools/ai-prompt-optimizer", icon: Sparkles, badge: "Popular", color: "#8b5cf6" },
      { title: "Code Beautifier 2.0", description: "Format and clean JSON, JavaScript, CSS, and HTML code.", href: "/tools/code-beautifier", icon: Code2, color: "#8b5cf6" },
      { title: "AI Agent Skills Creator", description: "Generate production-ready SKILL.md documentation files for AI agents.", href: "/tools/claude-skills-creator", icon: FileCode, badge: "New", color: "#8b5cf6" },
      { title: "JSON Formatter & Validator", description: "Prettify, validate, and minify JSON data structures.", href: "/tools/json-formatter", icon: Code, color: "#8b5cf6" },
      { title: "URL Encoder / Decoder", description: "Encode or decode strings for safe URL query parameters.", href: "/tools/url-encoder", icon: Link, color: "#8b5cf6" },
      { title: "Image to Base64", description: "Convert any image file into a Data URL or Base64 string.", href: "/tools/image-to-base64", icon: Code, color: "#8b5cf6" },
      { title: "Markdown to HTML", description: "Render Markdown text into clean HTML code with live preview.", href: "/tools/markdown-to-html", icon: FileCode, color: "#8b5cf6" },
      { title: "Text Diff Checker", description: "Compare two text snippets side-by-side and highlight differences.", href: "/tools/text-diff", icon: GitCompare, color: "#8b5cf6" },
      { title: "Regex Tester", description: "Test and debug Regular Expressions with real-time match highlighting.", href: "/tools/regex-tester", icon: Search, badge: "Elite", color: "#8b5cf6" },
      { title: "CSV to JSON Converter", description: "Convert raw CSV spreadsheets into structured JSON arrays.", href: "/tools/csv-to-json", icon: FileJson, color: "#8b5cf6" },
    ],
  },
  {
    id: "text-tools",
    label: "Text Intelligence",
    description: "High-performance text utilities for creators, writers, and developers.",
    color: "#6366f1",
    tools: [
      { title: "Word Counter 2.0", description: "Count words, characters, sentences, reading time, and keyword density.", href: "/tools/word-counter", icon: Type, badge: "Elite", color: "#6366f1" },
      { title: "Case Converter", description: "Transform text to UPPERCASE, lowercase, Title Case, camelCase, and snake_case.", href: "/tools/case-converter", icon: CaseSensitive, color: "#6366f1" },
      { title: "Whitespace Remover", description: "Strip extra spaces, trailing tabs, and empty lines from text.", href: "/tools/whitespace-remover", icon: RemoveFormatting, color: "#6366f1" },
      { title: "Lorem Ipsum Generator", description: "Generate custom placeholder text paragraphs for UI wireframes.", href: "/tools/lorem-ipsum", icon: AlignLeft, color: "#6366f1" },
      { title: "Text to PDF", description: "Convert formatted text into downloadable PDF documents.", href: "/tools/text-to-pdf", icon: FileText, color: "#6366f1" },
      { title: "Text to Word", description: "Export formatted text to Microsoft Word (.docx) files.", href: "/tools/text-to-word", icon: FileText, color: "#6366f1" },
    ],
  },
  {
    id: "utilities",
    label: "Productivity & Utilities",
    description: "Essential everyday tools for workflow automation and calculations.",
    color: "#f59e0b",
    tools: [
      { title: "Resume Builder Pro", description: "Create ATS-friendly professional resumes with instant PDF export.", href: "/tools/resume-builder", icon: FileUser, badge: "Elite", color: "#f59e0b" },
      { title: "QR Code Generator", description: "Generate custom QR codes for URLs, text, WiFi credentials, or contacts.", href: "/tools/qr-generator", icon: QrCode, badge: "Popular", color: "#f59e0b" },
      { title: "WhatsApp Link Generator", description: "Create direct click-to-chat WhatsApp links with custom pre-filled messages.", href: "/tools/whatsapp-link", icon: MessageSquare, color: "#f59e0b" },
      { title: "YouTube Thumbnail HD", description: "Extract and download 1080p Full HD thumbnails from any YouTube video.", href: "/tools/youtube-thumbnail", icon: Video, badge: "New", color: "#f59e0b" },
      { title: "Digital Signature Creator", description: "Draw or type digital signatures and export high-res transparent PNGs.", href: "/tools/signature-creator", icon: Pen, badge: "Elite", color: "#f59e0b" },
      { title: "Age Calculator", description: "Calculate exact age in years, months, days, hours, and minutes.", href: "/tools/age-calculator", icon: Clock, color: "#f59e0b" },
      { title: "EMI Calculator", description: "Calculate monthly loan EMIs, total interest payable, and amortization.", href: "/tools/emi-calculator", icon: Calculator, color: "#f59e0b" },
      { title: "Unit Converter", description: "Convert length, mass, temperature, area, volume, and data units.", href: "/tools/unit-converter", icon: Ruler, color: "#f59e0b" },
      { title: "Password Generator", description: "Generate cryptographically secure random passwords.", href: "/tools/password-generator", icon: KeyRound, color: "#f59e0b" },
    ],
  },
];

export const allTools = categories.flatMap(cat => cat.tools);
