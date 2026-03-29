"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Download, 
  Eraser, 
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

import { motion } from "framer-motion";

// Client-side only import type
type RemoveBgFn = (source: Blob | string | File, options?: Record<string, unknown>) => Promise<Blob>;
let removeBackground: RemoveBgFn;

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [progress, setProgress] = useState<number>(0);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [bgMode, setBgMode] = useState<"transparent" | "white" | "blue">("transparent");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@imgly/background-removal").then((module) => {
        removeBackground = module.removeBackground as unknown as RemoveBgFn;
        setAiLoaded(true);
      }).catch(err => {
        console.error("Failed to load AI Engine:", err);
      });
    }
  }, []);

  useEffect(() => {
    // Cleanup preview URLs
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (result) URL.revokeObjectURL(result);
    };
  }, [preview, result]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (preview) URL.revokeObjectURL(preview);
    if (result) URL.revokeObjectURL(result);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setStatus("idle");
    setProgress(0);
  };

  const processImage = async () => {
    if (!file || !removeBackground || status === "processing") return;

    setStatus("processing");
    setProgress(0);

    try {
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          try {
            if (total) {
              const p = Math.round((current / total) * 100);
              setProgress(p);
            }
          } catch (e) {
            console.error(e);
          }
        },
        publicPath: "https://static.imgly.com/@imgly/background-removal-data/1.7.0/dist/",
        model: "medium",
        output: {
          format: "image/png",
          quality: 0.9
        }
      });
      
      const url = URL.createObjectURL(blob);
      setResult(url);
      setStatus("completed");
    } catch (error) {
      console.error("AI Error:", error);
      setStatus("error");
    }
  };

  const downloadImage = async () => {
    if (!result || !file) return;

    // If transparent, download normally
    if (bgMode === "transparent") {
      const link = document.createElement("a");
      link.href = result;
      link.download = `nobg-${file.name.replace(/\.[^/.]+$/, "")}.png`;
      link.click();
      return;
    }

    // Apply colored background via Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        // Draw background
        ctx.fillStyle = bgMode === "white" ? "#ffffff" : "#0055ff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw isolated image
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.download = `${bgMode}-bg-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
        link.click();
      }
    };
    img.src = result;
  };

  const resetAll = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result) URL.revokeObjectURL(result);
    setFile(null);
    setPreview(null);
    setResult(null);
    setStatus("idle");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout 
      title="Background Remover" 
      description="Instantly remove backgrounds and apply professional white or blue backdrops for free." 
      icon={Eraser}
      color="#8b5cf6"
    >
      <style jsx global>{`
        .checkerboard-bg {
          background-image: linear-gradient(45deg, #121221 25%, transparent 25%), 
                            linear-gradient(-45deg, #121221 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #121221 75%), 
                            linear-gradient(-45deg, transparent 75%, #121221 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Upload State */}
        {!file && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-violet-500/30 rounded-[2.5rem] bg-violet-500/5 hover:bg-violet-500/10 transition-all cursor-pointer h-96 group"
          >
            <div className="w-24 h-24 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6 text-violet-500 group-hover:scale-110 transition-transform">
              <Upload className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight italic">Drop or Upload Image</h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Supports PNG, JPG, WEBP · Max 10MB</p>
          </motion.div>
        )}

        {/* Workspace State */}
        {file && preview && (
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 mb-8 h-auto">
              
              {/* Original Preview */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Input Image</span>
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 relative flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
              </div>

              {/* Result Preview */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Isolated Result</span>
                <div className={`aspect-square rounded-[2rem] overflow-hidden border border-violet-500/20 relative flex items-center justify-center transition-colors duration-500 ${
                  bgMode === "white" ? "bg-white" : bgMode === "blue" ? "bg-[#0055ff]" : "bg-black/40 checkerboard-bg"
                }`}>
                  
                  {status === "idle" && (
                     <div className="text-center text-slate-500 flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">Pending Extraction</span>
                     </div>
                  )}

                  {status === "processing" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 w-full p-8 text-center">
                       <RefreshCw className="w-8 h-8 text-pink-500 animate-spin mb-4" />
                       <div className="w-full max-w-xs bg-white/10 rounded-full h-2 mb-2">
                        <motion.div 
                          className="bg-pink-500 h-2 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                       </div>
                       <span className="text-white text-sm font-medium">Removing Background... {progress}%</span>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="text-center text-rose-500 flex flex-col items-center px-8">
                       <RefreshCw className="w-8 h-8 mb-4 opacity-50" />
                       <span className="text-sm font-black uppercase tracking-widest mb-1">AI Engine Failed</span>
                       <span className="text-xs text-slate-500 font-medium">This usually happens due to browser memory limits. Please reload and try again.</span>
                    </div>
                  )}

                  {result && (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={result} alt="Result" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                  )}
                </div>
              </div>
            </div>

            {/* Background Style Selector */}
            {status === "completed" && (
              <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/20 rounded-xl"><Sparkles className="w-4 h-4 text-violet-400" /></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Customize Background</span>
                  </div>
                  <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                    {[
                      { id: "transparent", label: "None", class: "bg-white/10" },
                      { id: "white", label: "White", class: "bg-white" },
                      { id: "blue", label: "Blue", class: "bg-[#0055ff]" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setBgMode(opt.id as any)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          bgMode === opt.id ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-2 pt-6 border-t border-white/10">
              <button
                onClick={resetAll}
                className="px-8 py-3 rounded-2xl border border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
              >
                Reset
              </button>

              {status === "idle" && (
                 <button
                    onClick={processImage}
                    disabled={!aiLoaded}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all font-black text-xs shadow-2xl shadow-violet-500/20 uppercase tracking-[0.2em]"
                 >
                    <Eraser className="w-5 h-5" />
                    {aiLoaded ? "Auto Remove" : "Initializing AI..."}
                 </button>
              )}

              {status === "processing" && (
                 <button disabled className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-violet-600/40 text-white cursor-not-allowed font-black text-xs uppercase tracking-[0.2em]">
                    <RefreshCw className="w-5 h-5 animate-spin" /> Processing
                 </button>
              )}

              {status === "completed" && (
                 <button
                    onClick={downloadImage}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white transition-all font-black text-xs shadow-2xl shadow-violet-500/20 uppercase tracking-[0.2em]"
                 >
                    <Download className="w-5 h-5" />
                    Download HD
                 </button>
              )}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          title="Upload Image"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </ToolLayout>
  );
}
