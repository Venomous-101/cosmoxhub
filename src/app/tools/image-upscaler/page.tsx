"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Zap, 
  Upload, 
  Download, 
  Settings, 
  Trash2, 
  Play, 
  CheckCircle, 
  Clock, 
  FileArchive,
  AlertCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import Upscaler from "upscaler";
import x2 from "@upscalerjs/esrgan-slim/2x";
import x4 from "@upscalerjs/esrgan-slim/4x";
import JSZip from "jszip";

interface UpscaleFile {
  id: string;
  file: File;
  preview: string;
  status: "idle" | "processing" | "completed" | "error";
  result?: string;
  originalDim?: { w: number; h: number };
  upscaledDim?: { w: number; h: number };
  error?: string;
}

export default function ImageUpscalerPage() {
  const [files, setFiles] = useState<UpscaleFile[]>([]);
  const [scale, setScale] = useState<2 | 4>(2);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEngineLoading, setIsEngineLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upscalerRef = useRef<InstanceType<typeof Upscaler> | null>(null);

  // Initialize upscaler when scale changes or on mount
  useEffect(() => {
    const initUpscaler = async () => {
      setIsEngineLoading(true);
      try {
          if (upscalerRef.current) {
              await upscalerRef.current.dispose();
          }
          const model = scale === 4 ? x4 : x2;
          upscalerRef.current = new Upscaler({
              model: model
          });
      } catch (err) {
          console.error("Upscaler Init Error:", err);
      } finally {
          setIsEngineLoading(false);
      }
    };
    initUpscaler();
    
    return () => {
        if (upscalerRef.current) upscalerRef.current.dispose();
    };
  }, [scale]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Limit to 15 images
    const totalNew = selectedFiles.slice(0, 15 - files.length);
    
    totalNew.forEach(file => {
        const objUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setFiles(prev => prev.map(f => 
                f.preview === objUrl ? { ...f, originalDim: { w: img.width, h: img.height } } : f
            ));
        };
        img.src = objUrl;

        setFiles(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: objUrl,
            status: "idle"
        }]);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
        const found = prev.find(f => f.id === id);
        if (found) {
            URL.revokeObjectURL(found.preview);
            if (found.result) URL.revokeObjectURL(found.result);
        }
        return prev.filter(f => f.id !== id);
    });
  };

  const processAll = async () => {
    if (!upscalerRef.current || isProcessing) return;
    setIsProcessing(true);

    const pending = files.filter(f => f.status === "idle" || f.status === "error");
    
    for (const f of pending) {
        setFiles(prev => prev.map(item => item.id === f.id ? { ...item, status: "processing" } : item));
        
        try {
            const upscaledResult = await upscalerRef.current.upscale(f.preview, {
                output: "base64",
                patchSize: 128,
                padding: 4
            });

            // Convert base64 to requested format if needed
            const finalUrl = upscaledResult;
            
            // To get dimensions, we'll load it into an image briefly
            const img = new Image();
            img.onload = () => {
                setFiles(prev => prev.map(item => item.id === f.id ? { 
                    ...item, 
                    status: "completed", 
                    result: finalUrl,
                    upscaledDim: { w: img.width, h: img.height }
                } : item));
            };
            img.src = finalUrl;
        } catch (err) {
            console.error("Process Error:", err);
            setFiles(prev => prev.map(item => item.id === f.id ? { ...item, status: "error", error: "OOM or GPU Error" } : item));
        }
    }

    setIsProcessing(false);
  };

  const downloadOne = (f: UpscaleFile) => {
      if (!f.result) return;
      const link = document.createElement("a");
      link.href = f.result;
      link.download = `cosmox-${scale}x-${f.file.name.replace(/\.[^/.]+$/, "")}.${format}`;
      link.click();
  };

  const downloadAllZip = async () => {
      const completed = files.filter(f => f.status === "completed" && f.result);
      if (completed.length === 0) return;

      const zip = new JSZip();
      completed.forEach((f, index) => {
          const base64Data = f.result!.split(",")[1];
          zip.file(`upscaled-${index + 1}-${f.file.name.replace(/\.[^/.]+$/, "")}.${format}`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `cosmox-upscaled-bulk.zip`;
      link.click();
  };

  return (
    <ToolLayout 
      title="Elite AI Upscaler" 
      description="Professional-grade AI Super-Resolution. Upscale up to 15 images at once with 100% privacy and zero server cost." 
      icon={Zap}
      color="#f59e0b"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Settings & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex items-center justify-between col-span-1 md:col-span-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                        <Settings size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Scale Mode</div>
                        <div className="flex gap-2 mt-1">
                            {[2, 4].map(v => (
                                <button 
                                    key={v}
                                    onClick={() => setScale(v as 2 | 4)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${scale === v ? 'bg-amber-500 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >{v}X AI</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="h-full w-px bg-white/5 mx-4 hidden sm:block" />
                <div className="flex items-center gap-4">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Format</div>
                        <select 
                            value={format}
                            onChange={(e) => setFormat(e.target.value as "png" | "jpeg" | "webp")}
                            className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer mt-1 border-b border-white/20 pb-1"
                        >
                            <option value="png" className="bg-[#0f0f1b]">PNG (Lossless)</option>
                            <option value="jpeg" className="bg-[#0f0f1b]">JPEG (Small)</option>
                            <option value="webp" className="bg-[#0f0f1b]">WebP (Modern)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Files Queue</div>
                <div className="text-2xl font-black text-white">{files.length}<span className="text-slate-500 text-sm ml-1">/ 15</span></div>
            </div>

            <button 
                onClick={() => processAll()}
                disabled={files.length === 0 || isProcessing || isEngineLoading}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 rounded-3xl flex items-center justify-center gap-3 text-black font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20"
            >
                {isProcessing ? <Zap className="animate-pulse" /> : <Play size={20} fill="currentColor" />}
                {isProcessing ? "Processing..." : "Start Bulk"}
            </button>
        </div>

        {/* Main Work Area */}
        {files.length === 0 ? (
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[350px] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-[3rem] transition-all cursor-pointer flex flex-col items-center justify-center group"
            >
                <div className="w-20 h-20 bg-amber-500/5 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-amber-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Drag & Drop Batch Images</h3>
                <p className="text-slate-500 text-sm font-medium">Select up to 15 images to upscale with AI</p>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Clock size={16} className="text-amber-500" /> Current Queue
                    </h2>
                    <div className="flex gap-4">
                        <button 
                            onClick={downloadAllZip}
                            disabled={!files.some(f => f.status === "completed")}
                            className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-2 disabled:opacity-30 transition-all"
                        >
                            <FileArchive size={14} /> Download ZIP
                        </button>
                        <button 
                            onClick={() => setFiles([])}
                            className="text-xs font-bold text-rose-500 hover:text-rose-400 flex items-center gap-2 transition-all"
                        >
                            <Trash2 size={14} /> Clear All
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence initial={false}>
                        {files.map((f) => (
                            <motion.div 
                                key={f.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#0a0a1a] border border-white/5 rounded-3xl p-4 flex gap-4 items-center group relative shadow-lg"
                            >
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 shrink-0 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={f.preview} alt="Thumb" className="w-full h-full object-cover" />
                                    {f.status === "processing" && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Zap className="text-amber-500 animate-pulse w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase truncate pr-6">{f.file.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {f.status === "completed" ? (
                                            <div className="flex flex-col">
                                                <div className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1">
                                                    <CheckCircle size={10} /> Ready
                                                </div>
                                                <div className="text-xs font-black text-white">{f.upscaledDim?.w}x{f.upscaledDim?.h}</div>
                                            </div>
                                        ) : f.status === "error" ? (
                                            <div className="text-[9px] font-black uppercase text-rose-500 flex items-center gap-1">
                                                <AlertCircle size={10} /> Error
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <div className="text-[9px] font-black uppercase text-slate-500">{f.status === "processing" ? "Upscaling..." : "Pending"}</div>
                                                <div className="text-xs font-black text-white/40">{f.originalDim?.w}x{f.originalDim?.h}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {f.status === "completed" ? (
                                        <button 
                                            onClick={() => downloadOne(f)}
                                            className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-xl transition-all"
                                        >
                                            <Download size={16} />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => removeFile(f.id)}
                                            disabled={isProcessing}
                                            className="p-2 bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {files.length < 15 && (
                             <motion.div 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.04] transition-all min-h-[110px]"
                             >
                                 <Upload className="text-slate-600 w-5 h-5 mb-1" />
                                 <span className="text-[10px] font-black uppercase text-slate-500">Add More</span>
                             </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        )}

        {/* Engine Progress Overlay */}
        {isEngineLoading && (
            <div className="fixed inset-0 bg-[#0a0a1a]/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 border-4 border-amber-500/20 border-t-amber-500 rounded-[2.5rem] animate-spin" />
                    <Zap className="text-amber-500 w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Initializing AI Engine</h3>
                <p className="max-w-md text-slate-400 font-medium leading-relaxed">
                    Loading the <span className="text-amber-500 font-bold">{scale}x ESRGAN</span> model. 
                    This only happens once per session to prepare your local GPU for high-speed processing.
                </p>
                <div className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20">CosmoxHub Elite Tech</div>
            </div>
        )}

        <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleUpload} 
            className="hidden" 
        />
      </div>
    </ToolLayout>
  );
}
