"use client";

import { useState, useRef } from "react";
import { 
  AlertCircle,
  FileText, 
  Upload, 
  X
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
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

export default function ImageToPdfClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imgFile of images) {
        try {
          const imageBytes = await imgFile.file.arrayBuffer();
          let image;
          
          const type = imgFile.file.type;
          if (type === "image/jpeg" || type === "image/jpg") {
            image = await pdfDoc.embedJpg(imageBytes);
          } else if (type === "image/png") {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            throw new Error(`Unsupported format: ${type}. Please use JPG or PNG.`);
          }

          const dims = image.scale(1);
          let pageWidth = dims.width;
          let pageHeight = dims.height;

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
          const imageWidth = dims.width * scale;
          const imageHeight = dims.height * scale;

          const page = pdfDoc.addPage([pageWidth, pageHeight]);
          page.drawImage(image, {
            x: (pageWidth - imageWidth) / 2,
            y: (pageHeight - imageHeight) / 2,
            width: imageWidth,
            height: imageHeight,
          });
        } catch (err) {
          console.error("Single image failure:", err);
          throw new Error(`Failed to process ${imgFile.name}. Check if it's a valid JPG/PNG.`);
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cosmoxhub-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "PDF generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout
      title="Elite Image to PDF"
      description="Convert images to professional PDF documents. Arrange pages, set margins, and export in seconds without uploading data."
      icon={FileText}
      color="#0ea5e9"
    >
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
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
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Add Images</h3>
                  <p className="text-slate-400 text-center max-w-xs px-4 text-sm">
                    Upload images to build your PDF. You can drag and drop them to reorder pages after uploading.
                  </p>
                  <span className="mt-6 px-5 py-2 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 hover:bg-sky-500 hover:text-white transition-all shadow-lg">
                    Build PDF
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
                {error && (
                   <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-rose-500 mb-4">
                     <AlertCircle size={14} className="shrink-0 mt-0.5" />
                     <p className="text-[10px] font-bold uppercase leading-tight tracking-wider">{error}</p>
                   </div>
                 )}
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
                  <span className="text-[10px] font-black text-sky-500/60 uppercase tracking-widest">Add More Images</span>
                </motion.button>
              </Reorder.Group>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">PDF Settings</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    Page Size
                </label>
                <div className="grid grid-cols-1 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                  {(["auto", "a4", "letter"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPageSize(s)}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pageSize === s ? "bg-sky-500 text-black shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {s === "a4" ? "A4 (Standard)" : s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    Orientation
                </label>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["portrait", "landscape"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOrientation(o)}
                      className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${orientation === o ? "bg-sky-500 text-black" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {o.slice(0, 4)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    Page Margins
                </label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["none", "small", "big"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMargin(m)}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${margin === m ? "bg-sky-500 text-black shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                       {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  disabled={images.length === 0 || isGenerating}
                  onClick={generatePDF}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-white/5 disabled:text-slate-600 text-black font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isGenerating ? "SAVING..." : "Save as PDF"}
                </button>

                <button
                    disabled={images.length === 0}
                    onClick={() => setImages([])}
                    className="w-full py-2 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] hover:text-rose-500 disabled:opacity-0 transition-opacity"
                >
                    Clear All
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-20 border-t border-white/5 pt-20">
        <ToolGuide
          toolName="Image to PDF"
          sections={[
            {
              title: "Upload Your Images",
              content: "Select the images (JPG, PNG) you want to include in your document. Use the 'Add More' button to build a multi-page PDF in bulk."
            },
            {
              title: "Arrange Page Order",
              content: "Drag and drop your uploaded images to set the perfect page sequence. The intuitive reordering system makes document structure effortless."
            },
            {
              title: "Configure PDF Settings",
              content: "Choose between A4, Letter, or Auto page sizes. Set margins and orientation to match your professional requirements."
            },
            {
              title: "Generate and Save",
              content: "Click 'Save as PDF' to compile your images. The entire process happens locally, delivering a high-quality PDF to your device instantly."
            }
          ]}
          faqs={[
            {
              question: "Is there a limit to how many images I can convert to PDF?",
              answer: "CosmoXHub is optimized for productivity. You can convert up to 20 images at once into a single, high-quality PDF document."
            },
            {
              question: "Will my images be uploaded to any server?",
              answer: "Never. Our 'Zero-Server' policy means your photos are processed entirely within your browser. Your privacy is 100% guaranteed."
            },
            {
              question: "What image formats are supported?",
              answer: "We currently support high-fidelity JPG and PNG formats, which are the industry standard for professional PDF document generation."
            }
          ]}
        />

        <div className="mt-20 prose prose-invert max-w-none border border-white/5 bg-white/[0.02] p-12 rounded-[3rem]">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">The Professional Image to PDF Converter for Total Privacy</h2>
          <div className="grid md:grid-cols-2 gap-10 text-slate-400 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p>
                In a world where digital privacy is often compromised, CosmoXHub offers a <span className="text-white font-bold">secure image to PDF converter</span> that keeps your data local. Whether you are creating a portfolio, archiving receipts, or preparing a presentation, our <span className="text-sky-500 font-bold underline">free online utility tool</span> ensures that your images stay on your device throughout the entire conversion process.
              </p>
              <p>
                As the <span className="text-white font-bold">fastest bulk image converter</span> available, we bypass traditional server latency by using browser-native processing. This means instant <span className="text-white font-bold">JPG to PDF</span> and <span className="text-white font-bold">PNG to PDF</span> generation, allowing your workflow to remain uninterrupted and elite.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Our platform goes beyond simple conversion by providing granular control over page dimensions and layout. Choose between <span className="text-white font-bold">A4, Letter, or automatic</span> page sizing, and adjust margins to meet strict professional standards. Your final PDF will be high-fidelity and ready for immediate sharing.
              </p>
              <p>
                Experience the difference of a <span className="text-white font-bold">private, secure, and ultra-fast</span> PDF management suite. No registration, no watermarks, and no data leaks—just the elite utility tools you need to succeed in a digital-first world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
