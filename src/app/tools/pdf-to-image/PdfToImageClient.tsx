"use client";

import { useState, useCallback } from "react";
import { FileImage, Upload, Download, Settings, Maximize, FilePlus, Trash2, Layers, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import ToolGuide from "@/components/ToolGuide";

type ImageFormat = "image/jpeg" | "image/png";
type Resolution = 1 | 2 | 3;

interface PdfEntry {
  id: string;
  file: File;
  status: "pending" | "converting" | "done" | "error";
  images: { url: string; page: number }[];
  pageCount: number;
  error?: string;
}

export default function PdfToImageClient() {
  const [pdfEntries, setPdfEntries] = useState<PdfEntry[]>([]);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [format, setFormat] = useState<ImageFormat>("image/png");
  const [resolution, setResolution] = useState<Resolution>(2);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newEntries: PdfEntry[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        newEntries.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
          file: f,
          status: "pending",
          images: [],
          pageCount: 0,
        });
      }
    }
    if (newEntries.length > 0) {
      setPdfEntries((prev) => [...prev, ...newEntries]);
    }
  }, []);

  const removeEntry = (id: string) => {
    setPdfEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const convertAll = async () => {
    const pendingIds = pdfEntries.filter((e) => e.status === "pending").map((e) => e.id);
    if (pendingIds.length === 0) return;

    setConverting(true);

    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    for (const entryId of pendingIds) {
      // Mark as converting
      setPdfEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, status: "converting" as const } : e))
      );

      const entry = pdfEntries.find((e) => e.id === entryId);
      if (!entry) continue;

      try {
        const bytes = await entry.file.arrayBuffer();
        const uint8 = new Uint8Array(bytes);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
        const count = pdf.numPages;
        const results: { url: string; page: number }[] = [];

        for (let i = 1; i <= count; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: resolution });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderTask = (
              page as unknown as {
                render: (params: {
                  canvasContext: CanvasRenderingContext2D;
                  viewport: unknown;
                }) => { promise: Promise<void> };
              }
            ).render({ canvasContext: context, viewport });
            await renderTask.promise;
            results.push({
              url: canvas.toDataURL(format, format === "image/jpeg" ? 0.92 : undefined),
              page: i,
            });
          }
        }

        setPdfEntries((prev) =>
          prev.map((e) =>
            e.id === entryId
              ? { ...e, status: "done" as const, images: results, pageCount: count }
              : e
          )
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to process PDF";
        setPdfEntries((prev) =>
          prev.map((e) =>
            e.id === entryId ? { ...e, status: "error" as const, error: msg } : e
          )
        );
      }
    }

    setConverting(false);
  };

  const allImages = pdfEntries.flatMap((e) =>
    e.images.map((img) => ({ ...img, fileName: e.file.name }))
  );

  const downloadImage = (url: string, page: number, fileName: string) => {
    const ext = format === "image/jpeg" ? "jpg" : "png";
    const baseName = fileName.replace(/\.pdf$/i, "");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}-page-${page}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    allImages.forEach((img) => downloadImage(img.url, img.page, img.fileName));
  };

  const totalPages = pdfEntries.reduce((sum, e) => sum + e.images.length, 0);
  const pendingCount = pdfEntries.filter((e) => e.status === "pending").length;

  return (
    <ToolLayout
      title="PDF to PNG/JPG — Bulk Converter"
      description="Convert single or bulk PDFs to high-quality PNG or JPG images. All pages extracted with vector-precision, 100% private local processing."
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
                  {(["image/png", "image/jpeg"] as ImageFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`py-2.5 px-1 rounded-xl text-[11px] font-black uppercase transition-all border ${
                        format === f
                          ? "bg-red-500/10 border-red-500 text-red-400 shadow-lg shadow-red-500/10"
                          : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                      }`}
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
                  Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as Resolution[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={`py-2.5 px-1 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                        resolution === r
                          ? "bg-red-500/10 border-red-500 text-red-400"
                          : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                      }`}
                      title={`Set resolution to ${r}x scale`}
                    >
                      {r}x {r === 1 ? "Low" : r === 2 ? "HD" : "Ultra"}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Queue */}
              {pdfEntries.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                    Queue ({pdfEntries.length} {pdfEntries.length === 1 ? "file" : "files"})
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pdfEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-white truncate">
                            {entry.file.name}
                          </p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest">
                            {entry.status === "pending" && "Waiting..."}
                            {entry.status === "converting" && "Converting..."}
                            {entry.status === "done" &&
                              `✓ ${entry.pageCount} pages extracted`}
                            {entry.status === "error" && `✗ ${entry.error}`}
                          </p>
                        </div>
                        {entry.status === "converting" && (
                          <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin shrink-0" />
                        )}
                        {entry.status === "done" && (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        )}
                        {entry.status !== "converting" && (
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="p-1 hover:bg-red-500/20 rounded-lg text-slate-600 hover:text-red-400 transition-colors shrink-0"
                            title="Remove file"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 space-y-3 border-t border-white/5">
                {pendingCount > 0 && (
                  <button
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    onClick={convertAll}
                    disabled={converting}
                    title="Convert all pending PDFs"
                  >
                    <Layers size={16} />
                    {converting
                      ? "Converting..."
                      : `Convert ${pendingCount} PDF${pendingCount > 1 ? "s" : ""}`}
                  </button>
                )}
                {totalPages > 0 && (
                  <button
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    onClick={downloadAll}
                    title="Download all extracted images"
                  >
                    <Download size={16} /> Download All ({totalPages} images)
                  </button>
                )}
                {pdfEntries.length > 0 && (
                  <button
                    className="w-full py-3 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                    onClick={() => setPdfEntries([])}
                    title="Clear all files"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Area: Upload & Results */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upload Zone */}
          <div
            className={`upload-zone p-16 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-[3rem] transition-all duration-500 ${
              dragOver
                ? "border-red-500 bg-red-500/10 scale-[1.01]"
                : "border-white/5 bg-[#050510]/40 hover:border-white/10"
            }`}
            onClick={() => document.getElementById("pdf2img-input")?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
            }}
          >
            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-500 mb-6">
              {pdfEntries.length > 0 ? <FilePlus size={32} /> : <Upload size={32} />}
            </div>
            <p className="text-slate-300 font-bold text-xl mb-2">
              {pdfEntries.length > 0 ? "Add More PDFs" : "Select PDF Documents"}
            </p>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              Drop one or multiple PDFs to convert every page into high-quality{" "}
              {format === "image/png" ? "PNG" : "JPG"} images. Supports bulk conversion.
            </p>

            <input
              id="pdf2img-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              multiple
              title="Upload PDF files"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Results */}
          <AnimatePresence>
            {pdfEntries
              .filter((e) => e.status === "converting")
              .map((entry) => (
                <motion.div
                  key={`loading-${entry.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 text-center bg-[#050510]/40 border border-white/5 rounded-3xl"
                >
                  <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                    Converting: {entry.file.name}
                  </p>
                </motion.div>
              ))}

            {allImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Maximize size={14} className="text-red-400" /> Extracted Pages (
                    {totalPages})
                  </h4>
                </div>

                {pdfEntries
                  .filter((e) => e.images.length > 0)
                  .map((entry) => (
                    <div key={entry.id} className="space-y-4">
                      {pdfEntries.filter((e) => e.images.length > 0).length > 1 && (
                        <div className="flex items-center gap-2 px-2 pt-4 border-t border-white/5">
                          <FileImage size={14} className="text-red-400" />
                          <span className="text-[11px] font-black text-white uppercase tracking-widest truncate">
                            {entry.file.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({entry.images.length} pages)
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {entry.images.map((img) => (
                          <motion.div
                            key={`${entry.id}-${img.page}`}
                            whileHover={{ scale: 1.02 }}
                            className="group relative p-3 bg-[#050510] border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all"
                          >
                            <div className="aspect-[3/4] rounded-xl bg-white/5 mb-3 overflow-hidden relative">
                              <Image
                                src={img.url}
                                alt={`${entry.file.name} Page ${img.page}`}
                                width={300}
                                height={400}
                                unoptimized
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                                Page {img.page}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                downloadImage(img.url, img.page, entry.file.name)
                              }
                              className="w-full py-2 bg-white/5 hover:bg-red-500 hover:text-white transition-all rounded-lg text-slate-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"
                              title={`Download page ${img.page}`}
                            >
                              <Download size={12} /> Save
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-20 border-t border-white/5 pt-20">
        <ToolGuide
          toolName="PDF to PNG/JPG Bulk Converter"
          sections={[
            {
              title: "Upload One or Multiple PDFs",
              content:
                "Select single or multiple PDF documents at once. Our tool supports bulk uploads — drop 1 or 50 PDFs simultaneously for batch processing.",
            },
            {
              title: "Define Output Quality",
              content:
                "Choose PNG for lossless clarity or JPG for smaller file sizes. Select resolution from 1x (fast) to 3x Ultra (print-quality HD).",
            },
            {
              title: "Convert All at Once",
              content:
                "Hit the Convert button to process every PDF in your queue. Each file is rendered independently with its own progress tracking.",
            },
            {
              title: "Download Individual or All",
              content:
                "Save pages individually or use 'Download All' to grab every extracted image. Everything happens on your device — zero server uploads.",
            },
          ]}
          faqs={[
            {
              question: "Can I convert multiple PDFs at once?",
              answer:
                "Yes! Our bulk converter lets you add as many PDFs as you need. Select multiple files or drag-and-drop them all at once. Each PDF is processed independently.",
            },
            {
              question: "What is the difference between PNG and JPG output?",
              answer:
                "PNG provides lossless, pixel-perfect quality ideal for text-heavy documents and transparency. JPG is compressed for smaller file sizes, perfect for photos and web use.",
            },
            {
              question: "How high is the quality of extracted images?",
              answer:
                "We offer up to 3x Ultra scale rendering, which provides crystal-clear HD output suitable for professional printing and high-res digital displays.",
            },
            {
              question: "Is the conversion process private?",
              answer:
                "Absolutely. We use browser-side PDF.js technology. Your documents never leave your local machine, making this the most private way to extract images from PDFs.",
            },
          ]}
        />

        <div className="mt-20 prose prose-invert max-w-none border border-white/5 bg-white/[0.02] p-12 rounded-[3rem]">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">
            The Elite PDF to Image Bulk Extraction Engine
          </h2>
          <div className="grid md:grid-cols-2 gap-10 text-slate-400 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p>
                Transforming complex documents into visual assets requires a{" "}
                <span className="text-white font-bold">
                  secure PDF to image converter
                </span>{" "}
                that preserves every detail. CosmoXHub provides a{" "}
                <span className="text-red-500 font-bold underline">
                  free online utility tool
                </span>{" "}
                designed for maximum quality and total user privacy. With our{" "}
                <span className="text-white font-bold">PDF to PNG</span> and{" "}
                <span className="text-white font-bold">PDF to JPG</span> extraction,
                your original layout is rendered with vector-precision.
              </p>
              <p>
                Our <span className="text-white font-bold">bulk PDF converter</span>{" "}
                lets you process multiple files simultaneously — perfect for batch
                operations. Upload 1 or 50 PDFs, and our engine extracts every single
                page into pristine images without touching any external server.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Whether you are prepping a social media carousel, extracting graphics
                for a presentation, or archiving high-res page snapshots, our granular
                resolution controls give you the power to choose between Low, HD, and
                Ultra scales. This flexibility ensures your images are perfectly sized
                for any destination.
              </p>
              <p>
                Choose CosmoXHub for a{" "}
                <span className="text-white font-bold">
                  private, secure, and professional
                </span>{" "}
                document conversion experience. Join elite users worldwide who trust our
                Zero-Server architecture for their high-fidelity PDF to image extraction
                needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
