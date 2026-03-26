"use client";
import { useState, useRef } from "react";
import { Image as ImageIcon, Upload, Download } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function PNGToJPGPage() {
  const [images, setImages] = useState<{ name: string; url: string; convertedUrl?: string }[]>([]);
  const [converting, setConverting] = useState(false);

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const imgs = Array.from(files).filter(f => f.type === "image/png").map(f => ({
      name: f.name.replace(/\.[^/.]+$/, ""),
      url: URL.createObjectURL(f),
    }));
    setImages(prev => [...prev, ...imgs]);
  };

  const convertAll = async () => {
    setConverting(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const newImages = [...images];
    for (let i = 0; i < newImages.length; i++) {
        if (newImages[i].convertedUrl) continue;
        
        await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                if (ctx) {
                    ctx.fillStyle = "#FFFFFF"; // JPG doesn't support transparency, fill with white
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    newImages[i].convertedUrl = canvas.toDataURL("image/jpeg", 0.92);
                }
                resolve();
            };
            img.src = newImages[i].url;
        });
    }
    setImages(newImages);
    setConverting(false);
  };

  const downloadAll = () => {
    images.forEach(img => {
        if (img.convertedUrl) {
            const a = document.createElement("a");
            a.href = img.convertedUrl;
            a.download = `${img.name}-cosmoxhub.jpg`;
            a.click();
        }
    });
  };

  const downloadOne = (url: string, name: string) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-cosmoxhub.jpg`;
      a.click();
  };

  return (
    <ToolLayout title="PNG to JPG" description="Convert PNG images to JPG format instantly. Supports batch conversion. Transparency is automatically replaced with white." icon={ImageIcon} color="#10b981">
      <div 
        className="upload-zone flex flex-col items-center justify-center p-10 border-2 border-dashed border-emerald-500/30 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-colors" 
        onClick={() => document.getElementById("png-input")?.click()}
        title="Click to upload PNG images"
      >
        <Upload className="mb-3 text-emerald-500 w-8 h-8" />
        <p className="text-slate-400 text-sm">Drop PNG images here or <span className="text-emerald-500 font-medium">click to browse</span></p>
        <input 
          id="png-input" 
          type="file" 
          accept="image/png" 
          multiple 
          className="hidden"
          title="File input for PNG images"
          onChange={(e) => addImages(e.target.files)} 
        />
      </div>

      {images.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-400 text-sm font-medium">{images.length} image(s) selected:</p>
            <div className="flex gap-3">
                <button 
                  className="btn-primary flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white rounded-lg transition-all" 
                  onClick={convertAll} 
                  disabled={converting || images.every(i => i.convertedUrl)}
                  title="Convert all images to JPG"
                >
                  {converting ? "Converting..." : "Convert All"}
                </button>
                {images.some(i => i.convertedUrl) && (
                    <button 
                      className="btn-secondary flex items-center gap-2 px-4 py-2 font-medium text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 rounded-lg transition-all" 
                      onClick={downloadAll}
                      title="Download all converted JPG images"
                    >
                        <Download size={16} /> Download All
                    </button>
                )}
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {images.map((img, i) => (
              <div key={i} className="card p-4 flex flex-col gap-3 bg-[#050510] border border-emerald-500/10 rounded-xl">
                <img 
                  src={img.url} 
                  alt={img.name} 
                  className="w-full h-[120px] object-contain bg-white/5 rounded-lg" 
                />
                <p className="text-slate-100 text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis" title={`${img.name}.png`}>
                  {img.name}.png
                </p>
                
                {img.convertedUrl ? (
                    <button 
                      onClick={() => downloadOne(img.convertedUrl!, img.name)} 
                      className="btn-primary mt-auto text-xs py-1.5 px-3 flex justify-center items-center gap-1.5 bg-emerald-500/15 text-emerald-500 shadow-none border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg font-medium transition-colors"
                      title="Download converted JPG"
                    >
                        <Download size={14} /> Download JPG
                    </button>
                ) : (
                    <button 
                      disabled 
                      className="mt-auto text-xs py-1.5 px-3 flex justify-center items-center gap-1.5 bg-transparent text-slate-500 border border-dashed border-slate-600 rounded-lg cursor-not-allowed font-medium"
                      title="Waiting for conversion"
                    >
                        Waiting to convert
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
