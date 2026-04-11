import { 
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
  Maximize,
  Unlock,
  Sparkles,
  Eraser,
  Code2,
  Minimize,
  FileArchive,
  LucideIcon
} from "lucide-react";

export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
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
    label: "PDF Tools",
    description: "Process PDFs instantly in your browser. No upload required.",
    color: "#ef4444",
    tools: [
      { title: "Merge PDF", description: "Combine multiple PDF files into one document in seconds.", href: "/tools/merge-pdf", icon: FileStack, badge: "Popular" },
      { title: "Split PDF", description: "Extract specific pages from a PDF or split into multiple files.", href: "/tools/split-pdf", icon: Scissors },
      { title: "PDF Compressor", description: "Reduce PDF file size instantly. Bulk compress multiple PDFs at once.", href: "/tools/pdf-compressor", icon: FileArchive, badge: "New" },
      { title: "PDF Password Remover", description: "Unlock protected PDF files instantly. 100% Client-side privacy.", href: "/tools/pdf-unlocker", icon: Unlock, badge: "Elite" },
      { title: "Image to PDF", description: "Convert JPG, PNG, or any image into a PDF document.", href: "/tools/image-to-pdf", icon: ImagePlus, badge: "Hot" },
      { title: "PDF to Image", description: "Export every page of a PDF as a high-quality PNG or JPG image.", href: "/tools/pdf-to-image", icon: FileImage },
    ],
  },
  {
    id: "text-tools",
    label: "Text Intelligence",
    description: "Powerful text utilities for writers, students, and developers.",
    color: "#6366f1",
    tools: [
      { title: "Word Counter 2.0", description: "Advanced metrics, keyword density, and SEO analysis.", href: "/tools/word-counter", icon: Type, badge: "Elite" },
      { title: "Case Converter", description: "Convert text to UPPERCASE, lowercase, Title Case and more.", href: "/tools/case-converter", icon: CaseSensitive },
      { title: "Whitespace Remover", description: "Remove extra spaces, tabs, and blank lines from any text.", href: "/tools/whitespace-remover", icon: RemoveFormatting },
      { title: "Lorem Ipsum Generator", description: "Generate dummy placeholder text for designs and prototypes.", href: "/tools/lorem-ipsum", icon: AlignLeft },
      { title: "Text to PDF", description: "Convert plain text into a professional PDF document.", href: "/tools/text-to-pdf", icon: FileText, badge: "New" },
    ],
  },
  {
    id: "ai-dev-tools",
    label: "AI & Developer Focus",
    description: "Next-gen tools for the modern workforce. 100% Secure.",
    color: "#8b5cf6",
    tools: [
      { title: "AI Prompt Optimizer", description: "Turn simple ideas into 10x better professional AI prompts.", href: "/tools/ai-prompt-optimizer", icon: Sparkles, badge: "Elite" },
      { title: "Code Beautifier 2.0", description: "Format and clean JSON, JS, CSS, and HTML instantly.", href: "/tools/code-beautifier", icon: Code2, badge: "New" },
      { title: "AI Agent Creator", description: "Generate professional skills.md files for AI agents.", href: "/tools/claude-skills-creator", icon: Brain, badge: "New" },
      { title: "JSON Formatter", description: "Standard prettifier and validator for small JSON snippets.", href: "/tools/json-formatter", icon: Code },
    ],
  },
  {
    id: "image-tools",
    label: "Image Tools",
    description: "Convert, resize and edit images without any quality loss.",
    color: "#10b981",
    tools: [
      { title: "Smart Image Compressor", description: "Compress single or bulk images instantly without losing quality.", href: "/tools/image-compressor", icon: Minimize, badge: "Hot" },
      { title: "BG Remover", description: "Remove background from images and add custom colors.", href: "/tools/bg-remover", icon: Eraser, badge: "Elite" },
      { title: "PNG to JPG", description: "Convert PNG images to JPG format instantly in your browser.", href: "/tools/png-to-jpg", icon: Image, badge: "Fast" },
      { title: "JPG to PNG", description: "Convert JPG images to PNG (with transparency support).", href: "/tools/jpg-to-png", icon: FileDown },
      { title: "HEIC to JPG", description: "Convert Apple HEIC photos to standard JPG format instantly.", href: "/tools/heic-to-jpg", icon: FileImage, badge: "New" },
      { title: "WebP to PNG", description: "Convert WebP images to PNG with full transparency support.", href: "/tools/webp-to-png", icon: ImagePlus, badge: "New" },
      { title: "Image Resizer", description: "Resize images to any dimension while preserving quality.", href: "/tools/image-resizer", icon: Maximize2 },
      { title: "Image Upscaler", description: "Enhance image resolution (2x, 4x) in the browser.", href: "/tools/image-upscaler", icon: Maximize, badge: "New" },
    ],
  },
  {
    id: "utilities",
    label: "Everyday Utilities",
    description: "Quick-access tools for daily tasks and productivity.",
    color: "#f59e0b",
    tools: [
      { title: "WhatsApp Link", description: "Create a WhatsApp chat link without saving the number.", href: "/tools/whatsapp-link", icon: MessageSquare, badge: "Useful" },
      { title: "QR Generator", description: "Generate a QR code for any URL, text, WiFi or contact.", href: "/tools/qr-generator", icon: QrCode, badge: "Popular" },
      { title: "YouTube Thumbnail", description: "Download HD thumbnails from any YouTube video.", href: "/tools/youtube-thumbnail", icon: Video, badge: "New" },
      { title: "Age Calculator", description: "Calculate exact age in years, months, days and hours.", href: "/tools/age-calculator", icon: CalendarDays },
      { title: "Password Generator", description: "Generate strong, secure, random passwords instantly.", href: "/tools/password-generator", icon: KeyRound },
    ],
  },
];

export const allTools = categories.flatMap(cat => cat.tools);
