import { Metadata } from 'next';
import MarkdownToHtmlClient from './MarkdownToHtmlClient';
import { categories } from '@/lib/tools-data';
import ToolLayout from '@/components/ToolLayout';

const tool = categories.find((c) => c.id === 'ai-dev-tools')?.tools.find((t) => t.href === '/tools/markdown-to-html');

export const metadata: Metadata = {
  title: `${tool?.title} | CosmoxHub`,
  description: tool?.description,
  alternates: {
    canonical: `https://cosmoxhub.com${tool?.href}`,
  },
};

export default function MarkdownToHtmlPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool?.title,
    description: tool?.description,
    applicationCategory: 'DeveloperApplication',
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
      title={tool?.title || 'Markdown to HTML'}
      description={tool?.description || 'Convert Markdown to HTML with live preview.'}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarkdownToHtmlClient />
    </ToolLayout>
  );
}
