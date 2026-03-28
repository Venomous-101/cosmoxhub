"use client";

import { useState, useRef } from "react";
import { 
  FileText, 
  Upload, 
  X, 
  Settings, 
  GripVertical,
  Layers,
  FilePenLine,
  Columns,
  Minus
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { PDFDocument } from "pdf-lib";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

type PageSize = "auto" | "a4" | "letter";
type MarginSize = "none" | "small" | "big";
type Orientation = "portrait" | "landscape";

export default function ImageToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("auto");
  const [margin, setMargin] = useState<MarginSize>("none");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newImg: ImageFile = {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      };
      setImages((prev) => [...prev, newImg]);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imgFile of images) {
        const imageBytes = await imgFile.file.arrayBuffer();
        let image;
        if (imgFile.file.type === "image/jpeg" || imgFile.file.type === "image/jpg") {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          image = await pdfDoc.embedPng(imageBytes);
        }

        const dims = image.scale(1);
        
        // Handle Page Size & Margin
        let pageWidth = dims.width;
        let pageHeight = dims.height;
        let imageWidth = dims.width;
        let imageHeight = dims.height;

        if (pageSize === "a4") {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSize === "letter") {
          pageWidth = 612;
          pageHeight = 792;
        }

        if (orientation === "landscape") {
            const temp = pageWidth;
            pageWidth = pageHeight;
            pageHeight = temp;
        }

        const marginVal = margin === "none" ? 0 : margin === "small" ? 20 : 50;
        
        const availableWidth = pageWidth - (marginVal * 2);
        const availableHeight = pageHeight - (marginVal * 2);

        const scale = Math.min(availableWidth / dims.width, availableHeight / dims.height);
        imageWidth = dims.width * scale;
        imageHeight = dims.height * scale;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(image, {
          x: (pageWidth - imageWidth) / 2,
          y: (pageHeight - imageHeight) / 2,
          width: imageWidth,
          height: imageHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cosmoxhub-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Image to PDF",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Drag-and-drop page reordering",
      "Multiple page sizes (Auto, A4, Letter)",
      "Margin and Orientation controls",
      "100% Client-side privacy",
      "Fast browser-native generation"
    ]
  };

  return (
    <ToolLayout
      title="Elite Image to PDF"
      description="Convert images to professional PDF documents. Arrange pages, set margins, and export in seconds without uploading data."
      icon={FileText}
      color="#0ea5e9"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Workspace */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {images.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group h-[400px]"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-sky-500/20 rounded-[3rem] bg-sky-500/5 transition-all group-hover:bg-sky-500/10 group-hover:border-sky-500/40 cursor-pointer overflow-hidden shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-sky-500/10 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-sky-500/20 group-hover:ring-sky-500/50 group-hover:bg-sky-500/20 transition-all">
                      <FileText className="w-10 h-10 text-sky-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Convert Images to PDF</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm">
                    Upload images to build your PDF. You can drag and drop them to reorder pages after uploading.
                  </p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-sky-500 hover:text-white transition-all shadow-lg">
                    Build Elite PDF
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  className="hidden"
                  aria-label="Upload images for PDF"
                  onChange={handleUpload}
                />
              </motion.div>
            ) : (
              <Reorder.Group 
                axis="y" 
                values={images} 
                onReorder={setImages}
                className="space-y-3"
              >
                <AnimatePresence>
                  {images.map((img) => (
                    <Reorder.Item
                      key={img.id}
                      value={img}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 flex gap-4 items-center hover:border-sky-500/30 transition-all cursor-grab active:cursor-grabbing shadow-xl"
                    >
                      <div className="p-2 text-slate-600 group-hover:text-sky-500 transition-colors">
                        <GripVertical size={20} />
                      </div>

                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img.preview} 
                          alt={img.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-200 text-sm font-bold truncate mb-1">{img.name}</h4>
                        <div className="text-[10px] text-slate-500 font-medium font-mono uppercase tracking-widest">
                            {(img.size / (1024*1024)).toFixed(2)} MB • PRIORITY: {images.indexOf(img) + 1}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                        aria-label="Remove image"
                        title="Remove image"
                        className="p-3 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white mr-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
                
                <motion.button
                  layout
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-sky-500/10 rounded-[2rem] bg-sky-500/5 hover:border-sky-500/30 transition-all group mt-6"
                >
                  <Upload className="w-6 h-6 text-sky-500/40 group-hover:text-sky-500 mb-2" />
                  <span className="text-[10px] font-black text-sky-500/60 uppercase tracking-widest">Append More Images</span>
                </motion.button>
              </Reorder.Group>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-600 to-sky-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-sky-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-sky-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">PDF Engine</h3>
            </div>

            <div className="space-y-8">
                {/* Page Size */}
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Columns size={12} className="text-sky-500" /> Page Size
                </label>
                <div className="grid grid-cols-1 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                  {(["auto", "a4", "letter"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPageSize(s)}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pageSize === s ? "bg-sky-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {s === "a4" ? "A4 (Standard)" : s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <FilePenLine size={12} className="text-sky-500" /> Orientation
                </label>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["portrait", "landscape"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOrientation(o)}
                      className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${orientation === o ? "bg-sky-500 text-white" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {o.slice(0, 4)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Borders */}
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Minus size={12} className="text-sky-500" /> Page Margins
                </label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["none", "small", "big"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMargin(m)}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${margin === m ? "bg-sky-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-4">
                <button
                  disabled={images.length === 0 || isGenerating}
                  onClick={generatePDF}
                  className="w-full btn-primary h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_4px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_4px_40px_rgba(14,165,233,0.5)] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:-translate-y-1 shadow-xl"
                >
                  {isGenerating ? "Assembling PDF..." : "Generate Elite PDF"}
                </button>

                <button
                    disabled={images.length === 0}
                    onClick={() => setImages([])}
                    className="w-full py-2 text-rose-500/60 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-400 disabled:opacity-0 transition-opacity"
                >
                    Discard Changes
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Layers size={16} className="text-sky-500" /> Pro Feature
            </h4>
            <div className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">
                Drag each image card to rearrange the final page order. Everything is processed locally.
            </div>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
