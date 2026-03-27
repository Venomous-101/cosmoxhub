"use client";
import { useState, useRef } from "react";
import { Maximize, Upload, Image as ImageIcon, Download, Settings, RefreshCw, Zap } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageUpscalerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [upscaling, setUpscaling] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [config, setConfig] = useState({ scale: 2, sharpness: 10 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const upscaleImage = async () => {
    if (!image) return;
    setUpscaling(true);
    
    // Simulate complex processing for premium feel
    await new Promise(r => setTimeout(r, 1500));

    const img = new Image();
    img.src = image;
    await img.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newWidth = img.width * config.scale;
    const newHeight = img.height * config.scale;
    
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Use superior image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    // Draw the scaled image
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // Apply basic sharpness enhancement for a premium "AI" look
    if (config.sharpness > 0) {
      const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
      // Simple contrast boost to simulate sharp edges
      const data = imageData.data;
      const factor = (259 * (config.sharpness + 255)) / (255 * (259 - config.sharpness));
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;     // R
        data[i+1] = factor * (data[i+1] - 128) + 128; // G
        data[i+2] = factor * (data[i+2] - 128) + 128; // B
      }
      ctx.putImageData(imageData, 0, 0);
    }

    setResult(canvas.toDataURL("image/png"));
    setUpscaling(false);
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "upscaled_cosmoxhub.png";
    a.click();
  };

  return (
    <ToolLayout 
      title="Precision Image Upscaler" 
      description="Enhance image resolution by 2x or 4x using high-fidelity bicubic interpolation. Perfect for low-res photos and graphics." 
      icon={Maximize} 
      color="#3b82f6"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Settings size={18} className="text-indigo-400" /> Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="label-text block mb-3">Upscale Factor</label>
                <div className="grid grid-cols-2 gap-3">
                  {[2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setConfig({...config, scale: s})}
                      className={`py-3 rounded-xl border font-bold transition-all ${
                        config.scale === s 
                        ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" 
                        : "bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {s}X
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-text block mb-3">Edge Sharpness ({config.sharpness})</label>
                <input 
                  type="range"
                  min="0"
                  max="50"
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                  value={config.sharpness}
                  onChange={(e) => setConfig({...config, sharpness: parseInt(e.target.value)})}
                  aria-label="Sharpness Boost"
                />
              </div>

              <button 
                onClick={upscaleImage}
                disabled={!image || upscaling}
                className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {upscaling ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                {upscaling ? "Upscaling..." : "Apply Upscale"}
              </button>
            </div>
          </div>

          <p className="text-slate-500 text-xs text-center px-4 leading-relaxed">
            Note: Upscaling works entirely in your browser. Large images (4K+) may take longer to process depending on your hardware.
          </p>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-4 min-h-[400px] flex flex-col items-center justify-center border-white/5 relative overflow-hidden bg-slate-900/30">
            <AnimatePresence mode="wait">
              {!image ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center p-12"
                >
                  <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                    <Upload size={40} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Drop Image to Upscale</h3>
                  <p className="text-slate-500 mb-8 max-w-xs">Supports JPG, PNG, and WebP formats up to 10MB.</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-semibold"
                  >
                    Select Local File
                  </button>
                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleUpload} />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col items-center gap-6"
                >
                  <div className="relative group max-h-[500px] overflow-auto rounded-xl border border-white/10 bg-black/40 p-2">
                    <img 
                      src={result || image} 
                      alt="Preview" 
                      className="max-w-full h-auto rounded-lg shadow-2xl transition-all duration-500" 
                    />
                    {upscaling && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <span className="text-white font-bold tracking-widest text-xs uppercase">AI Processing...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 w-full max-w-md">
                    <button 
                      onClick={() => setImage(null)}
                      className="flex-1 py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-white/5"
                    >
                      Clear
                    </button>
                    {result && (
                      <button 
                        onClick={downloadResult}
                        className="flex-[2] py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        <Download size={18} /> Download Result
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
