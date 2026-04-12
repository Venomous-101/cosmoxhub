import { Metadata } from 'next';
import FaviconGeneratorClient from './FaviconGeneratorClient';
import { categories } from '@/lib/tools-data';
import ToolLayout from '@/components/ToolLayout';

const tool = categories.find((c) => c.id === 'image-tools')?.tools.find((t) => t.href === '/tools/favicon-generator');

export const metadata: Metadata = {
  title: `${tool?.title} | CosmoxHub`,
  description: tool?.description,
  alternates: {
    canonical: `https://cosmoxhub.com${tool?.href}`,
  },
};

export default function FaviconGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool?.title,
    description: tool?.description,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    url: `https://cosmoxhub.com${tool?.href}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <ToolLayout
      title={tool?.title || 'Favicon Generator'}
      description={tool?.description || 'Create favicons from text, emoji, or image.'}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaviconGeneratorClient />
    </ToolLayout>
  );
}
