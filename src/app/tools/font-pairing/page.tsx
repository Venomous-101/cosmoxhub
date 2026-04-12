import { Metadata } from 'next';
import FontPairingClient from './FontPairingClient';
import ToolLayout from '@/components/ToolLayout';

export const metadata: Metadata = {
  title: 'Font Pairing Tool — Find Perfect Font Combinations | CosmoxHub',
  description:
    'Discover beautiful Google Font pairings for your next design project. Browse curated heading + body font combos with live preview, instantly copy the import link.',
  alternates: {
    canonical: 'https://cosmoxhub.com/tools/font-pairing',
  },
};

export default function FontPairingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Font Pairing Tool',
    description:
      'Discover beautiful Google Font pairings for your next design project. Browse curated heading + body font combos with live preview.',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    url: 'https://cosmoxhub.com/tools/font-pairing',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <ToolLayout
      title="Font Pairing Tool"
      description="Discover curated Google Font pairings with live preview. Find the perfect heading + body combination for your next project."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FontPairingClient />
    </ToolLayout>
  );
}
