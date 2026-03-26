import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cosmoxhub.com';

  const routes = [
    '',
    '/tools/merge-pdf',
    '/tools/split-pdf',
    '/tools/image-to-pdf',
    '/tools/pdf-to-image',
    '/tools/word-counter',
    '/tools/case-converter',
    '/tools/whitespace-remover',
    '/tools/lorem-ipsum',
    '/tools/png-to-jpg',
    '/tools/jpg-to-png',
    '/tools/image-resizer',
    '/tools/whatsapp-link',
    '/tools/qr-generator',
    '/tools/age-calculator',
    '/tools/password-generator',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
