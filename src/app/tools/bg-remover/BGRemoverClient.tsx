"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { 
  Download, 
  Eraser, 
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Lock,
  UserCheck,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

// Client-side only import type
type RemoveBgFn = (source: Blob | string | File, options?: Record<string, unknown>) => Promise<Blob>;
let removeBackground: RemoveBgFn;

export default function BGRemoverClient() {
  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Upload your JPG/PNG image by clicking the upload area. 2. Click 'Auto Remove' to start the AI engine. 3. Choose a background mode (Transparent, White, or Blue). 4. Download your high-quality result instantly.",
      icon: HelpCircle
    },
    {
      title: "AI Edge Intelligence",
      content: "Our engine uses sophisticated neural networks to detect subject boundaries with sub-pixel precision. It handles complex areas like hair, fur, and semi-transparent fabrics better than traditional 'magic wand' tools.",
      icon: Sparkles
    },
    {
      title: "100% Client-Side Privacy",
      content: "Unlike other 'free' removers that steal your data, CosmoxHub processes everything in your browser's local memory. Your photos never touch a server, ensuring 100% privacy for sensitive assets.",
      icon: Lock
    },
    {
      title: "SEO Moat: Why Choose Us",
      content: "Looking for a fast, free online tool to remove backgrounds? CosmoxHub provides an elite AI Background Remover that works entirely in your browser. Perfect for social media, Amazon listings, and professional headshots.",
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      question: "Is there a limit on resolution?",
      answer: "We support high-definition images up to 10MB. For extremely large files, the AI will intelligently optimize processing to maintain detail without draining your system RAM."
    },
    {
      question: "Why choose 'Safe Mode'?",
      answer: "Safe Mode uses a smaller AI model that requires less VRAM. If the standard model fails to load or your browser feels sluggish, Safe Mode ensures a successful extraction."
    },
    {
      question: "Can I use the results for commercial work?",
      answer: "Absolutely. Our tool is free for both personal and commercial use. The isolated PNGs are perfect for Amazon, eBay, and Shopify product listings."
    }
  ];

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [progress, setProgress] = useState<number>(0);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [bgMode, setBgMode] = useState<"transparent" | "white" | "blue">("transparent");
  const [useSmallModel, setUseSmallModel] = useState(true); // Default to small for speed
  const [retryCount, setRetryCount] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    // Cleanup preview URLs
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
  };

  const processImage = async () => {
    if (!file || !removeBackground || status === "processing") return;

    setStatus("processing");
    setProgress(0);

    try {
      const timeoutFallback = setTimeout(() => {
        setStatus(prev => {
          if (prev === "processing") {
             setUseSmallModel(true);
             return "error";
          }
          return prev;
        });
      }, 15000);

      const blob = await removeBackground(file, {
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
        model: useSmallModel ? "small" : "medium",
        debug: false,
        proxyToWorker: true, // Enable worker for speed
        output: {
          format: "image/png",
          quality: 0.8
        }
      });
      
      clearTimeout(timeoutFallback);
      const url = URL.createObjectURL(blob);
      setResult(url);
      setStatus("completed");
      
      // Revenue Trigger: Success Moment
      window.dispatchEvent(new Event("cosmox_tool_complete"));
    } catch (error) {
      console.error("AI Error:", error);
      if (!useSmallModel && retryCount < 1) {
        setUseSmallModel(true);
        setRetryCount(prev => prev + 1);
        processImage(); 
        return;
      }
      setStatus("error");
    }
  };

  const downloadImage = async () => {
    if (!result || !file) return;

    if (bgMode === "transparent") {
      const link = document.createElement("a");
      link.href = result;
      link.download = `nobg-${file.name.replace(/\.[^/.]+$/, "")}.png`;
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
        } else {
          // Transparent - already handled by canvas being clear
        }
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.download = `${bgMode}-bg-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
        link.click();
      }
    };
    img.src = result;
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

  return (
    <ToolLayout 
      title="BG Remover - Free Online Utility Tool" 
      description="Instantly remove backgrounds and apply professional white or blue backdrops with our free online tool." 
      icon={Eraser}
      color="#8b5cf6"
    >
      <style jsx global>{`
        .checkerboard-bg {
          background-image: linear-gradient(45deg, #121221 25%, transparent 25%), 
                            linear-gradient(-45deg, #121221 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #121221 75%), 
                            linear-gradient(-45deg, transparent 75%, #121221 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {!file && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-violet-500/30 rounded-[2.5rem] bg-violet-500/5 hover:bg-violet-500/10 transition-all cursor-pointer h-96 group"
          >
            <div className="w-24 h-24 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6 text-violet-500 group-hover:scale-110 transition-transform">
              <Upload className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight italic">Drop or Upload Image</h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Supports PNG, JPG, WEBP · Max 10MB</p>
          </motion.div>
        )}

        {file && preview && (
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 mb-8 h-auto">
              
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Input Image</span>
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 relative flex items-center justify-center">
                  <img src={preview} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Isolated Result</span>
                <div className={`aspect-square rounded-[2rem] overflow-hidden border transition-all duration-500 ${
                  bgMode === "white" ? "bg-white border-white" : bgMode === "blue" ? "bg-[#0055ff] border-blue-500" : "bg-black/40 checkerboard-bg border-violet-500/20"
                } relative flex items-center justify-center shadow-inner`}>
                  
                  {status === "idle" && (
                     <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                        <ImageIcon className="w-10 h-10 mb-4 opacity-50 text-violet-500" />
                        <span className="text-xs uppercase font-black tracking-widest italic">Pending Removal</span>
                     </div>
                  )}

                  {status === "processing" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 w-full p-8 text-center">
                       <RefreshCw className="w-8 h-8 text-pink-500 animate-spin mb-4" />
                       <div className="w-full max-w-xs bg-white/10 rounded-full h-2 mb-2">
                        <motion.div 
                          className="bg-pink-500 h-2 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                       </div>
                       <span className="text-white text-sm font-medium">Removing Background... {progress}%</span>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="text-center text-rose-500 flex flex-col items-center px-8">
                       <RefreshCw className="w-8 h-8 mb-4 opacity-50" />
                       <span className="text-sm font-black uppercase tracking-widest mb-1">AI Engine Failed</span>
                       <p className="text-xs text-slate-500 font-medium mb-4">
                         {useSmallModel ? "Deep extraction failed even in Safe Mode." : "This tool requires high memory. Try Safe Mode for a lighter processing."}
                       </p>
                       <button 
                         onClick={() => {
                           setUseSmallModel(true);
                           processImage();
                         }}
                         className="px-6 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-rose-400 transition-all mb-4"
                       >
                         Try Safe Mode
                       </button>
                       <div className="text-[9px] text-slate-600 bg-white/5 p-4 rounded-2xl border border-white/5 max-w-xs text-left">
                          <p className="font-bold text-slate-400 mb-1">Opera/Brave Troubleshooting:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Turn off &quot;Battery Saver&quot; mode.</li>
                            <li>Ensure &quot;Hardware Acceleration&quot; is ON in settings.</li>
                            <li>Lower &quot;Shields&quot; or Ad-blocker if assets fail to load.</li>
                          </ul>
                       </div>
                    </div>
                  )}

                  {result && (
                     <img src={result} alt="Result" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                  )}
                </div>
              </div>
            </div>

            {file && (
              <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/20 rounded-xl">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      Set Final Background
                    </span>
                  </div>
                  <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                    {[
                      { id: "transparent", label: "None", class: "bg-white/10" },
                      { id: "white", label: "White", class: "bg-white" },
                      { id: "blue", label: "Blue", class: "bg-[#0055ff]" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setBgMode(opt.id as "transparent" | "white" | "blue")}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          bgMode === opt.id ? "bg-violet-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-6 border-t border-white/10">
              <button
                onClick={resetAll}
                className="px-8 py-3 rounded-2xl border border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
              >
                Reset
              </button>

              {status === "idle" && (
                 <button
                    onClick={processImage}
                    disabled={!aiLoaded}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all font-black text-xs shadow-2xl shadow-violet-500/20 uppercase tracking-[0.2em]"
                 >
                    <Eraser className="w-5 h-5" />
                    {aiLoaded ? "Auto Remove" : "Initializing AI..."}
                 </button>
              )}

              {status === "processing" && (
                 <button disabled className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-violet-600/40 text-white cursor-not-allowed font-black text-xs uppercase tracking-[0.2em]">
                    <RefreshCw className="w-5 h-5 animate-spin" /> Processing
                 </button>
              )}

              {status === "completed" && (
                 <button
                    onClick={downloadImage}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white transition-all font-black text-xs shadow-2xl shadow-violet-500/20 uppercase tracking-[0.2em]"
                 >
                    <Download className="w-5 h-5" />
                    Download HD
                 </button>
              )}
            </div>
          </div>
        )}

        <ToolGuide 
          toolName="AI Background Remover" 
          sections={guideSections}
          faqs={faqs}
        />

        {/* SEO Content Section */}
        <div className="mt-16 p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed italic">
            Looking for a fast, **free online tool** to remove backgrounds from your images? CosmoxHub provides the ultimate **BG Remover** that works entirely in your browser. Whether you&apos;re a photographer, a Shopify seller, or just looking to create a transparent PNG for social media, our engine delivers professional results in seconds. No signup, no fees, and absolute privacy—your images are processed locally and never uploaded to any server.
          </p>
          <p className="text-slate-400 leading-relaxed mt-4">
            Our **BG Remover - Free Online Utility Tool** is designed for both high-end professional work and casual editing. It intelligently handles complex edges like hair and fur, ensuring your subjects look sharp. Plus, with integrated backdrop options, you can instantly apply a solid white or professional blue background, perfect for official documents and e-commerce listings. Experience total digital freedom with the world&apos;s most private image isolation engine.
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
      </div>
    </ToolLayout>
  );
}
