"use client";

import { useState, useRef } from "react";
import { 
  FileImage, 
  Upload, 
  Download, 
  X, 
  Settings, 
  CheckCircle2, 
  Palette,
  Layers,
  Sparkles,
  HelpCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import DownloadAdModal from "@/components/DownloadAdModal";
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

export default function PngToJpgClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState("#ffffff");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ad Intercept State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [pendingDownloadAction, setPendingDownloadAction] = useState<(() => void) | null>(null);
  const [adModalFileName, setAdModalFileName] = useState("");

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Upload your PNG files. 2. Adjust the 'JPEG Quality' slider. 3. Pick a 'Transparency Fill' color (replaces alpha). 4. Click 'Execute Elite Convert' and download your optimized JPGs.",
      icon: HelpCircle
    },
    {
      title: "Intelligent Flattening",
      content: "Since JPG doesn't support transparency, our engine allows you to pick a custom fill color (defaulting to clean white). This ensures that transparent logos or icons looks professional on a solid background.",
      icon: Palette
    },
    {
      title: "Quality Orchestration",
      content: "Our 'HD Elite' compression algorithm prioritizes structural integrity over file size at higher settings, or provides aggressive size reduction for web deployment when moved to 'Balanced'.",
      icon: Sparkles
    },
    {
      title: "Privacy Fortress",
      content: "All processing happens in your browser's local sandbox. Your files are NEVER uploaded to a server, making this the safest way to handle proprietary screenshots or personal data.",
      icon: Layers
    }
  ];

  const faqs = [
    {
      question: "Why do I need to pick a background color?",
      answer: "PNG files can be transparent, but JPG files MUST have a solid background. By providing a color picker, we give you full control over how your transparent areas are filled."
    },
    {
      question: "Is there any quality loss?",
      answer: "JPG is a lossy format by nature. However, at 90-100% quality, the difference is virtually imperceptible to the human eye while still reducing file size significantly compared to PNG."
    },
    {
      question: "Can I convert high-res screenshots?",
      answer: "Absolutely. Our engine is optimized for high-resolution graphics, though very large batches (20+) may depend on your device's available RAM."
    }
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type !== "image/png") return;
      
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
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", quality / 100));
          }
        };
        imageObj.src = img.preview;
      });

      setImages(prev => prev.map(i => i.id === img.id ? { 
        ...i, 
        status: "completed", 
        convertedUrl: result 
      } : i));
    } catch {
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
    setAdModalFileName(`${images.filter(i => i.status === "completed").length} converted files`);
    setPendingDownloadAction(() => () => {
      images.forEach((img) => {
        if (img.convertedUrl) {
          const link = document.createElement("a");
          link.href = img.convertedUrl;
          link.download = `${img.name}-CosmoxHub.jpg`;
          link.click();
        }
      });
    });
    setIsAdModalOpen(true);
  };

  const triggerDownloadSingle = (img: ImageFile) => {
    setAdModalFileName(`${img.name}-CosmoxHub.jpg`);
    setPendingDownloadAction(() => () => {
      const link = document.createElement("a");
      link.href = img.convertedUrl!;
      link.download = `${img.name}-CosmoxHub.jpg`;
      link.click();
    });
    setIsAdModalOpen(true);
  };

  return (
    <ToolLayout
      title="PNG to JPG - Free Online Utility Tool"
      description="Convert PNG images to high-quality JPG format instantly with our high-speed free online tool. 100% private and browser-side."
      icon={FileImage}
      color="#10b981"
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
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/20 rounded-[3rem] bg-emerald-500/5 transition-all group-hover:bg-emerald-500/10 group-hover:border-emerald-500/40 cursor-pointer overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/50 group-hover:bg-emerald-500/20 transition-all">
                      <FileImage className="w-10 h-10 text-emerald-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Bulk PNG to JPG</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm font-medium">
                    Upload PNG files to start. Our elite engine handles transparency with precision using custom background fills.
                  </p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-emerald-500 hover:text-white transition-all shadow-lg">
                    Begin Elite Session
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  title="Upload PNG Images"
                  accept="image/png"
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
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex gap-4 items-center hover:border-emerald-500/30 transition-all shadow-xl"
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img.preview} 
                          alt={img.name} 
                          className="w-full h-full object-cover" 
                        />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-in zoom-in-50 duration-300" />
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
                            onClick={() => triggerDownloadSingle(img)}
                            className="text-[10px] font-black flex items-center gap-2 text-emerald-400 hover:text-emerald-300 uppercase tracking-widest bg-emerald-400/5 px-4 py-2 rounded-xl border border-emerald-400/20 transition-all shadow-lg"
                          >
                            <Download className="w-3 h-3" /> Get JPG
                          </button>
                        ) : (
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${img.status === "error" ? "bg-rose-500" : "bg-emerald-500"}`}
                              initial={{ width: "0%" }}
                              animate={{ width: img.status === "converting" ? "80%" : "0%" }}
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
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 hover:border-emerald-500/30 transition-all group min-h-[128px]"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-emerald-500 uppercase tracking-widest">Add More PNGs</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl shadow-inner">
                <Settings className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Engine</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                    JPEG Quality
                    <span className="text-emerald-500">{quality}%</span>
                </label>
                <input 
                  type="range"
                  min="1"
                  max="100"
                  title="JPEG Quality"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                    <span>Balanced</span>
                    <span>HD Elite</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Palette size={12} className="text-emerald-500" /> Transparency Fill
                </label>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden shrink-0 shadow-lg transparency-preview-el-client">
                        <style>{`.transparency-preview-el-client { background-color: ${bgColor} }`}</style>
                        <input 
                            type="color" 
                            title="Pick Transparency Fill Color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-black text-[10px]">#</div>
                            <input 
                                type="text"
                                value={bgColor.replace("#", "")}
                                title="Hex Code for Transparency Fill"
                                onChange={(e) => setBgColor(`#${e.target.value.replace(/[^0-9A-Fa-f]/g, "")}`)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-8 py-2.5 text-xs text-white uppercase font-bold outline-none focus:border-emerald-500/30 transition-all font-mono"
                                maxLength={6}
                            />
                        </div>
                    </div>
                </div>
                <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">
                    Color used to replace transparent pixels (since JPG is non-alpha).
                </p>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  disabled={images.length === 0 || isProcessing || images.every(i => i.status === "completed")}
                  onClick={processAll}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_4px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_40px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:-translate-y-1"
                >
                  {isProcessing ? "Optimizing Assets..." : "Execute Elite Convert"}
                </button>

                {images.some(img => img.status === "completed") && (
                    <button
                        onClick={downloadAll}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all shadow-lg"
                    >
                        <Download size={16} /> Bulk Export
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
          toolName="PNG to JPG Converter" 
          sections={guideSections}
          faqs={faqs}
        />

        <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed italic">
            Why settle for large PNG files when you can optimize your storage with our **PNG to JPG - Free Online Utility Tool**? CosmoxHub provides a professional-grade converter that transforms your high-resolution PNGs into space-efficient JPEGs in milliseconds. Whether you&apos;re preparing images for a website, an email attachment, or a digital portfolio, our tool ensures your files are web-ready without compromising on visual integrity.
          </p>
          <p className="text-slate-400 leading-relaxed mt-4">
            Our **PNG to JPG** converter is unique because it operates entirely within your browser&apos;s secure environment. This means your private photos never touch our servers, offering you total peace of mind. With support for bulk processing of up to 20 images, a customizable quality slider for perfect compression, and instant download options, CosmoxHub is the ultimate destination for efficient image management. Experience the power of client-side technology and make your workflow faster today.
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
