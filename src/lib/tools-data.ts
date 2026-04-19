import { 
  FileStack, Scissors, ImagePlus, FileImage,
  Type, CaseSensitive, RemoveFormatting, AlignLeft,
  Image, FileDown, Maximize2,
  MessageSquare, QrCode,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  LucideIcon,
  Link, FileCode, GitCompare, Search, Palette, Star, Film, ImageIcon, Receipt, Pen, Timer, Clock, FileJson,
  Monitor, Calculator, Box, Ruler, FileUser
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
      { title: "API Tester Playground", description: "Test REST APIs and Webhooks instantly. Full HTTP support without Postman.", href: "/tools/api-tester", icon: Code2, badge: "Elite" },
      { title: "AI Prompt Optimizer", description: "Turn simple ideas into 10x better professional AI prompts.", href: "/tools/ai-prompt-optimizer", icon: Sparkles, badge: "Elite" },
      { title: "Code Beautifier 2.0", description: "Format and clean JSON, JS, CSS, and HTML instantly.", href: "/tools/code-beautifier", icon: Code2, badge: "New" },
      { title: "AI Agent Creator", description: "Generate professional skills.md files for AI agents.", href: "/tools/claude-skills-creator", icon: Brain, badge: "New" },
      { title: "JSON Formatter", description: "Standard prettifier and validator for small JSON snippets.", href: "/tools/json-formatter", icon: Code },
      { title: "URL Encoder / Decoder", description: "Encode or decode URLs and query strings instantly.", href: "/tools/url-encoder", icon: Link, badge: "New" },
      { title: "Image to Base64", description: "Convert any image to Base64 string or Data URL.", href: "/tools/image-to-base64", icon: Code, badge: "New" },
      { title: "Markdown to HTML", description: "Convert Markdown to HTML with live preview.", href: "/tools/markdown-to-html", icon: FileCode, badge: "New" },
      { title: "Text Diff Checker", description: "Compare two texts and highlight differences.", href: "/tools/text-diff", icon: GitCompare, badge: "New" },
      { title: "Regex Tester", description: "Test and debug regular expressions with live highlighting.", href: "/tools/regex-tester", icon: Search, badge: "Elite" },
      { title: "Font Pairing Tool", description: "Find perfect Google Font combinations with live preview.", href: "/tools/font-pairing", icon: Type, badge: "New" },
      { title: "Text to Word", description: "Convert text to Word (.docx) file. Rich editor included. Download instantly.", href: "/tools/text-to-word", icon: FileText, badge: "New" },
      { title: "CSV to JSON", description: "Convert CSV datasets into valid structured JSON format.", href: "/tools/csv-to-json", icon: FileJson, badge: "New" },
      { title: "Text Case Pro", description: "Advanced case transformations (camelCase, snake_case) for developers.", href: "/tools/text-case-pro", icon: CaseSensitive, badge: "New" },
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
      { title: "Color Palette Generator", description: "Generate beautiful color palettes from any base color.", href: "/tools/color-palette", icon: Palette, badge: "New" },
      { title: "Favicon Generator", description: "Create favicons from text, emoji, or image.", href: "/tools/favicon-generator", icon: Star, badge: "New" },
      { title: "Video to GIF", description: "Convert video to GIF in your browser. No upload.", href: "/tools/video-to-gif", icon: Film, badge: "New" },
      { title: "SVG to PNG", description: "Convert SVG files to PNG at any resolution.", href: "/tools/svg-to-png", icon: ImageIcon, badge: "New" },
      { title: "Contrast Checker", description: "Verify WCAG accessibility color contrast ratios.", href: "/tools/contrast-checker", icon: Palette, badge: "Accessibility" },
      { title: "Screen Tester", description: "Diagnostic tool to detect dead or stuck pixels.", href: "/tools/screen-tester", icon: Monitor, badge: "Useful" },
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
      { title: "Age Calculator", description: "Calculate your exact age and time elapsed between dates.", href: "/tools/age-calculator", icon: Clock },
      { title: "EMI Calculator", description: "Calculate loan installments and interest instantly.", href: "/tools/emi-calculator", icon: Calculator, badge: "New" },
      { title: "Aspect Ratio", description: "Maintain proportions between width and height for media.", href: "/tools/aspect-ratio-calculator", icon: Box, badge: "New" },
      { title: "Unit Converter", description: "Convert between metric and imperial units for length, weight, etc.", href: "/tools/unit-converter", icon: Ruler, badge: "New" },
      { title: "Password Generator", description: "Generate strong, secure, random passwords instantly.", href: "/tools/password-generator", icon: KeyRound },
      { title: "Invoice Number Generator", description: "Generate sequential invoice numbers in bulk.", href: "/tools/invoice-generator", icon: Receipt, badge: "New" },
      { title: "IQ Test", description: "Multi-domain cognitive assessment: patterns, logic, memory, speed & more. 100% private.", href: "/tools/iq-test", icon: Brain, badge: "Elite" },
      { title: "MindForge", description: "Train memory, focus, pattern recognition and reaction speed. Science-backed cognitive games.", href: "/tools/mind-forge", icon: Brain, badge: "New" },
      { title: "Signature Creator", description: "Draw, type, or upload your digital signature. Download PNG or SVG.", href: "/tools/signature-creator", icon: Pen, badge: "Elite" },
      { title: "Pomodoro Timer", description: "Boost your productivity with timed focus and breaks.", href: "/tools/pomodoro-timer", icon: Clock },
      { title: "Countdown Timer", description: "Create precise countdowns for events and launches.", href: "/tools/countdown-timer", icon: Timer },
      { title: "Resume Builder Pro", description: "Elite resume and CV builder with ATS-optimized templates and PDF export.", href: "/tools/resume-builder", icon: FileUser, badge: "Elite" },
    ],
  },
];

export const allTools = categories.flatMap(cat => cat.tools);
