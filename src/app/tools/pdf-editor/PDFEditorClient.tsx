"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Upload, X, Download, Type, Image as ImageIcon, Trash2, ShieldCheck, 
  ChevronLeft, ChevronRight, Plus, ZoomIn, ZoomOut, PenTool, Highlighter, 
  Square, Circle, Undo, Redo, MousePointer2
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import Draggable from "react-draggable";
import { saveAs } from "file-saver";
import { Ann, Tool, pathD, hexToRgb01 } from "./types";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PDFEditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.4);

  // Editor State
  const [tool, setTool] = useState<Tool>("select");
  const [annotations, setAnnotations] = useState<Ann[]>([]);
  const [history, setHistory] = useState<Ann[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  
  // Default properties for new annotations
  const [currentColor, setCurrentColor] = useState("#1a1aff");
  const [currentFontSize, setCurrentFontSize] = useState(18);
  const [currentStrokeW, setCurrentStrokeW] = useState(3);
  
  // Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{x: number, y: number}[]>([]);
  const [drawStart, setDrawStart] = useState<{x: number, y: number} | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{x: number, y: number} | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // --- History Management ---
  const saveHistory = useCallback((newAnns: Ann[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newAnns);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    setAnnotations(newAnns);
  }, [history, historyStep]);

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(s => s - 1);
      setAnnotations(history[historyStep - 1]);
      setSelectedAnnId(null);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(s => s + 1);
      setAnnotations(history[historyStep + 1]);
      setSelectedAnnId(null);
    }
  };

  // --- Load PDF ---
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
        setHistory([[]]);
        setHistoryStep(0);
        setErrorMsg("");
      } catch (err: unknown) {
        setErrorMsg("Failed to load PDF. " + (err instanceof Error ? err.message : String(err)));
      }
    };
    loadPdf();
  }, [file]);

  // --- Render PDF Page ---
  useEffect(() => {
    if (!pdfDocProxy || !canvasRef.current) return;
    const renderPage = async () => {
      try {
        if (renderTaskRef.current) renderTaskRef.current.cancel();
        const page = await pdfDocProxy.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext: any = { canvasContext: context, viewport };
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

  // --- File Upload ---
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") setFile(droppedFile);
    else setErrorMsg("Please drop a valid PDF file.");
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") setFile(selected);
    else setErrorMsg("Please select a valid PDF file.");
  };

  // --- Add Elements ---
  const addText = () => {
    setTool("select");
    const ann: Ann = {
      id: Date.now().toString(),
      page: currentPage,
      type: "text",
      x: 60, y: 60,
      text: "Double click to edit",
      fontSize: currentFontSize,
      color: currentColor,
      bold: false,
    };
    saveHistory([...annotations, ann]);
    setSelectedAnnId(ann.id);
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTool("select");
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ann: Ann = {
        id: Date.now().toString(),
        page: currentPage,
        type: "image",
        x: 60, y: 60, w: 160, h: 100,
        imgSrc: ev.target?.result as string,
      };
      saveHistory([...annotations, ann]);
      setSelectedAnnId(ann.id);
    };
    reader.readAsDataURL(imgFile);
    e.target.value = "";
  };

  const updateAnn = (id: string, updates: Partial<Ann>, skipHistory = false) => {
    const newAnns = annotations.map(a => a.id === id ? { ...a, ...updates } : a);
    if (skipHistory) setAnnotations(newAnns);
    else saveHistory(newAnns);
  };

  const deleteAnn = (id: string) => {
    saveHistory(annotations.filter(a => a.id !== id));
    setSelectedAnnId(null);
  };

  // --- Mouse / Drawing Logic ---
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX = 0, clientY = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === "select") {
      if (e.target === containerRef.current || e.target === canvasRef.current) {
        setSelectedAnnId(null);
      }
      return;
    }
    setSelectedAnnId(null);
    setIsDrawing(true);
    const pos = getPointerPos(e);
    
    if (tool === "pen" || tool === "highlight") {
      setCurrentStroke([pos]);
    } else if (tool === "rect" || tool === "ellipse") {
      setDrawStart(pos);
      setDrawCurrent(pos);
    }
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getPointerPos(e);
    
    if (tool === "pen" || tool === "highlight") {
      setCurrentStroke(prev => [...prev, pos]);
    } else if (tool === "rect" || tool === "ellipse") {
      setDrawCurrent(pos);
    }
  };

  const onPointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if ((tool === "pen" || tool === "highlight") && currentStroke.length > 1) {
      const ann: Ann = {
        id: Date.now().toString(),
        page: currentPage,
        type: tool,
        strokes: [currentStroke],
        color: tool === "highlight" ? "#ffff00" : currentColor,
        strokeW: tool === "highlight" ? 15 : currentStrokeW,
        opacity: tool === "highlight" ? 0.4 : 1,
      };
      saveHistory([...annotations, ann]);
    } else if ((tool === "rect" || tool === "ellipse") && drawStart && drawCurrent) {
      const x = Math.min(drawStart.x, drawCurrent.x);
      const y = Math.min(drawStart.y, drawCurrent.y);
      const w = Math.abs(drawCurrent.x - drawStart.x);
      const h = Math.abs(drawCurrent.y - drawStart.y);
      if (w > 5 && h > 5) {
        const ann: Ann = {
          id: Date.now().toString(),
          page: currentPage,
          type: tool,
          x, y, w, h,
          color: currentColor,
          strokeW: currentStrokeW,
        };
        saveHistory([...annotations, ann]);
      }
    }
    setCurrentStroke([]);
    setDrawStart(null);
    setDrawCurrent(null);
  };

  // --- Export PDF (pdf-lib) ---
  const exportPdf = async () => {
    if (!file || !pdfDocProxy) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (let pNum = 1; pNum <= numPages; pNum++) {
        const pageAnns = annotations.filter(a => a.page === pNum);
        if (!pageAnns.length) continue;

        const pdfjsPage = await pdfDocProxy.getPage(pNum);
        const viewport = pdfjsPage.getViewport({ scale: 1 });
        const pageHeight = viewport.height;
        const pdfPage = pages[pNum - 1];

        for (const ann of pageAnns) {
          const sx = (val: number) => val / scale;
          const sy = (val: number) => pageHeight - (val / scale); // invert Y for pdf-lib

          const rgbColor = ann.color ? rgb(...hexToRgb01(ann.color)) : rgb(0,0,0);
          const opacity = ann.opacity || 1;

          if (ann.type === "text" && ann.text && ann.x !== undefined && ann.y !== undefined) {
            const fs = (ann.fontSize || 16) / scale;
            pdfPage.drawText(ann.text, {
              x: sx(ann.x),
              y: sy(ann.y) - fs, // adjust baseline
              size: fs,
              color: rgbColor,
              opacity,
            });
          } 
          else if (ann.type === "image" && ann.imgSrc && ann.x !== undefined && ann.y !== undefined && ann.w && ann.h) {
            let img;
            if (ann.imgSrc.startsWith("data:image/png")) img = await pdfDoc.embedPng(ann.imgSrc);
            else img = await pdfDoc.embedJpg(ann.imgSrc);
            
            const w = sx(ann.w);
            const h = sx(ann.h);
            pdfPage.drawImage(img, { x: sx(ann.x), y: sy(ann.y) - h, width: w, height: h, opacity });
          }
          else if ((ann.type === "pen" || ann.type === "highlight") && ann.strokes) {
            // pdf-lib drawSvgPath is tricky with inverted Y. 
            // Better to draw as lines
            for (const stroke of ann.strokes) {
              for (let i = 0; i < stroke.length - 1; i++) {
                pdfPage.drawLine({
                  start: { x: sx(stroke[i].x), y: sy(stroke[i].y) },
                  end: { x: sx(stroke[i+1].x), y: sy(stroke[i+1].y) },
                  color: rgbColor,
                  thickness: (ann.strokeW || 3) / scale,
                  opacity,
                });
              }
            }
          }
          else if (ann.type === "rect" && ann.x !== undefined && ann.y !== undefined && ann.w && ann.h) {
            pdfPage.drawRectangle({
              x: sx(ann.x),
              y: sy(ann.y) - sx(ann.h),
              width: sx(ann.w),
              height: sx(ann.h),
              borderColor: rgbColor,
              borderWidth: (ann.strokeW || 3) / scale,
              opacity,
            });
          }
          else if (ann.type === "ellipse" && ann.x !== undefined && ann.y !== undefined && ann.w && ann.h) {
            pdfPage.drawEllipse({
              x: sx(ann.x) + sx(ann.w)/2,
              y: sy(ann.y) - sx(ann.h)/2,
              xScale: sx(ann.w)/2,
              yScale: sx(ann.h)/2,
              borderColor: rgbColor,
              borderWidth: (ann.strokeW || 3) / scale,
              opacity,
            });
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

  const pageAnns = annotations.filter(a => a.page === currentPage);
  const selectedAnn = annotations.find(a => a.id === selectedAnnId);

  // ── Upload Screen ──
  if (!file) {
    return (
      <div className="min-h-screen bg-[#0d0d24] text-slate-200 px-4 pt-24 pb-16 flex flex-col items-center">
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <ShieldCheck size={14} /> 100% Client-Side · Private & Secure
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            PDF <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Editor Pro</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Annotate, Draw, Highlight, and Sign PDFs directly in your browser.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={handleDrop}
          className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-14 text-center transition-all duration-300 cursor-pointer
            ${isDraggingFile ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-slate-600 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-800/50"}`}
        >
          <input type="file" accept=".pdf" className="hidden" id="pdf-upload" onChange={handleFileUpload} />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${isDraggingFile ? "bg-indigo-500/30 text-indigo-300" : "bg-indigo-500/15 text-indigo-400"}`}>
              <Upload size={36} />
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-1">Drop your PDF here</p>
              <p className="text-slate-400 text-sm">or <span className="text-indigo-400 font-semibold underline">click to browse</span></p>
            </div>
          </label>
        </div>

        {errorMsg && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-xl max-w-2xl w-full text-center text-sm">
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  // ── Editor Screen ──
  return (
    <div className="min-h-screen bg-[#0d0d24] text-slate-200 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
          <div>
            <p className="text-sm font-bold text-white truncate max-w-[150px] md:max-w-[300px]">{file.name}</p>
            <p className="text-xs text-slate-500">{numPages} pages</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
          <button onClick={undo} disabled={historyStep <= 0} className="p-2 disabled:opacity-30 hover:bg-slate-700 rounded-lg text-slate-300" title="Undo"><Undo size={16} /></button>
          <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-2 disabled:opacity-30 hover:bg-slate-700 rounded-lg text-slate-300" title="Redo"><Redo size={16} /></button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300" title="Zoom Out"><ZoomOut size={16} /></button>
          <span className="text-xs font-mono w-12 text-center text-slate-300">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300" title="Zoom In"><ZoomIn size={16} /></button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-2 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300"><ChevronLeft size={16} /></button>
          <span className="text-xs font-mono w-16 text-center text-slate-300">Pg {currentPage}/{numPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className="p-2 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300"><ChevronRight size={16} /></button>
        </div>

        <button onClick={exportPdf} disabled={isProcessing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
          <Download size={16} /> {isProcessing ? "Exporting..." : "Export PDF"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-16 md:w-56 bg-slate-900 border-r border-slate-800 p-2 md:p-4 flex flex-col gap-2 overflow-y-auto shrink-0 z-40">
          <p className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 pl-1">Tools</p>
          
          {[
            { id: "select", icon: MousePointer2, label: "Select/Move" },
            { id: "pen", icon: PenTool, label: "Draw" },
            { id: "highlight", icon: Highlighter, label: "Highlight" },
            { id: "rect", icon: Square, label: "Rectangle" },
            { id: "ellipse", icon: Circle, label: "Circle" },
          ].map((t) => (
            <button key={t.id} onClick={() => { setTool(t.id as Tool); setSelectedAnnId(null); }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tool === t.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
              <t.icon size={18} className="shrink-0" />
              <span className="hidden md:block text-sm font-semibold">{t.label}</span>
            </button>
          ))}

          <div className="h-px bg-slate-800 my-2" />
          <p className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 pl-1">Insert</p>

          <button onClick={addText} className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Type size={18} className="shrink-0" />
            <span className="hidden md:block text-sm font-semibold">Text Box</span>
          </button>
          
          <label className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer">
            <ImageIcon size={18} className="shrink-0" />
            <span className="hidden md:block text-sm font-semibold">Image / Sign</span>
            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={addImage} />
          </label>

          {/* Settings Panel */}
          {(tool === "pen" || tool === "rect" || tool === "ellipse" || selectedAnn?.type === "text") && (
            <div className="hidden md:block mt-auto pt-4 border-t border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Settings</p>
              
              <div className="mb-3">
                <label className="text-xs text-slate-400 mb-1 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {["#000000", "#ffffff", "#ff3b30", "#34c759", "#007aff", "#ff9500", "#af52de"].map(c => (
                    <button key={c} onClick={() => {
                        setCurrentColor(c);
                        if (selectedAnn) updateAnn(selectedAnn.id, { color: c });
                      }}
                      className={`w-6 h-6 rounded-full border-2 ${currentColor === c || selectedAnn?.color === c ? "border-white" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {(tool === "pen" || tool === "rect" || tool === "ellipse") && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 flex justify-between">
                    <span>Thickness</span> <span>{currentStrokeW}px</span>
                  </label>
                  <input type="range" min="1" max="20" value={currentStrokeW} onChange={e => setCurrentStrokeW(Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              )}

              {selectedAnn?.type === "text" && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 flex justify-between">
                    <span>Font Size</span> <span>{selectedAnn.fontSize}px</span>
                  </label>
                  <input type="range" min="8" max="72" value={selectedAnn.fontSize} onChange={e => updateAnn(selectedAnn.id, { fontSize: Number(e.target.value) })} className="w-full accent-indigo-500" />
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Canvas Area */}
        <main
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-950 p-4 md:p-8 flex justify-center items-start"
        >
          <div
            className={`relative bg-white shadow-2xl shadow-black/50 ${tool !== "select" ? "cursor-crosshair" : ""}`}
            style={{ width: canvasRef.current?.width || "auto", height: canvasRef.current?.height || "auto" }}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          >
            <canvas ref={canvasRef} className="block pointer-events-none" />

            {/* Render Annotations */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              {pageAnns.map(ann => {
                if ((ann.type === "pen" || ann.type === "highlight") && ann.strokes) {
                  return (
                    <g key={ann.id}>
                      {ann.strokes.map((stroke, i) => (
                        <path key={i} d={pathD(stroke)} fill="none" stroke={ann.color} strokeWidth={ann.strokeW} strokeLinecap="round" strokeLinejoin="round" opacity={ann.opacity} />
                      ))}
                    </g>
                  );
                }
                if (ann.type === "rect" && ann.x !== undefined) {
                  return <rect key={ann.id} x={ann.x} y={ann.y} width={ann.w} height={ann.h} fill="none" stroke={ann.color} strokeWidth={ann.strokeW} opacity={ann.opacity} />;
                }
                if (ann.type === "ellipse" && ann.x !== undefined && ann.w) {
                  return <ellipse key={ann.id} cx={ann.x + ann.w/2} cy={(ann.y||0) + (ann.h||0)/2} rx={ann.w/2} ry={(ann.h||0)/2} fill="none" stroke={ann.color} strokeWidth={ann.strokeW} opacity={ann.opacity} />;
                }
                return null;
              })}

              {/* Active Drawing */}
              {isDrawing && currentStroke.length > 0 && (tool === "pen" || tool === "highlight") && (
                <path d={pathD(currentStroke)} fill="none" stroke={tool === "highlight" ? "#ffff00" : currentColor} strokeWidth={tool === "highlight" ? 15 : currentStrokeW} strokeLinecap="round" strokeLinejoin="round" opacity={tool === "highlight" ? 0.4 : 1} />
              )}
              {isDrawing && drawStart && drawCurrent && tool === "rect" && (
                <rect x={Math.min(drawStart.x, drawCurrent.x)} y={Math.min(drawStart.y, drawCurrent.y)} width={Math.abs(drawCurrent.x - drawStart.x)} height={Math.abs(drawCurrent.y - drawStart.y)} fill="none" stroke={currentColor} strokeWidth={currentStrokeW} />
              )}
              {isDrawing && drawStart && drawCurrent && tool === "ellipse" && (
                <ellipse cx={Math.min(drawStart.x, drawCurrent.x) + Math.abs(drawCurrent.x - drawStart.x)/2} cy={Math.min(drawStart.y, drawCurrent.y) + Math.abs(drawCurrent.y - drawStart.y)/2} rx={Math.abs(drawCurrent.x - drawStart.x)/2} ry={Math.abs(drawCurrent.y - drawStart.y)/2} fill="none" stroke={currentColor} strokeWidth={currentStrokeW} />
              )}
            </svg>

            {/* Draggable Overlays (Text / Images) */}
            {pageAnns.filter(a => a.type === "text" || a.type === "image").map(ann => (
              <Draggable
                key={ann.id}
                position={{ x: ann.x || 0, y: ann.y || 0 }}
                onStop={(_, data) => updateAnn(ann.id, { x: data.x, y: data.y })}
                disabled={tool !== "select"}
                bounds="parent"
              >
                <div
                  onMouseDown={(e) => { if(tool === "select") { e.stopPropagation(); setSelectedAnnId(ann.id); } }}
                  onTouchStart={(e) => { if(tool === "select") { e.stopPropagation(); setSelectedAnnId(ann.id); } }}
                  className={`absolute z-20 ${tool === "select" ? "cursor-move" : "pointer-events-none"} ${selectedAnnId === ann.id ? "ring-2 ring-indigo-500 rounded" : ""}`}
                >
                  {ann.type === "text" ? (
                    <div style={{ fontSize: `${ann.fontSize}px`, color: ann.color, whiteSpace: "pre", padding: "2px" }}>
                      {selectedAnnId === ann.id ? (
                        <textarea
                          autoFocus
                          value={ann.text}
                          onChange={e => updateAnn(ann.id, { text: e.target.value }, true)}
                          onBlur={() => saveHistory([...annotations])}
                          className="bg-transparent outline-none resize-none overflow-hidden m-0 p-0"
                          style={{ color: ann.color, minWidth: "150px", height: `${(ann.fontSize||16)*1.5}px` }}
                        />
                      ) : (
                        <span>{ann.text}</span>
                      )}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ann.imgSrc} alt="" style={{ width: `${ann.w}px`, height: `${ann.h}px`, objectFit: "contain" }} draggable={false} />
                  )}
                  
                  {/* Delete button for selected item */}
                  {selectedAnnId === ann.id && tool === "select" && (
                    <button onClick={(e) => { e.stopPropagation(); deleteAnn(ann.id); }} className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 pointer-events-auto">
                      <Trash2 size={12} />
                    </button>
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
