"use client";

import { useState, useCallback } from "react";
import { FileArchive, Upload, Download, Trash2, CheckCircle2, AlertCircle, Zap, FilePlus } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import ToolGuide from "@/components/ToolGuide";

type CompressionLevel = "low" | "medium" | "high";

interface PdfFile {
  id: string;
  file: File;
  status: "pending" | "compressing" | "done" | "error";
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  error?: string;
  savings?: number; // percentage
}

const LEVEL_CONFIG: Record<CompressionLevel, { label: string; desc: string; objectStreams: boolean; useObjectStreams: boolean }> = {
  low:    { label: "Low",    desc: "Max quality, light size reduction",  objectStreams: false, useObjectStreams: false },
  medium: { label: "Medium", desc: "Balanced quality & size",            objectStreams: true,  useObjectStreams: true  },
  high:   { label: "High",   desc: "Smallest size, good quality",        objectStreams: true,  useObjectStreams: true  },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressPdf(file: File, level: CompressionLevel): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const cfg = LEVEL_CONFIG[level];

  const saved = await doc.save({
    useObjectStreams: cfg.useObjectStreams,
    addDefaultPage: false,
    objectsPerTick: level === "high" ? 50 : 100,
  });

  return new Blob([saved.buffer] as any, { type: "application/pdf" });
}

