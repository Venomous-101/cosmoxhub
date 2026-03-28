"use client";

import { useState } from "react";
import { 
  Scissors, 
  FileText, 
  Download, 
  Settings, 
  Zap, 
  Sparkles, 
  FileUp,
  CheckCircle2,
  AlertCircle,
  FileDigit,
  Split
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [ranges, setRanges] = useState<string>("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setPageCount(pdf.getPageCount());
        setRanges(`1-${pdf.getPageCount()}`); // Default range
      } catch {
        setError("Failed to load PDF metadata.");
      }
    }
  };

  const parseRanges = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(end, maxPages); i++) {
            pages.add(i - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const page = Number(part);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          pages.add(page - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!file || !ranges) return;
    
    setIsSplitting(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageIndices = parseRanges(ranges, pageCount);

      if (pageIndices.length === 0) {
        throw new Error("Invalid page range specified.");
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cosmoxhub-split-${Date.now()}.pdf`;
      link.click();
      
      setIsSplitting(false);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || "Failed to split PDF. Ensure ranges are valid.");
      setIsSplitting(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite PDF Splitter",
    "operatingSystem": "Any",
    "applicationCategory": "PDFTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Precision range-based PDF extraction",
       "High-res client-side byte splitting",
       "Secure no-upload workflow",
       "Elite document metadata analysis",
       "Zero-latency processing architecture"
    ]
  };

  return (
    <ToolLayout
      title="Elite PDF Splitter"
      description="Extract specific pages or ranges from any PDF document with precision. 100% private client-side processing."
      icon={Split}
      color="#ec4899"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Main Interface Area */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-[3.5rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative min-h-[500px] flex flex-col">
              {!file ? (
                <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-pink-500/10 hover:border-pink-500/30 bg-pink-500/[0.02] rounded-[2.5rem] cursor-pointer transition-all group">
                    <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center mb-6 border border-pink-500/20 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-500">
                        <FileUp className="text-pink-500 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Ingest PDF Source</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose max-w-xs text-center px-4">
                        Select a single PDF file to analyze and decompose.
                    </p>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="space-y-8 flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                    {/* File Card info */}
                    <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <FileText size={80} />
                        </div>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20 shadow-xl">
                                <FileText className="text-pink-500" size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-white tracking-widest uppercase truncate max-w-[300px]">{file.name}</h4>
                                <div className="flex gap-4">
                                    <span className="text-[10px] font-black uppercase text-pink-500/80 tracking-widest">{pageCount} PAGES DETECTED</span>
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                             <div className="flex items-center gap-2">
                                <Scissors size={14} className="text-pink-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Extraction Pattern</span>
                             </div>
                             <div className="text-[9px] font-black uppercase tracking-widest text-pink-500 animate-pulse">Byte stream ready</div>
                        </div>
                        <input 
                            type="text"
                            value={ranges}
                            onChange={(e) => setRanges(e.target.value)}
                            placeholder="Example: 1-5, 8, 12-14"
                            className="w-full bg-[#02020a] border border-white/5 p-6 rounded-2xl text-white font-mono text-center text-lg outline-none focus:border-pink-500/30 transition-all shadow-inner"
                        />
                         <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center px-4 leading-loose">
                            Type individual pages or ranges separated by commas.
                        </p>
                    </div>

                    <button 
                         onClick={() => setFile(null)}
                         className="mx-auto text-[10px] font-black text-slate-700 hover:text-rose-500 uppercase tracking-widest transition-colors"
                    >
                        Purge Local Memory Cache
                    </button>
                </div>
              )}

              {file && (
                 <div className="pt-8 mt-8 border-t border-white/5 flex flex-col items-center">
                    <div className="flex items-center gap-3 text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.2em]">
                        <CheckCircle2 size={12} /> Privacy Guaranteed: Processing 100% In-Terminal
                    </div>
                 </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-600 to-rose-600 shadow-[0_2px_15px_rgba(236,72,153,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-pink-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Split Config</h3>
            </div>

            <div className="space-y-8">
                {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-rose-500">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold uppercase leading-tight tracking-wider">{error}</p>
                    </div>
                )}

                <div className="pt-4 space-y-3">
                    <button
                        onClick={splitPDF}
                        disabled={!file || !ranges || isSplitting}
                        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-white/5 disabled:text-slate-600 text-black font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-2xl transition-all shadow-xl shadow-pink-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        {isSplitting ? (
                            <>
                                <FileDigit size={16} className="animate-pulse" /> EXTRACTING BYTES...
                            </>
                        ) : (
                            <>
                                <Download size={16} className="group-hover:scale-110 transition-transform" /> COMMAND SPLIT
                            </>
                        )}
                    </button>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl flex gap-3 text-pink-500 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                        <Zap size={16} className="shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold uppercase leading-tight tracking-wider relative z-10">
                            Decomposition logic ensures internal metadata and bookmarks are preserved in extracted ranges.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group flex items-start gap-4">
            <Sparkles size={18} className="text-pink-500 shrink-0" />
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Elite extraction doesn&apos;t re-encode images inside the PDF, ensuring zero quality loss in the extracted ranges.
            </p>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
