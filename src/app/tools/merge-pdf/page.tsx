"use client";
import { useState, useCallback } from "react";
import { FileStack, Upload, Trash2, Download, ArrowUp, ArrowDown } from "lucide-react";
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
      const a = document.createElement("a"); a.href = url; a.download = "merged.pdf"; a.click();
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
      title="Merge PDF"
      description="Combine multiple PDF files into one. Drag to reorder pages. 100% client-side — your files never leave your device."
      icon={FileStack}
      color="#ef4444"
    >
      {/* Drop Zone */}
      <div
        className={`upload-zone p-12 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-xl transition-all duration-200 m-6 ${dragOver ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]" : "border-indigo-500/20 bg-[#050510]/50 hover:border-indigo-500/40 hover:bg-[#050510]"}`}
        onClick={() => document.getElementById("pdf-input")?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
      >
        <Upload size={36} className="text-indigo-500 mb-4" />
        <p className="text-slate-300 font-medium mb-1">
          Drop PDF files here or <span className="text-indigo-400">click to browse</span>
        </p>
        <p className="text-slate-500 text-sm">You can add multiple PDFs at once</p>
        <input 
          id="pdf-input" 
          type="file" 
          accept="application/pdf" 
          multiple 
          className="hidden"
          title="Upload PDF files to merge"
          onChange={(e) => addFiles(e.target.files)} 
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="px-6 pb-6 mt-4">
          <p className="text-slate-400 text-sm font-medium mb-4">
            {files.length} file(s) — drag to reorder:
          </p>
          <div className="flex flex-col gap-2">
            {files.map((file, i) => (
              <div key={i} className="card p-3 px-4 flex items-center gap-3 bg-[#050510] border border-indigo-500/10 rounded-lg group">
                <span className="text-xl">📄</span>
                <span className="text-slate-200 text-sm flex-1 truncate font-medium">
                  {file.name}
                </span>
                <span className="text-slate-500 text-xs px-2">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveUp(i)} title="Move up" aria-label="Move file up" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"><ArrowUp size={16} /></button>
                  <button onClick={() => moveDown(i)} title="Move down" aria-label="Move file down" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"><ArrowDown size={16} /></button>
                  <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
                  <button onClick={() => removeFile(i)} title="Remove file" aria-label="Remove file" className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8 flex-wrap">
            <button 
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-gradient-to-br from-red-500 to-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.25)]"
              onClick={mergePDFs} 
              disabled={files.length < 2 || merging}
            >
              <Download size={18} />
              {merging ? "Merging..." : "Merge & Download PDF"}
            </button>
            <button 
              className="btn-secondary px-6 py-3 rounded-lg font-medium text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all" 
              onClick={() => { setFiles([]); setDone(false); }}
            >
              Clear All
            </button>
          </div>

          {done && (
            <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
              ✅ Merged PDF downloaded successfully!
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