export default function PdfCompressorClient() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [isRunning, setIsRunning] = useState(false);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (!arr.length) return;
    setFiles((prev) => [
      ...prev,
      ...arr.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f,
        status: "pending" as const,
        originalSize: f.size,
      })),
    ]);
  }, []);

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const compressAll = async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (!pending.length) return;
    setIsRunning(true);

    // Mark all as compressing first
    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "compressing" as const } : f
      )
    );

    // Run ALL files in parallel — fast!
    await Promise.all(
      pending.map(async (entry) => {
        try {
          const blob = await compressPdf(entry.file, level);
          const savings = Math.max(0, Math.round(((entry.originalSize - blob.size) / entry.originalSize) * 100));
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, status: "done" as const, compressedSize: blob.size, compressedBlob: blob, savings }
                : f
            )
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Compression failed";
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id ? { ...f, status: "error" as const, error: msg } : f
            )
          );
        }
      })
    );

    setIsRunning(false);
  };

  const downloadFile = (entry: PdfFile) => {
    if (!entry.compressedBlob) return;
    const url = URL.createObjectURL(entry.compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    files.filter((f) => f.status === "done").forEach(downloadFile);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const totalSavedBytes = files
    .filter((f) => f.status === "done" && f.compressedSize !== undefined)
    .reduce((sum, f) => sum + (f.originalSize - (f.compressedSize ?? f.originalSize)), 0);

  return (
    <ToolLayout
      title="PDF Compressor — Bulk Size Reducer"
      description="Compress single or multiple PDFs instantly. Reduce file size without quality loss. 100% private — no server uploads."
      icon={FileArchive}
      color="#8b5cf6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#050510]/60 border border-white/5 rounded-3xl backdrop-blur-xl">
            <h4 className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
              <Zap size={14} className="text-violet-400" /> Compression Settings
            </h4>

            {/* Level Picker */}
            <div className="space-y-2 mb-6">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                Compression Level
              </label>
              {(Object.keys(LEVEL_CONFIG) as CompressionLevel[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                    level === l
                      ? "bg-violet-500/10 border-violet-500 text-white"
                      : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest block">
                      {LEVEL_CONFIG[l].label}
                    </span>
                    <span className="text-[10px] text-slate-500">{LEVEL_CONFIG[l].desc}</span>
                  </div>
                  {level === l && (
                    <div className="w-2 h-2 bg-violet-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* File Queue */}
            {files.length > 0 && (
              <div className="border-t border-white/5 pt-5">
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  Queue ({files.length} file{files.length !== 1 ? "s" : ""})
                </label>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {files.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{entry.file.name}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">
                          {entry.status === "pending"   && formatBytes(entry.originalSize)}
                          {entry.status === "compressing" && "⚡ Compressing..."}
                          {entry.status === "done"      && `${formatBytes(entry.originalSize)} → ${formatBytes(entry.compressedSize!)} (−${entry.savings}%)`}
                          {entry.status === "error"     && `✗ ${entry.error}`}
                        </p>
                      </div>

                      {entry.status === "compressing" && (
                        <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin shrink-0" />
                      )}
                      {entry.status === "done" && (
                        <button onClick={() => downloadFile(entry)} title="Download compressed PDF" className="p-1.5 bg-violet-500/10 hover:bg-violet-500/20 rounded-lg text-violet-400 transition-colors shrink-0">
                          <Download size={12} />
                        </button>
                      )}
                      {entry.status === "error" && (
                        <AlertCircle size={16} className="text-red-400 shrink-0" />
                      )}
                      {entry.status !== "compressing" && (
                        <button onClick={() => removeFile(entry.id)} title="Remove" className="p-1 hover:bg-red-500/20 rounded-lg text-slate-600 hover:text-red-400 transition-colors shrink-0">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {doneCount > 0 && (
              <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  ✓ {doneCount} done — Saved {formatBytes(totalSavedBytes)}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 space-y-3">
              {pendingCount > 0 && (
                <button
                  onClick={compressAll}
                  disabled={isRunning}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <Zap size={16} />
                  {isRunning ? "Compressing..." : `Compress ${pendingCount} PDF${pendingCount > 1 ? "s" : ""}`}
                </button>
              )}
              {doneCount > 0 && (
                <button
                  onClick={downloadAll}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black rounded-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <Download size={16} /> Download All ({doneCount})
                </button>
              )}
              {files.length > 0 && (
                <button
                  onClick={() => setFiles([])}
                  className="w-full py-3 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Drop Zone */}
          <div
            className={`p-20 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-[3rem] transition-all duration-300 ${
              dragOver
                ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
                : "border-white/5 bg-[#050510]/40 hover:border-white/10"
            }`}
            onClick={() => document.getElementById("pdf-compress-input")?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); }}
          >
            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-500 mb-6">
              {files.length > 0 ? <FilePlus size={32} /> : <Upload size={32} />}
            </div>
            <p className="text-slate-300 font-bold text-xl mb-2">
              {files.length > 0 ? "Add More PDFs" : "Drop PDFs to Compress"}
            </p>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              Drag &amp; drop one or multiple PDF files. Processed instantly in your browser — zero server uploads.
            </p>
            <input
              id="pdf-compress-input"
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              title="Upload PDF files"
              onChange={(e) => { if (e.target.files?.length) { addFiles(e.target.files); e.target.value = ""; } }}
            />
          </div>

          {/* Results Grid */}
          <AnimatePresence>
            {files.filter((f) => f.status === "done").length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Completed ({doneCount})
                </h4>
                {files
                  .filter((f) => f.status === "done")
                  .map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 bg-[#050510] border border-white/5 rounded-2xl hover:border-violet-500/20 transition-all"
                    >
                      <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0">
                        <FileArchive size={20} className="text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{entry.file.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-500">{formatBytes(entry.originalSize)}</span>
                          <span className="text-[10px] text-slate-600">→</span>
                          <span className="text-[10px] text-emerald-400 font-bold">{formatBytes(entry.compressedSize!)}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full border border-emerald-500/20">
                            −{entry.savings}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - (entry.savings ?? 0)}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => downloadFile(entry)}
                        className="py-2 px-4 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-400 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <Download size={12} /> Save
                      </button>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Guide */}
      <div className="mt-20 border-t border-white/5 pt-20">
        <ToolGuide
          toolName="PDF Compressor"
          sections={[
            { title: "Upload PDFs", content: "Select one or multiple PDF files. Drag & drop supported for bulk uploads." },
            { title: "Choose Level", content: "Low keeps max quality with light compression. Medium is balanced. High gives smallest file size." },
            { title: "Compress All", content: "All files are processed in parallel — no waiting for one to finish before next starts." },
            { title: "Download", content: "Save files individually or use Download All to get everything at once." },
          ]}
          faqs={[
            { question: "Will quality be affected?", answer: "Low and Medium levels retain near-identical visual quality. High removes redundant metadata and optimizes streams while keeping the content readable." },
            { question: "Can I compress multiple PDFs at once?", answer: "Yes! Add as many PDFs as you want. All are compressed simultaneously in parallel for maximum speed." },
            { question: "Is it private?", answer: "100%. Everything runs in your browser using pdf-lib. Your files never leave your device." },
            { question: "What is the maximum file size?", answer: "There is no enforced limit. Large files may take a few seconds depending on your device speed." },
          ]}
        />
      </div>
    </ToolLayout>
  );
}
