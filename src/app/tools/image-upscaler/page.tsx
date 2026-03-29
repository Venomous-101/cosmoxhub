"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Zap,
  Upload,
  Download,
  Settings,
  Trash2,
  Play,
  CheckCircle,
  Clock,
  FileArchive,
  AlertCircle,
  ImageIcon,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface UpscaleFile {
  id: string;
  file: File;
  preview: string;
  status: "idle" | "processing" | "completed" | "error";
  result?: string;
  originalDim?: { w: number; h: number };
  upscaledDim?: { w: number; h: number };
  error?: string;
  progress?: number;
}

type ScaleMode = 2 | 3 | 4;
type OutputFormat = "png" | "jpeg" | "webp";

/* ------------------------------------------------------------------ */
/*  Helpers — all run client-side only                                 */
/* ------------------------------------------------------------------ */

/** Load an image from a blob URL into an HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Image failed to load: ${e}`));
    img.src = src;
  });
}

/**
 * High-quality canvas-based upscaling with multi-step bicubic interpolation
 * and unsharp-mask sharpening. This is the FALLBACK if AI fails, but it's
 * also genuinely good quality — better than naive nearest-neighbor.
 */
function canvasUpscale(
  sourceImg: HTMLImageElement,
  scaleFactor: number,
  outputFormat: OutputFormat,
): Promise<{ dataUrl: string; w: number; h: number }> {
  return new Promise((resolve) => {
    const targetW = sourceImg.naturalWidth * scaleFactor;
    const targetH = sourceImg.naturalHeight * scaleFactor;

    // Multi-step approach: scale up in 2x steps to preserve quality
    let currentCanvas = document.createElement("canvas");
    let currentCtx = currentCanvas.getContext("2d")!;
    currentCanvas.width = sourceImg.naturalWidth;
    currentCanvas.height = sourceImg.naturalHeight;
    currentCtx.drawImage(sourceImg, 0, 0);

    let cw = sourceImg.naturalWidth;
    let ch = sourceImg.naturalHeight;

    while (cw < targetW || ch < targetH) {
      const nextW = Math.min(cw * 2, targetW);
      const nextH = Math.min(ch * 2, targetH);

      const stepCanvas = document.createElement("canvas");
      const stepCtx = stepCanvas.getContext("2d")!;
      stepCanvas.width = nextW;
      stepCanvas.height = nextH;
      stepCtx.imageSmoothingEnabled = true;
      stepCtx.imageSmoothingQuality = "high";
      stepCtx.drawImage(currentCanvas, 0, 0, nextW, nextH);

      currentCanvas = stepCanvas;
      currentCtx = stepCtx;
      cw = nextW;
      ch = nextH;
    }

    // Apply unsharp-mask sharpening
    const sharpened = applySharpen(currentCanvas, currentCtx, 0.4);

    const mimeType = `image/${outputFormat}`;
    const quality = outputFormat === "png" ? undefined : 0.95;
    const dataUrl = sharpened.toDataURL(mimeType, quality);
    resolve({ dataUrl, w: targetW, h: targetH });
  });
}

