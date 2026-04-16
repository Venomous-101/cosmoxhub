'use client';

import { useState } from 'react';
import { Box, Lock, Unlock, Monitor, Ratio } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function AspectRatioClient() {
  const [w1, setW1] = useState<number | ''>(1920);
  const [h1, setH1] = useState<number | ''>(1080);
  const [w2, setW2] = useState<number | ''>(1280);
  const [h2, setH2] = useState<number | ''>(720);
  const [isLocked, setIsLocked] = useState(true);

  // Calculates GCD to display ratio (e.g., 16:9)
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const getRatio = () => {
    if (!w1 || !h1 || w1 <= 0 || h1 <= 0) return '0:0';
    const divisor = gcd(Number(w1), Number(h1));
    return `${Number(w1) / divisor}:${Number(h1) / divisor}`;
  };

  const handleW1Change = (val: string) => {
    const newVal = val === '' ? '' : Number(val);
    setW1(newVal);
    if (isLocked && newVal && h1 && w1) {
      setH2(Math.round((Number(h1) / Number(w1)) * Number(newVal)));
      setW2(newVal);
    }
  };

  const handleH1Change = (val: string) => {
    const newVal = val === '' ? '' : Number(val);
    setH1(newVal);
  };

  const handleW2Change = (val: string) => {
    const newVal = val === '' ? '' : Number(val);
    setW2(newVal);
    if (isLocked && newVal && w1 && h1) {
      setH2(Math.round((Number(h1) / Number(w1)) * Number(newVal)));
    }
  };

  const handleH2Change = (val: string) => {
    const newVal = val === '' ? '' : Number(val);
    setH2(newVal);
    if (isLocked && newVal && w1 && h1) {
      setW2(Math.round((Number(w1) / Number(h1)) * Number(newVal)));
    }
  };

  return (
    <ToolLayout
      title="Aspect Ratio Calculator"
      description="Easily calculate and scale dimensions for images, videos, and screens while maintaining perfectly locked aspect ratios."
      icon={Ratio}
      color="#3b82f6"
    >
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        {/* TOP ROW: Original Ratio */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-blue-400" />
            Base Resolution (Source)
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="w1" className="block text-sm font-medium text-zinc-400 mb-2">Width (W1)</label>
              <input
                id="w1"
                type="number"
                min="1"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={w1}
                onChange={(e) => handleW1Change(e.target.value)}
              />
            </div>
            <div className="pt-6 font-bold text-zinc-500 text-xl">×</div>
            <div className="flex-1">
              <label htmlFor="h1" className="block text-sm font-medium text-zinc-400 mb-2">Height (H1)</label>
              <input
                id="h1"
                type="number"
                min="1"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={h1}
                onChange={(e) => handleH1Change(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-zinc-500">Calculated Aspect Ratio:</span>
            <span className="font-bold text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">{getRatio()}</span>
          </div>
        </div>

        <div className="h-px bg-zinc-800 mb-8 relative">
           <button 
             onClick={() => setIsLocked(!isLocked)}
             className={`absolute left-1/2 -top-5 -translate-x-1/2 bg-[#111111] border ${isLocked ? 'border-blue-500/50 text-blue-400' : 'border-zinc-700 text-zinc-500'} p-2.5 rounded-full hover:scale-110 transition-all shadow-xl z-10`}
             title={isLocked ? "Ratio Locked" : "Ratio Unlocked"}
           >
              {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
           </button>
        </div>

        {/* BOTTOM ROW: New Size */}
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Box className="w-5 h-5 text-indigo-400" />
            Target Dimensions (Scaled)
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="w2" className="block text-sm font-medium text-zinc-400 mb-2">New Width (W2)</label>
              <input
                id="w2"
                type="number"
                min="1"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                value={w2}
                onChange={(e) => handleW2Change(e.target.value)}
              />
            </div>
            <div className="pt-6 font-bold text-zinc-500 text-xl">×</div>
            <div className="flex-1">
              <label htmlFor="h2" className="block text-sm font-medium text-zinc-400 mb-2">New Height (H2)</label>
              <input
                id="h2"
                type="number"
                min="1"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                value={h2}
                onChange={(e) => handleH2Change(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* COMMON RATIOS */}
      <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Ratio className="w-4 h-4 text-blue-400" />
          Common Ratios
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '16:9 (HD)', w: 1920, h: 1080 },
            { label: '4:3 (SD)', w: 1024, h: 768 },
            { label: '1:1 (Square)', w: 1080, h: 1080 },
            { label: '21:9 (Ultrawide)', w: 2560, h: 1080 }
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => {
                setW1(r.w);
                setH1(r.h);
                if (isLocked) {
                   setH2(Math.round((r.h / r.w) * Number(w2 || 0)));
                }
              }}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-center"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
