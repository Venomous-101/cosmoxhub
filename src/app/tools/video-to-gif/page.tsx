import { Metadata } from 'next';
import VideoToGifClient from './VideoToGifClient';
import { categories } from '@/lib/tools-data';
import ToolLayout from '@/components/ToolLayout';

const tool = categories.find((c) => c.id === 'image-tools')?.tools.find((t) => t.href === '/tools/video-to-gif');

export const metadata: Metadata = {
  title: `Video to GIF Converter — Free Online Tool | CosmoxHub`,
  description: tool?.description,
  alternates: {
    canonical: `https://www.cosmoxhub.com/tools/video-to-gif`,
  },
  other: {
    // Hint browser to prefetch FFmpeg WASM on page load (complements hover preload)
    "link-prefetch-ffmpeg-core": "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
    "link-prefetch-ffmpeg-wasm": "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
  },
};

export default function VideoToGifPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool?.title,
    description: tool?.description,
    applicationCategory: 'MultimediaApplication',
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
      title={tool?.title || 'Video to GIF'}
      description={tool?.description || 'Convert video to GIF in your browser. No upload.'}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoToGifClient />
    </ToolLayout>
  );
}
