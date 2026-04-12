import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,

  async redirects() {
    return [
      // PDF redirects
      { source: "/free-pdf-merger",           destination: "/tools/merge-pdf",       permanent: true },
      { source: "/merge-pdf-free",             destination: "/tools/merge-pdf",       permanent: true },
      { source: "/pdf-merger",                 destination: "/tools/merge-pdf",       permanent: true },
      { source: "/pdf-password-remover",       destination: "/tools/pdf-unlocker",   permanent: true },
      { source: "/remove-pdf-password",        destination: "/tools/pdf-unlocker",   permanent: true },
      { source: "/unlock-pdf",                 destination: "/tools/pdf-unlocker",   permanent: true },
      { source: "/compress-pdf",               destination: "/tools/pdf-compressor", permanent: true },
      { source: "/pdf-compressor-free",        destination: "/tools/pdf-compressor", permanent: true },
      // Image redirects
      { source: "/ai-image-upscaler",          destination: "/tools/image-upscaler", permanent: true },
      { source: "/upscale-image-free",         destination: "/tools/image-upscaler", permanent: true },
      { source: "/image-upscaler",             destination: "/tools/image-upscaler", permanent: true },
      { source: "/bg-remover-free",            destination: "/tools/bg-remover",     permanent: true },
      { source: "/remove-background-free",     destination: "/tools/bg-remover",     permanent: true },
      { source: "/background-remover",         destination: "/tools/bg-remover",     permanent: true },
      // Developer tool redirects
      { source: "/url-encode",                 destination: "/tools/url-encoder",    permanent: true },
      { source: "/url-decode",                 destination: "/tools/url-encoder",    permanent: true },
      { source: "/url-encoder",                destination: "/tools/url-encoder",    permanent: true },
      { source: "/regex-test",                 destination: "/tools/regex-tester",   permanent: true },
      { source: "/regex-tester",               destination: "/tools/regex-tester",   permanent: true },
      { source: "/json-format",                destination: "/tools/json-formatter", permanent: true },
      { source: "/json-formatter",             destination: "/tools/json-formatter", permanent: true },
      { source: "/markdown-html",              destination: "/tools/markdown-to-html", permanent: true },
      { source: "/text-diff",                  destination: "/tools/text-diff",      permanent: true },
      // Utility redirects
      { source: "/qr-code-generator",         destination: "/tools/qr-generator",   permanent: true },
      { source: "/password-generator-free",   destination: "/tools/password-generator", permanent: true },
      { source: "/favicon-generator-free",    destination: "/tools/favicon-generator", permanent: true },
    ];
  },
};

export default nextConfig;
