"use client";
import { useState, useCallback } from "react";
import { FileStack, Upload, Trash2, Download, ArrowUp, ArrowDown, Database, Cloud } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfs = Array.from(newFiles).filter(f => f.type === "application/pdf");
    setFiles(prev => [...prev, ...pdfs]);
    setDone(false);
  }, []);

  const simulateCloudPicker = () => {
    alert("CosmoxHub Cloud Picker Initialized!\n\nThis feature is in Elite Beta. In production, this will open the secure Google Drive / Dropbox file selector.");
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));
  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles(prev => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  };
  const moveDown = (i: number) => {
    if (i === files.length - 1) return;
    setFiles(prev => { const a = [...prev]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "merged-cosmoxhub.pdf"; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (error) {
      console.error(error);
      alert("Error merging PDFs. Please ensure all files are valid PDFs.");
    }
    setMerging(false);
  };

  return (
    <ToolLayout
      title="Merge PDF Elite"
      description="Combine multiple PDF files into one high-quality document. Now with Cloud Support (Beta). 100% Client-side — your files never leave your device."
      icon={FileStack}
      color="#ef4444"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button 
            onClick={() => document.getElementById("pdf-input")?.click()}
            className="flex-1 p-6 bg-[#050510]/60 border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all group flex flex-col items-center justify-center text-center"
          >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
              </div>
              <span className="text-slate-200 font-bold uppercase tracking-widest text-xs">Browse Local Files</span>
          </button>

          <button 
            onClick={simulateCloudPicker}
            className="flex-1 p-6 bg-[#050510]/60 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group flex flex-col items-center justify-center text-center"
          >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Database size={24} />
              </div>
              <span className="text-slate-200 font-bold uppercase tracking-widest text-xs">Import from Cloud</span>
          </button>
      </div>

      <input 
        id="pdf-input" 
        type="file" 
        accept="application/pdf" 
        multiple 
        className="hidden"
        title="Upload PDF files to merge"
        onChange={(e) => addFiles(e.target.files)} 
      />

      {/* Drop Zone */}
      <div
        className={`upload-zone p-20 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-[2.5rem] transition-all duration-500 ${dragOver ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]" : "border-white/5 bg-[#050510]/40 hover:border-white/10"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
      >
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-500 mb-6 font-space text-4xl">
            {files.length || "+"}
        </div>
        <p className="text-slate-300 font-bold text-xl mb-2">Drag & Drop PDFs</p>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">Combine any number of documents instantly. Files are never uploaded to our servers.</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Cloud size={14} className="text-blue-400" /> Documents in Queue ({files.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, i) => (
              <div key={i} className="p-4 bg-[#050510] border border-white/5 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-red-400 text-xl">
                  📄
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-slate-200 text-sm font-bold truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{(file.size / 1024).toFixed(0)} KB</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveUp(i)} className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowUp size={16} /></button>
                  <button onClick={() => moveDown(i)} className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowDown size={16} /></button>
                  <button onClick={() => removeFile(i)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-8 border-t border-white/5">
            <button 
              className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
              onClick={mergePDFs} 
              disabled={files.length < 2 || merging}
            >
              <Download size={18} />
              {merging ? "Merging Elite Documents..." : "Merge & Download PDF"}
            </button>
            <button 
              className="px-8 py-4 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-2xl hover:bg-white/10 transition-all" 
              onClick={() => { setFiles([]); setDone(false); }}
            >
              Clear
            </button>
          </div>

          {done && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
              ✅ Elite PDF Merge Successful!
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
