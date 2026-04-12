'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Shuffle, ChevronLeft, ChevronRight, ExternalLink, Type, Check } from 'lucide-react';

interface FontPairing {
  heading: string;
  body: string;
  category: string;
  description: string;
  headingWeight: string;
  bodyWeight: string;
}

const FONT_PAIRINGS: FontPairing[] = [
  {
    heading: 'Playfair Display',
    body: 'Source Sans 3',
    category: 'Editorial',
    description: 'Classic editorial feel — great for blogs, news, and media.',
    headingWeight: '700',
    bodyWeight: '400',
  },
  {
    heading: 'Raleway',
    body: 'Lato',
    category: 'Corporate',
    description: 'Clean and modern — perfect for business and SaaS sites.',
    headingWeight: '700',
    bodyWeight: '400',
  },
  {
    heading: 'Merriweather',
    body: 'Open Sans',
    category: 'Publishing',
    description: 'Highly readable — ideal for long-form articles and documentation.',
    headingWeight: '700',
    bodyWeight: '400',
  },
  {
    heading: 'Oswald',
    body: 'Libre Baskerville',
    category: 'Contrast',
    description: 'Bold contrast between serif and condensed sans — very striking.',
    headingWeight: '600',
    bodyWeight: '400',
  },
  {
    heading: 'Montserrat',
    body: 'Nunito',
    category: 'Modern',
    description: 'Friendly and professional — great for apps and landing pages.',
    headingWeight: '800',
    bodyWeight: '400',
  },
  {
    heading: 'Cormorant Garamond',
    body: 'Proza Libre',
    category: 'Luxury',
    description: 'Elegant and sophisticated — perfect for fashion and luxury brands.',
    headingWeight: '600',
    bodyWeight: '400',
  },
  {
    heading: 'Space Grotesk',
    body: 'Inter',
    category: 'Tech',
    description: 'Modern tech aesthetic — perfect for SaaS, AI, and startup sites.',
    headingWeight: '700',
    bodyWeight: '400',
  },
  {
    heading: 'DM Serif Display',
    body: 'DM Sans',
    category: 'Premium',
    description: 'Polished and premium — works great for design agencies.',
    headingWeight: '400',
    bodyWeight: '400',
  },
  {
    heading: 'Bebas Neue',
    body: 'Roboto',
    category: 'Bold Impact',
    description: 'High-impact and bold — excellent for sports, fitness, and events.',
    headingWeight: '400',
    bodyWeight: '400',
  },
  {
    heading: 'Josefin Sans',
    body: 'Crimson Pro',
    category: 'Stylish',
    description: 'Vintage character meets readability — great for lifestyle brands.',
    headingWeight: '700',
    bodyWeight: '400',
  },
  {
    heading: 'Sora',
    body: 'Manrope',
    category: 'UI',
    description: 'Clean and sharp — designed for modern interfaces and dashboards.',
    headingWeight: '700',
    bodyWeight: '400',
  },
  {
    heading: 'Cinzel',
    body: 'Fauna One',
    category: 'Classic',
    description: 'Timeless and authoritative — works for law, finance, and history.',
    headingWeight: '700',
    bodyWeight: '400',
  },
];

