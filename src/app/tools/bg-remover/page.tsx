"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ImageIcon, 
  Trash2, 
  Download, 
  Eraser, 
  Sparkles, 
  Palette, 
  Check, 
  Loader2,
  Info,
  Eye,
  Upload,
  Zap,
  ShieldCheck,
  CheckCircle2,
  X,
  Cpu
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  status: "idle" | "fetching-weights" | "processing" | "completed" | "error";
  progress: number;
  resultUrl?: string;
}

// Client-side only import - typed via cast to avoid module namespace mismatch
type RemoveBgFn = (source: Blob | string | File, options?: Record<string, unknown>) => Promise<Blob>;
let removeBackground: RemoveBgFn;

export default function BackgroundRemoverPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [modelType, setModelType] = useState<"small" | "medium">("medium");
  const [bgColor, setBgColor] = useState("transparent");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [showOriginalId, setShowOriginalId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newImg: ImageFile = {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        name: file.name.replace(/\.[^/.]+$/, ""),
        size: file.size,
        status: "idle",
        progress: 0,
      };
      setImages((prev) => [...prev, newImg]);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
        const removed = prev.find(i => i.id === id);
        if(removed?.preview) URL.revokeObjectURL(removed.preview);
        if(removed?.resultUrl) URL.revokeObjectURL(removed.resultUrl);
        return prev.filter((img) => img.id !== id);
    });
  };

  const processOne = async (img: ImageFile) => {
    if (img.status === "completed" || !removeBackground) return;

    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "fetching-weights", progress: 0 } : i));

    try {
      const blob = await removeBackground(img.file, {
        progress: (key: string, current: number, total: number) => {
          const p = Math.round((current / (total || 1)) * 100);
          setImages(prev => prev.map(i => i.id === img.id ? { 
            ...i, 
            status: key === "fetch" ? "fetching-weights" : "processing",
            progress: p 
          } : i));
        },
        model: modelType,
        output: {
            format: "image/png",
            quality: 0.8
        }
      });
      
      const url = URL.createObjectURL(blob);
      setImages(prev => prev.map(i => i.id === img.id ? { 
        ...i, 
        status: "completed", 
        resultUrl: url,
        progress: 100 
      } : i));
    } catch (error) {
      console.error("AI Error:", error);
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i));
    }
  };

  const processAll = async () => {
    setIsProcessing(true);
    for (const img of images) {
      if (img.status !== "completed") {
        await processOne(img);
      }
    }
    setIsProcessing(false);
  };

  const downloadImage = (img: ImageFile) => {
    const finalUrl = img.resultUrl || img.preview;
    if (!finalUrl) return;

    if (bgColor !== "transparent" && img.resultUrl) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const imgObj = new Image();
        imgObj.onload = () => {
            canvas.width = imgObj.width;
            canvas.height = imgObj.height;
            if (ctx) {
                ctx.fillStyle = bgColor === "custom" ? customColor : bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imgObj, 0, 0);
                const dataUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `${img.name}-elite.png`;
                link.click();
            }
        };
        imgObj.src = img.resultUrl;
    } else {
        const link = document.createElement("a");
        link.href = finalUrl;
        link.download = `${img.name}-no-bg.png`;
        link.click();
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub AI Background Remover Elite",
    "operatingSystem": "Any",
    "applicationCategory": "DesignApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% Client-side AI Removal",
      "Batch Background Eraser",
      "Model optimization for Low-power devices",
      "Custom color fills for portraits",
      "No data tracking, 100% private"
    ]
  };

  return (
    <ToolLayout 
      title="AI Background Remover" 
      description="Professional-grade batch background removal powered by local AI. Your photos never leave your device for maximum security." 
      icon={Eraser} 
      color="#ec4899"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Workspace */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {images.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group h-[450px]"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-pink-500/20 rounded-[3rem] bg-pink-500/5 transition-all group-hover:bg-pink-500/10 group-hover:border-pink-500/40 cursor-pointer overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-24 h-24 bg-pink-500/10 rounded-[2rem] flex items-center justify-center mb-6 ring-1 ring-pink-500/20 shadow-xl">
                      <Zap className="w-12 h-12 text-pink-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Erase Backgrounds</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm font-medium leading-relaxed">
                    Upload portraits, objects, or products. Our Elite AI removes backgrounds in batches instantly.
                  </p>
                  <span className="mt-8 px-6 py-2.5 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-pink-500 hover:text-white transition-all shadow-xl">
                    Launch AI Session
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 flex gap-4 items-center hover:border-pink-500/30 transition-all shadow-xl"
                    >
                      <div 
                        className="relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-white/10 shrink-0"
                        style={{ 
                            backgroundColor: bgColor === "transparent" ? "#050510" : (bgColor === "custom" ? customColor : bgColor),
                            backgroundImage: bgColor === "transparent" ? "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" : "none"
                        }}
                      >
                        <img 
                          src={showOriginalId === img.id ? img.preview : (img.resultUrl || img.preview)} 
                          alt={img.name} 
                          className={`w-full h-full object-cover transition-all ${img.status === "processing" ? "blur-md opacity-50" : "opacity-100"}`}
                        />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center backdrop-blur-[1px]">
                            <CheckCircle2 className="w-8 h-8 text-pink-400 animate-in zoom-in-50 duration-300" />
                          </div>
                        )}
                        {img.status !== "idle" && img.status !== "completed" && (
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
                                <motion.div 
                                    className="h-full bg-pink-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${img.progress}%` }}
                                />
                            </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <h4 className="text-slate-200 text-xs font-bold truncate mb-1 uppercase tracking-wider">{img.name}</h4>
                        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-slate-500 mb-2">
                             {img.status.replace("-", " ")}
                        </div>
                        
                        <div className="flex gap-2">
                           {img.status === "completed" ? (
                              <button
                                onClick={() => downloadImage(img)}
                                className="text-[10px] font-black flex items-center gap-2 text-pink-400 hover:text-pink-300 uppercase tracking-widest bg-pink-400/5 px-3 py-1.5 rounded-xl border border-pink-400/20 transition-all"
                              >
                                <Download className="w-3 h-3" /> Get Asset
                              </button>
                            ) : (
                                <button
                                    onMouseDown={() => setShowOriginalId(img.id)}
                                    onMouseUp={() => setShowOriginalId(null)}
                                    onMouseLeave={() => setShowOriginalId(null)}
                                    className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors"
                                >
                                    View Original
                                </button>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-4 right-4 p-1.5 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <motion.button
                  layout
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/5 hover:border-pink-500/30 transition-all group min-h-[128px]"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-pink-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-pink-500 uppercase tracking-widest">Append Objects</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-600 to-pink-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-pink-500/10 rounded-2xl">
                <Palette className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">AI Cosmetics</h3>
            </div>

            <div className="space-y-8">
              {/* Model Choice */}
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                    AI Energy Mode
                    <Cpu className="w-3 h-3 text-pink-500" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: "small", label: "Fast" },
                        { id: "medium", label: "Pro" }
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setModelType(m.id as any)}
                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                modelType === m.id ? "bg-pink-500/20 border-pink-500/40 text-pink-400 shadow-lg" : "bg-white/5 border-white/5 text-slate-500"
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
              </div>

              {/* Background Color switcher */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">Environment fill</label>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { id: "transparent", color: "bg-black border-white/10" },
                        { id: "#ffffff", color: "bg-white border-transparent" },
                        { id: "#000000", color: "bg-slate-900 border-white/10" },
                        { id: "custom", color: "bg-gradient-to-tr from-pink-500 to-rose-500 border-transparent" }
                    ].map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setBgColor(c.id)}
                            className={`aspect-square rounded-xl border-2 transition-all ${c.color} ${bgColor === c.id ? "border-pink-500 scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                        />
                    ))}
                </div>
                {bgColor === "custom" && (
                    <div className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input 
                            type="color" 
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer p-0 overflow-hidden"
                        />
                        <div className="flex-1 px-4 bg-white/5 border border-white/5 rounded-xl flex items-center">
                            <span className="text-white font-mono text-[10px] uppercase tracking-widest">{customColor}</span>
                        </div>
                    </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-4">
                <button
                  disabled={images.length === 0 || isProcessing || !aiLoaded || images.every(i => i.status === "completed")}
                  onClick={processAll}
                  className="w-full btn-primary h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-pink-400 shadow-[0_4px_30px_rgba(236,72,153,0.3)] hover:shadow-[0_4px_40px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:-translate-y-1"
                >
                  {isProcessing ? "Analyzing Pixels..." : "Execute Elite Removal"}
                </button>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-[9px] text-emerald-500/80 font-bold leading-tight uppercase">
                        AI Weights Local. Zero Server exposure.
                    </div>
                </div>

                <button
                    disabled={images.length === 0}
                    onClick={() => setImages([])}
                    className="w-full py-2 text-rose-500/60 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-400 disabled:opacity-0 transition-opacity"
                >
                    Wipe session
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
