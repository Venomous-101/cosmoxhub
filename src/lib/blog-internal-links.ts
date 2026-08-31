// Blog post internal linking strategy
// Maps each blog post slug to related tools and other blog posts for strategic internal linking

export const blogInternalLinks: Record<string, {
  relatedTools: Array<{ name: string; path: string; description: string }>;
  relatedPosts: string[];
}> = {
  'zapier-make-webhook-testing-guide': {
    relatedTools: [
      { name: 'API Tester', path: '/tools/api-tester', description: 'Test webhooks and APIs directly in browser' },
      { name: 'JSON Formatter', path: '/tools/json-formatter', description: 'Format and validate JSON payloads' },
      { name: 'Code Beautifier', path: '/tools/code-beautifier', description: 'Pretty-print code for debugging' },
    ],
    relatedPosts: ['understanding-cors-api-proxies', 'lightweight-postman-alternatives-2026'],
  },
  'understanding-cors-api-proxies': {
    relatedTools: [
      { name: 'API Tester', path: '/tools/api-tester', description: 'Test APIs with CORS handling' },
      { name: 'JSON Formatter', path: '/tools/json-formatter', description: 'Validate API responses' },
    ],
    relatedPosts: ['zapier-make-webhook-testing-guide', 'lightweight-postman-alternatives-2026'],
  },
  'lightweight-postman-alternatives-2026': {
    relatedTools: [
      { name: 'API Tester', path: '/tools/api-tester', description: 'Free Postman alternative for API testing' },
      { name: 'JSON Formatter', path: '/tools/json-formatter', description: 'Format API responses' },
      { name: 'Code Beautifier', path: '/tools/code-beautifier', description: 'Beautify response payloads' },
    ],
    relatedPosts: ['understanding-cors-api-proxies', 'zapier-make-webhook-testing-guide'],
  },
  'free-alternative-remove-bg': {
    relatedTools: [
      { name: 'Image Compressor', path: '/tools/image-compressor', description: 'Reduce file size after BG removal' },
      { name: 'Image Upscaler', path: '/tools/image-upscaler', description: 'Enhance removed background images' },
    ],
    relatedPosts: ['how-to-compress-pdf-without-losing-quality-mobile'],
  },
  'how-to-compress-pdf-without-losing-quality-mobile': {
    relatedTools: [
      { name: 'PDF Compressor', path: '/tools/pdf-compressor', description: 'Compress PDFs without quality loss' },
      { name: 'PDF Merger', path: '/tools/merge-pdf', description: 'Combine multiple PDFs' },
      { name: 'PDF Splitter', path: '/tools/split-pdf', description: 'Split large PDF files' },
    ],
    relatedPosts: ['free-alternative-remove-bg'],
  },
};

// Default internal links for posts without specific mappings
export const getDefaultInternalLinks = (postSlug: string) => ({
  relatedTools: [
    { name: 'API Tester', path: '/tools/api-tester', description: 'Test any API or webhook' },
    { name: 'JSON Formatter', path: '/tools/json-formatter', description: 'Format and validate data' },
  ],
  relatedPosts: [],
});

export function getBlogInternalLinks(slug: string) {
  return blogInternalLinks[slug] || getDefaultInternalLinks(slug);
}
