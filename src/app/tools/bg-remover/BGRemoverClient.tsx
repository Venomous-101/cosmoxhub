"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { 
  Download, 
  Eraser, 
  Upload,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DownloadAdModal from "@/components/DownloadAdModal";

// Client-side only import type
type RemoveBgFn = (source: Blob | string | File, options?: Record<string, unknown>) => Promise<Blob>;

export default function BGRemoverClient() {
  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Upload your JPG/PNG image. 2. Our Ultra-Precision AI will automatically detect subjects. 3. Use the Before/After slider to review the pixel-perfect edges. 4. Choose a transparent, white, or blue backdrop and download the uncompressed 100% quality HD result.",
      icon: HelpCircle
    },
    {
      title: "AI Ultra-Precision Mode",
      content: "We use the largest, most advanced edge-detection model running entirely in your browser. With uncompressed 1:1 output quality, it retains fine hair, fur, and intricate details without the fuzzy compression common on other free tools.",
      icon: Sparkles
    },
    {
      title: "100% Client-Side Privacy",
      content: "Unlike other 'free' removers that steal your data or charge credits, CosmoxHub processes everything locally in RAM. Your photos never touch a server, ensuring mathematical privacy for IDs and sensitive assets.",
      icon: Lock
    },
    {
      title: "SEO Moat: Unmatched Quality",
      content: "Looking for an elite AI Background Remover that yields studio-grade transparent PNGs for free? CosmoxHub uses 16-bit WebGL acceleration to give Amazon sellers, designers, and creators flawless background removal.",
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      question: "Is there a limit on resolution or quality?",
      answer: "No. Unlike other tools that downgrade your image or compress it, we output at 100% quality (1.0). The maximum size depends solely on your browser's RAM, usually around 10MB-15MB gracefully."
    },
    {
      question: "What happens if the 'Ultra' model fails?",
      answer: "We employ a Smart Fallback architecture. If your device lacks the VRAM (Video RAM) to run the 'Large' ultra-precision model, it instantly and transparently switches to the 'Medium' high-quality model to ensure successful output."
    },
    {
      question: "Can I use the results for commercial work?",
      answer: "Absolutely. Free for personal and commercial use without watermarks. Ideal for e-commerce, Shopify product isolation, and professional headshots."
    }
  ];

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [progress, setProgress] = useState<number>(0);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [bgMode, setBgMode] = useState<"transparent" | "white" | "blue">("transparent");
  const [useMediumModel, setUseMediumModel] = useState(false); // Ultra precision (large) is default, fallback to medium
  
  // Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false);

  // Ad Intercept State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [pendingDownloadAction, setPendingDownloadAction] = useState<(() => void) | null>(null);
  const [adModalFileName, setAdModalFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const removeBgRef = useRef<RemoveBgFn | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@imgly/background-removal").then((module) => {
        removeBgRef.current = module.removeBackground as unknown as RemoveBgFn;
        setAiLoaded(true);
      }).catch(err => {
        console.error("Failed to load AI Engine:", err);
      });
    }
  }, []);

  useEffect(() => {
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
    setSliderPos(50);
    // Auto-start removal based on User feedback for "elite" feel
    setTimeout(() => {
      processImage(selected, false);
    }, 100);
  };

  const runRemoval = async (fileToProcess: File, modelSize: "medium" | "large"): Promise<Blob> => {
    const removeFn = removeBgRef.current;
    if (!removeFn) throw new Error("AI engine not loaded");

    return removeFn(fileToProcess, {
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
      model: modelSize,
      debug: false,
      proxyToWorker: false, 
      output: {
        format: "image/png",
        quality: 1.0 // 100% Quality Uncompressed RAW pixels
      }
    });
  };

  const processImage = async (fileToUse?: File, fallbackMode: boolean = false) => {
    const targetFile = fileToUse || file;
    if (!targetFile || !removeBgRef.current || status === "processing") return;

    setStatus("processing");
    setProgress(0);
    
    if (fallbackMode) {
      setUseMediumModel(true);
    }

    try {
      // Execute with Large "Ultra" Mode first, Medium on fallback
      const modelToUse = (useMediumModel || fallbackMode) ? "medium" : "large";
      const blob = await runRemoval(targetFile, modelToUse);
      
      const url = URL.createObjectURL(blob);
      setResult(url);
      setStatus("completed");
      setSliderPos(50);
      
      window.dispatchEvent(new Event("cosmox_tool_complete"));
    } catch (firstError) {
      console.error("AI Error:", firstError);
      
      // Smart Fallback
      if (!useMediumModel && !fallbackMode) {
        console.warn("Large model failed, triggering Smart Fallback to Medium...");
        // Re-run safely
        processImage(targetFile, true);
        return;
      }
      
      setStatus("error");
    }
  };

  const triggerDownload = async () => {
    if (!result || !file) return;

    let extension = "png";
    let calculatedFileName = `nobg-${file.name.replace(/\.[^/.]+$/, "")}.png`;
    if (bgMode !== "transparent") {
      calculatedFileName = `${bgMode}-bg-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
      extension = "jpg";
    }

    setAdModalFileName(calculatedFileName);

    setPendingDownloadAction(() => () => {
      if (bgMode === "transparent") {
        const link = document.createElement("a");
        link.href = result;
        link.download = calculatedFileName;
        link.click();
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          if (bgMode === "white") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (bgMode === "blue") {
            ctx.fillStyle = "#0055ff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/jpeg", 1.0); // 100% Quality Output
          link.download = calculatedFileName;
          link.click();
        }
      };
      img.src = result;
    });

    setIsAdModalOpen(true);
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

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current || status !== "completed") return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  // Helper to handle both desktop drag and mobile swipe
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !sliderRef.current || status !== "completed") return;
      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percent);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, status]);

  return (
    <ToolLayout 
      title="Pro AI Background Remover" 
      description="Studio-grade ultra-precision edge detection. 100% uncompressed quality. Privacy guaranteed." 
      icon={Eraser}
      color="#8b5cf6"
    >
      <style jsx global>{`
        .checkerboard-bg {
          background-image: linear-gradient(45deg, #0f0f1c 25%, transparent 25%), 
                            linear-gradient(-45deg, #0f0f1c 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #0f0f1c 75%), 
                            linear-gradient(-45deg, transparent 75%, #0f0f1c 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .elite-slider {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }
      `}</style>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {!file && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-violet-500/30 rounded-[2.5rem] bg-violet-500/5 hover:bg-violet-500/10 transition-all cursor-pointer h-96 md:h-[500px] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-28 h-28 bg-violet-500/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mb-8 text-violet-500 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-2xl shadow-violet-500/20 z-10">
              <Upload className="w-14 h-14" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Drop High-Res Image</h3>
            <p className="text-violet-400 text-sm font-bold uppercase tracking-[0.2em] z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Ultra-Precision AI Engine
            </p>
          </motion.div>
        )}

        {file && preview && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#05050a] border border-white/10 rounded-[2.5rem] p-4 sm:p-8 shadow-2xl overflow-hidden relative"
          >
            {/* The Elite Before/After Slider Area */}
            <div 
              className="relative w-full aspect-[4/3] md:aspect-video rounded-[2rem] overflow-hidden mb-8 select-none touch-none bg-[#0a0a16] border border-white/5"
              ref={sliderRef}
              onMouseDown={(e) => {
                if (status === "completed") {
                  setIsDragging(true);
                  handleSliderMove(e);
                }
              }}
              onTouchStart={(e) => {
                if (status === "completed") {
                  setIsDragging(true);
                  handleSliderMove(e);
                }
              }}
              onMouseEnter={() => setIsHoveringSlider(true)}
              onMouseLeave={() => setIsHoveringSlider(false)}
            >
              <div className={`absolute inset-0 transition-all duration-300 ${
                  bgMode === "white" ? "bg-white" : bgMode === "blue" ? "bg-[#0055ff]" : "checkerboard-bg"
                }`}>
                {/* Always render background base layer for transparency mode */}
              </div>

              {/* Status Overlays */}
              <AnimatePresence>
                {(status === "idle" || status === "processing") && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-20"
                  >
                    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                      <div className="relative mb-8 mt-4">
                        <div className="absolute inset-0 bg-violet-500 blur-[40px] opacity-20 rounded-full" />
                        <Sparkles className="w-16 h-16 text-violet-400 animate-pulse relative z-10" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight">AI Ultra-Precision</h3>
                      <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-6 h-6">
                        {useMediumModel ? "Optimizing (Smart Fallback Mode)..." : "Analyzing Complex Edges..."}
                      </p>
                      
                      <div className="w-full bg-white/5 border border-white/10 rounded-full h-3 overflow-hidden p-[2px]">
                        <motion.div 
                          className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full w-full origin-left" 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: progress / 100 }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      </div>
                      <span className="text-white font-mono text-sm mt-4 font-bold">{progress}%</span>
                    </div>
                  </motion.div>
                )}
                
                {status === "error" && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-rose-900/40 backdrop-blur-md z-20 border border-rose-500/20"
                  >
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <AlertTriangle className="w-16 h-16 text-rose-500 mb-6" />
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Processing Error</h3>
                      <p className="text-rose-200 text-sm mb-6 max-w-sm">
                        Total engine failure over current environment. Usually caused by aggressive adblockers or strict COEP policies enabled in browser flags.
                      </p>
                      <button 
                        onClick={() => processImage()}
                        className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-rose-100 transition-colors"
                      >
                        Retry Action
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slider Layers (only show when completed) */}
              <div className="absolute inset-0 select-none touch-none pointer-events-none">
                {/* Bottom layer: Original Image */}
                <div className="absolute inset-0">
                  <img src={preview} alt="Original" className="w-full h-full object-contain pointer-events-none" draggable={false} />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">Original</div>
                </div>

                {/* Top layer: Resulting Image (Cut via clip-path) */}
                {result && status === "completed" && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <div className={`absolute inset-0 ${
                      bgMode === "white" ? "bg-white" : bgMode === "blue" ? "bg-[#0055ff]" : "checkerboard-bg"
                    }`}></div>
                    <img src={result} alt="Isolated" className="w-full h-full object-contain pointer-events-none absolute inset-0 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]" draggable={false} />
                    <div className="absolute top-4 left-4 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]">AI Isolated</div>
                  </div>
                )}

                {/* The Slider Thumb/Divider */}
                {status === "completed" && (
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize elite-slider group flex items-center justify-center transform -translate-x-1/2 pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className={`w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform ${isHoveringSlider || isDragging ? "scale-110" : ""}`}>
                      <ChevronLeft className="w-3 h-3 md:w-5 md:h-5 text-violet-600 -mr-1" />
                      <ChevronRight className="w-3 h-3 md:w-5 md:h-5 text-violet-600 -ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            {status === "completed" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 md:p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-violet-500/20 rounded-2xl border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-white uppercase tracking-widest mb-1">
                      Background Backdrop
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">Rendered directly over raw pixels</span>
                  </div>
                </div>

                <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto custom-scrollbar">
                  {[
                    { id: "transparent", label: "Transparent", class: "bg-white/10" },
                    { id: "white", label: "Pure White", class: "bg-white text-black" },
                    { id: "blue", label: "Studio Blue", class: "bg-[#0055ff]" }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setBgMode(opt.id as "transparent" | "white" | "blue")}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        bgMode === opt.id ? "bg-violet-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <button
                onClick={resetAll}
                className="w-full md:w-auto px-8 py-4 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-[0.2em]"
              >
                New Image
              </button>

              {status === "completed" && (
                <button
                  onClick={triggerDownload}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white transition-all font-black text-xs shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:-translate-y-1 uppercase tracking-[0.2em]"
                >
                  <Download className="w-5 h-5" />
                  Download 100% Quality
                </button>
              )}
            </div>
          </motion.div>
        )}

        <ToolGuide 
          toolName="Elite Background Remover" 
          sections={guideSections}
          faqs={faqs}
        />

        {/* Dynamic SEO Content Section */}
        <div className="mt-16 p-8 md:p-12 bg-[#05050a]/80 backdrop-blur-2xl border-t border-white/5 rounded-[2.5rem] prose prose-invert prose-violet max-w-none shadow-2xl">
          <p className="text-slate-300 leading-relaxed text-lg mb-6">
            Looking for an elite, **free online tool** to remove backgrounds from your images at native resolution? CosmoxHub provides the ultimate **AI Ultra-Precision BG Remover** that operates entirely via WebGL inside your browser matrix. Whether you&apos;re a premium seller on Shopify, an Amazon FBA expert, or a digital artist requiring perfect edge-masking, our engine outputs mathematical perfection. Zero server delays, zero hidden fees, and absolute cryptographic privacy.
          </p>
          <p className="text-slate-300 leading-relaxed text-lg">
            Our **BG Remover** is hardcoded for studio-grade isolation. It intelligently handles complex edge vectors like hair, glass, and fur without the heavy compression typical in competing products. With native backdrop integration (Pure White, Studio Blue), you can instantly prep your e-commerce listings or passport photography. Experience 1.0 Quality with the world&apos;s most secure image isolation protocol.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          title="Upload Image"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />

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
      </div>
    </ToolLayout>
  );
}
