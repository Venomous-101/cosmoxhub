"use client";

import { useState } from "react";
import { 
  FilePlus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  Combine,
  Download,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import ToolGuide from "@/components/ToolGuide";

interface PDFFile {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function MergePdfClient() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
      .filter(f => f.type === "application/pdf")
      .map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        size: f.size,
        file: f
      }));
    
    setFiles(prev => [...prev, ...selectedFiles]);
    setError(null);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const fileObj of files) {
        const arrayBuffer = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && typeof (window as any).call_locker === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        try { (window as any).call_locker(); } catch(e) {}
      }
      const link = document.createElement("a");
      link.href = url;
      link.download = `CosmoxHub-merged-${Date.now()}.pdf`;
      link.click();
      
      setIsMerging(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError("Failed to merge PDFs. Ensure files are not password protected. " + message);
      setIsMerging(false);
    }
  };

  return (
    <ToolLayout
      title="Elite PDF Merger"
      description="Combine multiple PDF documents into a single high-fidelity file. Precision reordering with 100% client-side security."
      icon={Combine}
      color="#f43f5e"
    >
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-[3.5rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative min-h-[500px]">
                <label className="w-full flex flex-col items-center justify-center py-16 px-8 border-2 border-dashed border-rose-500/10 hover:border-rose-500/30 bg-rose-500/[0.02] rounded-[2.5rem] cursor-pointer transition-all group mb-8">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6 border border-rose-500/20 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-500">
                        <FilePlus className="text-rose-500 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Add PDF Files</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose max-w-xs text-center">
                        Select multiple documents. They will be merged entirely on this device.
                    </p>
                    <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </label>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {files.map((file, idx) => (
                            <motion.div
                                key={file.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
                                        <FileText size={18} className="text-rose-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-white uppercase tracking-widest truncate max-w-[200px]">{file.name}</div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        disabled={idx === 0}
                                        onClick={() => moveFile(idx, 'up')}
                                        aria-label="Move file up"
                                        title="Move up"
                                        className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-0 transition-all"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button 
                                        disabled={idx === files.length - 1}
                                        onClick={() => moveFile(idx, 'down')}
                                        aria-label="Move file down"
                                        title="Move down"
                                        className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-0 transition-all"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                    <div className="w-px h-6 bg-white/5 mx-2" />
                                    <button 
                                        onClick={() => removeFile(file.id)}
                                        aria-label="Remove file"
                                        title="Remove file"
                                        className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {files.length === 0 && (
                     <div className="h-[200px] flex flex-col items-center justify-center text-center opacity-20">
                        <Combine size={48} className="text-slate-500 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">No Files Selected</p>
                    </div>
                )}
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">Merge Settings</h3>
              <span className="text-rose-500 font-black text-[10px] uppercase tracking-widest">{files.length} FILES</span>
            </div>

            <div className="space-y-6">
                <div className="pt-4 space-y-3">
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-rose-500 mb-4">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold uppercase leading-tight tracking-wider">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={mergePDFs}
                        disabled={files.length < 2 || isMerging}
                        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-white/5 disabled:text-slate-600 text-black font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isMerging ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" /> MERGING...
                            </>
                        ) : (
                            <>
                                <Download size={16} /> MERGE NOW
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={() => setFiles([])}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Trash2 size={16} className="text-slate-500" /> Clear All Files
                    </button>
                </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-20 border-t border-white/5 pt-20">
        <ToolGuide
          toolName="Merge PDF"
          sections={[
            {
              title: "Upload Your PDFs",
              content: "Click the upload area to select multiple PDF files or drag and drop them from your folder. Our tool handles high-fidelity documents entirely on your device."
            },
            {
              title: "Reorder Documents",
              content: "Use the precision arrows to arrange your files in the exact sequence you want them merged. This ensures a perfect unified result."
            },
            {
              title: "Initiate Merging",
              content: "Click the 'MERGE NOW' button. Our byte-level engine will combine your documents instantly with zero upload risk."
            },
            {
              title: "Download Result",
              content: "Once processed, your new unified PDF document will download automatically to your device in seconds."
            }
          ]}
          faqs={[
            {
              question: "Is merging PDFs on CosmoxHub secure?",
              answer: "Yes, it is the most secure method available. Unlike other tools, we process your files entirely in your browser. Your sensitive documents never leave your computer or touch a server."
            },
            {
              question: "Will my PDF quality be affected?",
              answer: "Not at all. Our tool uses professional-grade byte manipulation to merge pages, ensuring text, images, and formatting remain exactly as they were in the original files."
            },
            {
              question: "Is there a limit to how many files I can merge?",
              answer: "There is no hard limit on the number of files. However, extremely large files or a very high number of documents may be limited by your device's available memory."
            }
          ]}
        />

        <div className="mt-20 prose prose-invert max-w-none border border-white/5 bg-white/[0.02] p-12 rounded-[3rem]">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">The Fastest and Most Secure PDF Merger Tool</h2>
          <div className="grid md:grid-cols-2 gap-10 text-slate-400 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p>
                In the modern digital workspace, the ability to <span className="text-white font-bold">merge PDF files</span> quickly and securely is essential. CosmoxHub provides a professional-grade, <span className="text-rose-500 font-bold underline">free online utility tool</span> designed to handle your most sensitive documents with absolute privacy. By leveraging advanced browser-side technology, we ensure that your files never touch a cloud server, making this the <span className="text-white font-bold">fastest and safest way</span> to combine documents.
              </p>
              <p>
                Whether you are combining legal contracts, academic reports, or personal records, our <span className="text-white font-bold">local processing</span> architecture guarantees that your data stays on your device. This eliminates the risk of data breaches associated with traditional online PDF mergers that upload your private information to external servers.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Our interface is built for precision. You have full control over the sequence of your merged document, allowing you to reorder pages with a single click. The result is a high-fidelity unified PDF that maintains the original resolution and metadata of your source files.
              </p>
              <p>
                Experience the difference between standard tools and elite performance. CosmoxHub&apos;s PDF Suite is optimized for speed, security, and simplicity. No registration, no hidden fees, and no watermarks—just pure, high-performance utility at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
