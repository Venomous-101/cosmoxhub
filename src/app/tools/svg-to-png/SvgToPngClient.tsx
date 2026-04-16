'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { saveAs } from 'file-saver';
import ToolLayout from '@/components/ToolLayout';

export default function SvgToPngClient() {
  const [svgContent, setSvgContent] = useState<string>('');
  const [filename, setFilename] = useState<string>('converted-image');
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderSvgToCanvas = useCallback(() => {
    if (!canvasRef.current || !svgContent) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      setPngDataUrl(canvas.toDataURL('image/png'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [svgContent, width, height]);

  useEffect(() => {
    if (svgContent) {
      renderSvgToCanvas();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPngDataUrl(null);
    }
  }, [svgContent, renderSvgToCanvas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name.replace(/\.svg$/i, ''));
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setSvgContent(text);
        
        // Try to extract native width/height to preserve aspect ratio
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgElement = doc.documentElement;
        
        let w = parseFloat(svgElement.getAttribute('width') || '0');
        let h = parseFloat(svgElement.getAttribute('height') || '0');
        
        if (!w || !h) {
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            const parts = viewBox.split(' ');
            w = parseFloat(parts[2]);
            h = parseFloat(parts[3]);
          } else {
             w = 500; h = 500;
          }
        }
        
        if (w && h) {
           setWidth(Math.round(w));
           setHeight(Math.round(h));
           setAspectRatio(w / h);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    setHeight(Math.round(newWidth / aspectRatio));
  };

  const downloadPng = () => {
    if (!pngDataUrl) return;
    saveAs(pngDataUrl, `${filename}.png`);
  };

  const clearAll = () => {
    setSvgContent('');
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolLayout
      title="SVG to PNG Converter"
      description="Convert SVG files to high-resolution PNG images instantly. Upload or paste SVG code, set custom output dimensions, and download. Free, browser-based."
      icon={ImageIcon}
      color="#7c3aed"
    >
      <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Left Side: Upload & Settings */}
        <div className="space-y-6 flex flex-col bg-[#111111] p-6 rounded-xl border border-white/8">
          
          <div className="space-y-3">
            <label htmlFor="svg-file-upload" className="block text-sm font-medium text-gray-400">Upload SVG File</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 bg-[#0A0A0A] hover:bg-[#1A1A1A] border-2 border-dashed border-white/10 hover:border-[#7C3AED]/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group"
            >
              <input 
                id="svg-file-upload"
                title="Upload SVG file"
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".svg, image/svg+xml" 
                className="hidden" 
              />
              <Upload className="w-6 h-6 text-[#A78BFA] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">{svgContent ? 'Upload another SVG' : 'Click to select SVG file'}</p>
            </div>
          </div>

          <div className="space-y-3">
             <label htmlFor="svg-code-input" className="block text-sm font-medium text-gray-400">Or Paste SVG Code</label>
             <textarea
               id="svg-code-input"
               title="Paste SVG code"
               value={svgContent}
               onChange={(e) => setSvgContent(e.target.value)}
               placeholder="<svg>...</svg>"
               className="w-full h-32 bg-[#0A0A0A] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-xs"
             />
          </div>

          {svgContent && (
            <div className="space-y-4 pt-4 border-t border-white/8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <label htmlFor="output-width-slider">Output Width</label>
                  <span>{width}px</span>
                </div>
                <input 
                  id="output-width-slider"
                  title="Output Width"
                  type="range" min="16" max="4096" step="1" 
                  value={width} 
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full accent-[#7C3AED]"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Calculated Height:</span>
                <span>{height}px</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Output & Preview */}
        <div className="space-y-6 flex flex-col bg-[#111111] p-6 rounded-xl border border-white/8 relative">
           <h3 className="block text-sm font-medium text-gray-400 mb-2">Preview (PNG)</h3>
           
           <div className="flex-1 min-h-[300px] w-full bg-[#0A0A0A] border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center overflow-hidden relative">
             <canvas ref={canvasRef} className="hidden" />
             {pngDataUrl ? (
               <>{/* eslint-disable-next-line @next/next/no-img-element */}
               <img loading="lazy" decoding="async" src={pngDataUrl} alt="Preview" className="max-w-full max-h-full object-contain p-4" /></>
             ) : (
               <div className="flex flex-col items-center justify-center text-gray-500">
                 <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                 <p className="text-sm">Image preview will appear here</p>
               </div>
             )}
           </div>

           {pngDataUrl && (
             <div className="absolute top-8 right-8">
               <span className="bg-[#7C3AED] text-white text-xs px-2 py-1 rounded shadow-lg border border-white/20 font-mono">
                 {width} x {height}
               </span>
             </div>
           )}
        </div>
      </div>

      <div className="flex justify-center bg-[#111111] p-4 sm:p-6 rounded-xl border border-white/8 gap-4">
        {pngDataUrl && (
          <button
            onClick={downloadPng}
            className="flex-1 sm:flex-none px-8 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        )}
        <button
          onClick={clearAll}
          disabled={!svgContent}
          className="flex-1 sm:flex-none px-8 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Everything
        </button>
      </div>

      </div>
    </ToolLayout>
  );
}
