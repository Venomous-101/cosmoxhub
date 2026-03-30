"use client";

import { useState } from "react";
import { FileImage, Upload, Download, Settings, Maximize, Camera } from "lucide-react";
import Image from "next/image";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import ToolGuide from "@/components/ToolGuide";

type ImageFormat = "image/jpeg" | "image/png";
type Resolution = 1 | 2 | 3;

export default function PdfToImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [images, setImages] = useState<{url: string, page: number}[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [format, setFormat] = useState<ImageFormat>("image/jpeg");
  const [resolution, setResolution] = useState<Resolution>(2);

  const convert = async (f: File) => {
    setFile(f); 
    setImages([]); 
    setConverting(true);
    try {
      // Use the legacy build to avoid private field issues
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const bytes = await f.arrayBuffer();
      const uint8 = new Uint8Array(bytes);
      const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
      const count = pdf.numPages;
      const results: {url: string, page: number}[] = [];

      for (let i = 1; i <= count; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: resolution }); 
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // Specifying the render parameters explicitly to avoid 'any'
          const renderTask = (page as unknown as { render: (params: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> } }).render({ canvasContext: context, viewport });
          await renderTask.promise;
          results.push({
            url: canvas.toDataURL(format, format === "image/jpeg" ? 0.9 : undefined),
            page: i
          });
        }
      }
      setImages(results);
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Could not process PDF. Please try a different document.";
      alert(`Elite Engine Error: ${msg}`); 
    }
    setConverting(false);
  };

  const downloadImage = (url: string, i: number) => {
    const ext = format === "image/jpeg" ? "jpg" : "png";
    const a = document.createElement("a"); 
    a.href = url; 
    a.download = `cosmoxhub-page-${i}.${ext}`; 
    a.click();
  };

  const downloadAll = () => {
    images.forEach((img) => downloadImage(img.url, img.page));
  };

  return (
    <ToolLayout 
      title="PDF to Image Elite" 
      description="Extract high-resolution images from your PDF pages. Perfect for social media, presentations, and archival quality." 
      icon={FileImage} 
      color="#ef4444"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar: Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#050510]/60 border border-white/5 rounded-3xl backdrop-blur-xl">
            <h4 className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
              <Settings size={14} className="text-red-400" /> Export Settings
            </h4>

            <div className="space-y-6">
              {/* Image Format */}
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                   {(["image/jpeg", "image/png"] as ImageFormat[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase transition-all border ${format === f ? "bg-red-500/10 border-red-500 text-red-400" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"}`}
                        title={`Select ${f === "image/jpeg" ? "JPG" : "PNG"} format`}
                      >
                         {f === "image/jpeg" ? "JPG" : "PNG"}
                      </button>
                   ))}
                </div>
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  Resolution (Scale)
                </label>
                <div className="grid grid-cols-3 gap-2">
                   {([1, 2, 3] as Resolution[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setResolution(r)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase transition-all border ${resolution === r ? "bg-red-500/10 border-red-500 text-red-400" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"}`}
                        title={`Set resolution to ${r}x scale`}
                      >
                         {r}x {r === 1 ? "(Low)" : r === 2 ? "(Mid)" : "(HD)"}
                      </button>
                   ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest text-xs" 
                  onClick={downloadAll} 
                  disabled={images.length === 0}
                  title="Download all extracted pages"
                >
                  <Download size={16} /> Download All
                </button>
                <button 
                  className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]" 
                  onClick={() => { setFile(null); setImages([]); }}
                  title="Clear all extracted images"
                >
                  Clear Files
                </button>
              </div>
            </div>
          </div>


        </div>

        {/* Main Area: Upload & Results */}
        <div className="lg:col-span-8 space-y-6">
          <div 
            className={`upload-zone p-20 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-[3rem] transition-all duration-500 ${dragOver ? "border-red-500 bg-red-500/10 scale-[1.01]" : "border-white/5 bg-[#050510]/40 hover:border-white/10"}`}
            onClick={() => document.getElementById("pdf2img-input")?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) convert(e.dataTransfer.files[0]); }}
          >
            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-500 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} />
            </div>
            <p className="text-slate-300 font-bold text-xl mb-2">
               {file ? file.name : "Select PDF Document"}
            </p>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
               Drop a PDF to convert every page into high-quality images. Zero server uploads, maximum privacy.
            </p>
            
            <input 
              id="pdf2img-input" 
              type="file" 
              accept="application/pdf" 
              className="hidden"
              title="Upload PDF file"
              onChange={(e) => e.target.files?.[0] && convert(e.target.files[0])} 
            />
          </div>

          <AnimatePresence>
            {converting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Processing Elite Frames...</p>
              </motion.div>
            )}

            {images.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Maximize size={14} className="text-red-400" /> Extracted Pages ({images.length})
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="group relative p-3 bg-[#050510] border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all"
                    >
                      <div className="aspect-[3/4] rounded-xl bg-white/5 mb-3 overflow-hidden relative">
                         <Image 
                           src={img.url} 
                           alt={`Extracted PDF Page ${img.page}`} 
                           width={300}
                           height={400}
                           unoptimized
                           className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                         />
                         <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">Page {img.page}</div>
                      </div>
                      <button 
                        onClick={() => downloadImage(img.url, img.page)}
                        className="w-full py-2 bg-white/5 hover:bg-red-500 hover:text-white transition-all rounded-lg text-slate-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"
                        title={`Download page ${img.page} as image`}
                      >
                         <Download size={12} /> Save
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-20 border-t border-white/5 pt-20">
        <ToolGuide
          toolName="PDF to Image"
          sections={[
            {
              title: "Upload Your PDF File",
              content: "Select the PDF document you want to convert. Our tool quickly identifies the page count and structure using secure, local analysis."
            },
            {
              title: "Define Output Quality",
              content: "Choose your preferred image format (JPG, PNG) and resolution (up to 3x HD). Higher scales ensure pixel-perfect clarity for presentations."
            },
            {
              title: "Extract PDF Pages",
              content: "Click the conversion trigger. Our elite engine renders every PDF page into a high-fidelity image with vector-level precision."
            },
            {
              title: "Save Your Images",
              content: "Download individual pages or save your entire collection. Everything happens on your device, ensuring total privacy."
            }
          ]}
          faqs={[
            {
              question: "How high is the quality of extracted images?",
              answer: "We offer up to 3x scale rendering, which provides crystal-clear HD output suitable for professional printing and high-res digital displays."
            },
            {
              question: "Can I convert multiple pages at once?",
              answer: "Yes, our converter automatically processes every page in your PDF document. You can then download them individually as needed."
            },
            {
              question: "Is the conversion process private?",
              answer: "Absolutely. We use browser-side PDFJS technology. Your documents never leave your local machine, making this the most private way to extract images."
            }
          ]}
        />

        <div className="mt-20 prose prose-invert max-w-none border border-white/5 bg-white/[0.02] p-12 rounded-[3rem]">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">The Elite PDF to Image Extraction Engine</h2>
          <div className="grid md:grid-cols-2 gap-10 text-slate-400 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p>
                Transforming complex documents into visual assets requires a <span className="text-white font-bold">secure PDF to image converter</span> that preserves every detail. CosmoXHub provides a <span className="text-red-500 font-bold underline">free online utility tool</span> designed for maximum quality and total user privacy. With our <span className="text-white font-bold">PDF to JPG</span> and <span className="text-white font-bold">PDF to PNG</span> extraction, your original layout is rendered with vector-precision.
              </p>
              <p>
                Our platform stands out as the <span className="text-white font-bold">fastest PDF extractor</span> because it eliminates the need for slow server-side processing. By handling all rendering <span className="text-white font-bold">locally in your browser</span>, we provide a seamless experience that is perfect for professionals who value both time and their sensitive data.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Whether you're prepping a social media carousel, extracting graphics for a presentation, or archiving high-res page snapshots, our granular resolution controls give you the power to choose between low, mid, and HD scales. This flexibility ensures your images are perfectly sized for any destination.
              </p>
              <p>
                Choose CosmoXHub for a <span className="text-white font-bold">private, secure, and professional</span> document conversion experience. Join elite users worldwide who trust our "Zero-Server" architecture for their high-fidelity image extraction needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
