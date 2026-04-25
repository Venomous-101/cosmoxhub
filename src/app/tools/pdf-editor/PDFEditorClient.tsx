"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, Download, Type, Image as ImageIcon, Trash2, ShieldCheck, ChevronLeft, ChevronRight, Plus, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb } from "pdf-lib";
import Draggable from "react-draggable";
import { saveAs } from "file-saver";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface Annotation {
  id: string;
  pageIndex: number;
  type: "text" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  imgDataUrl?: string;
}

export default function PDFEditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.4);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // Load PDF
  useEffect(() => {
    if (!file) return;
    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPdfDocProxy(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setAnnotations([]);
        setErrorMsg("");
      } catch (err: unknown) {
        setErrorMsg("Failed to load PDF. " + (err instanceof Error ? err.message : String(err)));
      }
    };
    loadPdf();
  }, [file]);

  // Render page
  useEffect(() => {
    if (!pdfDocProxy || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDocProxy.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "RenderingCancelledException") {
          console.error("Render error:", err);
        }
      }
    };

    renderPage();
  }, [pdfDocProxy, currentPage, scale]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      setErrorMsg("Please drop a valid PDF file.");
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
    } else {
      setErrorMsg("Please select a valid PDF file.");
    }
  };

  const addText = () => {
    const ann: Annotation = {
      id: Date.now().toString(),
      pageIndex: currentPage,
      type: "text",
      x: 60,
      y: 60,
      text: "Your text here",
      fontSize: 18,
      color: "#1a1aff",
      fontWeight: "normal",
    };
    setAnnotations(prev => [...prev, ann]);
    setSelectedAnnId(ann.id);
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ann: Annotation = {
        id: Date.now().toString(),
        pageIndex: currentPage,
        type: "image",
        x: 60,
        y: 60,
        width: 160,
        height: 100,
        imgDataUrl: ev.target?.result as string,
      };
      setAnnotations(prev => [...prev, ann]);
      setSelectedAnnId(ann.id);
    };
    reader.readAsDataURL(imgFile);
    // Reset input
    e.target.value = "";
  };

  const updateAnn = (id: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAnn = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    setSelectedAnnId(null);
  };

  const exportPdf = async () => {
    if (!file || !pdfDocProxy) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (let pNum = 1; pNum <= numPages; pNum++) {
        const pageAnns = annotations.filter(a => a.pageIndex === pNum);
        if (!pageAnns.length) continue;

        const pdfjsPage = await pdfDocProxy.getPage(pNum);
        const viewport = pdfjsPage.getViewport({ scale: 1 });
        const pageHeight = viewport.height;
        const pdfPage = pages[pNum - 1];

        for (const ann of pageAnns) {
          const unscaledX = ann.x / scale;
          const unscaledY = ann.y / scale;

          if (ann.type === "text" && ann.text) {
            const fs = (ann.fontSize || 16) / scale;
            const pdfY = pageHeight - unscaledY - fs;
            const hex = ann.color || "#000000";
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            pdfPage.drawText(ann.text, {
              x: unscaledX,
              y: pdfY,
              size: fs,
              color: rgb(r, g, b),
            });
          } else if (ann.type === "image" && ann.imgDataUrl) {
            let imageToEmbed;
            try {
              if (ann.imgDataUrl.startsWith("data:image/png")) {
                imageToEmbed = await pdfDoc.embedPng(ann.imgDataUrl);
              } else {
                imageToEmbed = await pdfDoc.embedJpg(ann.imgDataUrl);
              }
            } catch {
              continue;
            }
            const w = (ann.width || 100) / scale;
            const h = (ann.height || 100) / scale;
            const pdfY = pageHeight - unscaledY - h;
            pdfPage.drawImage(imageToEmbed, { x: unscaledX, y: pdfY, width: w, height: h });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      saveAs(blob, `edited_${file.name}`);
    } catch (err: unknown) {
      setErrorMsg("Export failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  const pageAnns = annotations.filter(a => a.pageIndex === currentPage);
  const selectedAnn = annotations.find(a => a.id === selectedAnnId);

  // ── Upload Screen ──
  if (!file) {
    return (
      <div className="min-h-screen bg-[#0d0d24] text-slate-200 px-4 pt-24 pb-16 flex flex-col items-center">
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <ShieldCheck size={14} /> 100% Client-Side · Files Never Uploaded
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            PDF <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Editor Pro</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Add text, signatures, and images to any PDF. No signup, no cloud, no limits.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-14 text-center transition-all duration-300 cursor-pointer
            ${isDragging
              ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
              : "border-slate-600 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-800/50"
            }`}
        >
          <input type="file" accept=".pdf" className="hidden" id="pdf-upload" onChange={handleFileUpload} />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-indigo-500/30 text-indigo-300" : "bg-indigo-500/15 text-indigo-400"}`}>
              <Upload size={36} />
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-1">Drop your PDF here</p>
              <p className="text-slate-400 text-sm">or <span className="text-indigo-400 font-semibold underline">click to browse</span></p>
            </div>
            <p className="text-xs text-slate-500 mt-2">Supports all PDF versions · Max 100 MB</p>
          </label>
        </div>

        {errorMsg && (
          <div className="mt-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-xl max-w-2xl w-full">
            <X size={16} className="shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            { icon: "T", title: "Add Text", desc: "Insert custom text anywhere on the page" },
            { icon: "✍", title: "Sign PDFs", desc: "Add a signature image from your device" },
            { icon: "🖼", title: "Insert Images", desc: "Embed logos, stamps, or graphics" },
          ].map((f) => (
            <div key={f.title} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-3">{f.icon}</div>
              <p className="font-bold text-white text-sm mb-1">{f.title}</p>
              <p className="text-slate-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Editor Screen ──
  return (
    <div className="min-h-screen bg-[#0d0d24] text-slate-200 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0d0d24]/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setFile(null); setPdfDocProxy(null); setAnnotations([]); }}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div>
            <p className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-slate-500">{numPages} pages · {pageAnns.length} annotations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom */}
          <button onClick={() => setScale(s => Math.max(0.7, s - 0.2))} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Zoom Out"><ZoomOut size={16} /></button>
          <span className="text-xs text-slate-400 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Zoom In"><ZoomIn size={16} /></button>

          <div className="h-5 w-px bg-slate-700 mx-1" />

          {/* Page Nav */}
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-2 hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"><ChevronLeft size={16} /></button>
          <span className="text-sm text-slate-300 font-semibold w-16 text-center">{currentPage} / {numPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className="p-2 hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"><ChevronRight size={16} /></button>

          <div className="h-5 w-px bg-slate-700 mx-1" />

          <button
            onClick={exportPdf}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all"
          >
            <Download size={15} />
            {isProcessing ? "Exporting..." : "Download PDF"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mx-4 mt-3 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          <X size={15} className="shrink-0" /><p className="text-sm flex-1">{errorMsg}</p>
          <button onClick={() => setErrorMsg("")}><X size={14} /></button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 bg-slate-900/80 border-r border-slate-800 p-4 flex flex-col gap-3 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Add Elements</p>

          <button
            onClick={addText}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500/40 text-left transition-all group"
          >
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500/30">
              <Type size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Add Text</p>
              <p className="text-[10px] text-slate-500">Click to insert</p>
            </div>
          </button>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-purple-500/20 border border-transparent hover:border-purple-500/40 text-left transition-all cursor-pointer group">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500/30">
              <ImageIcon size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Add Image</p>
              <p className="text-[10px] text-slate-500">Signature / Logo</p>
            </div>
            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={addImage} />
          </label>

          {/* Selected annotation properties */}
          {selectedAnn && (
            <>
              <div className="h-px bg-slate-700/50 my-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Properties</p>

              {selectedAnn.type === "text" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-1 block">Content</label>
                    <input
                      type="text"
                      value={selectedAnn.text}
                      onChange={e => updateAnn(selectedAnn.id, { text: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-500 mb-1 block">Size</label>
                      <input
                        type="number"
                        min={8}
                        max={96}
                        value={selectedAnn.fontSize}
                        onChange={e => updateAnn(selectedAnn.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 mb-1 block">Color</label>
                      <input
                        type="color"
                        value={selectedAnn.color}
                        onChange={e => updateAnn(selectedAnn.id, { color: e.target.value })}
                        className="w-10 h-9 rounded-lg cursor-pointer bg-slate-800 border border-slate-700 p-0.5"
                      />
                    </div>
                  </div>
                  <button onClick={() => updateAnn(selectedAnn.id, { fontWeight: selectedAnn.fontWeight === "bold" ? "normal" : "bold" })}
                    className={`w-full text-xs font-bold py-1.5 rounded-lg border transition-all ${selectedAnn.fontWeight === "bold" ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-300" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"}`}>
                    Bold
                  </button>
                </div>
              )}

              {selectedAnn.type === "image" && (
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 block">Width (px)</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateAnn(selectedAnn.id, { width: Math.max(20, (selectedAnn.width || 100) - 20), height: Math.max(20, (selectedAnn.height || 100) - 20) })}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700">
                      <span className="font-bold text-sm text-white">−</span>
                    </button>
                    <span className="flex-1 text-center text-sm text-white">{selectedAnn.width}px</span>
                    <button onClick={() => updateAnn(selectedAnn.id, { width: (selectedAnn.width || 100) + 20, height: (selectedAnn.height || 100) + 20 })}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700">
                      <Plus size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => deleteAnn(selectedAnn.id)}
                className="flex items-center gap-2 justify-center w-full p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm transition-all"
              >
                <Trash2 size={14} /> Delete
              </button>
            </>
          )}

          {/* Annotations list */}
          {pageAnns.length > 0 && (
            <>
              <div className="h-px bg-slate-700/50 my-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Page Layers</p>
              <div className="space-y-1">
                {pageAnns.map((ann, i) => (
                  <button
                    key={ann.id}
                    onClick={() => setSelectedAnnId(ann.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-all ${selectedAnnId === ann.id ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300" : "bg-slate-800/50 text-slate-400 hover:text-white"}`}
                  >
                    {ann.type === "text" ? <Type size={11} /> : <ImageIcon size={11} />}
                    <span className="truncate">{ann.type === "text" ? ann.text?.slice(0, 18) : "Image " + (i + 1)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* PDF Canvas Area */}
        <main
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-950 p-6 flex justify-center items-start"
          onClick={(e) => { if (e.target === e.currentTarget || e.target === canvasRef.current) setSelectedAnnId(null); }}
        >
          <div
            className="relative bg-white shadow-2xl shadow-black/50"
            style={{ width: canvasRef.current?.width || "auto", height: canvasRef.current?.height || "auto" }}
          >
            <canvas ref={canvasRef} className="block" />

            {/* Annotation Overlays */}
            {pageAnns.map((ann) => (
              <Draggable
                key={ann.id}
                position={{ x: ann.x, y: ann.y }}
                onStop={(_, data) => updateAnn(ann.id, { x: data.x, y: data.y })}
                bounds="parent"
                handle=".drag-handle"
              >
                <div
                  onClick={(e) => { e.stopPropagation(); setSelectedAnnId(ann.id); }}
                  className={`absolute ${selectedAnnId === ann.id ? "ring-2 ring-indigo-500 ring-offset-1 ring-offset-white/80" : ""}`}
                  style={{ top: 0, left: 0 }}
                >
                  <div className="drag-handle cursor-move">
                    {ann.type === "text" ? (
                      <span
                        style={{
                          fontSize: `${ann.fontSize}px`,
                          color: ann.color,
                          fontWeight: ann.fontWeight || "normal",
                          fontFamily: "sans-serif",
                          whiteSpace: "pre",
                          display: "block",
                          userSelect: "none",
                          padding: "2px 4px",
                        }}
                      >
                        {ann.text}
                      </span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ann.imgDataUrl}
                        alt=""
                        style={{ width: `${ann.width}px`, height: `${ann.height}px`, display: "block", objectFit: "contain" }}
                        draggable={false}
                      />
                    )}
                  </div>

                  {selectedAnnId === ann.id && ann.type === "text" && (
                    <div className="absolute left-0 -top-8 z-50">
                      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex items-center gap-1 px-1 py-0.5 whitespace-nowrap">
                        <input
                          type="text"
                          value={ann.text}
                          onChange={e => updateAnn(ann.id, { text: e.target.value })}
                          className="w-28 bg-slate-800 text-white text-xs px-1.5 py-1 rounded outline-none border border-slate-700 focus:border-indigo-500"
                          onClick={e => e.stopPropagation()}
                        />
                        <button onClick={(e) => { e.stopPropagation(); deleteAnn(ann.id); }} className="p-1 text-red-400 hover:bg-red-400/20 rounded">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Draggable>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
