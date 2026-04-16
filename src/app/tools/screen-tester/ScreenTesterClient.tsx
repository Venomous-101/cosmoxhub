'use client';

import { useState, useEffect } from 'react';
import { Maximize, Monitor, X, ChevronRight, ChevronLeft } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

const COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Grey', hex: '#808080' },
];

export default function ScreenTesterClient() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextColor = () => setCurrentIndex((prev) => (prev + 1) % COLORS.length);
  const prevColor = () => setCurrentIndex((prev) => (prev - 1 + COLORS.length) % COLORS.length);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowRight' && isFullscreen) nextColor();
      if (e.key === 'ArrowLeft' && isFullscreen) prevColor();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen, currentIndex]);

  const startTest = () => {
    setIsFullscreen(true);
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(() => {});
    }
  };

  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-between cursor-none"
        style={{ backgroundColor: COLORS[currentIndex].hex }}
        onClick={nextColor}
      >
        <div className="p-4 bg-black/20 backdrop-blur-md rounded-b-xl text-white/50 text-xs font-medium uppercase tracking-widest opacity-0 hover:opacity-100 transition-opacity flex items-center gap-4">
          <span>Click to change color | Esc to exit</span>
          <span className="bg-white/10 px-2 py-0.5 rounded">{COLORS[currentIndex].name}</span>
        </div>
        
        <div className="flex justify-between w-full px-8 opacity-0 hover:opacity-100 transition-opacity">
           <button aria-label="Previous color" onClick={(e) => { e.stopPropagation(); prevColor(); }} className="p-4 bg-black/20 text-white rounded-full"><ChevronLeft /></button>
           <button aria-label="Next color" onClick={(e) => { e.stopPropagation(); nextColor(); }} className="p-4 bg-black/20 text-white rounded-full"><ChevronRight /></button>
        </div>

        <div className="p-4 opacity-0 hover:opacity-100 transition-opacity">
           <button 
             aria-label="Exit fullscreen"
             onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); if (document.exitFullscreen) document.exitFullscreen().catch(() => {}); }}
             className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2"
           >
             <X className="w-4 h-4" /> Exit Test
           </button>
        </div>
      </div>
    );
  }

  return (
    <ToolLayout
      title="Screen Dead Pixel Tester"
      description="Professional diagnostic tool to detect dead or stuck pixels and verify color uniformity on any display."
      icon={Monitor}
      color="#f87171"
    >
      <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50 pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <Monitor className="w-10 h-10 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Ready to test?</h2>
          <p className="text-zinc-400 mb-8">
            The test will enter fullscreen mode. Look closely for any spots that don&apos;t match the color on screen. We&apos;ll cycle through Red, Green, Blue, White, and Black.
          </p>

          <button 
            onClick={startTest}
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-red-600/20 transform hover:-translate-y-1 transition-all"
          >
            <Maximize className="w-5 h-5" />
            Start Fullscreen Test
          </button>

          <p className="mt-6 text-zinc-500 text-sm italic">
            Press <kbd className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700 not-italic">ESC</kbd> anytime to exit.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
         {[
           { title: "Cleaning", text: "Clean your screen before starting to avoid mistaking dust for dead pixels." },
           { title: "Darken Room", text: "Dim the lights in your room for better visibility of screen defects." },
           { title: "Look Closely", text: "Examine corner to corner for stuck (bright) or dead (dark) pixels." }
         ].map((item, i) => (
           <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
           </div>
         ))}
      </div>
    </ToolLayout>
  );
}