function buildGoogleFontUrl(pairing: FontPairing): string {
  const h = pairing.heading.replace(/ /g, '+');
  const b = pairing.body.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${h}:wght@${pairing.headingWeight}&family=${b}:wght@400;600&display=swap`;
}

function buildImportStatement(pairing: FontPairing): string {
  return `@import url('${buildGoogleFontUrl(pairing)}');\n\n/* Heading */\nfont-family: '${pairing.heading}', serif;\n\n/* Body */\nfont-family: '${pairing.body}', sans-serif;`;
}

export default function FontPairingClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [previewText, setPreviewText] = useState(
    'The quick fox jumps over the lazy dog — a sentence for typographers.'
  );
  const [fontSize, setFontSize] = useState(48);

  const currentPairing = FONT_PAIRINGS[activeIndex];

  // Inject Google Fonts dynamically
  useEffect(() => {
    const linkId = 'font-pairing-link';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    link.href = buildGoogleFontUrl(currentPairing);
  }, [activeIndex]);

  const go = (dir: number) => {
    setActiveIndex((prev) => (prev + dir + FONT_PAIRINGS.length) % FONT_PAIRINGS.length);
  };

  const shuffle = () => {
    let next = Math.floor(Math.random() * FONT_PAIRINGS.length);
    if (next === activeIndex) next = (next + 1) % FONT_PAIRINGS.length;
    setActiveIndex(next);
  };

  const copyImport = async () => {
    try {
      await navigator.clipboard.writeText(buildImportStatement(currentPairing));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111111] p-4 sm:p-5 rounded-xl border border-white/8">
        <div className="flex items-center gap-3">
          <Type className="w-5 h-5 text-[#A78BFA] shrink-0" />
          <span className="text-white font-medium">{activeIndex + 1} / {FONT_PAIRINGS.length} Pairings</span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-[#7C3AED]/20 text-[#A78BFA] text-xs rounded-full border border-[#7C3AED]/30">
            {currentPairing.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => go(-1)} className="p-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-white/8 text-gray-400 hover:text-white rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={shuffle} className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-white/8 text-gray-400 hover:text-white rounded-lg text-sm transition-colors">
            <Shuffle className="w-4 h-4" /> Shuffle
          </button>
          <button onClick={() => go(1)} className="p-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-white/8 text-gray-400 hover:text-white rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left: Live Preview Canvas */}
        <div className="bg-[#111111] rounded-xl border border-white/8 p-6 sm:p-8 flex flex-col gap-6 min-h-[420px]">
          <div
            className="flex-1 space-y-5 transition-all duration-500"
            style={{ fontFamily: `'${currentPairing.body}', sans-serif` }}
          >
            <p
              className="text-white leading-tight break-words"
              style={{
                fontFamily: `'${currentPairing.heading}', serif`,
                fontSize: `${fontSize}px`,
                fontWeight: currentPairing.headingWeight,
                lineHeight: 1.2,
              }}
            >
              {previewText}
            </p>
            <p className="text-gray-400 text-base leading-relaxed" style={{ fontFamily: `'${currentPairing.body}', sans-serif` }}>
              Typography is the art and technique of arranging type to make written language legible, readable, and appealing. The right font pairing creates visual harmony and communicates your brand's personality instantly.
            </p>
            <div className="flex gap-3 text-sm">
              <span className="px-3 py-1.5 bg-[#0A0A0A] border border-white/8 text-[#A78BFA] rounded-lg font-mono">{currentPairing.heading}</span>
              <span className="text-gray-600 self-center">+</span>
              <span className="px-3 py-1.5 bg-[#0A0A0A] border border-white/8 text-gray-400 rounded-lg font-mono">{currentPairing.body}</span>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-white/8">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Heading Size</span>
              <span>{fontSize}px</span>
            </div>
            <input type="range" min="24" max="80" step="2" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-[#7C3AED]" />
          </div>
        </div>

        {/* Right: Details + Code */}
        <div className="flex flex-col gap-4">

          {/* Pairing Info */}
          <div className="bg-[#111111] rounded-xl border border-white/8 p-5 space-y-4">
            <h3 className="text-white font-semibold text-lg">{currentPairing.heading} + {currentPairing.body}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{currentPairing.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0A0A0A] rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-500">Heading Font</p>
                <p className="text-white text-sm font-medium" style={{ fontFamily: `'${currentPairing.heading}', serif` }}>{currentPairing.heading}</p>
                <p className="text-gray-600 text-xs">Weight: {currentPairing.headingWeight}</p>
              </div>
              <div className="bg-[#0A0A0A] rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-500">Body Font</p>
                <p className="text-white text-sm font-medium" style={{ fontFamily: `'${currentPairing.body}', sans-serif` }}>{currentPairing.body}</p>
                <p className="text-gray-600 text-xs">Weight: 400, 600</p>
              </div>
            </div>
            <a
              href={`https://fonts.google.com/specimen/${currentPairing.heading.replace(/ /g, '+')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#A78BFA] hover:text-white text-sm transition-colors"
            >
              View on Google Fonts <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* CSS Import Code */}
          <div className="bg-[#111111] rounded-xl border border-white/8 p-5 flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">CSS Import Code</span>
              <button
                onClick={copyImport}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <pre className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 text-xs text-[#A78BFA] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed flex-1">
              {buildImportStatement(currentPairing)}
            </pre>
          </div>

        </div>
      </div>

      {/* Custom Preview Text */}
      <div className="bg-[#111111] p-5 rounded-xl border border-white/8 space-y-3">
        <label className="block text-sm font-medium text-gray-400">Customize Preview Text</label>
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className="w-full bg-[#0A0A0A] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40"
          placeholder="Enter your own preview text..."
        />
      </div>

      {/* All Pairings Grid */}
      <div className="bg-[#111111] p-5 rounded-xl border border-white/8 space-y-4">
        <h3 className="text-sm font-medium text-gray-400">All {FONT_PAIRINGS.length} Curated Pairings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FONT_PAIRINGS.map((pair, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`text-left p-3 rounded-lg border transition-all ${
                i === activeIndex
                  ? 'bg-[#7C3AED]/10 border-[#7C3AED]/40 text-white'
                  : 'bg-[#0A0A0A] border-white/5 text-gray-400 hover:border-white/15 hover:text-white'
              }`}
            >
              <p className="text-sm font-medium truncate">{pair.heading}</p>
              <p className="text-xs text-gray-500 truncate">+ {pair.body}</p>
              <span className={`mt-1 inline-block text-xs px-1.5 py-0.5 rounded ${i === activeIndex ? 'bg-[#7C3AED]/30 text-[#A78BFA]' : 'bg-white/5 text-gray-600'}`}>
                {pair.category}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
