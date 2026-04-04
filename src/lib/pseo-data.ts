import { LucideIcon, Download, Sparkles, Image as ImageIcon, Video, Calculator, Calendar, FileText, Key, FileStack, Zap, Lock, MessageSquare, QrCode } from "lucide-react";

export interface PseoPage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  content: string[]; // Arrays of paragraphs for easy rendering
  targetToolLink: string;
  targetToolName: string;
  iconName: "download" | "sparkles" | "image" | "video" | "calculator" | "calendar" | "fileText" | "key" | "fileStack" | "zap" | "lock" | "message" | "qrcode"; 
}

export const pseoData: PseoPage[] = [
  // 1. YouTube Thumbnail Downloader
  {
    slug: "free-youtube-thumbnail-downloader-hd",
    title: "Free HD YouTube Thumbnail Downloader | 1080p Images",
    h1: "Download YouTube Thumbnails in Full HD Instantly",
    metaDescription: "Grab any YouTube video thumbnail in ultra-high resolution (1080p, 4K) for free. Zero installation, 100% cloud-based utility for creators.",
    content: [
      "Are you looking to grab the perfect thumbnail from a YouTube video for inspiration, or perhaps to share with your team? Our free HD YouTube Thumbnail tool lets you extract professional-grade thumbnail images in seconds.",
      "As a content creator, analyzing top-performing thumbnails is crucial for your click-through rate (CTR). This fast, privacy-first tool operates directly in your browser without requiring you to download any sketchy software.",
      "Just paste the YouTube video link above, and click 'Download'. You can choose the maximum available resolution including HD and 4K variations where available."
    ],
    targetToolLink: "/tools/youtube-thumbnail",
    targetToolName: "Launch Thumbnail Downloader",
    iconName: "video"
  },
  {
    slug: "download-youtube-shorts-thumbnail-hd",
    title: "Download YouTube Shorts Thumbnail HD | Free Online Tool",
    h1: "High-Quality YouTube Shorts Thumbnail Grabber",
    metaDescription: "Easily extract and download thumbnail images from any YouTube Short. Get crisp, vertical or horizontal thumbnails in original quality.",
    content: [
      "YouTube Shorts have taken over the digital space, but getting the thumbnail from a short isn't always straightforward. Our dedicated utility bypasses the hassle and gets you the exact image file used for the Short.",
      "Whether you are analyzing a viral Short to replicate its success or need the image for a presentation, our tool fetches the highest available resolution instantly.",
      "Operating completely locally, our tool guarantees zero server-side caching so your data remains strictly yours."
    ],
    targetToolLink: "/tools/youtube-thumbnail",
    targetToolName: "Open Shorts Thumbnail Grabber",
    iconName: "download"
  },

  // 2. Age Calculator
  {
    slug: "exact-age-calculator-by-date-of-birth",
    title: "Exact Age Calculator by Date of Birth | Free Tool",
    h1: "Calculate Your Exact Age in Seconds",
    metaDescription: "Find out your exact age in years, months, weeks, days, and seconds. A 100% free, private online age calculator tailored for precision.",
    content: [
      "Calculating your exact age manually can be tedious. Whether you need it for official documents, applications, or simply out of curiosity, our Exact Age Calculator delivers hyper-accurate results.",
      "This tool breaks down your lifespan into exact years, months, weeks, and even remaining days until your next milestone birthday. Designed for speed, it requires ZERO uploads and operates securely in your local environment."
    ],
    targetToolLink: "/tools/age-calculator",
    targetToolName: "Open Age Calculator",
    iconName: "calendar"
  },
  {
    slug: "chronological-age-calculator",
    title: "Chronological Age Calculator Online | Accurate Finder",
    h1: "Find Your Exact Chronological Age",
    metaDescription: "Easily calculate your exact chronological age automatically. Input your birthday to accurately determine months, days, and weeks instantly.",
    content: [
      "Medical professionals, researchers, and admissions teams often require a strict chronological age calculation down to the exact day. Our tool handles leap years and timezone differences seamlessly to give you the precise mathematical result you need.",
      "Powered by ultra-fast client-side JavaScript, our Chronological Age Calculator ensures your birthdate relies solely on your local device. We value privacy and speed above all else.",
      "Try it out manually and watch our elite algorithms calculate your stats in under a millisecond."
    ],
    targetToolLink: "/tools/age-calculator",
    targetToolName: "Use Chronological Age Finder",
    iconName: "calculator"
  },

  // 3. Image Upscaler
  {
    slug: "free-photo-enlarger-without-losing-quality",
    title: "Free Photo Enlarger - Upscale Images Without Losing Quality",
    h1: "Enhance and Enlarge Photos with AI",
    metaDescription: "Upscale your low-resolution images 2x, 4x, or 8x without blurring. 100% free AI photo enlarger operating directly in your browser.",
    content: [
      "If you have a pixelated or low-resolution image that needs to be brought up to professional print standards, our AI-powered Photo Enlarger is your ultimate solution. Utilizing next-generation neural networks, we redraw the missing pixels instead of simply stretching the image.",
      "Traditional resizing leaves photos blurry and full of artifacts. By using ESRGAN technology strictly within your web browser, our tool gives you desktop-software quality for free.",
      "Best of all, your images are never uploaded to a cloud server, ensuring 100% data privacy for sensitive enterprise assets."
    ],
    targetToolLink: "/tools/image-upscaler",
    targetToolName: "Launch AI Photo Enlarger",
    iconName: "sparkles"
  },
  {
    slug: "upscale-image-to-4k-online",
    title: "Upscale Image to 4K Online Free | AI Enhancer",
    h1: "Convert Low Quality Images to 4K Resolution",
    metaDescription: "Instantly turn blurry photos into stunning 4K masterpieces. Our browser-based AI engine scales images securely without data uploads.",
    content: [
      "Getting images ready for big screens or high-end retina displays requires native 4K scaling. Our zero-upload AI 4K Upscaler takes raw, pixelated files and breathes life into them with insane detail retrieval.",
      "Whether it's an old family photograph, web graphics, or anime illustrations, our client-side GPU acceleration processes the image locally, keeping the process fast and private.",
      "Select Ultra-detail mode to activate deep algorithmic enhancement, giving you unprecedented control over digital image clarity."
    ],
    targetToolLink: "/tools/image-upscaler",
    targetToolName: "Open 4K Image Upscaler",
    iconName: "zap"
  },

  // 4. Background Remover
  {
    slug: "transparent-background-maker",
    title: "Transparent Background Maker | Free & Instant",
    h1: "Create Transparent Backgrounds Automatically",
    metaDescription: "Easily make image backgrounds transparent. Perfect for logos, products, and graphics. Fast, secure, and fully browser-based.",
    content: [
      "E-commerce business owners, graphic designers, and social media managers frequently need to isolate subjects from their backgrounds. Our Transparent Background Maker uses lightning-fast browser AI to separate foregrounds perfectly.",
      "Stop wasting time with complex lasso tools or expensive graphic software. Our utility identifies edges cleanly, offering you a professional `.png` file with full transparency in seconds.",
      "All background removal executes completely in your local memory, keeping unparalleled standards of data confidentiality."
    ],
    targetToolLink: "/tools/bg-remover",
    targetToolName: "Make Background Transparent",
    iconName: "image"
  },
  {
    slug: "remove-background-from-logo-free",
    title: "Remove White Background from Logo Free | Online Tool",
    h1: "Instantly Remove Backgrounds from Logos",
    metaDescription: "Need a logo without the white background? Use our free AI tool to instantly extract your logo with a pure transparent background.",
    content: [
      "When working with branding assets, having a logo with a white background can ruin a website's sleek design. Our dedicated Logo Background Remover specifically targets flat-color surroundings, erasing them permanently.",
      "It preserves the sharp, crisp edges of vector-like graphics and typography inside the logo, ensuring no artifacting or ghosting remains.",
      "Drag and drop your logo today to get the pristine, transparent PNG you need for your next presentation or brand kit."
    ],
    targetToolLink: "/tools/bg-remover",
    targetToolName: "Remove Logo Background",
    iconName: "sparkles"
  },

  // 5. Password Generator
  {
    slug: "generate-secure-password-for-wifi",
    title: "Generate Secure WiFi Passwords | Random Password Generator",
    h1: "Create Uncrackable WiFi Passwords",
    metaDescription: "Protect your network with a highly secure, randomized 20+ character WiFi password. 100% free tool generated locally for absolute safety.",
    content: [
      "Default router passwords are often compromised or mathematically predictable. By using our Secure WiFi Password Generator, you can enforce military-grade encryption keys for your personal or enterprise network.",
      "Our system relies on local cryptographic random number generation. The keys created never leave your device, meaning the password generated is known only to you—and never transmitted over the internet.",
      "Choose to include symbols, numbers, and both casing variants to maximize your WPA2/WPA3 network defense."
    ],
    targetToolLink: "/tools/password-generator",
    targetToolName: "Generate Secure Password",
    iconName: "key"
  },

  // 6. WhatsApp Link Generator
  {
    slug: "whatsapp-direct-message-without-saving-number",
    title: "WhatsApp Direct Message Link | No Contact Save Required",
    h1: "Send a WhatsApp Message Without Saving the Number",
    metaDescription: "Generate a wa.me chat link instantly. Easily text anyone on WhatsApp directly without cluttering your phone's address book.",
    content: [
      "Business owners and freelancers constantly need to chat with clients, leads, or temporary contacts. Saving every single number clutters your phone heavily. Our WhatsApp Direct Link tool solves this seamlessly.",
      "Just input the destination phone number and an optional pre-filled message. We will instantly give you a clickable wa.me URL. You can use it yourself or deploy it on your Instagram bio, Facebook page, or website.",
      "Boost your conversion rate by allowing clients to slide into your WhatsApp DMs with a single tap, removing all friction from communication."
    ],
    targetToolLink: "/tools/whatsapp-link",
    targetToolName: "Create WhatsApp Link",
    iconName: "message"
  },

  // 7. HEIC to JPG
  {
    slug: "convert-iphone-heic-to-jpg-windows",
    title: "Convert iPhone HEIC to JPG on Windows Free",
    h1: "View and Convert iPhone Photos on Windows",
    metaDescription: "Easily convert Apple HEIC image formats into universally compatible JPG files for Windows, Android, and Web. 100% browser-based.",
    content: [
      "Apple's high-efficiency HEIC format is great for saving space on an iPhone, but historically creates massive compatibility issues on Windows computers, Android arrays, and standard web application uploads.",
      "Our ultra-fast HEIC to JPG converter bridges this gap effortlessly. Operating entirely inside the local browser context via WebAssembly strings, it decrypts and recompresses your private photos without uploading them to any third-party server.",
      "Quickly batch-convert your whole vacation gallery safely, achieving universally standard JPGs ready for social media or client portfolios."
    ],
    targetToolLink: "/tools/heic-to-jpg",
    targetToolName: "Convert HEIC to JPG",
    iconName: "image"
  },

  // 8. PDF Merge
  {
    slug: "merge-pdf-files-free-no-watermark",
    title: "Merge PDF Files Free Without Watermark | Online Utility",
    h1: "Combine PDF Documents Seamlessly",
    metaDescription: "Merge multiple PDF files into one master document without annoying watermarks or file size limits. 100% private and localized to your browser.",
    content: [
      "Tired of using PDF software that forcibly injects a watermark on your final document unless you pay? Our Elite PDF Merger combines your documents cleanly, legally, and for absolutely zero cost with no watermarks ever.",
      "Whether combining financial reports, academic essays, or scanned invoices, you can drag and drop multiple items, reorder them visually, and hit merge.",
      "Since processing is 100% client-side via JavaScript, your confidential PDFs are never exposed to remote servers. Total security with lightning speed."
    ],
    targetToolLink: "/tools/merge-pdf",
    targetToolName: "Merge PDFs Now",
    iconName: "fileStack"
  },

  // 9. AI Prompt Optimizer
  {
    slug: "improve-chatgpt-prompts-free",
    title: "Improve ChatGPT Prompts Free | AI Prompt Optimizer",
    h1: "Turn Good Ideas Into Elite AI Prompts",
    metaDescription: "Upgrade simple instructions into highly engineered master prompts for ChatGPT, Claude, and Gemini. 100% free engineering tool.",
    content: [
      "Generative AI models are incredibly powerful, but their output is only as good as your input. The 'garbage in, garbage out' paradigm is real. Our AI Prompt Optimizer serves as an automatic prompt engineer.",
      "Simply paste your rough idea, and the optimizer structures it with explicit constraints, persona adoption, chain-of-thought pathways, and format specifications—the hallmark strategies of elite AI power users.",
      "Stop settling for generic AI responses. Evolve your prompt structure today and unlock the true reasoning power of Top-Tier Large Language Models."
    ],
    targetToolLink: "/tools/ai-prompt-optimizer",
    targetToolName: "Optimize Your Prompt",
    iconName: "sparkles"
  },

  // 10. PDF Unlocker
  {
    slug: "remove-password-protection-from-pdf",
    title: "Remove Password Protection from PDF Free | Unlock PDF",
    h1: "Bypass and Strip Passwords from PDF Files Locally",
    metaDescription: "Forgot your PDF open or edit password? Instantly remove printing and editing restrictions locally in your browser. 100% secure.",
    content: [
      "Being locked out of your own bank statements, tax forms, or digital textbooks is a frustrating reality. The local PDF Password Remover solves this without ever risking your highly sensitive documents on random internet servers.",
      "As long as you know the initial read-password—or are dealing with a widely restricted edit-password—our tool removes the cryptographic lock layers and outputs a fresh, unprotected PDF immediately.",
      "It is the fastest, safest way to strip 128-bit and 256-bit AES encryption layers strictly for legitimate personal administrative use."
    ],
    targetToolLink: "/tools/pdf-unlocker",
    targetToolName: "Unlock PDF File",
    iconName: "lock"
  },

  // 11. Word Counter
  {
    slug: "character-count-for-twitter-online",
    title: "Character Count for Twitter Online | Word Counter",
    h1: "Check Twitter/X Character Limits Accurately",
    metaDescription: "Keep your tweets perfectly within limit. Instantly count characters, words, sentences, and reading time for your social media content.",
    content: [
      "Drafting the perfect Tweet or X-post requires strict adherence to character limits. While premium users get longer posts, the classic punchy tweet relies heavily on the 280-character boundary.",
      "Our Live Word and Character counter is fundamentally designed for copywriters and social managers. Paste your drafts, format them properly, and get real-time lexical analytics.",
      "Beyond basic counting, we analyze reading time, whitespace, and grammatical syllables, supercharging your content publishing workflow."
    ],
    targetToolLink: "/tools/word-counter",
    targetToolName: "Launch Word Counter",
    iconName: "fileText"
  },

  // 12. QR Generator
  {
    slug: "qr-code-generator-for-wifi-password",
    title: "QR Code Generator for WiFi Password Free",
    h1: "Create a Scan-to-Connect WiFi QR Code",
    metaDescription: "Stop asking guests for the WiFi password. Generate a secure, scannable QR code that instantly connects smartphones to your network.",
    content: [
      "Modern cafes, offices, and smart homes are eliminating the process of manually typing out long, convoluted WiFi passwords. A simple QR code acts as the ultimate digital handshake.",
      "By selecting the WiFi format on our QR Code Generator, you simply enter your SSID, password, and encryption type (WPA/WEP). We instantly render a high-quality matrix.",
      "Print it out or display it on a screen. When users point their iOS or Android camera at it, their device will securely auto-connect without typing a single character."
    ],
    targetToolLink: "/tools/qr-generator",
    targetToolName: "Generate WiFi QR Code",
    iconName: "qrcode"
  },

  // JSON Formatter
  {
    slug: "format-json-string-online-free",
    title: "Format JSON String Online Free | Clean Code",
    h1: "Validate and Format JSON Files Instantly",
    metaDescription: "Easily format, beautify, and validate your JSON strings. Error detection, syntax highlighting, and 100% private browser processing.",
    content: [
      "Working with massive JSON strings is a developer's nightmare without proper indentation. Our JSON Formatter transforms minified or messy JSON data into highly readable, tree-structured formats.",
      "Beyond basic beautification, the tool includes instantaneous syntax validation. It pinpoints exactly which line and character is breaking your code—saving you hours of debugging.",
      "Since all processing is strictly executed using client-side JavaScript, your sensitive API payloads or configuration files are never sent to external servers."
    ],
    targetToolLink: "/tools/json-formatter",
    targetToolName: "Format JSON Now",
    iconName: "fileText"
  },
  {
    slug: "online-json-validator-tool",
    title: "Online JSON Validator Tool | Free Syntax Checker",
    h1: "Verify and Debug JSON Data with Precision",
    metaDescription: "Quickly validate your JSON payloads online. Find syntax errors, missing commas, and brace mismatches instantly. 100% safe and secure.",
    content: [
      "A single misplaced comma in a JSON file can crash your entire application. Our Online JSON Validator acts as an automated QA engineer, parsing your data against strict ECMA specification standards.",
      "Built for developers to solve problems fast, it immediately highlights the problematic row preventing compilation.",
      "Forget downloading heavy IDEs just to check a payload. Paste your text, validate it locally, and get back to building your architecture."
    ],
    targetToolLink: "/tools/json-formatter",
    targetToolName: "Validate JSON Data",
    iconName: "zap"
  },

  // Code Beautifier
  {
    slug: "beautify-javascript-code-online",
    title: "Beautify JavaScript Code Online | Code Formatter",
    h1: "Clean and Format JavaScript Code Free",
    metaDescription: "Make your messy JS, HTML, and CSS code beautifully indented and readable. Free developer tool for instant code formatting.",
    content: [
      "Inheriting legacy code or dealing with minified files often means staring at a wall of unreadable text. Our Code Beautifier takes your compressed strings and unpacks them into pristine, PEP/Standard compliant structures.",
      "Supporting Javascript, CSS, and HTML out-of-the-box, it intelligently handles nested callbacks, complex DOM hierarchies, and dense stylesheet rules.",
      "Experience local, zero-latency code transformation that respects your source privacy fully."
    ],
    targetToolLink: "/tools/code-beautifier",
    targetToolName: "Beautify Code",
    iconName: "sparkles"
  },

  // PNG to JPG
  {
    slug: "convert-png-to-jpg-online-free",
    title: "Convert PNG to JPG Online Free | Image Converter",
    h1: "Change PNG Images to High Quality JPGs",
    metaDescription: "Reduce file sizes by converting heavy PNG files into web-friendly JPG images. Fast, local, and utterly secure conversion.",
    content: [
      "While PNGs are excellent for transparent graphics, they often carry massive file sizes unsuitable for web performance. Our PNG to JPG converter solves this instantly.",
      "By stripping the alpha channel and properly applying standard compression, you can reduce server load and boost your site speed.",
      "Operating locally within your browser, your proprietary images are transformed safely without ever hitting cloud API bottlenecks."
    ],
    targetToolLink: "/tools/png-to-jpg",
    targetToolName: "Convert Image Now",
    iconName: "image"
  },

  // JPG to PNG
  {
    slug: "convert-jpg-to-png-transparent-background",
    title: "Convert JPG to PNG Transparent Support | Free Optimizer",
    h1: "Convert JPG Pictures to PNG Format Offline",
    metaDescription: "Upgrade your JPG files into the lossless PNG format. Perfect for graphic design and web integration. 100% free tool.",
    content: [
      "Sometimes a project demands a strict PNG format requirement for compatibility with vector software or specific printing interfaces. Our JPG to PNG converter handles this with 1:1 pixel fidelity.",
      "With high-speed local processing, you don't have to wait in queues like other freemium services force you to.",
      "Transform your photographs into the absolute highest standard format securely today."
    ],
    targetToolLink: "/tools/jpg-to-png",
    targetToolName: "Convert to PNG",
    iconName: "image"
  },

  // Split PDF
  {
    slug: "extract-pages-from-pdf-online",
    title: "Extract Pages From PDF Online | Split PDF Tool",
    h1: "Split and Extract Specific PDF Pages",
    metaDescription: "Easily extract one page or a range of pages from a large PDF document. Fast, safe, and works entirely in your browser.",
    content: [
      "When dealing with massive 300-page manuals or financial disclosures, you often only need a crucial single page or a small chapter. Our Split PDF tool is the absolute perfect utility for this.",
      "Simply upload the document into the local browser engine, type the page range you require (e.g., 5-12), and hit extract.",
      "Your new document is instantly provided to you in perfect visual fidelity without any upload risk."
    ],
    targetToolLink: "/tools/split-pdf",
    targetToolName: "Split PDF Files",
    iconName: "fileStack"
  },

  // Image to PDF
  {
    slug: "convert-multiple-images-to-pdf",
    title: "Convert Multiple Images to PDF Free | Online Binder",
    h1: "Turn Your Photos Into a Single PDF Document",
    metaDescription: "Select multiple JPG or PNG images and instantly merge them into a single, scrollable PDF file. Perfect for email attachments and archiving.",
    content: [
      "Sending 15 different photographs via email is a terrible experience for both the sender and the receiver. Convert them into a single, professional PDF document instantly.",
      "Our Image to PDF utility allows you to drag-and-drop your gallery, re-order the visual sequence, and bind them all together natively in your browser.",
      "No file limits, no hidden premium fees—just raw utility."
    ],
    targetToolLink: "/tools/image-to-pdf",
    targetToolName: "Create PDF from Images",
    iconName: "fileStack"
  },

  // Lorem Ipsum
  {
    slug: "generate-lorem-ipsum-dummy-text",
    title: "Generate Lorem Ipsum Dummy Text | Designer Free Tool",
    h1: "Instant Lorem Ipsum Text Generator",
    metaDescription: "Quickly generate paragraphs of professional placeholder text for mockups, UI design, and typography tests.",
    content: [
      "No design is complete without content, but waiting for copywriters halts production. Use our classic Lorem Ipsum generator to instantly populate your Figma or Adobe XD mockups.",
      "Choose exactly how many paragraphs, words, or bytes you need, and generate randomized, non-distracting Latin placeholder text.",
      "Ensure your UI formatting and typography scales perfectly without the distraction of real content."
    ],
    targetToolLink: "/tools/lorem-ipsum",
    targetToolName: "Generate Placeholder Text",
    iconName: "fileText"
  },

  // Case Converter
  {
    slug: "convert-text-to-title-case-online",
    title: "Convert Text to Title Case Online | Free Formatting",
    h1: "Instantly Fix Text Formatting and Capitalization",
    metaDescription: "Easily convert any text string into Title Case, lowercase, UPPERCASE, or sentence case. Fast processing for writers and coders.",
    content: [
      "Inconsistent capitalization ruins the professionalism of blog posts, academic papers, and website headers. Our Case Converter fixes everything with a single click.",
      "Need to transform an entire heavily-capitalized legal document into readable sentence case? Done. Want to properly format a headline into Title Case? Handled.",
      "It operates instantly on your device, handling thousands of words without lag."
    ],
    targetToolLink: "/tools/case-converter",
    targetToolName: "Convert Text Case",
    iconName: "fileText"
  },

  // Image Resizer
  {
    slug: "resize-image-to-exact-pixels",
    title: "Resize Image to Exact Pixels Online | Photo Resizer",
    h1: "Scale Images to Exact Dimensions Instantly",
    metaDescription: "Need an image to be exactly 1920x1080 or 800x800? Use our free resizing tool to stretch or crop images to your strict constraints.",
    content: [
      "Social media platforms and government application portals have incredibly strict dimensional and size limits. Our image resizer puts precise control in your hands.",
      "Just upload your file, enter your target width and height, and choose whether to maintain aspect ratio or execute a hard-stretch.",
      "Achieve pixel-perfect compliance locally on your machine."
    ],
    targetToolLink: "/tools/image-resizer",
    targetToolName: "Resize Image Now",
    iconName: "image"
  },

  // AI Agent Skills Creator
  {
    slug: "generate-claude-ai-skills-md-file",
    title: "Generate Claude AI Skills.md File | Pro AI Agent Tool",
    h1: "Create Custom Skills for Claude, Custom GPTs, or Deepmind",
    metaDescription: "Generate professional SKILL.md and SYSTEM.md instructions for autonomous AI agents. The ultimate free prompt architect tool.",
    content: [
      "Building cutting-edge AI pipelines like Raptor Axiom or generic AutoGPTs requires strict, markdown-based system instructions. Our AI Agent Skills Creator automates this engineering.",
      "By answering a few simple questions, the tool dynamically generates robust guidelines detailing formatting, rules, and behavioral constraints that AI models understand perfectly.",
      "Elevate your AI development workflow from amateur tinkering to elite, predictable automation."
    ],
    targetToolLink: "/tools/ai-agent-creator",
    targetToolName: "Build AI Skill Setup",
    iconName: "zap"
  }

];

export const getIcon = (name: PseoPage["iconName"]): LucideIcon => {
  switch (name) {
    case "video": return Video;
    case "calendar": return Calendar;
    case "calculator": return Calculator;
    case "image": return ImageIcon;
    case "sparkles": return Sparkles;
    case "fileText": return FileText;
    case "key": return Key;
    case "fileStack": return FileStack;
    case "zap": return Zap;
    case "lock": return Lock;
    case "message": return MessageSquare;
    case "qrcode": return QrCode;
    case "download": 
    default:
      return Download;
  }
};
