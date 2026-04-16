import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Eliminate trailing slash inconsistency
  trailingSlash: false,

  // Compress all HTTP responses with gzip
  compress: true,

  // React strict mode — catches bugs early, double-renders in dev
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Allow data: and blob: URLs used by client-side image tools
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },

  // Security + cache headers
  async headers() {
    return [
      {
        // Security headers on all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Cache tool pages — revalidate every hour, stale-while-revalidate 24h
        source: "/tools/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Long cache for static assets
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Long-tail SEO redirects (301 permanent)
  async redirects() {
    return [
      // PDF redirects
      { source: "/free-pdf-merger",           destination: "/tools/merge-pdf",          permanent: true },
      { source: "/merge-pdf-free",             destination: "/tools/merge-pdf",          permanent: true },
      { source: "/pdf-merger",                 destination: "/tools/merge-pdf",          permanent: true },
      { source: "/pdf-password-remover",       destination: "/tools/pdf-unlocker",      permanent: true },
      { source: "/remove-pdf-password",        destination: "/tools/pdf-unlocker",      permanent: true },
      { source: "/unlock-pdf",                 destination: "/tools/pdf-unlocker",      permanent: true },
      { source: "/compress-pdf",               destination: "/tools/pdf-compressor",    permanent: true },
      { source: "/pdf-compressor-free",        destination: "/tools/pdf-compressor",    permanent: true },
      // Image redirects
      { source: "/ai-image-upscaler",          destination: "/tools/image-upscaler",    permanent: true },
      { source: "/upscale-image-free",         destination: "/tools/image-upscaler",    permanent: true },
      { source: "/image-upscaler",             destination: "/tools/image-upscaler",    permanent: true },
      { source: "/bg-remover-free",            destination: "/tools/bg-remover",        permanent: true },
      { source: "/remove-background-free",     destination: "/tools/bg-remover",        permanent: true },
      { source: "/background-remover",         destination: "/tools/bg-remover",        permanent: true },
      // Developer tool redirects
      { source: "/url-encode",                 destination: "/tools/url-encoder",       permanent: true },
      { source: "/url-decode",                 destination: "/tools/url-encoder",       permanent: true },
      { source: "/url-encoder",                destination: "/tools/url-encoder",       permanent: true },
      { source: "/regex-test",                 destination: "/tools/regex-tester",      permanent: true },
      { source: "/regex-tester",               destination: "/tools/regex-tester",      permanent: true },
      { source: "/test-regex-online",          destination: "/tools/regex-tester",      permanent: true },
      { source: "/json-format",                destination: "/tools/json-formatter",    permanent: true },
      { source: "/json-formatter",             destination: "/tools/json-formatter",    permanent: true },
      { source: "/markdown-html",              destination: "/tools/markdown-to-html",  permanent: true },
      { source: "/text-diff",                  destination: "/tools/text-diff",         permanent: true },
      { source: "/text-to-word",               destination: "/tools/text-to-word",      permanent: true },
      { source: "/txt-to-word",                destination: "/tools/text-to-word",      permanent: true },
      { source: "/convert-text-to-word",       destination: "/tools/text-to-word",      permanent: true },
      { source: "/csv-json",                   destination: "/tools/csv-to-json",       permanent: true },
      { source: "/convert-csv-to-json",        destination: "/tools/csv-to-json",       permanent: true },
      { source: "/text-case-converter",        destination: "/tools/text-case-pro",     permanent: true },
      { source: "/change-case",                destination: "/tools/text-case-pro",     permanent: true },
      { source: "/loan-calculator",            destination: "/tools/emi-calculator",    permanent: true },
      { source: "/ratio-calculator",           destination: "/tools/aspect-ratio-calculator", permanent: true },
      { source: "/imperial-to-metric",         destination: "/tools/unit-converter",    permanent: true },
      { source: "/dead-pixel-test",            destination: "/tools/screen-tester",     permanent: true },
      { source: "/pixel-tester",               destination: "/tools/screen-tester",     permanent: true },
      { source: "/wcag-contrast",              destination: "/tools/contrast-checker",  permanent: true },
      { source: "/color-contrast",             destination: "/tools/contrast-checker",  permanent: true },
      // Utility redirects
      { source: "/qr-code-generator",         destination: "/tools/qr-generator",      permanent: true },
      { source: "/password-generator-free",   destination: "/tools/password-generator", permanent: true },
      { source: "/favicon-generator-free",    destination: "/tools/favicon-generator", permanent: true },
      { source: "/signature-creator",         destination: "/tools/signature-creator", permanent: true },
      { source: "/online-signature-maker",    destination: "/tools/signature-creator", permanent: true },
      { source: "/cv-maker",                  destination: "/tools/resume-builder",    permanent: true },
      { source: "/cv-builder",                destination: "/tools/resume-builder",    permanent: true },
      { source: "/resume-creator",            destination: "/tools/resume-builder",    permanent: true },
      { source: "/draw-signature-online",     destination: "/tools/signature-creator", permanent: true },
      { source: "/pomodoro",                  destination: "/tools/pomodoro-timer",    permanent: true },
      { source: "/tomato-timer",              destination: "/tools/pomodoro-timer",    permanent: true },
      { source: "/study-timer",               destination: "/tools/pomodoro-timer",    permanent: true },
      { source: "/countdown",                 destination: "/tools/countdown-timer",   permanent: true },
      { source: "/online-countdown",          destination: "/tools/countdown-timer",   permanent: true },
      { source: "/target-timer",              destination: "/tools/countdown-timer",   permanent: true },
    ];
  },
};

export default nextConfig;
