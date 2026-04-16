'use client';

import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Palette, Check, Info, AlertTriangle, CheckCircle2, Contrast } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function ContrastCheckerClient() {
  const [fg, setFg] = useState('#7C3AED');
  const [bg, setBg] = useState('#0A0A0A');
  const [ratio, setRatio] = useState(0);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  useEffect(() => {
    const rgb1 = hexToRgb(fg);
    const rgb2 = hexToRgb(bg);
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const contrast = (brightest + 0.05) / (darkest + 0.05);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRatio(Number(contrast.toFixed(2)));
  }, [fg, bg]);

  const getStatus = (req: number) => ratio >= req;

  return (
    <ToolLayout
      title="Contrast Checker"
      description="Professional accessibility validator focused on WCAG 2.1 contrast guidelines. Ensure your designs are readable by everyone."
      icon={Contrast}
      color="#8b5cf6"
    >
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* INPUTS */}
        <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-8">
            <Palette className="w-5 h-5 text-purple-400" />
            Color Configuration
          </h2>

          <div className="space-y-8">
            <div className="group">
              <label htmlFor="fgColor" className="block text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Foreground (Text)</label>
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl flex-shrink-0">
                    <input
                      title="Foreground Color Picker"
                      type="color"
                      className="absolute inset-x-[-50%] inset-y-[-50%] w-[200%] h-[200%] cursor-pointer"
                      value={fg}
                      onChange={(e) => setFg(e.target.value)}
                    />
                </div>
                <input
                  id="fgColor"
                  type="text"
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl py-4 px-6 text-xl font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all uppercase"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  placeholder="#7C3AED"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="bgColor" className="block text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Background</label>
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl flex-shrink-0">
                    <input
                      title="Background Color Picker"
                      type="color"
                      className="absolute inset-x-[-50%] inset-y-[-50%] w-[200%] h-[200%] cursor-pointer"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                    />
                </div>
                <input
                  id="bgColor"
                  type="text"
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl py-4 px-6 text-xl font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all uppercase"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  placeholder="#0A0A0A"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-10 p-10 rounded-2xl border-2 border-zinc-800 shadow-inner flex flex-col items-center justify-center min-h-[160px] transition-colors duration-300 bg-[var(--preview-bg)] text-[var(--preview-fg)]" style={{ '--preview-bg': bg, '--preview-fg': fg } as React.CSSProperties}>
             <p className="text-3xl font-black mb-2 text-center leading-tight">Elite Typographic Preview</p>
             <p className="text-base text-center opacity-90 max-w-sm">The quick brown fox jumps over the lazy dog. Designers use this text to verify readability at a glance.</p>
          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 flex flex-col backdrop-blur-sm">
          <div className="text-center py-6 mb-8 border-b border-zinc-800">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Contrast Ratio</p>
            <div className={`text-7xl font-black tracking-tighter ${ratio >= 4.5 ? 'text-green-400' : 'text-red-400'}`}>
                {ratio}<span className="text-3xl text-zinc-600">:1</span>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-400">
                {ratio >= 7 ? '🌟 Phenomenal' : ratio >= 4.5 ? '✅ Accessible' : '⚠️ Poor Contrast'}
            </p>
          </div>

          <div className="grid gap-3">
             {[
               { level: 'WCAG AA (Normal)', req: 4.5 },
               { level: 'WCAG AA (Large)', req: 3.0 },
               { level: 'WCAG AAA (Normal)', req: 7.0 },
               { level: 'WCAG AAA (Large)', req: 4.5 },
             ].map((item, i) => (
               <div key={i} className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${getStatus(item.req) ? 'bg-zinc-900/60 border-zinc-800' : 'bg-red-500/5 border-red-500/10'}`}>
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-bold text-sm">{item.level}</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Threshold: {item.req}:1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatus(item.req) ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Pass
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-black uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> Fail
                      </div>
                    )}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
        <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
            <Info className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-white font-bold text-lg mb-2">Accessibility Standards</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                The Web Content Accessibility Guidelines (WCAG) require a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Level AAA requires 7:1 for normal text. These standards ensure your content is readable by people with moderately low vision or color deficiencies.
            </p>
        </div>
      </div>
    </ToolLayout>
  );
}
