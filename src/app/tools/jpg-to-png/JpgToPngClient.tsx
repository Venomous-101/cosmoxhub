"use client";

import { useState, useRef } from "react";
import {
  FileDown, Upload, Download, X, FileImage,
  Settings, LayoutGrid, CheckCircle2,
  RefreshCw,
  HelpCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
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

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024, sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export default function JpgToPngClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Click 'Upload' and select your JPG/JPEG files. 2. Review the image list. 3. Click 'Convert All to PNG' to start the high-speed local processing. 4. Download your lossless PNG assets individually or as a batch.",
      icon: HelpCircle
    },
    {
      title: "Lossless Precision",
      content: "Unlike JPG which uses lossy compression, PNG is a lossless format. Converting to PNG ensures that every available pixel from your source is preserved perfectly, preventing further degradation.",
      icon: FileImage
    },
    {
      title: "Design Readiness",
      content: "Moving from JPG to PNG is the first step in preparing assets for professional design work. PNG is the industry standard for web graphics and UI elements that require clean, sharp visibility.",
      icon: LayoutGrid
    },
    {
      title: "Zero Data Risk",
      content: "At CosmoXHub, privacy is our cornerstone. Our JPG to PNG engine runs in your browser's RAM, ensuring your files never leave your device. Fast, free, and 100% secure.",
      icon: CheckCircle2
    }
  ];

  const faqs = [
    {
      question: "Will converting JPG to PNG make the file size larger?",
      answer: "Yes, typically. Since PNG uses lossless compression, the resulting file will likely be larger than the original compressed JPG, but it will prevent future quality loss during edits."
    },
    {
      question: "Can I convert multiple JPGs at once?",
      answer: "Absolutely! You can upload and process up to 20 JPG images simultaneously in our bulk conversion workspace."
    },
    {
      question: "Is there a limit on image dimensions?",
      answer: "We support high-resolution images. The limit is primarily your browser's memory, though we recommend staying under 50MB per file for the smoothest experience."
    }
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file, preview: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, ""),
      size: file.size, status: "idle",
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      if (removed?.convertedUrl) URL.revokeObjectURL(removed.convertedUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const convertOne = async (img: ImageFile) => {
    if (img.status === "completed") return;
    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "converting" } : i));
    try {
      const result = await new Promise<string>((resolve) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(image, 0, 0);
            resolve(canvas.toDataURL("image/png", 1.0));
          }
        };
        image.src = img.preview;
      });
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "completed", convertedUrl: result } : i));
    } catch {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i));
    }
  };

  const convertAll = async () => {
    setIsProcessing(true);
    for (const img of images) {
      if (img.status !== "completed") await convertOne(img);
    }
    setIsProcessing(false);
  };

  const downloadAll = () => {
    images.forEach((img) => {
      if (img.convertedUrl) {
        const link = document.createElement("a");
        link.href = img.convertedUrl;
        link.download = `${img.name}-cosmoxhub.png`;
        link.click();
      }
    });
  };

  return (
    <ToolLayout
      title="JPG to PNG - Free Online Utility Tool"
      description="Convert JPG images to high-quality PNG format instantly with our high-speed free online tool. 100% private and browser-side."
      icon={FileDown} color="#10b981"
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {images.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative group h-[420px]">
                <div onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/20 rounded-[3rem] bg-emerald-500/5 transition-all group-hover:bg-emerald-500/10 group-hover:border-emerald-500/40 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/50 group-hover:bg-emerald-500/20 transition-all">
                      <FileImage className="w-10 h-10 text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Upload JPG Images</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm font-medium">Batch convert to lossless PNG. Full quality preservation, zero cloud processing.</p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-emerald-500 hover:text-white transition-all">Begin Elite Session</span>
                </div>
                <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg" className="hidden" aria-label="Upload JPG images" onChange={handleUpload} />
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex gap-4 items-center hover:border-emerald-500/30 transition-all shadow-xl">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 group-hover:ring-emerald-500/30 transition-all shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                          </div>
                        )}
                        {img.status === "converting" && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <h4 className="text-slate-200 text-sm font-bold truncate mb-1">{img.name}.jpg</h4>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">
                          <span className="bg-white/5 px-2 py-0.5 rounded-sm">{formatSize(img.size)}</span>
                          <span className={img.status === "completed" ? "text-emerald-400" : img.status === "error" ? "text-rose-400" : "text-amber-400"}>
                            {img.status === "completed" ? "✓ PNG Ready" : img.status === "error" ? "Error" : img.status}
                          </span>
                        </div>
                        {img.status === "completed" ? (
                          <button onClick={() => { const l = document.createElement("a"); l.href = img.convertedUrl!; l.download = `${img.name}-cosmoxhub.png`; l.click(); }}
                            className="text-[10px] font-black flex items-center gap-2 text-emerald-400 hover:text-emerald-300 uppercase tracking-widest bg-emerald-400/5 px-4 py-2 rounded-xl border border-emerald-400/20 transition-all">
                            <Download className="w-3 h-3" /> Download PNG
                          </button>
                        ) : (
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div className={`h-full ${img.status === "error" ? "bg-rose-500" : "bg-emerald-500"}`}
                              initial={{ width: "0%" }} animate={{ width: img.status === "converting" ? "70%" : "0%" }} transition={{ duration: 0.5 }} />
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeImage(img.id)} aria-label="Remove image" title="Remove image" className="absolute top-4 right-4 p-1.5 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.button layout onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-500/10 rounded-3xl bg-emerald-500/5 hover:border-emerald-500/30 transition-all group min-h-[128px]">
                  <Upload className="w-6 h-6 text-emerald-500/40 group-hover:text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Add More</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg" className="hidden" aria-label="Upload JPG images" onChange={handleUpload} />
        </div>

        <aside className="space-y-5 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_2px_15px_rgba(16,185,129,0.4)]" />
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl"><Settings className="w-5 h-5 text-emerald-500" /></div>
              <h3 className="text-xl font-black text-white tracking-tight">Batch Stats</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
                  <div className="text-2xl font-black text-white">{images.length}</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Queued</div>
                </div>
                <div className="p-4 bg-emerald-500/[0.05] rounded-2xl border border-emerald-500/10 text-center">
                  <div className="text-2xl font-black text-emerald-400">{images.filter(i => i.status === "completed").length}</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Complete</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button disabled={images.length === 0 || isProcessing || images.every(i => i.status === "completed")} onClick={convertAll}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_4px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all">
                  {isProcessing ? <><RefreshCw size={16} className="animate-spin" /> Converting...</> : "Convert All to PNG"}
                </button>
                {images.some(i => i.status === "completed") && (
                  <button onClick={downloadAll} className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all">
                    <Download size={15} /> Download All ({images.filter(i => i.status === "completed").length})
                  </button>
                )}
                <button disabled={images.length === 0} onClick={() => setImages([])}
                  className="w-full py-2 text-rose-500/60 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-400 disabled:opacity-0 transition-all">
                  Clear Workspace
                </button>
              </div>
            </div>
          </div>
          </aside>
        </div>

        {/* SEO Enrichment Layer */}
        <div className="lg:col-span-2 space-y-12 py-12">
          <ToolGuide 
            toolName="JPG to PNG Converter" 
            sections={guideSections}
            faqs={faqs}
          />

          <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
            <p className="text-slate-400 leading-relaxed italic">
              Convert your JPEGs to the versatile PNG format with our **JPG to PNG - Free Online Utility Tool**. CosmoXHub offers a seamless, high-performance solution for users who need to preserve image quality or prepare assets for layers-based design work. While JPG is excellent for photography, PNG is the gold standard for web graphics that require crisp edges and potential transparency. Our tool bridges that gap with a single click.
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              Our **JPG to PNG** converter is engineered for speed and absolute privacy. By running the entire conversion process locally in your browser, we ensure that your sensitive images are never uploaded to our servers. This client-side approach not only protects your personal data but also eliminates the latency of traditional cloud-based tools. With the ability to process up to 20 images at once and download them instantly, CosmoXHub is the definitive free online tool for professional image conversion.
            </p>
          </div>
        </div>
      </ToolLayout>
  );
}
