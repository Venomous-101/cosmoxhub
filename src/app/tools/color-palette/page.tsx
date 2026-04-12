import { Metadata } from 'next';
import ColorPaletteClient from './ColorPaletteClient';
import { categories } from '@/lib/tools-data';
import ToolLayout from '@/components/ToolLayout';

const tool = categories.find((c) => c.id === 'image-tools')?.tools.find((t) => t.href === '/tools/color-palette');

export const metadata: Metadata = {
  title: `${tool?.title} | CosmoxHub`,
  description: tool?.description,
  alternates: {
    canonical: `https://cosmoxhub.com${tool?.href}`,
  },
};

export default function ColorPalettePage() {
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
      title={tool?.title || 'Color Palette Generator'}
      description={tool?.description || 'Generate beautiful color palettes from any base color.'}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ColorPaletteClient />
    </ToolLayout>
  );
}
