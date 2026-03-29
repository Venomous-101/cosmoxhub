"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Download, 
  Eraser, 
  Upload,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

import { motion } from "framer-motion";

// Client-side only import type
type RemoveBgFn = (source: Blob | string | File, options?: Record<string, unknown>) => Promise<Blob>;
let removeBackground: RemoveBgFn;

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [progress, setProgress] = useState<number>(0);
  const [aiLoaded, setAiLoaded] = useState(false);
  
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
        publicPath: "https://static.imgly.com/@imgly/background-removal-data/1.7.0/dist/",
        model: "medium",
        output: {
          format: "image/png",
          quality: 1
        }
      });
      
      const url = URL.createObjectURL(blob);
      setResult(url);
      setStatus("completed");
    } catch (error) {
      console.error("AI Error:", error);
      setStatus("error");
    }
  };

  const downloadImage = () => {
    if (!result || !file) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `nobg-${file.name.replace(/\.[^/.]+$/, "")}.png`;
    link.click();
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
      title="Background Remover" 
      description="Instantly remove backgrounds from images for free using pure client-side AI processing." 
      icon={Eraser}
      color="#ec4899"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Upload State */}
        {!file && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-pink-500/30 rounded-3xl bg-pink-500/5 hover:bg-pink-500/10 transition-all cursor-pointer h-80"
          >
            <div className="w-20 h-20 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-4 text-pink-500">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload an Image</h3>
            <p className="text-slate-400 text-sm">PNG, JPG or WEBP (Max 10MB)</p>
          </div>
        )}

        {/* Workspace State */}
        {file && preview && (
          <div className="bg-[#0f0f1b] border border-white/5 rounded-3xl p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6 h-auto md:h-80">
              
              {/* Original Preview */}
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase">Original</span>
                <div className="flex-1 rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
              </div>

              {/* Result Preview */}
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-xs font-bold font-mono text-pink-500 uppercase">Result</span>
                <div className="flex-1 rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative flex items-center justify-center">
                  
                  {status === "idle" && (
                     <div className="text-center text-slate-500 flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">Pending Extraction</span>
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
                    <div className="text-center text-rose-500 flex flex-col items-center px-4">
                       <span className="text-sm font-medium mb-1">Processing Failed</span>
                       <span className="text-xs text-rose-500/70">Please try a different image.</span>
                    </div>
                  )}

                  {result && (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={result} alt="Result" className="max-w-full max-h-full object-contain" />
                  )}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
              <button
                onClick={resetAll}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
              >
                Choose Another
              </button>

              {status === "idle" && (
                 <button
                    onClick={processImage}
                    disabled={!aiLoaded}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors font-bold text-sm shadow-lg shadow-pink-500/20"
                 >
                    <Eraser className="w-4 h-4" />
                    {aiLoaded ? "Auto Remove Background" : "Loading AI Engine..."}
                 </button>
              )}

              {status === "processing" && (
                 <button disabled className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600/50 text-white cursor-not-allowed font-bold text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing
                 </button>
              )}

              {status === "completed" && (
                 <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition-colors font-bold text-sm shadow-lg shadow-pink-500/20"
                 >
                    <Download className="w-4 h-4" />
                    Download HD Image
                 </button>
              )}
            </div>
          </div>
        )}

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
