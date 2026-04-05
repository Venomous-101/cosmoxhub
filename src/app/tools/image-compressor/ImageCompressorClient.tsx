"use client";

import { useState, useRef } from "react";
import { 
  FileImage, 
  Upload, 
  Download, 
  X, 
  Settings, 
  CheckCircle2, 
  Maximize,
  Minimize,
  Sparkles,
  HelpCircle,
  Archive
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import DownloadAdModal from "@/components/DownloadAdModal";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  originalSize: number;
  compressedSize?: number;
  status: "idle" | "compressing" | "completed" | "error";
  compressedBlob?: Blob;
  compressedUrl?: string;
}

export default function ImageCompressorClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthHeight, setMaxWidthHeight] = useState(1920);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ad Intercept State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [pendingDownloadAction, setPendingDownloadAction] = useState<(() => void) | null>(null);
  const [adModalFileName, setAdModalFileName] = useState("");

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Upload JPG, PNG, or WebP files. 2. Set the maximum target size (e.g., 0.5 MB). 3. Adjust max resolution if necessary. 4. Click 'Execute Elite Compression' and download the individual files or as a ZIP.",
      icon: HelpCircle
    },
    {
      title: "Intelligent Compression",
      content: "Our elite compression algorithm automatically balances visual fidelity with file size, reducing image footprints massively without noticeable visual degradation.",
      icon: Minimize
    },
    {
      title: "Bulk ZIP Export",
      content: "Have 20+ images to deliver? Our system will batch process them rapidly and can package them into a single secure ZIP file perfectly organized for clients or storage.",
      icon: Archive
    },
    {
      title: "Privacy Fortress",
      content: "All compression operates via local WebAssembly in your browser. Your images are NEVER uploaded to any servers, ensuring absolute privacy.",
      icon: Sparkles
    }
  ];

  const faqs = [
    {
      question: "Are my files uploaded?",
      answer: "No. The entire process uses HTML5 APIs to compress the images utilizing your device's own CPU. It is completely offline-capable and highly secure."
    },
    {
      question: "Why should I use maximum dimensions?",
      answer: "Sometimes an image taken from a phone is 4000x4000 pixels. Capping the dimension (e.g., 1920px HD) allows the compressor to achieve drastically smaller sizes."
    },
    {
      question: "Does it work on Mobile?",
      answer: "Yes, this tool is fully optimized for iOS and Android web browsers."
    }
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      
      const newImg: ImageFile = {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        originalSize: file.size,
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
      if (removed?.compressedUrl) URL.revokeObjectURL(removed.compressedUrl);
      return filtered;
    });
  };

  const compressOne = async (img: ImageFile) => {
    if (img.status === "completed") return;

    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "compressing" } : i));

    try {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxWidthHeight,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(img.file, options);
      const compressedUrl = URL.createObjectURL(compressedFile);

      setImages(prev => prev.map(i => i.id === img.id ? { 
        ...i, 
        status: "completed", 
        compressedSize: compressedFile.size,
        compressedBlob: compressedFile,
        compressedUrl: compressedUrl 
      } : i));
    } catch (err) {
      console.error(err);
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i));
    }
  };

  const processAll = async () => {
    setIsProcessing(true);
    for (const img of images) {
      if (img.status !== "completed") {
        await compressOne(img);
      }
    }
    setIsProcessing(false);
  };

  const downloadAllAsZip = async () => {
    const completedImages = images.filter(i => i.status === "completed" && i.compressedBlob);
    if (completedImages.length === 0) return;

    setAdModalFileName(`${completedImages.length} compressed_images.zip`);
    
    setPendingDownloadAction(() => async () => {
      try {
        const zip = new JSZip();
        completedImages.forEach(img => {
          zip.file(`compressed_${img.name}`, img.compressedBlob!);
        });
        
        const content = await zip.generateAsync({ type: "blob" });
        const { saveAs } = await import('file-saver');
        saveAs(content, "compressed_images_cosmoxhub.zip");
      } catch (e) {
        console.error("Zipping failed", e);
      }
    });

    setIsAdModalOpen(true);
  };

  const triggerDownloadSingle = async (img: ImageFile) => {
    setAdModalFileName(`min_${img.name}`);
    setPendingDownloadAction(() => async () => {
      const { saveAs } = await import('file-saver');
      saveAs(img.compressedBlob!, `min_${img.name}`);
    });
    setIsAdModalOpen(true);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <ToolLayout
      title="Smart Image Compressor"
      description="Compress images instantly to KB without losing quality. Bulk upload JPG, PNG, and WebP files. Custom settings, 100% private."
      icon={Minimize}
      color="#06b6d4"
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
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
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/20 rounded-[3rem] bg-cyan-500/5 transition-all group-hover:bg-cyan-500/10 group-hover:border-cyan-500/40 cursor-pointer overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-cyan-500/20 group-hover:ring-cyan-500/50 group-hover:bg-cyan-500/20 transition-all">
                      <Minimize className="w-10 h-10 text-cyan-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Bulk Image Compressor</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm font-medium">
                    Upload images to automatically reduce sizes magically without any visible quality loss.
                  </p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-cyan-500 hover:text-white transition-all shadow-lg">
                    Add Media Files
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  title="Upload Images to Compress"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={handleUpload}
                />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-4"
              >
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex gap-4 items-center hover:border-cyan-500/30 transition-all shadow-xl"
                    >
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img.preview} 
                          alt={img.name} 
                          className="w-full h-full object-cover" 
                        />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <CheckCircle2 className="w-8 h-8 text-cyan-400 animate-in zoom-in-50 duration-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <h4 className="text-slate-200 text-sm font-bold truncate mb-1">{img.name}</h4>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase font-black tracking-widest">
                            <span className="text-slate-500">Original: {formatSize(img.originalSize)}</span>
                            {img.compressedSize && (
                                <span className="text-cyan-400 flex items-center gap-1">
                                    → New: {formatSize(img.compressedSize)} 
                                    <span className="ml-1 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                                      -{((1 - (img.compressedSize / img.originalSize)) * 100).toFixed(0)}%
                                    </span>
                                </span>
                            )}
                        </div>
                        
                        <div className="mt-2 text-[10px] uppercase tracking-[0.2em] font-black text-white/30">
                          {img.status}
                        </div>
                        
                        {img.status === "completed" ? (
                          <button
                            onClick={() => triggerDownloadSingle(img)}
                            className="mt-2 text-[10px] font-black flex items-center gap-2 text-cyan-400 hover:text-cyan-300 uppercase tracking-widest bg-cyan-400/5 px-4 py-2 rounded-xl border border-cyan-400/20 transition-all shadow-lg"
                          >
                            <Download className="w-3 h-3" /> Get Item
                          </button>
                        ) : (
                          <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${img.status === "error" ? "bg-rose-500" : "bg-cyan-500"}`}
                              initial={{ width: "0%" }}
                              animate={{ width: img.status === "compressing" ? "80%" : "0%" }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeImage(img.id)}
                        title="Remove Image"
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
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 hover:border-cyan-500/30 transition-all group min-h-[128px]"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-cyan-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-cyan-500 uppercase tracking-widest">Add More Files</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-600 to-cyan-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-cyan-500/10 rounded-2xl shadow-inner">
                <Settings className="w-5 h-5 text-cyan-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Parameters</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                    Target Size (MB)
                    <span className="text-cyan-500">{maxSizeMB} MB</span>
                </label>
                <input 
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  title="Target Max MB Limit"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                    <span>Extreme Reduce</span>
                    <span>High Quality</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Maximize size={12} className="text-cyan-500" /> Max Resolution (PX)
                </label>
                <div className="relative">
                    <select
                        title="Max Resolution Limit"
                        value={maxWidthHeight}
                        onChange={(e) => setMaxWidthHeight(parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500/30 transition-all appearance-none"
                    >
                        <option className="bg-slate-900" value="800">800px (Email / Thumbnails)</option>
                        <option className="bg-slate-900" value="1280">1280px (Standard HD)</option>
                        <option className="bg-slate-900" value="1920">1920px (Full HD - Recommended)</option>
                        <option className="bg-slate-900" value="2560">2560px (2K Quality)</option>
                        <option className="bg-slate-900" value="3840">3840px (4K Maximum)</option>
                    </select>
                </div>
                <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">
                    Resizing images larger than this limit drastically reduces the final output size.
                </p>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  disabled={images.length === 0 || isProcessing || images.every(i => i.status === "completed")}
                  onClick={processAll}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_4px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_40px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:-translate-y-1"
                >
                  {isProcessing ? "Optimizing Assets..." : "Execute Bulk Compress"}
                </button>

                {images.some(img => img.status === "completed") && (
                    <button
                        onClick={downloadAllAsZip}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-cyan-500/20 transition-all shadow-lg"
                    >
                        <Archive size={16} /> Download ZIP Archive
                    </button>
                )}

                <button
                    disabled={images.length === 0}
                    onClick={() => setImages([])}
                    className="w-full py-2 text-rose-500/60 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-400 disabled:opacity-0 transition-opacity"
                >
                    Discard Session
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* SEO Enrichment Layer */}
      <div className="lg:col-span-2 space-y-12 py-12">
        <ToolGuide 
          toolName="Smart Bulk Image Compressor" 
          sections={guideSections}
          faqs={faqs}
        />

        <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed italic">
            Why settle for massive image payloads when you can intelligently shrink them with our **Smart Bulk Image Compressor**? CosmoXHub provides unmatched image optimization technology directly embedded in your browser. With advanced WebAssembly techniques, we guarantee your JPG, WebP, and PNG visuals are compressed significantly (often by up to 80%) while maintaining striking visual accuracy.
          </p>
          <p className="text-slate-400 leading-relaxed mt-4">
            Security and speed are at the heart of our mission. Unlike older image minification methods that force you to upload precious content to an insecure remote cloud, the **Smart Image Compressor** performs memory-safe compression exclusively on your own desktop or mobile processor. Use the custom MB/KB sliders to meet strict upload size constraints on portals, job applications, or forums with absolute ease, and export dozens of processed results in a neat `.zip` package.
          </p>
        </div>
      </div>

      <DownloadAdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onComplete={() => {
          if (pendingDownloadAction) {
            pendingDownloadAction();
            setPendingDownloadAction(null);
          }
        }}
        fileName={adModalFileName}
      />
    </ToolLayout>
  );
}
