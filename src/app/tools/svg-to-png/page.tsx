import { Metadata } from 'next';
import SvgToPngClient from './SvgToPngClient';
import { categories } from '@/lib/tools-data';
import ToolLayout from '@/components/ToolLayout';

const tool = categories.find((c) => c.id === 'image-tools')?.tools.find((t) => t.href === '/tools/svg-to-png');

export const metadata: Metadata = {
  title: `${tool?.title} | CosmoxHub`,
  description: tool?.description,
  alternates: {
    canonical: `https://cosmoxhub.com${tool?.href}`,
  },
};

export default function SvgToPngPage() {
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
      title={tool?.title || 'SVG to PNG'}
      description={tool?.description || 'Convert SVG files to PNG at any resolution.'}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SvgToPngClient />
    </ToolLayout>
  );
}
