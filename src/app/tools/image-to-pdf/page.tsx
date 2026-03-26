"use client";
import { useState } from "react";
import { ImagePlus, Upload, Download } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";

export default function ImageToPDFPage() {
  const [images, setImages] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    setImages(prev => [...prev, ...imgs]);
    setDone(false);
  };

  const convert = async () => {
    if (images.length === 0) return;
    setConverting(true);
    try {
      const pdf = await PDFDocument.create();
      for (const file of images) {
        const bytes = await file.arrayBuffer();
        let img;
        if (file.type === "image/png") img = await pdf.embedPng(bytes);
        else img = await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "images.pdf"; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch { alert("Could not convert image. Please try JPG or PNG format."); }
    setConverting(false);
  };

  return (
    <ToolLayout title="Image to PDF" description="Convert JPG, PNG images to a PDF document instantly. Add multiple images to create a multi-page PDF." icon={ImagePlus} color="#ef4444">
      <div 
        className={`upload-zone p-12 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-xl transition-all duration-200 m-6 ${dragOver ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]" : "border-indigo-500/20 bg-[#050510]/50 hover:border-indigo-500/40 hover:bg-[#050510]"}`}
        onClick={() => document.getElementById("img-input")?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
      >
        <Upload size={36} className="text-indigo-500 mb-4" />
        <p className="text-slate-300 font-medium mb-1">Drop images here or <span className="text-indigo-400">click to browse</span></p>
        <p className="text-slate-500 text-sm">JPG, PNG supported</p>
        <input 
          id="img-input" 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden"
          title="Upload images to convert to PDF"
          onChange={(e) => addImages(e.target.files)} 
        />
      </div>

      {images.length > 0 && (
        <div className="px-6 pb-6 mt-4">
          <p className="text-slate-400 text-sm font-medium mb-4">{images.length} image(s) selected</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {images.map((img, i) => (
              <div key={i} className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                {img.name}
              </div>
            ))}
          </div>
          <button 
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-gradient-to-br from-red-500 to-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.25)]" 
            onClick={convert} 
            disabled={converting}
          >
            <Download size={18} /> {converting ? "Converting..." : "Convert to PDF"}
          </button>
          {done && <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2 w-fit">✅ PDF downloaded successfully!</div>}
        </div>
      )}
    </ToolLayout>
  );
}