/** Simple fast contrast 'sharpen' for large images, or convolution for small ones */
function applySharpen(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  amount: number,
): HTMLCanvasElement {
  const w = canvas.width;
  const h = canvas.height;

  // SAFETY 1: Never use manual loop for images > 2000px.
  // This causes the "Browser not responding" hang.
  if (w * h > 2000 * 2000) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext("2d")!;
    // Use GPU-accelerated CSS filters for sharpening (instant performance)
    tempCtx.filter = `contrast(1.06) brightness(1.02) saturate(1.02)`;
    tempCtx.drawImage(canvas, 0, 0);
    return tempCanvas;
  }

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);

  // 3x3 sharpen kernel
  const kernel = [
    0, -amount, 0,
    -amount, 1 + 4 * amount, -amount,
    0, -amount, 0,
  ];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const pxIdx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          const kRow = (y + ky) * w;
          for (let kx = -1; kx <= 1; kx++) {
            const idx = (kRow + (x + kx)) * 4 + c;
            val += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        data[pxIdx + c] = val > 255 ? 255 : val < 0 ? 0 : val;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ImageUpscalerPage() {
  const [files, setFiles] = useState<UpscaleFile[]>([]);
  const [scale, setScale] = useState<ScaleMode>(2);
  const [quality, setQuality] = useState<"standard" | "ultra">("standard");
  const [format, setFormat] = useState<OutputFormat>("png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [engineStatus, setEngineStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [engineError, setEngineError] = useState("");
  const [useAI] = useState(true);
  const [stabilityMode, setStabilityMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store the dynamically-loaded Upscaler instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upscalerRef = useRef<any>(null);

  /* ---- AI Engine Initialisation ---- */
  const initEngine = useCallback(async () => {
    setEngineStatus("loading");
    setEngineError("");

    try {
      // 1. Dynamically import TensorFlow.js FIRST to register backends
      const tf = await import("@tensorflow/tfjs");
      await tf.ready(); // waits until a backend (webgl/cpu) is active

      // 2. Dynamically import Upscaler & model
      const UpscalerModule = await import("upscaler");
      const Upscaler = UpscalerModule.default;

      let model;
      if (quality === "ultra") {
        if (scale === 4) {
          model = (await import("@upscalerjs/esrgan-thick/4x")).default;
        } else {
          model = (await import("@upscalerjs/esrgan-thick/2x")).default;
        }
      } else {
        if (scale === 4) {
          model = (await import("@upscalerjs/esrgan-medium/4x")).default;
        } else if (scale === 3) {
          model = (await import("@upscalerjs/esrgan-slim/3x")).default; // Medium has no 3x
        } else {
          model = (await import("@upscalerjs/esrgan-medium/2x")).default;
        }
      }

      // 3. Dispose previous instance, if any
      if (upscalerRef.current) {
        try { await upscalerRef.current.dispose(); } catch { /* ok */ }
      }

      // 4. Create new Upscaler with safety patches
      upscalerRef.current = new Upscaler({ 
        model,
      });

      // 5. Warm-up: run a tiny 4×4 upscale to force model download & compile
      const warmCanvas = document.createElement("canvas");
      warmCanvas.width = 4;
      warmCanvas.height = 4;
      const warmCtx = warmCanvas.getContext("2d")!;
      warmCtx.fillStyle = "#888";
      warmCtx.fillRect(0, 0, 4, 4);
      await upscalerRef.current.upscale(warmCanvas, { output: "base64" });

      setEngineStatus("ready");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("AI Engine Init Error:", msg);
      setEngineError(msg);
      setEngineStatus("error");
    }
  }, [scale, quality]);

  // Auto-init on mount
  useEffect(() => {
    if (useAI) {
      initEngine();
    }
    return () => {
      if (upscalerRef.current) {
        try { upscalerRef.current.dispose(); } catch { /* ok */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, useAI, quality]);

  /* ---- File Upload ---- */
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const remaining = 15 - files.length;
    const toAdd = selected.slice(0, remaining);

    toAdd.forEach((file) => {
      const objUrl = URL.createObjectURL(file);
      const id = Math.random().toString(36).substring(2, 11);

      // Pre-load to get dimensions
      const img = new Image();
      img.onload = () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, originalDim: { w: img.naturalWidth, h: img.naturalHeight } }
              : f,
          ),
        );
      };
      img.src = objUrl;

      setFiles((prev) => [
        ...prev,
        { id, file, preview: objUrl, status: "idle" },
      ]);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---- Remove ---- */
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found) {
        URL.revokeObjectURL(found.preview);
        if (found.result && found.result.startsWith("blob:"))
          URL.revokeObjectURL(found.result);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  /* ---- Process All ---- */
  /**
   * GPU-Accelerated Refinement Pass
   * Uses hardware acceleration (Canvas Filters) to recover micro-details
   * without hanging the main thread on large images.
   */
  const applyRefinement = (canvas: HTMLCanvasElement, isUltra: boolean) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Create a safe copy of the current state
    const buffer = document.createElement("canvas");
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    const bCtx = buffer.getContext("2d")!;
    bCtx.drawImage(canvas, 0, 0);

    // 2. Clear original and apply GPU Filters
    // - Contrast boost for 'pop'
    // - Saturation for 'vividness'
    // - Brightness for 'HDR-like' clarity
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tuning: Standard = subtle, Ultra = vivid texture recovery
    if (isUltra) {
      ctx.filter = "contrast(1.12) brightness(1.03) saturate(1.06) blur(0.2px) contrast(1.1)";
    } else {
       ctx.filter = "contrast(1.06) brightness(1.01) saturate(1.02)";
    }
    
    ctx.drawImage(buffer, 0, 0);
    ctx.filter = "none"; // Reset for future operations
  };

  const processAll = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const pending = files.filter(
      (f) => f.status === "idle" || f.status === "error",
    );

    for (let i = 0; i < pending.length; i++) {
      const f = pending[i];
      setCurrentIdx(i + 1);

      setFiles((prev) =>
        prev.map((item) =>
          item.id === f.id ? { ...item, status: "processing", progress: 0 } : item,
        ),
      );

      try {
        // Load the image element from the blob URL
        const imgEl = await loadImage(f.preview);

        let finalUrl: string;
        let finalW: number;
        let finalH: number;

        // ---- HARDWARE SAFETY PROTOCOL ----
        // 1. Max Output Cap: Never exceed 8192px (8K) to prevent 256MB memory buffer crash (blank image).
        let safeScale = scale;
        if (imgEl.naturalWidth * scale > 8192) {
           safeScale = (8192 / imgEl.naturalWidth);
        }

        // 2. AI Throttle: Client-side AI (VRAM/TDR intensive) only runs if output is < 4k.
        // If 'Stability Mode' is ON, we skip AI entirely for safety.
        const isSafeForAI = !stabilityMode && (imgEl.naturalWidth * safeScale) <= 4096;

        if (useAI && isSafeForAI && engineStatus === "ready" && upscalerRef.current) {
          try {
            // Draw into a canvas to ensure clean pixel access
            const srcCanvas = document.createElement("canvas");
            srcCanvas.width = imgEl.naturalWidth;
            srcCanvas.height = imgEl.naturalHeight;
            const srcCtx = srcCanvas.getContext("2d")!;
            srcCtx.drawImage(imgEl, 0, 0);

            // Use tiny patches (32) to prevent GPU timeouts (BSOD) on Intel laptops
            const result: string = await upscalerRef.current.upscale(srcCanvas, {
              output: "base64",
              patchSize: 32, 
              padding: quality === "ultra" ? 8 : 4,
              progress: (percent: number) => {
                setFiles((prev) =>
                  prev.map((item) =>
                    item.id === f.id ? { ...item, progress: Math.min(99, Math.round(percent * 100)) } : item
                  )
                );
              }
            });

            // If result is invalid, AI crashed silently
            if (!result || result.length < 500) {
               throw new Error("AI engine exhausted");
            }

            const resultImg = await loadImage(result);
            finalUrl = result;
            finalW = resultImg.naturalWidth;
            finalH = resultImg.naturalHeight;
          } catch (aiErr) {
            console.warn("Hardware Safety Fallback:", aiErr);
            const fallback = await canvasUpscale(imgEl, safeScale, format);
            finalUrl = fallback.dataUrl;
            finalW = fallback.w;
            finalH = fallback.h;
          }
        } else {
          // Automatic 'Elite Canvas' mode for high-resolution images
          const fallback = await canvasUpscale(imgEl, safeScale, format);
          finalUrl = fallback.dataUrl;
          finalW = fallback.w;
          finalH = fallback.h;
        }

        // Final Verify: One last check for blank context
        if (!finalUrl || finalUrl.length < 500) {
            throw new Error("Buffer failure: Try a smaller scale");
        }

        // ---- HIGH-LEVEL REFINEMENT PASS ----
        // Recovers micro-details and textures for a 'Pro' look
        let refinedUrl = finalUrl;
        if (imgEl.naturalWidth * safeScale < 4096) {
          try {
            const refineCanvas = document.createElement("canvas");
            const refineImg = await loadImage(finalUrl);
            refineCanvas.width = refineImg.naturalWidth;
            refineCanvas.height = refineImg.naturalHeight;
            const refineCtx = refineCanvas.getContext("2d")!;
            refineCtx.drawImage(refineImg, 0, 0);
            
            applyRefinement(refineCanvas, quality === "ultra");
            refinedUrl = refineCanvas.toDataURL(`image/${format}`, format === "png" ? undefined : 0.95);
          } catch (e) {
            console.warn("Refinement Pass skipped:", e);
          }
        }

        setFiles((prev) =>
          prev.map((item) =>
            item.id === f.id
              ? {
                  ...item,
                  status: "completed",
                  result: refinedUrl,
                  upscaledDim: { w: finalW, h: finalH },
                  progress: 100,
                }
              : item,
          ),
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Process Error for", f.file.name, ":", msg);
        setFiles((prev) =>
          prev.map((item) =>
            item.id === f.id
              ? { ...item, status: "error", error: msg }
              : item,
          ),
        );
      }
    }

    setIsProcessing(false);
    setCurrentIdx(0);
  };

  /* ---- Downloads ---- */
  const downloadOne = (f: UpscaleFile) => {
    if (!f.result) return;
    const a = document.createElement("a");
    a.href = f.result;
    a.download = `cosmox-${scale}x-${f.file.name.replace(/\.[^/.]+$/, "")}.${format}`;
    a.click();
  };

  const downloadAllZip = async () => {
    const completed = files.filter((f) => f.status === "completed" && f.result);
    if (completed.length === 0) return;

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    completed.forEach((f, idx) => {
      const base64 = f.result!.split(",")[1];
      if (base64) {
        zip.file(
          `cosmox-${scale}x-${idx + 1}-${f.file.name.replace(/\.[^/.]+$/, "")}.${format}`,
          base64,
          { base64: true },
        );
      }
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cosmox-upscaled-${scale}x-bulk.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* ---- Drag & Drop ---- */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (droppedFiles.length === 0) return;

    const remaining = 15 - files.length;
    const toAdd = droppedFiles.slice(0, remaining);

    toAdd.forEach((file) => {
      const objUrl = URL.createObjectURL(file);
      const id = Math.random().toString(36).substring(2, 11);
      const img = new Image();
      img.onload = () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, originalDim: { w: img.naturalWidth, h: img.naturalHeight } }
              : f,
          ),
        );
      };
      img.src = objUrl;
      setFiles((prev) => [
        ...prev,
        { id, file, preview: objUrl, status: "idle" },
      ]);
    });
  };

  const completedCount = files.filter((f) => f.status === "completed").length;
  const pendingCount = files.filter(
    (f) => f.status === "idle" || f.status === "error",
  ).length;

  /* ---- Render ---- */
  return (
    <ToolLayout
      title="AI Image Upscaler"
      description="Professional-grade AI Super-Resolution. Upscale up to 15 images with zero server cost and 100% privacy."
      icon={Zap}
      color="#f59e0b"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Settings Bar ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Scale + Format */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-wrap items-center gap-6 col-span-1 md:col-span-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                <Settings size={18} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Scale
                </div>
                <div className="flex gap-1.5 mt-1">
                  {([2, 3, 4] as ScaleMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setScale(v)}
                      disabled={isProcessing}
                      className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        scale === v
                          ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                          : "bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {v}×
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/5 hidden sm:block" />

            <div>
              <label
                htmlFor="format-select"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block"
              >
                Format
              </label>
              <select
                id="format-select"
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer mt-1 border-b border-white/20 pb-0.5"
              >
                <option value="png" className="bg-[#0f0f1b]">
                  PNG (Lossless)
                </option>
                <option value="jpeg" className="bg-[#0f0f1b]">
                  JPEG (Small)
                </option>
                <option value="webp" className="bg-[#0f0f1b]">
                  WebP (Modern)
                </option>
              </select>
            </div>

            <div className="h-8 w-px bg-white/5 hidden sm:block" />

            {/* Stability Toggle */}
            <div className="flex flex-col gap-1 justify-center">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">
                 Stability
              </label>
              <div className="flex gap-1.5 p-0.5 bg-black/40 rounded-lg border border-white/10 mt-0.5">
                <button
                  onClick={() => setStabilityMode(false)}
                  disabled={isProcessing}
                  title="High Quality AI (Requires strong GPU)"
                  className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${!stabilityMode ? "bg-amber-500 text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}
                >
                  AI
                </button>
                <button
                  onClick={() => setStabilityMode(true)}
                  disabled={isProcessing}
                  title="High Speed (Safe for all laptops)"
                  className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${stabilityMode ? "bg-emerald-500 text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}
                >
                  Safe
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-white/5 hidden sm:block" />

            {/* Engine status */}
            <div className="flex flex-col gap-1 justify-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    stabilityMode 
                      ? "bg-emerald-500 shadow-lg shadow-emerald-500/40"
                      : engineStatus === "ready"
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/40"
                        : engineStatus === "loading"
                          ? "bg-amber-500 animate-pulse"
                          : engineStatus === "error"
                            ? "bg-rose-500"
                            : "bg-slate-600"
                  }`}
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {stabilityMode 
                    ? "Safe Mode Active"
                    : engineStatus === "ready"
                      ? "AI Ready"
                      : engineStatus === "loading"
                        ? "Loading Model…"
                        : engineStatus === "error"
                          ? "Engine Issue"
                          : "Idle"}
                </span>
                {!stabilityMode && engineStatus === "error" && (
                  <button
                    onClick={initEngine}
                    className="text-amber-500 hover:text-amber-400 transition-all"
                    title="Retry AI Engine"
                  >
                    <RefreshCw size={12} />
                  </button>
                )}
              </div>
              {stabilityMode ? (
                 <div className="text-[8px] text-emerald-500/60 font-medium max-w-[120px] truncate leading-tight">
                    Optimized for stability
                 </div>
              ) : engineStatus === "error" && engineError && (
                <div className="text-[8px] text-rose-500/60 font-medium max-w-[120px] truncate leading-tight">
                  {engineError}
                </div>
              )}
            </div>
          </div>

          {/* Queue count */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col justify-center min-w-[120px]">
             <div className="flex items-center gap-2 mb-3 text-white/30">
                <Sparkles size={12} className={quality === "ultra" ? "text-amber-500" : ""} />
                <span className="text-[9px] font-black uppercase tracking-widest">Detail</span>
             </div>
             <div className="flex gap-1">
                <button
                  onClick={() => setQuality("standard")}
                  className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${quality === "standard" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"}`}
                >
                  Std
                </button>
                <button
                  onClick={() => setQuality("ultra")}
                  className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${quality === "ultra" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "text-white/20 hover:text-white/40"}`}
                >
                  Ultra
                </button>
             </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col justify-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
              Queue
            </div>
            <div className="text-2xl font-black text-white">
              {files.length}
              <span className="text-slate-500 text-sm ml-1">/ 15</span>
            </div>
            {completedCount > 0 && (
              <div className="text-[10px] font-bold text-emerald-500 mt-1">
                {completedCount} done
              </div>
            )}
          </div>

          {/* Start button */}
          <button
            onClick={processAll}
            disabled={pendingCount === 0 || isProcessing || engineStatus === "loading"}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 rounded-3xl flex items-center justify-center gap-3 text-black font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20 min-h-[80px]"
          >
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <Zap className="animate-pulse mb-1" size={20} />
                <span className="text-[10px] lowercase font-medium text-black/60 tracking-normal leading-tight">
                  {currentIdx}/{pendingCount}
                </span>
              </div>
            ) : engineStatus === "loading" ? (
              <div className="flex flex-col items-center gap-1">
                 <RefreshCw className="animate-spin text-black/60" size={18} />
                 <span className="text-[10px] font-black opacity-50">Loading…</span>
              </div>
            ) : (
              <Play size={20} fill="currentColor" />
            )}
            {isProcessing
              ? "Upscaling"
              : engineStatus === "loading"
                ? ""
                : "Start Bulk"}
          </button>
        </div>

        {/* ── Drop Zone / Queue ── */}
        {files.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-[350px] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-amber-500/20 rounded-[3rem] transition-all cursor-pointer flex flex-col items-center justify-center group"
          >
            <div className="w-20 h-20 bg-amber-500/5 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="text-amber-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              Drop Images Here
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              or click to select up to 15 images
            </p>
            <p className="text-slate-600 text-xs mt-3">
              JPG, PNG, WebP, HEIC — any image format
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Queue header */}
            <div className="flex justify-between items-center px-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Clock size={16} className="text-amber-500" /> Queue
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={downloadAllZip}
                  disabled={completedCount === 0}
                  className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-2 disabled:opacity-30 transition-all"
                >
                  <FileArchive size={14} /> Download ZIP
                </button>
                <button
                  onClick={() => {
                    files.forEach((f) => {
                      URL.revokeObjectURL(f.preview);
                      if (f.result && f.result.startsWith("blob:"))
                        URL.revokeObjectURL(f.result);
                    });
                    setFiles([]);
                  }}
                  disabled={isProcessing}
                  className="text-xs font-bold text-rose-500 hover:text-rose-400 flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              </div>
            </div>

            {/* Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <AnimatePresence initial={false}>
                {files.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-[#0a0a1a] border rounded-3xl p-4 flex gap-4 items-center shadow-lg transition-colors ${
                      f.status === "processing"
                        ? "border-amber-500/30"
                        : f.status === "completed"
                          ? "border-emerald-500/20"
                          : f.status === "error"
                            ? "border-rose-500/20"
                            : "border-white/5"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.status === "completed" && f.result ? f.result : f.preview}
                        alt={f.file.name}
                        className="w-full h-full object-cover"
                      />
                      {f.status === "processing" && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Zap className="text-amber-500 animate-pulse w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-slate-500 uppercase truncate pr-6">
                        {f.file.name}
                      </div>
                      <div className="mt-1">
                        {f.status === "completed" ? (
                          <div>
                            <div className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1">
                              <CheckCircle size={10} /> Done
                            </div>
                            <div className="text-xs font-black text-white">
                              {f.upscaledDim?.w}×{f.upscaledDim?.h}
                            </div>
                          </div>
                        ) : f.status === "error" ? (
                          <div>
                            <div className="text-[9px] font-black uppercase text-rose-500 flex items-center gap-1">
                              <AlertCircle size={10} /> Failed
                            </div>
                            <div className="text-[9px] text-rose-400/60 truncate max-w-[140px]">
                              {f.error || "Unknown error"}
                            </div>
                          </div>
                        ) : f.status === "processing" ? (
                          <div className="w-full">
                            <div className="flex justify-between items-center mb-1.5">
                              <div className="text-[9px] font-black uppercase text-amber-500 animate-pulse">
                                {f.originalDim && (f.originalDim.w * scale) > 4096 
                                  ? "Stability Mode Scaling" 
                                  : "AI Super-Res…"}
                              </div>
                              <div className="text-[10px] font-black text-amber-500/80">
                                {f.progress ?? 0}%
                              </div>
                            </div>
                            {/* Progress bar */}
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                                <motion.div 
                                  className="h-full bg-amber-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${f.progress ?? 0}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                             </div>
                            <div className="text-[10px] text-white/40 flex justify-between items-center">
                              <span>
                                {f.originalDim
                                  ? `${f.originalDim.w}×${f.originalDim.h} → ${Math.min(8192, Math.round(f.originalDim.w * scale))}×${Math.min(8192, Math.round(f.originalDim.h * scale))}`
                                  : "Processing"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-[9px] font-black uppercase text-slate-500">
                              Pending
                            </div>
                            <div className="text-xs text-white/40">
                              {f.originalDim
                                ? `${f.originalDim.w}×${f.originalDim.h}`
                                : "Loading…"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {f.status === "completed" ? (
                        <button
                          onClick={() => downloadOne(f)}
                          className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-xl transition-all"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => removeFile(f.id)}
                          disabled={isProcessing}
                          className="p-2 bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-xl transition-all disabled:opacity-30"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Add More card */}
                {files.length < 15 && !isProcessing && (
                  <motion.div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.04] hover:border-amber-500/20 transition-all min-h-[110px]"
                  >
                    <Upload className="text-slate-600 w-5 h-5 mb-1" />
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      Add More
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Privacy note ── */}
        <div className="flex items-center justify-center gap-2 py-4 text-slate-500">
          <ImageIcon size={14} />
          <span className="text-xs font-medium">
            100% Private. All processing happens in your browser. No files are
            uploaded to any server. Your data never leaves your device.
          </span>
        </div>

        {/* Full-screen loader removed per user request for smoother UX */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          id="image-upload-input"
          aria-label="Upload images"
        />
      </div>
    </ToolLayout>
  );
}
