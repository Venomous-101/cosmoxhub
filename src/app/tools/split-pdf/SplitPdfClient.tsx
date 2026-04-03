"use client";

import { useState } from "react";
import { 
  Scissors, 
  FileText, 
  Download, 
  FileUp,
  CheckCircle2,
  AlertCircle,
  FileDigit,
  Split
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import ToolGuide from "@/components/ToolGuide";

export default function SplitPdfClient() {
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
      if (typeof window !== 'undefined' && typeof (window as any).call_locker === 'function') {
        try { (window as any).call_locker(); } catch(e) {}
      }
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

  return (
    <ToolLayout
      title="Elite PDF Splitter"
      description="Extract specific pages or ranges from any PDF document with precision. 100% private client-side processing."
      icon={Split}
      color="#ec4899"
    >
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
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
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Add PDF File</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose max-w-xs text-center px-4">
                        Select a single PDF file to extract pages.
                    </p>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="space-y-8 flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
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
                        Remove File
                    </button>
                </div>
              )}

              {file && (
                 <div className="pt-8 mt-8 border-t border-white/5 flex flex-col items-center">
                    <div className="flex items-center gap-3 text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.2em]">
                        <CheckCircle2 size={12} /> Privacy Guaranteed: Processing 100% On-Device
                    </div>
                 </div>
              )}
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">Split Settings</h3>
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
                        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-white/5 disabled:text-slate-600 text-black font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSplitting ? (
                            <>
                                <FileDigit size={16} className="animate-spin" /> SPLITTING...
                            </>
                        ) : (
                            <>
                                <Download size={16} /> SPLIT NOW
                            </>
                        )}
                    </button>
                </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-20 border-t border-white/5 pt-20">
        <ToolGuide
          toolName="Split PDF"
          sections={[
            {
              title: "Upload Your PDF",
              content: "Select the PDF document you want to split. Our tool instantly analyzes the file structure locally and prepares the byte-stream."
            },
            {
              title: "Define Extraction Pattern",
              content: "Type the specific pages or ranges you need (e.g., 1-5, 8, 12-14). Our precision engine interprets your pattern in real-time."
            },
            {
              title: "Execute Splitting",
              content: "Click the 'SPLIT NOW' button. Our core logic extracts the requested pages with 100% on-device privacy."
            },
            {
              title: "Download New PDF",
              content: "Your new, perfectly split PDF document will download automatically to your device in seconds."
            }
          ]}
          faqs={[
            {
              question: "Is splitting PDFs on CosmoXHub private?",
              answer: "Absolutely. We use advanced browser-side splitting technology. Your original PDF and the extracted pages never leave your device, ensuring total privacy for sensitive data."
            },
            {
              question: "Can I split a password-protected PDF?",
              answer: "No, for security reasons, you must first remove the password from the PDF before our tool can analyze the page structure and extract content."
            },
            {
              question: "Is there a limit on how many ranges I can extract?",
              answer: "There's no limit to the combination of ranges you can use. However, the final created PDF must remain within the memory limits of your web browser."
            }
          ]}
        />

        <div className="mt-20 prose prose-invert max-w-none border border-white/5 bg-white/[0.02] p-12 rounded-[3rem]">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">The Ultimate Secure PDF Splitter and Page Extractor</h2>
          <div className="grid md:grid-cols-2 gap-10 text-slate-400 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p>
                When it comes to handling sensitive intellectual property or personal data, a <span className="text-white font-bold">secure PDF splitter</span> is a non-negotiable tool. CosmoXHub's <span className="text-pink-500 font-bold underline">free online utility tool</span> is built on a "Zero-Server" architecture. This means when you <span className="text-white font-bold">extract PDF pages</span>, the entire operation happens locally on your computer. Your files are never uploaded, stored, or reviewed by anyone—not even us.
              </p>
              <p>
                Our platform is recognized as one of the <span className="text-white font-bold">fastest PDF extraction tools</span> available. By bypassing the traditional upload/download cycle required by other sites, we provide instant results, making it the ideal choice for professionals who value both time and <span className="text-white font-bold">local processing</span> security.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Whether you're separating a single chapter from an ebook, removing irrelevant pages from a report, or splitting a multi-page contract into individual sections, our precision range-based extraction handles it all with byte-level accuracy. The output maintains the exact quality and resolution of the original document.
              </p>
              <p>
                At CosmoXHub, we believe that elite tools should be accessible to everyone. Experience a <span className="text-white font-bold">private, secure, and ultra-fast</span> PDF management experience without the need for registration or expensive software subscriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
