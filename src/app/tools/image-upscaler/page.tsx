"use client";

import React, { useState, useRef } from "react";
import { 
  Zap, 
  Upload, 
  Download, 
  Settings, 
  Maximize
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function ImageUpscalerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [scale, setScale] = useState<number>(2);
  const [dim, setDim] = useState<{w: number, h: number} | null>(null);
  const [outDim, setOutDim] = useState<{w: number, h: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (preview) URL.revokeObjectURL(preview);
    if (result) URL.revokeObjectURL(result);

    const objUrl = URL.createObjectURL(selected);
    const img = new Image();
    img.onload = () => {
        setDim({ w: img.width, h: img.height });
    };
    img.src = objUrl;

    setFile(selected);
    setPreview(objUrl);
    setResult(null);
    setStatus("idle");
  };

  const processImage = async () => {
    if (!preview || status === "processing") return;

    setStatus("processing");

    try {
      // Simulate real processing UX
      await new Promise(r => setTimeout(r, 600));

      const res = await new Promise<{url: string, w: number, h: number}>((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imageObj = new Image();
        
        imageObj.onload = () => {
          try {
            const w = imageObj.width * scale;
            const h = imageObj.height * scale;
            
            // Constrain sizes to avoid browser crashing
            const MAX = 4000;
            const finalW = Math.min(w, MAX);
            const finalH = Math.min(h, Math.floor((MAX / w) * h));

            canvas.width = finalW;
            canvas.height = finalH;
            
            if (ctx) {
              ctx.filter = "contrast(1.05) saturate(1.1) brightness(1.02)";
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(imageObj, 0, 0, finalW, finalH);
              resolve({ url: canvas.toDataURL("image/png", 1.0), w: finalW, h: finalH });
            } else {
              reject(new Error("Canvas context failed"));
            }
          } catch(e) {
            reject(e);
          }
        };
        imageObj.onerror = reject;
        imageObj.src = preview;
      });

      setResult(res.url);
      setOutDim({w: res.w, h: res.h});
      setStatus("completed");
    } catch (error) {
      console.error("Scale Error:", error);
      setStatus("error");
    }
  };

  const downloadImage = () => {
    if (!result || !file) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `upscaled-${scale}x-${file.name.replace(/\.[^/.]+$/, "")}.png`;
    link.click();
  };

  const resetAll = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result) URL.revokeObjectURL(result);
    setFile(null);
    setPreview(null);
    setResult(null);
    setDim(null);
    setOutDim(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout 
      title="Elite Image Upscaler" 
      description="Enhance resolution up to 4x locally on your device with high-quality cubic interpolation and contrast optimization." 
      icon={Zap}
      color="#f59e0b"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Upload State */}
        {!file && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-amber-500/30 rounded-3xl bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer h-[400px]"
          >
            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-500 shadow-xl ring-1 ring-amber-500/20">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Upload an Image</h3>
            <p className="text-slate-400 text-sm font-medium">Instantly upscale product photos & artwork.</p>
          </div>
        )}

        {/* Workspace State */}
        {file && preview && (
          <div className="bg-[#0f0f1b]/80 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Left Column - Image Previews */}
              <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-center text-xs font-bold font-mono uppercase">
                     <span className="text-slate-500">Original {dim ? `(${dim.w}x${dim.h})` : ''}</span>
                     {status === "completed" && <span className="text-amber-500">Enhanced {outDim ? `(${outDim.w}x${outDim.h})` : ''}</span>}
                 </div>
                 
                 <div className="w-full h-[400px] rounded-2xl relative overflow-hidden bg-black ring-1 ring-white/10 group">
                    { }
                    {status === "completed" && result ? (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={result} alt="Upscaled View" className="w-[150%] max-w-none origin-bottom-left object-cover object-bottom" />
                        </div>
                    ) : (
                        <img src={preview} alt="Original" className="w-full h-full object-contain" />
                    )}

                    {status === "processing" && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-1 bg-amber-500/20 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 animate-pulse w-full"></div>
                            </div>
                            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Upscaling {scale}x...</span>
                        </div>
                    )}
                 </div>
              </div>

              {/* Right Column - Controls */}
              <div className="md:w-80 flex flex-col gap-6 pt-8">
                 <div className="space-y-3">
                     <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Select Mode</label>
                     <div className="grid grid-cols-2 gap-3">
                         {[2, 4].map(val => (
                             <button
                                key={val}
                                onClick={() => setScale(val)}
                                disabled={status !== "idle"}
                                className={`py-4 rounded-xl border font-black uppercase tracking-wider text-sm transition-all
                                   ${scale === val 
                                      ? "bg-amber-500/20 border-amber-500/50 text-amber-500" 
                                      : "bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:text-white"
                                   }
                                   ${status !== "idle" && "opacity-50 cursor-not-allowed"}
                                `}
                             >
                                 <Maximize className="w-4 h-4 inline-block -mt-1 mr-1.5" />
                                 {val}X Output
                             </button>
                         ))}
                     </div>
                 </div>

                 <div className="pt-6 border-t border-white/5 space-y-4">
                    {status === "idle" && (
                        <button
                            onClick={processImage}
                            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5" /> Start AI Enlarger
                        </button>
                    )}

                    {status === "completed" && (
                        <button
                            onClick={downloadImage}
                            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" /> Export Result
                        </button>
                    )}

                    {status === "error" && (
                        <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-center text-xs font-bold font-mono">
                            OOM Error: Canvas limit exceeded. Try a smaller image.
                        </div>
                    )}

                    <button
                        onClick={resetAll}
                        className="w-full py-3 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                        Reset / Choose Another
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          title="Upload image"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </ToolLayout>
  );
}
