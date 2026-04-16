'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Type, Smile, Upload, Download, Archive } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ToolLayout from '@/components/ToolLayout';

type TabMode = 'text' | 'emoji' | 'image';

export default function FaviconGeneratorClient() {
  const [mode, setMode] = useState<TabMode>('text');
  
  // Text & Emoji State
  const [text, setText] = useState('C');
  const [bgColor, setBgColor] = useState('#7C3AED');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [borderRadius, setBorderRadius] = useState(20);
  const [fontSize, setFontSize] = useState(60); // Percentage relative to canvas
  
  // Image State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Draw on Canvas when settings change
  useEffect(() => {
    drawPreview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text, bgColor, textColor, borderRadius, fontSize, imageSrc]);

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    if (mode === 'image' && imageSrc) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
      };
      img.src = imageSrc;
      return;
    }

    // Draw Background
    const radius = (borderRadius / 100) * (size / 2);
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.fill();

    // Draw Text/Emoji
    if (text) {
      const displayChar = text.substring(0, mode === 'emoji' ? 2 : 1).toUpperCase();
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const actualSize = (fontSize / 100) * size;
      ctx.font = `bold ${actualSize}px Inter, sans-serif`;
      ctx.fillText(displayChar, size / 2, size / 2 + (actualSize * 0.05)); // slight vertical adjustment
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  const downloadSize = (size: number) => {
    const originalCanvas = canvasRef.current;
    if (!originalCanvas) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(originalCanvas, 0, 0, size, size);
    
    const dataUrl = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadZip = async () => {
    const originalCanvas = canvasRef.current;
    if (!originalCanvas) return;

    const zip = new JSZip();
    const sizes = [16, 32, 48, 192, 512];

    for (const size of sizes) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = size;
      tempCanvas.height = size;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(originalCanvas, 0, 0, size, size);
        
        await new Promise<void>((resolve) => {
          tempCanvas.toBlob((blob) => {
            if (blob) {
              const filename = size === 16 ? 'favicon.ico' : `favicon-${size}x${size}.png`;
              zip.file(filename, blob);
            }
            resolve();
          }, 'image/png');
        });
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'favicons.zip');
  };

  return (
    <ToolLayout
      title="Favicon Generator"
      description="Create custom favicons from text, emoji, or an uploaded image. Download in all standard sizes including .ico. Free, browser-based, instant."
      icon={Archive}
      color="#7c3aed"
    >
      <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex bg-[#111111] border border-white/8 rounded-xl p-1 w-full max-w-sm mx-auto">
        <button
          onClick={() => setMode('text')}
          className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'text' ? 'bg-[#7C3AED] text-white shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Type className="w-4 h-4" /> Text
        </button>
        <button
           onClick={() => setMode('emoji')}
           className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'emoji' ? 'bg-[#7C3AED] text-white shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Smile className="w-4 h-4" /> Emoji
        </button>
        <button
           onClick={() => setMode('image')}
           className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'image' ? 'bg-[#7C3AED] text-white shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Upload className="w-4 h-4" /> Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Controls */}
        <div className="space-y-6 bg-[#111111] p-6 rounded-xl border border-white/8">
          {mode === 'image' ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-400">Upload Base Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 bg-[#0A0A0A] hover:bg-[#1A1A1A] border-2 border-dashed border-white/10 hover:border-[#7C3AED]/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group"
              >
                <input 
                  title="Upload Image"
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/png, image/jpeg, image/svg+xml" 
                  className="hidden" 
                />
                <Upload className="w-6 h-6 text-[#A78BFA] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">Click to upload image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG supported</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label htmlFor="iconText" className="block text-sm font-medium text-gray-400">
                  {mode === 'emoji' ? 'Select Emoji' : 'Letter (1 char max recommended)'}
                </label>
                <input
                  id="iconText"
                  title="Icon Text or Emoji"
                  type="text"
                  maxLength={2}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-white border border-white/8 rounded-xl p-3 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40"
                  placeholder={mode === 'emoji' ? '🚀' : 'A'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bgColortext" className="block text-xs font-medium text-gray-400">Background</label>
                  <div className="flex border border-white/8 rounded-lg overflow-hidden h-10 focus-within:ring-1 focus-within:ring-[#7C3AED]/40">
                    <input
                      title="Background Color Selector"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-full p-0 border-0 cursor-pointer"
                    />
                    <input
                      id="bgColortext"
                      title="Background Color Value"
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 bg-[#0A0A0A] text-sm text-white px-2 focus:outline-none uppercase font-mono"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="textColortext" className="block text-xs font-medium text-gray-400">Text Color</label>
                  <div className="flex border border-white/8 rounded-lg overflow-hidden h-10 focus-within:ring-1 focus-within:ring-[#7C3AED]/40">
                    <input
                      title="Text Color Selector"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-full p-0 border-0 cursor-pointer"
                    />
                    <input
                      id="textColortext"
                      title="Text Color Value"
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 bg-[#0A0A0A] text-sm text-white px-2 focus:outline-none uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/8">
                <div className="space-y-2">
                  <div className="flex text-sm justify-between text-gray-400">
                    <span>Roundness</span>
                    <span>{borderRadius}%</span>
                  </div>
                  <input
                    title="Roundness Percentage"
                    type="range"
                    min="0"
                    max="100"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full accent-[#7C3AED]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex text-sm justify-between text-gray-400">
                    <span>Icon/Text Size</span>
                    <span>{fontSize}%</span>
                  </div>
                  <input
                    title="Icon or Text Size Percentage"
                    type="range"
                    min="10"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-[#7C3AED]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Preview & Download */}
        <div className="space-y-6 flex flex-col p-6 border border-white/8 rounded-xl bg-[#0A0A0A]">
          <h3 className="text-sm font-medium text-gray-400 text-center">Live Preview</h3>
          
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full" />
              <canvas
                ref={canvasRef}
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl relative z-10 shadow-2xl border border-white/10"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/8">
             <button
                onClick={downloadZip}
                className="w-full px-6 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all flex justify-center items-center gap-2"
             >
               <Archive className="w-5 h-5" />
               Download ZIP File
             </button>
             <p className="text-xs text-center text-gray-500">Includes .ico and HD .png formats</p>
             
             <div className="flex flex-wrap justify-center gap-2">
               {[16, 32, 192, 512].map(size => (
                 <button
                   key={size}
                   onClick={() => downloadSize(size)}
                   className="px-3 py-1.5 text-xs bg-[#111111] hover:bg-[#1A1A1A] text-gray-300 rounded border border-white/8 transition-colors flex items-center gap-1"
                 >
                   <Download className="w-3 h-3" />
                   {size}x{size}
                 </button>
               ))}
             </div>
          </div>
        </div>

      </div>
      </div>
    </ToolLayout>
  );
}
