"use client";

import { useState, useRef } from "react";
import { 
  Zap, 
  Upload, 
  Download, 
  X, 
  Settings, 
  LayoutGrid, 
  CheckCircle2, 
  AlertCircle,
  Maximize,
  Search,
  Layers,
  Sparkles
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  width: number;
  height: number;
  status: "idle" | "upscaling" | "completed" | "error";
  upscaledUrl?: string;
  upscaledWidth?: number;
  upscaledHeight?: number;
}

export default function ImageUpscalerPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [scaleFactor, setScaleFactor] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhanceDetails, setEnhanceDetails] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const img = new Image();
      img.onload = () => {
        const newImg: ImageFile = {
          id: Math.random().toString(36).substring(7),
          file,
          preview: URL.createObjectURL(file),
          name: file.name.replace(/\.[^/.]+$/, ""),
          size: file.size,
          width: img.width,
          height: img.height,
          status: "idle",
        };
        setImages((prev) => [...prev, newImg]);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      if (removed?.upscaledUrl) URL.revokeObjectURL(removed.upscaledUrl);
      return filtered;
    });
  };

  const upscaleOne = async (img: ImageFile) => {
    if (img.status === "completed") return;

    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "upscaling" } : i));

    try {
      const result = await new Promise<{url: string, w: number, h: number}>((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imageObj = new Image();
        
        imageObj.onload = () => {
          try {
            const w = imageObj.width * scaleFactor;
            const h = imageObj.height * scaleFactor;
            
            // To prevent browser crashes on gigapixel sizes, strictly constrain max dimensions
            const MAX_DIM = 8192;
            const finalW = Math.min(w, MAX_DIM);
            const finalH = Math.min(h, Math.floor((MAX_DIM / w) * h));

            canvas.width = finalW;
            canvas.height = finalH;
            
            if (ctx) {
              if (enhanceDetails) {
                  // Hardware-accelerated CSS filter instead of JS pixel looping
                  ctx.filter = "contrast(1.05) saturate(1.1) brightness(1.02)";
              }
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
        imageObj.src = img.preview;
      });

      setImages(prev => prev.map(i => i.id === img.id ? { 
        ...i, 
        status: "completed", 
        upscaledUrl: result.url,
        upscaledWidth: result.w,
        upscaledHeight: result.h
      } : i));
    } catch (error) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i));
    }
  };

  const processAll = async () => {
    setIsProcessing(true);
    for (const img of images) {
      if (img.status !== "completed") {
        await upscaleOne(img);
      }
    }
    setIsProcessing(false);
  };

  const downloadAll = () => {
    images.forEach((img) => {
      if (img.upscaledUrl) {
        const link = document.createElement("a");
        link.href = img.upscaledUrl;
        link.download = `${img.name}-${scaleFactor}x-upscaled.png`;
        link.click();
      }
    });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Image Upscaler",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Ultra-clear upscaling up to 4x",
      "Premium sharpening algorithms",
      "Bulk batch processing",
      "100% Client-side local processing",
      "Privacy-first engineering"
    ]
  };

  return (
    <ToolLayout
      title="Elite Image Upscaler"
      description="Enhance resolution and clarity with premium upscaling algorithms. Boost image quality up to 4x without uploading to any server."
      icon={Zap}
      color="#f59e0b"
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
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-amber-500/20 rounded-[3rem] bg-amber-500/5 transition-all group-hover:bg-amber-500/10 group-hover:border-amber-500/40 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-amber-500/20 group-hover:ring-amber-500/50 group-hover:bg-amber-500/20 transition-all">
                      <Zap className="w-10 h-10 text-amber-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Upload Images to Upscale</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm font-medium">
                    Bring low-res photos to life. Our "Elite" sharpening pass creates stunning clarity instantly.
                  </p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-amber-500 hover:text-white transition-all">
                    Start Upscaling Session
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  aria-label="Upload images for upscaling"
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
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex gap-4 items-center hover:border-amber-500/30 transition-all shadow-xl"
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 group-hover:ring-amber-500/30 transition-all shrink-0">
                        <img 
                          src={img.preview} 
                          alt={img.name} 
                          className="w-full h-full object-cover" 
                        />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <Sparkles className="w-8 h-8 text-amber-400 animate-in zoom-in-50 duration-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <h4 className="text-slate-200 text-sm font-bold truncate mb-1">{img.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">
                          <span className="bg-white/5 px-2 py-0.5 rounded-sm">{img.width}x{img.height}</span>
                          <span className={img.status === "completed" ? "text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-sm" : "text-slate-500 bg-white/5 px-2 py-0.5 rounded-sm"}>
                            {img.status === "completed" ? `➔ ${img.upscaledWidth}x${img.upscaledHeight}` : img.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {img.status === "completed" ? (
                          <button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = img.upscaledUrl!;
                              link.download = `${img.name}-upscaled.png`;
                              link.click();
                            }}
                            className="text-[10px] font-black flex items-center gap-2 text-amber-400 hover:text-amber-300 uppercase tracking-widest bg-amber-400/5 px-4 py-2 rounded-xl border border-amber-400/20 transition-all"
                          >
                            <Download className="w-3 h-3" /> Download Link
                          </button>
                        ) : (
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-amber-500"
                              initial={{ width: "0%" }}
                              animate={{ width: img.status === "upscaling" ? "80%" : "0%" }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-4 right-4 p-1.5 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                        aria-label="Remove image"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <motion.button
                  layout
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 hover:border-amber-500/30 transition-all group min-h-[128px]"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-amber-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-amber-500 uppercase tracking-widest">Add Assets</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-500/10 rounded-2xl ring-1 ring-amber-500/20">
                <Settings className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-none">Settings</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Image Upscaler</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Scale Options */}
              <div className="space-y-3">
                <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-between">
                    Resolution Factor
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-2xl border border-white/5">
                  {[2, 4].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setScaleFactor(scale)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          scaleFactor === scale ? "bg-amber-500/20 text-amber-500 font-bold border border-amber-500/20 shadow-md" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {scale}X Clear
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhance Options */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-between cursor-pointer" onClick={() => setEnhanceDetails(!enhanceDetails)}>
                    Details Enhancement
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${enhanceDetails ? "bg-amber-500" : "bg-white/10"}`}>
                        <motion.div 
                            animate={{ x: enhanceDetails ? 16 : 2 }}
                            className="absolute top-[2px] w-3 h-3 bg-white rounded-full shadow-sm"
                        />
                    </div>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <button
                  disabled={images.length === 0 || isProcessing || images.every(i => i.status === "completed")}
                  onClick={processAll}
                  className={`w-full h-14 flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-[0.15em] transition-all duration-300 text-[11px] ${
                    isProcessing 
                        ? "bg-amber-500/20 text-amber-500 border border-amber-500/20 cursor-wait" 
                        : images.length === 0
                            ? "bg-white/5 text-slate-500 cursor-not-allowed"
                            : "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Upscale Images"}
                </button>

                {images.some(img => img.status === "completed") && (
                    <button
                        onClick={downloadAll}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all shadow-lg mt-2"
                    >
                        <Download size={16} /> Bulk Export
                    </button>
                )}

                <button
                    disabled={images.length === 0}
                    onClick={() => setImages([])}
                    className="w-full py-2.5 text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] disabled:opacity-0 transition-all mt-4"
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
