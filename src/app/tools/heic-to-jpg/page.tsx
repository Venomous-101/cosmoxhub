"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FileImage, 
  Upload, 
  Download, 
  X, 
  Settings, 
  LayoutGrid, 
  CheckCircle2, 
  Sparkles,
  Smartphone,
  Zap,
  Box,
  Share2
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  status: "idle" | "converting" | "completed" | "error";
  convertedUrl?: string;
  convertedFormat?: string;
}

export default function HEICToJPGPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [quality, setQuality] = useState(0.8);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [heic2any, setHeic2any] = useState<any>(null);

  // Dynamically load heic2any only on client side
  useEffect(() => {
    import("heic2any").then((module) => {
      setHeic2any(module.default || module);
    }).catch(err => console.error("Failed to load heic2any", err));
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith(".heic") && !fileName.endsWith(".heif")) return;

      const newImg: ImageFile = {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file), // This might show placeholder for HEIC, but it's okay for now
        name: file.name.replace(/\.[^/.]+$/, ""),
        size: file.size,
        status: "idle",
      };
      setImages((prev) => [...prev, newImg]);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      if (removed?.convertedUrl) URL.revokeObjectURL(removed.convertedUrl);
      return filtered;
    });
  };

  const convertOne = async (img: ImageFile) => {
    if (img.status === "completed" || !heic2any) return;

    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "converting" } : i));

    try {
      const blob = await heic2any({
        blob: img.file,
        toType: targetFormat,
        quality: quality,
      });

      const actualBlob = Array.isArray(blob) ? blob[0] : blob;
      const resultUrl = URL.createObjectURL(actualBlob);

      setImages(prev => prev.map(i => i.id === img.id ? { 
        ...i, 
        status: "completed", 
        convertedUrl: resultUrl,
        convertedFormat: targetFormat.split("/")[1]
      } : i));
    } catch (error) {
      console.error("HEIC Conversion failed:", error);
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i));
    }
  };

  const processAll = async () => {
    if (!heic2any) return;
    setIsProcessing(true);
    for (const img of images) {
      if (img.status !== "completed") {
        await convertOne(img);
      }
    }
    setIsProcessing(false);
  };

  const downloadAll = () => {
    images.forEach((img) => {
      if (img.convertedUrl) {
        const link = document.createElement("a");
        link.href = img.convertedUrl;
        link.download = `${img.name}.${img.convertedFormat}`;
        link.click();
      }
    });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite HEIC to JPG Converter",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "IPhone HEIC/HEIF format support",
      "Bulk background conversion",
      "Output to JPG, PNG, or WebP",
      "High-fidelity quality preservation",
      "100% Client-side local processing"
    ]
  };

  return (
    <ToolLayout
      title="Elite HEIC to JPG"
      description="Convert iPhone HEIC photos to standard formats in bulk. High-fidelity encoding with zero privacy risks and no server uploads."
      icon={Smartphone}
      color="#e11d48"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Workspace */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!heic2any ? (
                <div className="h-[400px] flex items-center justify-center bg-white/5 rounded-[3rem] border border-white/10 animate-pulse">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Readying HEIC Engine...</p>
                </div>
            ) : images.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group h-[400px]"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-rose-500/20 rounded-[3rem] bg-rose-500/5 transition-all group-hover:bg-rose-500/10 group-hover:border-rose-500/40 cursor-pointer overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-rose-500/20 group-hover:ring-rose-500/50 group-hover:bg-rose-500/20 transition-all">
                      <Smartphone className="w-10 h-10 text-rose-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Convert HEIC Files</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm font-medium">
                    Upload your Apple HEIC/HEIF photos. Our elite converter builds high-res JPG/PNG assets instantly.
                  </p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-rose-500 hover:text-white transition-all shadow-lg">
                    Start Conversion session
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".heic,.heif"
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
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex gap-4 items-center hover:border-rose-500/30 transition-all shadow-xl"
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 shrink-0 flex items-center justify-center">
                        <Box className="w-8 h-8 text-slate-700" />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <CheckCircle2 className="w-8 h-8 text-rose-400 animate-in zoom-in-50 duration-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <h4 className="text-slate-200 text-sm font-bold truncate mb-1">{img.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">
                            {(img.size / (1024*1024)).toFixed(2)} MB • {img.status.toUpperCase()}
                        </div>
                        
                        {img.status === "completed" ? (
                          <button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = img.convertedUrl!;
                              link.download = `${img.name}.${img.convertedFormat}`;
                              link.click();
                            }}
                            className="text-[10px] font-black flex items-center gap-2 text-rose-400 hover:text-rose-300 uppercase tracking-widest bg-rose-400/5 px-4 py-2 rounded-xl border border-rose-400/20 transition-all shadow-lg"
                          >
                            <Download className="w-3 h-3" /> Get Result
                          </button>
                        ) : (
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${img.status === "error" ? "bg-rose-500" : "bg-rose-500"}`}
                              initial={{ width: "0%" }}
                              animate={{ width: img.status === "converting" ? "90%" : "0%" }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                        )}
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
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 hover:border-rose-500/30 transition-all group min-h-[128px]"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-rose-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-rose-500 uppercase tracking-widest">More Photos</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-600 to-rose-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-rose-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Apple Engine</h3>
            </div>

            <div className="space-y-8">
              {/* Output Format */}
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Share2 size={12} className="text-rose-500" /> Export format
                </label>
                <select 
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-rose-500/30 transition-all appearance-none cursor-pointer"
                >
                    <option value="image/jpeg">JPEG (Universal)</option>
                    <option value="image/png">PNG (Lossless)</option>
                    <option value="image/webp">WebP (Modern)</option>
                </select>
              </div>

              {/* Quality Range */}
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                    Compression
                    <span className="text-rose-500">{(quality * 100).toFixed(0)}%</span>
                </label>
                <input 
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-4">
                <button
                  disabled={images.length === 0 || isProcessing || !heic2any || images.every(i => i.status === "completed")}
                  onClick={processAll}
                  className="w-full btn-primary h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_4px_30px_rgba(225,29,72,0.3)] hover:shadow-[0_4px_40px_rgba(225,29,72,0.5)] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:-translate-y-1"
                >
                  {isProcessing ? "Recalculating Pixels..." : "Execute Elite Blast"}
                </button>

                {images.some(img => img.status === "completed") && (
                    <button
                        onClick={downloadAll}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all shadow-lg"
                    >
                        <Download size={16} /> Bulk Download
                    </button>
                )}

                <button
                    disabled={images.length === 0}
                    onClick={() => setImages([])}
                    className="w-full py-2 text-rose-500/60 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-400 disabled:opacity-0 transition-opacity"
                >
                    Clear session
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl leading-relaxed">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-rose-500" /> Pro Insight
            </h4>
            <div className="text-[10px] text-slate-500 font-medium italic">
                Our elite engine converts Apple's proprietary HEIF/HEIC layers into high-contrast standards. 100MB+ files are handled with optimized WASM memory management.
            </div>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
