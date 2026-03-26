"use client";
import { useState } from "react";
import { Scissors, Upload, Download } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState("");
  const [splitting, setSplitting] = useState(false);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const loadPDF = async (f: File) => {
    setFile(f); setDone(false);
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const splitPDF = async () => {
    if (!file) return;
    setSplitting(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const total = doc.getPageCount();
      const indices = pages.split(",").flatMap(p => {
        const [a, b] = p.split("-").map(x => parseInt(x.trim()) - 1);
        if (b !== undefined && !isNaN(b)) return Array.from({ length: b - a + 1 }, (_, i) => a + i);
        return [a];
      }).filter(i => i >= 0 && i < total);

      if (indices.length === 0) { alert("Invalid page numbers."); setSplitting(false); return; }
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(doc, indices);
      copied.forEach(p => newDoc.addPage(p));
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "split.pdf"; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch { alert("Error splitting PDF. Please check page numbers."); }
    setSplitting(false);
  };

  return (
    <ToolLayout title="Split PDF" description="Extract specific pages from your PDF. Enter page numbers like 1,3,5-8 to create a new document." icon={Scissors} color="#ef4444">
      <div 
        className={`upload-zone p-12 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-xl transition-all duration-200 m-6 ${dragOver ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]" : "border-indigo-500/20 bg-[#050510]/50 hover:border-indigo-500/40 hover:bg-[#050510]"}`}
        onClick={() => document.getElementById("split-input")?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) loadPDF(e.dataTransfer.files[0]); }}
      >
        <Upload size={36} className="text-indigo-500 mb-4" />
        <p className="text-slate-300 font-medium mb-1">{file ? file.name : "Click to select a PDF file"}</p>
        {pageCount > 0 && <p className="text-indigo-400 text-sm mt-1">Total pages: {pageCount}</p>}
        <input 
          id="split-input" 
          type="file" 
          accept="application/pdf" 
          className="hidden"
          title="Upload a PDF file to split"
          onChange={(e) => e.target.files?.[0] && loadPDF(e.target.files[0])} 
        />
      </div>

      {file && (
        <div className="px-6 pb-6 mt-4 flex flex-col gap-6">
          <div>
            <label htmlFor="page-numbers" className="block text-slate-400 text-sm font-medium mb-2">
              Page numbers to extract (e.g., 1,3,5-8):
            </label>
            <input 
              id="page-numbers"
              className="w-full bg-[#050510] border border-indigo-500/20 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors" 
              placeholder="1,2,5-8" 
              title="Page numbers to extract"
              value={pages}
              onChange={(e) => setPages(e.target.value)} 
            />
          </div>
          <button 
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all w-fit bg-gradient-to-br from-red-500 to-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.25)]" 
            onClick={splitPDF} 
            disabled={!pages || splitting}
          >
            <Download size={18} /> {splitting ? "Splitting..." : "Split & Download"}
          </button>
          {done && <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2 w-fit">✅ Split PDF downloaded successfully!</div>}
        </div>
      )}
    </ToolLayout>
  );
}
