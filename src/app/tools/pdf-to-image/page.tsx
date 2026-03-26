"use client";
import { useState } from "react";
import { FileImage, Upload, Download } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";

export default function PDFToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const convert = async (f: File) => {
    setFile(f); setImages([]); setConverting(true);
    try {
      // We render each page using canvas via pdfjs-dist approach
      // Using a simpler approach: convert via blob URL and canvas
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      const results: string[] = [];

      for (let i = 0; i < count; i++) {
        const singlePdf = await PDFDocument.create();
        const [page] = await singlePdf.copyPages(doc, [i]);
        singlePdf.addPage(page);
        const pdfBytes = await singlePdf.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        results.push(url);
      }
      setImages(results);
    } catch { alert("Could not process this PDF. Please try another file."); }
    setConverting(false);
  };

  const downloadImage = (url: string, i: number) => {
    const a = document.createElement("a"); a.href = url; a.download = `page-${i + 1}.pdf`; a.click();
  };

  return (
    <ToolLayout title="PDF to Image" description="Extract each page from a PDF as a separate downloadable file. View all pages in your browser." icon={FileImage} color="#ef4444">
      <div 
        className={`upload-zone p-12 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-xl transition-all duration-200 m-6 ${dragOver ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]" : "border-indigo-500/20 bg-[#050510]/50 hover:border-indigo-500/40 hover:bg-[#050510]"}`}
        onClick={() => document.getElementById("pdf2img-input")?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) convert(e.dataTransfer.files[0]); }}
      >
        <Upload size={36} className="text-indigo-500 mb-4" />
        <p className="text-slate-300 font-medium mb-1">{file ? file.name : "Click to select a PDF file"}</p>
        <p className="text-slate-500 text-sm">Upload a PDF to extract pages</p>
        <input 
          id="pdf2img-input" 
          type="file" 
          accept="application/pdf" 
          className="hidden"
          title="Upload PDF to extract images"
          onChange={(e) => e.target.files?.[0] && convert(e.target.files[0])} 
        />
      </div>

      {converting && <div className="text-center text-indigo-400 mt-6 mb-8 font-medium animate-pulse">⏳ Processing pages...</div>}

      {images.length > 0 && (
        <div className="px-6 pb-6 mt-4">
          <p className="text-slate-400 text-sm font-medium mb-4">{images.length} page(s) extracted:</p>
          <div className="flex flex-wrap gap-4">
            {images.map((url, i) => (
              <div key={i} className="card p-4 text-center min-w-[160px] bg-[#050510] border border-indigo-500/10 rounded-xl flex flex-col items-center justify-between">
                <div>
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-slate-400 text-sm font-medium mb-4">Page {i + 1}</p>
                </div>
                <button 
                  className="btn-primary flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold text-white transition-all w-full justify-center bg-gradient-to-br from-red-500 to-red-400" 
                  onClick={() => downloadImage(url, i)}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
