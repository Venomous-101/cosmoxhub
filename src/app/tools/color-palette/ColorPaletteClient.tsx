'use client';

import React, { useState, useMemo } from 'react';
import { Palette, Copy, CheckCircle2 } from 'lucide-react';

// Color conversion helpers
function hexToHSL(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

type PaletteType = 'monochromatic' | 'analogous' | 'complementary' | 'triadic';

export default function ColorPaletteClient() {
  const [baseColor, setBaseColor] = useState('#7C3AED');
  const [paletteType, setPaletteType] = useState<PaletteType>('monochromatic');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBaseColor(value);
  };

  const palette = useMemo(() => {
    if (!/^#[0-9A-Fa-f]{6}$/i.test(baseColor)) return ['#111111', '#111111', '#111111', '#111111', '#111111'];
    
    const [h, s, l] = hexToHSL(baseColor);
    let colors: string[] = [];

    switch (paletteType) {
      case 'monochromatic':
        colors = [
          hslToHex(h, s, Math.max(0, l - 40)),
          hslToHex(h, s, Math.max(0, l - 20)),
          baseColor.toUpperCase(),
          hslToHex(h, s, Math.min(100, l + 20)),
          hslToHex(h, s, Math.min(100, l + 40)),
        ];
        break;
      case 'analogous':
        colors = [
          hslToHex((h - 60 + 360) % 360, s, l),
          hslToHex((h - 30 + 360) % 360, s, l),
          baseColor.toUpperCase(),
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h + 60) % 360, s, l),
        ];
        break;
      case 'complementary':
        colors = [
          baseColor.toUpperCase(),
          hslToHex(h, s, Math.max(0, l - 20)),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 180) % 360, s, Math.min(100, l + 20)),
          hslToHex((h + 180) % 360, s, Math.max(0, l - 20)),
        ];
        break;
      case 'triadic':
        colors = [
          baseColor.toUpperCase(),
          hslToHex((h + 120) % 360, s, Math.min(100, l + 15)),
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, Math.min(100, l + 15)),
          hslToHex((h + 240) % 360, s, l),
        ];
        break;
    }
    return colors;
  }, [baseColor, paletteType]);

  const copyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-6 p-6 bg-[#111111] border border-white/8 rounded-xl items-center justify-between">
        <div className="space-y-2 w-full sm:w-auto flex-grow">
          <label className="block text-sm font-medium text-gray-400">Base Color</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={baseColor}
              onChange={handleColorChange}
              className="w-14 h-14 rounded cursor-pointer bg-transparent outline-none p-0 border-0"
            />
            <input
              type="text"
              value={baseColor}
              onChange={handleColorChange}
              className="w-32 bg-[#0A0A0A] text-[#A78BFA] border border-white/8 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 font-mono text-base uppercase transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2 w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-400">Palette Type</label>
          <div className="flex flex-wrap gap-2">
            {(['monochromatic', 'analogous', 'complementary', 'triadic'] as PaletteType[]).map((type) => (
              <button
                key={type}
                onClick={() => setPaletteType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  paletteType === type 
                  ? 'bg-[#7C3AED] text-white shadow-lg' 
                  : 'bg-[#0A0A0A] text-gray-400 border border-white/8 hover:text-white hover:border-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Palette Display */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#A78BFA]" />
          <h2 className="text-xl font-semibold text-white capitalize">{paletteType} Palette</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {palette.map((hex, index) => (
            <div 
              key={index}
              onClick={() => copyColor(hex)}
              className="flex flex-col group cursor-pointer"
            >
              <div 
                className="w-full h-32 sm:h-48 rounded-t-xl transition-transform transform origin-bottom group-hover:scale-[1.02] shadow-xl border border-white/5"
                style={{ backgroundColor: hex }}
              />
              <div className="bg-[#111111] p-4 rounded-b-xl border border-white/8 border-t-0 flex justify-between items-center group-hover:bg-[#141414] transition-colors">
                <span className="font-mono text-white text-sm sm:text-base">{hex}</span>
                {copiedHex === hex ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">Click any color card to copy its HEX code.</p>
      </div>

    </div>
  );
}
