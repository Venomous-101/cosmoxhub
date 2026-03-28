"use client";
import React, { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Trash2, Download, Eraser, Sparkles, Palette, Check, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

// Client-side only import
let removeBackground: any;

export default function BackgroundRemoverPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [bgColor, setBgColor] = useState("transparent");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with heavy WASM libraries
    import("@imgly/background-removal").then((module) => {
      removeBackground = module.default;
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setImage(readerEvent.target?.result as string);
        setResultImage(null);
        setStatus("");
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image || !removeBackground) return;
    
    setIsProcessing(true);
    setStatus("Loading AI Engine...");
    
    try {
      // Removing background using real AI
      const blob = await removeBackground(image, {
        progress: (status: string, progress: number) => {
          setStatus(`${status === "fetch" ? "Downloading AI Model" : "Processing"}: ${Math.round(progress * 100)}%`);
        }
      });
      
      const url = URL.createObjectURL(blob);
      setResultImage(url);
      setStatus("Success!");
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI Processing failed. Please try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const finalUrl = resultImage || image;
    if (!finalUrl) return;

    if (bgColor !== "transparent" && resultImage) {
        // Draw on canvas to include background color in download
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                // Background
                ctx.fillStyle = bgColor === "white" ? "#FFFFFF" : bgColor === "black" ? "#000000" : bgColor === "blue" ? "#2563EB" : "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Image
                ctx.drawImage(img, 0, 0);
                // Download
                const dataUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `cosmoxhub-elite-${Date.now()}.png`;
                link.click();
            }
        };
        img.src = resultImage;
    } else {
        const link = document.createElement("a");
        link.href = finalUrl;
        link.download = `cosmoxhub-no-bg-${Date.now()}.png`;
        link.click();
    }
  };

  return (
    <ToolLayout 
      title="AI Background Remover Elite" 
      description="Studio-quality background removal instantly. 100% Client-Side Private AI. No uploads. No limits. Elite Privacy." 
      icon={Eraser} 
      color="#ec4899"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Hidden Canvas for background layering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Control Panel */}
        <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-[#050510]/60 border border-white/5 rounded-3xl">
                <h4 className="flex items-center gap-2 text-slate-300 text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                    <Palette size={16} className="text-pink-400" /> Options
                </h4>
                
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Post-Removal Background</p>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: "transparent", label: "None", color: "bg-white/5 border-white/20" },
                          { id: "white", label: "White", color: "bg-white" },
                          { id: "black", label: "Black", color: "bg-black" },
                          { id: "blue", label: "Blue", color: "bg-blue-600" },
                        ].map((bg) => (
                           <button 
                             key={bg.id}
                             onClick={() => setBgColor(bg.id)}
                             className={`h-12 rounded-xl border-2 transition-all flex items-center justify-center ${bg.color} ${bgColor === bg.id ? "border-pink-500 scale-110 shadow-lg shadow-pink-500/20" : "border-transparent opacity-60 hover:opacity-100"}`}
                             title={`Change to ${bg.label}`}
                           >
                             {bgColor === bg.id && <Check size={16} className={bgColor === "white" ? "text-black" : "text-white"} />}
                           </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    {!resultImage ? (
                        <button 
                            onClick={processImage}
                            disabled={!image || isProcessing}
                            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black rounded-2xl shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_4px_40px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:translate-y-0"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            {isProcessing ? "AI Processing..." : "Remove Background"}
                        </button>
                    ) : (
                        <button 
                            onClick={() => {setResultImage(null); setStatus("");}}
                            className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                        >
                           Reset Analysis
                        </button>
                    )}
                </div>

                {status && (
                    <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-pink-400 font-black uppercase tracking-widest flex items-center gap-2">
                        <Loader2 className="animate-spin" size={12} /> {status}
                    </div>
                )}
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                <div className="text-xs text-blue-400 font-black uppercase mb-2">Elite Privacy</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                   We download the AI model to your browser once. All processing happens on your device. Your photos are **never seen** by us.
                </p>
            </div>
        </div>

        {/* Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <div className={`p-4 bg-[#050510]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] relative min-h-[500px] flex items-center justify-center overflow-hidden transition-all duration-500 ${bgColor === "white" ? "bg-white" : bgColor === "black" ? "bg-black" : bgColor === "blue" ? "bg-blue-600" : "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-[#050510]"}`}>
                <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
                
                {!image ? (
                   <label className="flex flex-col items-center justify-center p-20 cursor-pointer group">
                      <div className="w-20 h-20 bg-pink-500/10 rounded-[2rem] flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                          <ImageIcon size={40} />
                      </div>
                      <span className="text-slate-300 font-bold text-xl">Select Image</span>
                      <span className="text-slate-500 text-sm mt-2 opacity-60 font-medium tracking-wide">JPG, PNG or WEBP (Max 10MB)</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} title="Select image for background removal" />
                   </label>
                ) : (
                   <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                      <img 
                        src={resultImage || image} 
                        alt="Background removal result" 
                        className={`max-w-full max-h-[400px] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-all duration-700 ${isProcessing ? "blur-sm scale-95 opacity-50" : "scale-100"}`}
                      />
                      {isProcessing && (
                         <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin shadow-lg shadow-pink-500/20" />
                            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-tighter shadow-2xl">
                                AI is analyzing pixels...
                            </div>
                         </div>
                      )}
                   </div>
                )}
            </div>

            {image && !isProcessing && (
                <div className="flex justify-between items-center p-2 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-xl">
                    <button 
                       onClick={() => {setImage(null); setResultImage(null); setStatus("");}}
                       className="px-6 py-3 text-slate-500 hover:text-red-400 flex items-center gap-2 text-xs font-bold transition-colors"
                       title="Discard current image"
                    >
                       <Trash2 size={16} /> REMOVE FILE
                    </button>
                    <button 
                       onClick={handleDownload}
                       className="px-8 py-3 bg-white text-black font-black rounded-2xl text-xs flex items-center gap-2 hover:bg-pink-500 hover:text-white transition-all shadow-xl"
                    >
                       <Download size={16} /> DOWNLOAD {resultImage ? "ELITE RESULT" : "ORIGINAL"}
                    </button>
                </div>
            )}
        </div>
      </div>
    </ToolLayout>
  );
}
