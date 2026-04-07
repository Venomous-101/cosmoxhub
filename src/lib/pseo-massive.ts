import { PseoPage } from "./pseo-data";

const bgRemoverKeywords = [
  "transparent background from image",
  "remove background amazon product",
  "isolate subject from photo",
  "clear background png maker",
  "remove white background from logo",
  "replace background with blue",
  "passport photo background remover",
  "free ai background eraser",
  "cut out image subject online",
  "remove background without losing quality",
  "hd transparent image converter",
  "shopify product image transparent",
  "remove background signature",
  "make logo transparent instantly",
  "erase complex backgrounds hair fur",
  "100 percent free background remover",
  "private image isolation online",
  "remove background car photo",
  "transparent portrait maker",
  "background remover no upload required"
];

const ytThumbnailKeywords = [
  "download youtube thumbnail HD",
  "grab youtube podcast image",
  "save youtube shorts thumbnail 1080p",
  "extract 4k youtube thumbnail",
  "youtube thumbnail viewer online",
  "download maxresdefault youtube",
  "youtube thumbnail extractor free",
  "save youtube video cover image",
  "copy youtube thumbnail image",
  "download thumbnail without watermark",
  "youtube intro image downloader",
  "save youtube banner and thumbnail",
  "fetch youtube thumbnail by link",
  "youtube thumbnail finder hd",
  "download youtube preview image"
];

const pdfCompressorKeywords = [
  "compress pdf to 100kb",
  "reduce pdf file size online",
  "compress pdf for email attachment",
  "make pdf smaller without losing quality",
  "shrink pdf to 1mb",
  "lossless pdf compressor",
  "compress large pdf documents",
  "resize pdf size online",
  "fast pdf compression tool",
  "compress scanned pdf file",
  "secure local pdf compressor",
  "compress pdf offline browser",
  "shrink pdf resume size",
  "compress pdf portfolio",
  "pdf size minimizer free"
];

const passGenKeywords = [
  "generate secure 16 character password",
  "random password creator offline",
  "strong password generator with symbols",
  "unhackable password maker",
  "memorable secure password generator",
  "wpa2 wifi password generator",
  "random strings generator",
  "cryptographic password creator",
  "generate password for apple id",
  "windows local password generator"
];

// Helper to generate the PSEO objects dynamically
const generateVariations = (
  keywords: string[],
  basePayload: Partial<PseoPage>,
  specifics: { h1Prefix: string, desc: string, icon: PseoPage["iconName"], targetLink: string, targetName: string }
): PseoPage[] => {
  return keywords.map((kw, i) => {
    const slug = kw.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const titleCase = kw.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    
    return {
      slug,
      title: `${titleCase} | Free Online Tool`,
      h1: `${specifics.h1Prefix} ${titleCase}`,
      metaDescription: `${specifics.desc} Try our free, fast, and 100% private ${kw} tool right in your browser.`,
      content: [
        `Searching for a way to ${kw}? You've found the ultimate utility. At CosmoxHub, we focus on delivering edge-computing tools that run entirely in your local browser environment.`,
        `When you use our ${titleCase} generator, you are getting zero-latency processing without your data ever bouncing to a third-party server.`,
        `This means absolute privacy, infinite usage without paywalls, and the highest fidelity output possible.`
      ],
      targetToolLink: specifics.targetLink,
      targetToolName: specifics.targetName,
      iconName: specifics.icon,
      faqs: [
        {
          question: `Is it safe to ${kw} here?`,
          answer: `Yes! Our tools employ client-side WebAssembly protocols, meaning your inputs stay on your device.`
        },
        {
          question: `Are there hidden costs to ${kw}?`,
          answer: `Absolutely none. CosmoxHub is passionately committed to providing free, unmetered access.`
        }
      ]
    };
  });
};

export const massivePseoData: PseoPage[] = [
  ...generateVariations(bgRemoverKeywords, {}, {
    h1Prefix: "Instantly",
    desc: "Need to clear an image backdrop? Use our ultra-precision AI.",
    icon: "sparkles",
    targetLink: "/tools/bg-remover",
    targetName: "Launch BG Remover"
  }),
  ...generateVariations(ytThumbnailKeywords, {}, {
    h1Prefix: "Easily",
    desc: "Get crystal clear HD thumbs instantly.",
    icon: "video",
    targetLink: "/tools/youtube-thumbnail",
    targetName: "Open YT Downloader"
  }),
  ...generateVariations(pdfCompressorKeywords, {}, {
    h1Prefix: "Quickly",
    desc: "Shrink heavy files easily.",
    icon: "fileStack",
    targetLink: "/tools/pdf-compressor",
    targetName: "Launch PDF Compressor"
  }),
  ...generateVariations(passGenKeywords, {}, {
    h1Prefix: "Securely",
    desc: "Lock down your digital footprint.",
    icon: "lock",
    targetLink: "/tools/password-generator",
    targetName: "Open Password Generator"
  })
];

