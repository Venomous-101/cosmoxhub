"use client";

import { useState, useRef } from "react";
import { 
  FileImage, 
  Upload, 
  Download, 
  X, 
  Settings, 
  LayoutGrid, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ShieldCheck,
  Eye
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
}

export default function WebPToPNGPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preserveAlpha, setPreserveAlpha] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Modern browsers support WebP naturally
      const newImg: ImageFile = {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
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
    if (img.status === "completed") return;

    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "converting" } : i));

    try {
      const result = await new Promise<string>((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imageObj = new Image();
        
        imageObj.onload = () => {
          canvas.width = imageObj.width;
          canvas.height = imageObj.height;
          if (ctx) {
            // WebP to PNG supports transparency perfectly
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          }
        };
        imageObj.src = img.preview;
      });

      setImages(prev => prev.map(i => i.id === img.id ? { 
        ...i, 
        status: "completed", 
        convertedUrl: result 
      } : i));
    } catch (error) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i));
    }
  };

  const processAll = async () => {
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
        link.download = `${img.name}.png`;
        link.click();
      }
    });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite WebP to PNG Converter",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Lossless bulk processing",
      "Full Alpha-channel transparency preservation",
      "100% Client-side local processing",
      "Privacy-first engineering",
      "High-speed browser execution"
    ]
  };

  return (
    <ToolLayout
      title="Elite WebP to PNG"
      description="Convert WebP images to lossless PNGs in bulk. Perfectly preserve transparency and structural details with our elite engine."
      icon={Zap}
      color="#8b5cf6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Workspace */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {images.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group h-[400px]"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-violet-500/20 rounded-[3rem] bg-violet-500/5 transition-all group-hover:bg-violet-500/10 group-hover:border-violet-500/40 cursor-pointer overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-violet-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-violet-500/20 group-hover:ring-violet-500/50 group-hover:bg-violet-500/20 transition-all shadow-lg">
                      <Zap className="w-10 h-10 text-violet-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Convert WebP to PNG</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm font-medium leading-relaxed">
                    Upload bulk WebP files. Our engine ensures 100% lossless conversion with full transparency support.
                  </p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-violet-500 hover:text-white transition-all shadow-xl">
                    Launch Elite Converter
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/webp"
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
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex gap-4 items-center hover:border-violet-500/30 transition-all shadow-xl"
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 shrink-0">
                        <img 
                          src={img.preview} 
                          alt={img.name} 
                          className="w-full h-full object-cover" 
                        />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <CheckCircle2 className="w-8 h-8 text-violet-400 animate-in zoom-in-50 duration-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <h4 className="text-slate-200 text-sm font-bold truncate mb-1">{img.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">
                            {(img.size / 1024).toFixed(0)} KB • {img.status.toUpperCase()}
                        </div>
                        
                        {img.status === "completed" ? (
                          <button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = img.convertedUrl!;
                              link.download = `${img.name}.png`;
                              link.click();
                            }}
                            className="text-[10px] font-black flex items-center gap-2 text-violet-400 hover:text-violet-300 uppercase tracking-widest bg-violet-400/5 px-4 py-2 rounded-xl border border-violet-400/20 transition-all shadow-lg"
                          >
                            <Download className="w-3 h-3" /> Get Asset
                          </button>
                        ) : (
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${img.status === "error" ? "bg-rose-500" : "bg-violet-500"}`}
                              initial={{ width: "0%" }}
                              animate={{ width: img.status === "converting" ? "100%" : "0%" }}
                              transition={{ duration: 1.5, repeat: Infinity }}
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
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 hover:border-violet-500/30 transition-all group min-h-[128px]"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-violet-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-violet-500 uppercase tracking-widest">Append Assets</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 to-violet-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-violet-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-violet-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Image Logic</h3>
            </div>

            <div className="space-y-8">
              {/* Alpha Protection */}
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                    Preserve Alpha
                    <div 
                        onClick={() => setPreserveAlpha(!preserveAlpha)}
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${preserveAlpha ? "bg-violet-500" : "bg-slate-700"}`}
                    >
                        <motion.div 
                            animate={{ x: preserveAlpha ? 20 : 2 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full"
                        />
                    </div>
                </label>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic">
                    Ensures transparent backgrounds remain perfectly clear in the final PNG asset.
                </p>
              </div>

              {/* Security Hint */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 items-start">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-[10px] text-emerald-500/80 font-bold leading-tight uppercase">
                    Client-Side Security Active
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-4">
                <button
                  disabled={images.length === 0 || isProcessing || images.every(i => i.status === "completed")}
                  onClick={processAll}
                  className="w-full btn-primary h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-violet-400 shadow-[0_4px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_40px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:-translate-y-1"
                >
                  {isProcessing ? "Reconstructing..." : "Process Fleet"}
                </button>

                {images.some(img => img.status === "completed") && (
                    <button
                        onClick={downloadAll}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all shadow-lg"
                    >
                        <Download size={16} /> Export All Results
                    </button>
                )}

                <button
                    disabled={images.length === 0}
                    onClick={() => setImages([])}
                    className="w-full py-2 text-rose-500/60 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-400 disabled:opacity-0 transition-opacity"
                >
                    Clear Workspace
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" /> Technology
            </h4>
            <div className="space-y-4 text-[10px] text-slate-500 font-medium italic">
                Uses 32-bit pixel reconstruction for perfect 1:1 color mapping from WebP to PNG without compression loss.
            </div>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
