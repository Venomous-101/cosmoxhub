"use client";

import { useState, useRef, AnimatePresence } from "react";
import {
  Maximize2, Upload, Download, X, Settings, LayoutGrid,
  CheckCircle2, RefreshCw, ScissorsSquare, SlidersHorizontal, ArrowRightLeft, Lock, Unlock, Crop, HelpCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion } from "framer-motion";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  originalWidth: number;
  originalHeight: number;
  status: "idle" | "processing" | "completed" | "error";
  resultUrl?: string;
  resultW?: number;
  resultH?: number;
}

type FitMode = "contain" | "stretch";
type ActiveMode = "resize" | "crop";

const SOCIAL_PRESETS = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Twitter Card", w: 1200, h: 628 },
  { label: "YouTube Thumb", w: 1280, h: 720 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "LinkedIn Banner", w: 1584, h: 396 },
];

export default function ImageResizerClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [activeMode, setActiveMode] = useState<ActiveMode>("resize");

  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(0);
  const [cropH, setCropH] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Upload your images. 2. Choose between 'Resize' (for overall scaling) or 'Crop' (for area selection). 3. Enter custom dimensions or select a 'Social Preset'. 4. Click 'Execute' and download your perfectly scaled assets.",
      icon: HelpCircle
    },
    {
      title: "Social Media Presets",
      content: "Stop searching for 'Instagram Post size'. Our built-in presets automatically set the perfect width and height for all major platforms (IG, Twitter, YouTube, LinkedIn, FB), ensuring your content looks professional.",
      icon: SlidersHorizontal
    },
    {
      title: "Aspect Ratio Intelligence",
      content: "Our 'Lock' button ensures your images never look stretched or squashed. When locked, changing the width automatically updates the height to preserve the image's original proportions.",
      icon: Lock
    },
    {
      title: "Private Processing",
      content: "Unlike other resizers that store your photos, CosmoXHub runs the entire engine in your browser. Your high-res photography never leaves your device, providing total privacy and speed.",
      icon: CheckCircle2
    }
  ];

  const faqs = [
    {
      question: "Will resizing affect my image quality?",
      answer: "Downsizing (making images smaller) generally preserves sharpness. Upscaling beyond the original dimensions may cause pixelation. We recommend starting with high-res sources for the best results."
    },
    {
      question: "What is the difference between 'Contain' and 'Stretch'?",
      answer: "'Contain' fits your image inside the target box without cropping or distortion (creating a pillar/letterbox effect if needed). 'Stretch' forces the image to fill the entire box, which may distort the image if aspect ratio isn't locked."
    },
    {
      question: "Is this tool free for commercial use?",
      answer: "Absolutely. All CosmoXHub tools are 100% free and open for professional projects, social media management, and personal use."
    }
  ];

  const updateWidth = (w: number) => {
    setTargetWidth(w);
    if (lockAspect && images.length > 0) {
      const first = images[0];
      const ratio = first.originalHeight / first.originalWidth;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const updateHeight = (h: number) => {
    setTargetHeight(h);
  };

  const toggleLock = () => {
    const newLock = !lockAspect;
    setLockAspect(newLock);
    if (newLock && targetWidth > 0 && images.length > 0) {
      const first = images[0];
      const ratio = first.originalHeight / first.originalWidth;
      setTargetHeight(Math.round(targetWidth * ratio));
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const img = new Image();
      img.onload = () => {
        const newImg: ImageFile = {
          id: Math.random().toString(36).substring(7),
          file, preview: URL.createObjectURL(file),
          name: file.name.replace(/\.[^/.]+$/, ""),
          size: file.size,
          originalWidth: img.width, originalHeight: img.height,
          status: "idle",
        };
        if (images.length === 0 && targetWidth === 0) {
          setTargetWidth(img.width);
          setTargetHeight(img.height);
          setCropW(img.width);
          setCropH(img.height);
        }
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
      if (removed?.resultUrl) URL.revokeObjectURL(removed.resultUrl);
      return filtered;
    });
  };

  const processOne = async (img: ImageFile) => {
    if (img.status === "completed") return;
    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "processing" } : i));
    try {
      const result = await new Promise<{ url: string; w: number; h: number }>((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imageObj = new Image();
        imageObj.onload = () => {
          if (activeMode === "resize") {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              if (fitMode === "stretch") {
                ctx.drawImage(imageObj, 0, 0, targetWidth, targetHeight);
              } else {
                const ratio = Math.min(targetWidth / imageObj.width, targetHeight / imageObj.height);
                const x = (targetWidth - imageObj.width * ratio) / 2;
                const y = (targetHeight - imageObj.height * ratio) / 2;
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, targetWidth, targetHeight);
                ctx.drawImage(imageObj, x, y, imageObj.width * ratio, imageObj.height * ratio);
              }
              resolve({ url: canvas.toDataURL("image/png", 1.0), w: targetWidth, h: targetHeight });
            }
          } else {
            const sx = Math.max(0, cropX), sy = Math.max(0, cropY);
            const sw = Math.min(cropW, imageObj.width - sx);
            const sh = Math.min(cropH, imageObj.height - sy);
            canvas.width = sw; canvas.height = sh;
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(imageObj, sx, sy, sw, sh, 0, 0, sw, sh);
              resolve({ url: canvas.toDataURL("image/png", 1.0), w: sw, h: sh });
            }
          }
        };
        imageObj.src = img.preview;
      });
      setImages(prev => prev.map(i => i.id === img.id ? {
        ...i, status: "completed", resultUrl: result.url, resultW: result.w, resultH: result.h
      } : i));
    } catch {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i));
    }
  };

  const processAll = async () => {
    if (activeMode === "resize" && (targetWidth <= 0 || targetHeight <= 0)) return;
    if (activeMode === "crop" && (cropW <= 0 || cropH <= 0)) return;
    setIsProcessing(true);
    for (const img of images) {
      if (img.status !== "completed") await processOne(img);
    }
    setIsProcessing(false);
  };

  const downloadAll = () => {
    images.forEach((img) => {
      if (img.resultUrl) {
        const link = document.createElement("a");
        link.href = img.resultUrl;
        link.download = `${img.name}-${activeMode}d.png`;
        link.click();
      }
    });
  };

  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    setLockAspect(false);
    setActiveMode("resize");
    setImages(prev => prev.map(i => ({ ...i, status: "idle", resultUrl: undefined })));
  };

  return (
    <ToolLayout
      title="Image Resizer - Free Online Utility Tool"
      description="Resize and crop images to perfect dimensions for social media or custom needs with our high-speed free online tool. 100% private and browser-side."
      icon={Maximize2} color="#10b981"
    >
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {images.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative group h-[420px]">
                <div onClick={() => fileInputRef.current?.click()} className="h-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/20 rounded-[3rem] bg-emerald-500/5 transition-all group-hover:bg-emerald-500/10 group-hover:border-emerald-500/40 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/50 group-hover:bg-emerald-500/20 transition-all">
                      <ScissorsSquare className="w-10 h-10 text-emerald-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Upload Images</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm">Resize to exact dimensions or crop precisely. Bulk supported, zero cloud uploads.</p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-emerald-500 hover:text-white transition-all">Start Elite Session</span>
                </div>
                <input ref={fileInputRef} type="file" multiple title="Upload Images" accept="image/*" className="hidden" onChange={handleUpload} />
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {images.map((img) => (
                      <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex gap-4 items-center hover:border-emerald-500/30 transition-all shadow-xl">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 group-hover:ring-emerald-500/30 transition-all shrink-0">
                          <img src={img.resultUrl || img.preview} alt={img.name} className="w-full h-full object-cover" />
                          {img.status === "completed" && (
                            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </div>
                          )}
                          {img.status === "processing" && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                          <h4 className="text-slate-200 text-sm font-bold truncate mb-1">{img.name}</h4>
                          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">
                            <span className="bg-white/5 px-2 py-0.5 rounded-sm">{img.originalWidth}×{img.originalHeight}</span>
                            {img.resultW && <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-sm">→ {img.resultW}×{img.resultH}</span>}
                          </div>
                          {img.status === "completed" ? (
                            <button onClick={() => { const l = document.createElement("a"); l.href = img.resultUrl!; l.download = `${img.name}-${activeMode}d.png`; l.click(); }}
                              className="text-[10px] font-black flex items-center gap-2 text-emerald-400 hover:text-emerald-300 uppercase tracking-widest bg-emerald-400/5 px-4 py-2 rounded-xl border border-emerald-400/20 transition-all">
                              <Download className="w-3 h-3" /> Download
                            </button>
                          ) : (
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div className={`h-full ${img.status === "error" ? "bg-rose-500" : "bg-emerald-500"}`}
                                initial={{ width: "0%" }} animate={{ width: img.status === "processing" ? "70%" : "0%" }} transition={{ duration: 0.5 }} />
                            </div>
                          )}
                        </div>
                        <button onClick={() => removeImage(img.id)} title="Remove Image" className="absolute top-4 right-4 p-1.5 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={fileInputRef} type="file" multiple title="Upload Images" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>

        <aside className="space-y-5 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_2px_15px_rgba(16,185,129,0.4)]" />
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl"><Settings className="w-5 h-5 text-emerald-500" /></div>
              <h3 className="text-xl font-black text-white tracking-tight">Processing Engine</h3>
            </div>

            <div className="space-y-7">
              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Operation Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                  {[{ id: "resize", label: "Resize", icon: Maximize2 }, { id: "crop", label: "Crop", icon: Crop }].map(m => (
                    <button key={m.id} onClick={() => { setActiveMode(m.id as ActiveMode); setImages(prev => prev.map(i => ({ ...i, status: "idle", resultUrl: undefined }))); }}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === m.id ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                      <m.icon size={13} /> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeMode === "resize" && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Target Dimensions</label>
                      <button onClick={toggleLock}
                        title={lockAspect ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${lockAspect ? "text-emerald-500" : "text-slate-500"}`}>
                        {lockAspect ? <Lock size={11} /> : <Unlock size={11} />}
                        {lockAspect ? "Locked" : "Free"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-slate-600 text-[9px] font-bold uppercase ml-1">Width px</span>
                        <input type="number" value={targetWidth || ""} title="Width in Pixels" onChange={(e) => updateWidth(parseInt(e.target.value) || 0)} placeholder="W"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-all font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-slate-600 text-[9px] font-bold uppercase ml-1">Height px</span>
                        <input type="number" value={targetHeight || ""} title="Height in Pixels" onChange={(e) => updateHeight(parseInt(e.target.value) || 0)} placeholder="H" disabled={lockAspect}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-all font-bold disabled:opacity-40" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block flex items-center gap-2"><ArrowRightLeft size={11} className="text-emerald-500" /> Fit Strategy</label>
                    <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                      {[{ id: "contain", l: "Contain" }, { id: "stretch", l: "Stretch" }].map(f => (
                        <button key={f.id} onClick={() => setFitMode(f.id as FitMode)}
                          className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${fitMode === f.id ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                          {f.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block flex items-center gap-2"><SlidersHorizontal size={11} className="text-emerald-500" /> Social Presets</label>
                    <div className="space-y-2">
                      {SOCIAL_PRESETS.map(p => (
                        <button key={p.label} onClick={() => applyPreset(p.w, p.h)}
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all group">
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-wider">{p.label}</span>
                          <span className="text-[9px] font-bold text-slate-600 group-hover:text-emerald-500 font-mono">{p.w}×{p.h}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeMode === "crop" && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                    <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-wider">Set crop origin (X,Y) and dimensions (W,H) in pixels.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: "X Origin", val: cropX, set: setCropX }, { label: "Y Origin", val: cropY, set: setCropY },
                      { label: "Width px", val: cropW, set: setCropW }, { label: "Height px", val: cropH, set: setCropH }].map(c => (
                      <div key={c.label} className="space-y-1.5">
                        <span className="text-slate-600 text-[9px] font-bold uppercase ml-1">{c.label}</span>
                        <input type="number" value={c.val || ""} title={c.label} onChange={(e) => c.set(parseInt(e.target.value) || 0)} placeholder="0"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-all font-bold" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <button disabled={images.length === 0 || isProcessing} onClick={processAll}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_4px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_40px_rgba(16,185,129,0.55)] disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:-translate-y-1 disabled:translate-y-0">
                  {isProcessing ? <><RefreshCw className="animate-spin" size={16} /> Processing...</> : <><ScissorsSquare size={16} /> Execute {activeMode === "crop" ? "Crop" : "Resize"}</>}
                </button>
                {images.some(i => i.status === "completed") && (
                  <button onClick={downloadAll} className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all">
                    <Download size={15} /> Download All ({images.filter(i => i.status === "completed").length})
                  </button>
                )}
                <button disabled={images.length === 0} onClick={() => { setImages([]); setTargetWidth(0); setTargetHeight(0); }}
                  className="w-full py-2 text-rose-500/60 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-400 disabled:opacity-0 transition-all">
                  Clear Workspace
                </button>
              </div>
            </div>
          </div>

          </div>
        </aside>

        {/* SEO Enrichment Layer */}
        <div className="lg:col-span-2 space-y-12 py-12">
          <ToolGuide 
            toolName="Image Resizer & Cropper" 
            sections={guideSections}
            faqs={faqs}
          />

          <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
            <p className="text-slate-400 leading-relaxed italic">
              Need the perfect dimensions for your digital content? Our **Image Resizer - Free Online Utility Tool** is your professional-grade companion for precision scaling. Whether you&apos;re optimizing photos for a blog, resizing for social media platforms like Instagram and LinkedIn, or reducing file size for faster web performance, CosmoXHub provides a flexible, high-speed solution that puts you in control.
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              Our **Image Resizer** stands out because of its absolute commitment to privacy. Unlike traditional online tools that require you to upload your files to their servers, our resizer handles everything locally in your browser. This means your high-resolution photographs never leave your device. With built-in presets for various social channels, custom width and height controls, and the ability to maintain aspect ratio effortlessly, CosmoXHub is the definitive free online tool for all your image resizing needs.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
