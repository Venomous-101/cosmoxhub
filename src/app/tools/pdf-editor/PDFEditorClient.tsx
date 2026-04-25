"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Upload, X, Download, Type, Image as ImageIcon, Trash2, ShieldCheck, 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, PenTool, Highlighter, 
  Square, Circle, Undo, Redo, MousePointer2, Eraser, AlignLeft, AlignCenter, AlignRight, Bold, Italic
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb } from "pdf-lib";
import Draggable from "react-draggable";
import { saveAs } from "file-saver";
import { Ann, Tool, pathD, hexToRgb01 } from "./types";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function DraggableAnnotation({ 
  ann, scale, tool, selectedAnnId, setSelectedAnnId, updateAnn, deleteAnn, saveHistory, annotations 
}: { 
  ann: Ann; scale: number; tool: string; selectedAnnId: string | null; 
  setSelectedAnnId: (id: string | null) => void; 
  updateAnn: (id: string, updates: Partial<Ann>, skipHistory?: boolean) => void;
  deleteAnn: (id: string) => void;
  saveHistory: (newAnns: Ann[]) => void;
  annotations: Ann[];
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Contextual Toolbar (Floating)
  const isSelected = selectedAnnId === ann.id;

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: (ann.x || 0) * scale, y: (ann.y || 0) * scale }}
      onStop={(_, data) => updateAnn(ann.id, { x: data.x / scale, y: data.y / scale })}
      disabled={tool !== "select"}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        onMouseDown={(e) => { if(tool === "select") { e.stopPropagation(); setSelectedAnnId(ann.id); } }}
        onTouchStart={(e) => { if(tool === "select") { e.stopPropagation(); setSelectedAnnId(ann.id); } }}
        className={`absolute z-20 ${tool === "select" ? "cursor-move" : "pointer-events-none"} ${isSelected ? "ring-2 ring-indigo-500 rounded" : ""}`}
      >
        {ann.type === "text" ? (
          <div style={{ fontSize: `${(ann.fontSize || 16) * scale}px`, color: ann.color, whiteSpace: "pre", padding: "2px", fontWeight: ann.bold ? "bold" : "normal", fontStyle: ann.italic ? "italic" : "normal", fontFamily: ann.font || "inherit" }}>
            {isSelected ? (
              <textarea
                autoFocus
                value={ann.text}
                onChange={e => updateAnn(ann.id, { text: e.target.value }, true)}
                onBlur={() => saveHistory([...annotations])}
                className="bg-transparent outline-none resize-none overflow-visible m-0 p-0 block"
                style={{ color: ann.color, minWidth: `${150 * scale}px`, height: `${(ann.fontSize||16) * 1.5 * scale * (ann.text?.split('\n').length || 1)}px`, lineHeight: 1.2, fontWeight: ann.bold ? "bold" : "normal", fontStyle: ann.italic ? "italic" : "normal", fontFamily: ann.font || "inherit" }}
              />
            ) : (
              <span style={{ lineHeight: 1.2, display: "block" }}>{ann.text}</span>
            )}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ann.imgSrc} alt="" style={{ width: `${(ann.w || 0) * scale}px`, height: `${(ann.h || 0) * scale}px`, objectFit: "contain" }} draggable={false} />
        )}
        
        {/* Contextual Toolbar */}
        {isSelected && tool === "select" && (
          <div 
            className="absolute -top-12 left-0 bg-slate-800 border border-slate-700 shadow-xl rounded-lg p-1 flex items-center gap-1 pointer-events-auto"
            onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when interacting with toolbar
          >
            {ann.type === "text" && (
              <>
                <input type="color" value={ann.color || "#000000"} onChange={(e) => updateAnn(ann.id, { color: e.target.value })} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <button onClick={() => updateAnn(ann.id, { fontSize: Math.max(8, (ann.fontSize || 16) - 2) })} className="px-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded">-</button>
                <span className="text-xs text-slate-300 w-4 text-center">{ann.fontSize || 16}</span>
                <button onClick={() => updateAnn(ann.id, { fontSize: Math.min(72, (ann.fontSize || 16) + 2) })} className="px-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded">+</button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <button onClick={() => updateAnn(ann.id, { bold: !ann.bold })} className={`p-1.5 rounded ${ann.bold ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}><Bold size={14} /></button>
                <button onClick={() => updateAnn(ann.id, { italic: !ann.italic })} className={`p-1.5 rounded ${ann.italic ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}><Italic size={14} /></button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
              </>
            )}
            {ann.type === "image" && (
              <>
                <button onClick={() => updateAnn(ann.id, { w: Math.max(20, (ann.w || 100) - 20), h: Math.max(20, (ann.h || 100) * (Math.max(20, (ann.w || 100) - 20) / (ann.w || 100))) })} className="px-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded">-</button>
                <span className="text-xs text-slate-300">Size</span>
                <button onClick={() => updateAnn(ann.id, { w: (ann.w || 100) + 20, h: (ann.h || 100) * (((ann.w || 100) + 20) / (ann.w || 100)) })} className="px-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded">+</button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
              </>
            )}
            <button onClick={() => deleteAnn(ann.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </Draggable>
  );
}

export default function PDFEditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);

  // Editor State
  const [tool, setTool] = useState<Tool | "sign">("select");
  const [annotations, setAnnotations] = useState<Ann[]>([]);
  const [history, setHistory] = useState<Ann[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  
  // Canvas Size
  const [canvasDim, setCanvasDim] = useState({ width: 0, height: 0 });

  // Default properties
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentStrokeW, setCurrentStrokeW] = useState(3);
  
  // Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{x: number, y: number}[]>([]);
  const [drawStart, setDrawStart] = useState<{x: number, y: number} | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{x: number, y: number} | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Signature State
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signTab, setSignTab] = useState<"draw" | "type" | "upload">("draw");
  const signCanvasRef = useRef<HTMLDivElement>(null);
  const [signStrokes, setSignStrokes] = useState<{x: number, y: number}[][]>([]);
  const [signStroke, setSignStroke] = useState<{x: number, y: number}[]>([]);
  const [isSignDrawing, setIsSignDrawing] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [signFont, setSignFont] = useState("var(--font-caveat)");
  const [activeSignatureDataUrl, setActiveSignatureDataUrl] = useState<string | null>(null);
  const [activeSignatureAspect, setActiveSignatureAspect] = useState(0.5); // h/w

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
        console.error("PDF Load Error:", err);
        setErrorMsg("Failed to load PDF. Please make sure it's a valid document.");
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
        setCanvasDim({ width: viewport.width, height: viewport.height });

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

  // --- Tool Selection ---
  const handleToolSelect = (newTool: Tool | "sign") => {
    if (newTool === "sign") {
      if (!activeSignatureDataUrl) {
        setIsSignModalOpen(true);
      }
    }
    setTool(newTool);
    setSelectedAnnId(null);
  };

  // --- Click to Place (Text / Image / Sign) ---
  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === "select") return;
    
    const pos = getPointerPos(e);

    if (tool === "text") {
      const ann: Ann = {
        id: Date.now().toString(),
        page: currentPage,
        type: "text",
        x: pos.x, y: pos.y,
        text: "", // Start empty
        fontSize: 16,
        color: currentColor,
        bold: false,
        italic: false,
      };
      saveHistory([...annotations, ann]);
      setTool("select");
      setTimeout(() => setSelectedAnnId(ann.id), 50); // Select to focus
    } 
    else if (tool === "sign" && activeSignatureDataUrl) {
      const w = 150;
      const h = w * activeSignatureAspect;
      const ann: Ann = {
        id: Date.now().toString(),
        page: currentPage,
        type: "image", // Signatures are stored as images
        x: pos.x - w/2, y: pos.y - h/2, w, h,
        imgSrc: activeSignatureDataUrl,
      };
      saveHistory([...annotations, ann]);
      setTool("select");
      setSelectedAnnId(ann.id);
    }
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 300;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = (h/w)*maxDim; w = maxDim; }
          else { w = (w/h)*maxDim; h = maxDim; }
        }
        const ann: Ann = {
          id: Date.now().toString(),
          page: currentPage,
          type: "image",
          x: (canvasDim.width/scale/2) - w/2, y: 100, w, h, 
          imgSrc: src,
        };
        saveHistory([...annotations, ann]);
        setTool("select");
        setSelectedAnnId(ann.id);
      };
      img.src = src;
    };
    reader.readAsDataURL(imgFile);
    e.target.value = "";
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
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === "select") {
      if (e.target === containerRef.current || e.target === canvasRef.current || (e.target as HTMLElement).tagName === "svg") {
        setSelectedAnnId(null);
      }
      return;
    }
    
    // For text and sign, we handle in onClick equivalent (mouse up or immediate)
    // To prevent dragging the canvas, we just start drawing if it's a drawing tool
    if (tool === "text" || tool === "sign") {
      handleCanvasClick(e);
      return;
    }

    setSelectedAnnId(null);
    setIsDrawing(true);
    const pos = getPointerPos(e);
    
    if (tool === "pen" || tool === "highlight") {
      setCurrentStroke([pos]);
    } else if (tool === "rect" || tool === "ellipse" || tool === "whiteout") {
      setDrawStart(pos);
      setDrawCurrent(pos);
    }
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getPointerPos(e);
    
    if (tool === "pen" || tool === "highlight") {
      setCurrentStroke(prev => [...prev, pos]);
    } else if (tool === "rect" || tool === "ellipse" || tool === "whiteout") {
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
    } else if ((tool === "rect" || tool === "ellipse" || tool === "whiteout") && drawStart && drawCurrent) {
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
          color: tool === "whiteout" ? "#ffffff" : currentColor,
          strokeW: tool === "whiteout" ? 0 : currentStrokeW,
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
          const rgbColor = ann.color ? rgb(...hexToRgb01(ann.color)) : rgb(0,0,0);
          const opacity = ann.opacity || 1;

          if (ann.type === "text" && ann.text && ann.x !== undefined && ann.y !== undefined) {
            const fs = ann.fontSize || 16;
            // pdf-lib doesn't support easy custom font embedding without files, 
            // so we rely on standard fonts. Signatures are images anyway.
            pdfPage.drawText(ann.text, {
              x: ann.x,
              y: pageHeight - ann.y - fs, 
              size: fs,
              color: rgbColor,
              opacity,
            });
          } 
          else if (ann.type === "image" && ann.imgSrc && ann.x !== undefined && ann.y !== undefined && ann.w && ann.h) {
            let img;
            if (ann.imgSrc.startsWith("data:image/png")) img = await pdfDoc.embedPng(ann.imgSrc);
            else img = await pdfDoc.embedJpg(ann.imgSrc);
            
            pdfPage.drawImage(img, { x: ann.x, y: pageHeight - ann.y - ann.h, width: ann.w, height: ann.h, opacity });
          }
          else if ((ann.type === "pen" || ann.type === "highlight") && ann.strokes) {
            for (const stroke of ann.strokes) {
              for (let i = 0; i < stroke.length - 1; i++) {
                pdfPage.drawLine({
                  start: { x: stroke[i].x, y: pageHeight - stroke[i].y },
                  end: { x: stroke[i+1].x, y: pageHeight - stroke[i+1].y },
                  color: rgbColor,
                  thickness: ann.strokeW || 3,
                  opacity,
                });
              }
            }
          }
          else if ((ann.type === "rect" || ann.type === "whiteout") && ann.x !== undefined && ann.y !== undefined && ann.w && ann.h) {
            pdfPage.drawRectangle({
              x: ann.x,
              y: pageHeight - ann.y - ann.h,
              width: ann.w,
              height: ann.h,
              color: ann.type === "whiteout" ? rgb(1,1,1) : undefined,
              borderColor: ann.type === "whiteout" ? undefined : rgbColor,
              borderWidth: ann.type === "whiteout" ? 0 : (ann.strokeW || 3),
              opacity,
            });
          }
          else if (ann.type === "ellipse" && ann.x !== undefined && ann.y !== undefined && ann.w && ann.h) {
            pdfPage.drawEllipse({
              x: ann.x + ann.w/2,
              y: pageHeight - (ann.y + ann.h/2),
              xScale: ann.w/2,
              yScale: ann.h/2,
              borderColor: rgbColor,
              borderWidth: ann.strokeW || 3,
              opacity,
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      saveAs(blob, `edited_${file.name}`);
    } catch (err: unknown) {
      setErrorMsg("Export failed. Something went wrong while saving the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Signature Logic ---
  const getSignPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!signCanvasRef.current) return { x: 0, y: 0 };
    const rect = signCanvasRef.current.getBoundingClientRect();
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

  const onSignPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsSignDrawing(true);
    setSignStroke([getSignPointerPos(e)]);
  };

  const onSignPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSignDrawing) return;
    setSignStroke(prev => [...prev, getSignPointerPos(e)]);
  };

  const onSignPointerUp = () => {
    if (!isSignDrawing) return;
    setIsSignDrawing(false);
    if (signStroke.length > 1) {
      setSignStrokes(prev => [...prev, signStroke]);
    }
    setSignStroke([]);
  };

  const handleCreateSignature = async () => {
    let dataUrl = "";
    let aspect = 0.5;

    if (signTab === "draw") {
      if (signStrokes.length === 0) return;
      const canvas = document.createElement("canvas");
      const rect = signCanvasRef.current?.getBoundingClientRect();
      const width = rect?.width || 400;
      const height = rect?.height || 200;
      aspect = height / width;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr; 
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = currentColor;
      signStrokes.forEach(stroke => {
        if (stroke.length === 0) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });
      dataUrl = canvas.toDataURL("image/png");
    } 
    else if (signTab === "type") {
      if (!typedSignature) return;
      // Wait for fonts to load
      await document.fonts.ready;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      canvas.width = 600;
      canvas.height = 200;
      aspect = 200 / 600;

      // Extract font family name from the CSS variable via computed style
      // Since it's tricky to get CSS variable purely in JS if not attached, we can just use the literal font names
      let fontFamily = "Caveat";
      if (signFont.includes("pacifico")) fontFamily = "Pacifico";
      else if (signFont.includes("inter")) fontFamily = "Inter";

      ctx.font = `60px ${fontFamily}`;
      ctx.fillStyle = currentColor;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
      
      dataUrl = canvas.toDataURL("image/png");
    }

    if (dataUrl) {
      setActiveSignatureDataUrl(dataUrl);
      setActiveSignatureAspect(aspect);
      setIsSignModalOpen(false);
      setTool("sign");
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setActiveSignatureDataUrl(src);
        setActiveSignatureAspect(img.height / img.width);
        setIsSignModalOpen(false);
        setTool("sign");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const pageAnns = annotations.filter(a => a.page === currentPage);
  const updateAnn = (id: string, updates: Partial<Ann>, skipHistory = false) => {
    const newAnns = annotations.map(a => a.id === id ? { ...a, ...updates } : a);
    if (skipHistory) setAnnotations(newAnns);
    else saveHistory(newAnns);
  };
  const deleteAnn = (id: string) => {
    saveHistory(annotations.filter(a => a.id !== id));
    setSelectedAnnId(null);
  };

  // ── Upload Screen ──
  if (!file) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-200 px-4 pt-24 pb-16 flex flex-col items-center">
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

        {/* Premium Upload Card */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={handleDrop}
          className={`w-full max-w-3xl rounded-3xl p-16 text-center transition-all duration-300 cursor-pointer border border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden
            ${isDraggingFile ? "bg-indigo-500/10 scale-[1.02] border-indigo-500/50 ring-4 ring-indigo-500/20" : "bg-slate-800/20 hover:bg-slate-800/40 hover:border-indigo-500/30"}`}
        >
          {/* Decorative gradients */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

          <input type="file" accept=".pdf" className="hidden" id="pdf-upload" onChange={handleFileUpload} />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-5 relative z-10">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isDraggingFile ? "bg-indigo-500 shadow-indigo-500/30 text-white scale-110" : "bg-slate-800 text-indigo-400"}`}>
              <Upload size={40} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-2">Drop your PDF here</p>
              <p className="text-slate-400 text-base">or <span className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">click to browse</span></p>
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
    <div className="h-screen w-full bg-[#0B0F19] text-slate-200 flex flex-col font-sans overflow-hidden relative">
      
      {/* Mobile Warning Banner */}
      <div className="md:hidden bg-indigo-600 text-white text-xs font-bold text-center py-2 px-4 shadow-md">
        ⚠️ This tool is optimized for Desktop. The experience on mobile may be limited.
      </div>

      {/* Top Toolbar (2 Tiers) */}
      <div className="shrink-0 flex flex-col z-50 bg-[#121826] border-b border-slate-800 shadow-lg">
        
        {/* Tier 1: Document Controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors" title="Close PDF">
              <X size={18} />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-500">{numPages} pages</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/50 rounded-xl p-1 border border-slate-700/50">
            <button onClick={undo} disabled={historyStep <= 0} className="p-1.5 sm:p-2 disabled:opacity-30 hover:bg-slate-700 rounded-lg text-slate-300" title="Undo"><Undo size={16} /></button>
            <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-1.5 sm:p-2 disabled:opacity-30 hover:bg-slate-700 rounded-lg text-slate-300" title="Redo"><Redo size={16} /></button>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg text-slate-300" title="Zoom Out"><ZoomOut size={16} /></button>
            <span className="text-xs font-mono w-10 sm:w-12 text-center text-slate-300">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg text-slate-300" title="Zoom In"><ZoomIn size={16} /></button>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-1.5 sm:p-2 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300"><ChevronLeft size={16} /></button>
            <span className="text-xs font-mono w-14 sm:w-16 text-center text-slate-300">Pg {currentPage}/{numPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className="p-1.5 sm:p-2 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300"><ChevronRight size={16} /></button>
          </div>

          <button onClick={exportPdf} disabled={isProcessing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
            <Download size={16} /> <span className="hidden sm:inline">{isProcessing ? "Exporting..." : "Export PDF"}</span>
          </button>
        </div>

        {/* Tier 2: Annotation Tools */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 bg-[#0F1420]">
          
          {[
            { id: "select", icon: MousePointer2, label: "Select" },
            { id: "text", icon: Type, label: "Text" },
          ].map((t) => (
            <button key={t.id} onClick={() => handleToolSelect(t.id as Tool)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${tool === t.id ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"}`}>
              <t.icon size={16} /> <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}

          <button onClick={() => handleToolSelect("sign")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${tool === "sign" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"}`}>
            <PenTool size={16} /> <span className="hidden md:inline">Sign</span>
          </button>

          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent cursor-pointer">
            <ImageIcon size={16} /> <span className="hidden md:inline">Image</span>
            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={addImage} />
          </label>

          <div className="w-px h-6 bg-slate-700 mx-1" />

          {[
            { id: "pen", icon: PenTool, label: "Draw" },
            { id: "highlight", icon: Highlighter, label: "Highlight" },
            { id: "rect", icon: Square, label: "Square" },
            { id: "ellipse", icon: Circle, label: "Circle" },
            { id: "whiteout", icon: Eraser, label: "Whiteout" },
          ].map((t) => (
            <button key={t.id} onClick={() => handleToolSelect(t.id as Tool)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${tool === t.id ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"}`}>
              <t.icon size={16} /> <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}

          {/* Persistent Color Picker for drawing tools */}
          {(tool === "pen" || tool === "rect" || tool === "ellipse" || tool === "text") && (
            <>
              <div className="w-px h-6 bg-slate-700 mx-1" />
              <input type="color" value={currentColor} onChange={e => setCurrentColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" title="Color" />
            </>
          )}

          {/* Stroke Width for drawing tools */}
          {(tool === "pen" || tool === "rect" || tool === "ellipse") && (
            <input type="range" min="1" max="15" value={currentStrokeW} onChange={e => setCurrentStrokeW(Number(e.target.value))} className="w-20 accent-indigo-500" title="Stroke Width" />
          )}

        </div>
      </div>

      {/* Canvas Area */}
      <main
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#0B0F19] p-4 md:p-10 flex justify-center items-start"
      >
        <div
          className={`relative bg-white shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-shadow duration-300 ${tool === "text" || tool === "sign" ? "cursor-crosshair" : tool !== "select" ? "cursor-crosshair" : ""}`}
          style={{ width: canvasDim.width || "auto", height: canvasDim.height || "auto" }}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          <canvas ref={canvasRef} className="block pointer-events-none" />

          {/* Render Annotations (Vectors) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            <g style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}>
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
                if (ann.type === "whiteout" && ann.x !== undefined) {
                  return <rect key={ann.id} x={ann.x} y={ann.y} width={ann.w} height={ann.h} fill="#ffffff" stroke="none" opacity={ann.opacity} />;
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
              {isDrawing && drawStart && drawCurrent && tool === "whiteout" && (
                <rect x={Math.min(drawStart.x, drawCurrent.x)} y={Math.min(drawStart.y, drawCurrent.y)} width={Math.abs(drawCurrent.x - drawStart.x)} height={Math.abs(drawCurrent.y - drawStart.y)} fill="#ffffff" stroke="#ccc" strokeWidth={1} strokeDasharray="4" />
              )}
              {isDrawing && drawStart && drawCurrent && tool === "ellipse" && (
                <ellipse cx={Math.min(drawStart.x, drawCurrent.x) + Math.abs(drawCurrent.x - drawStart.x)/2} cy={Math.min(drawStart.y, drawCurrent.y) + Math.abs(drawCurrent.y - drawStart.y)/2} rx={Math.abs(drawCurrent.x - drawStart.x)/2} ry={Math.abs(drawCurrent.y - drawStart.y)/2} fill="none" stroke={currentColor} strokeWidth={currentStrokeW} />
              )}
            </g>
          </svg>

          {/* Draggable Overlays (Text / Images / Signatures) */}
          {pageAnns.filter(a => a.type === "text" || a.type === "image").map(ann => (
            <DraggableAnnotation 
              key={ann.id} 
              ann={ann} 
              scale={scale} 
              tool={tool} 
              selectedAnnId={selectedAnnId} 
              setSelectedAnnId={setSelectedAnnId} 
              updateAnn={updateAnn} 
              deleteAnn={deleteAnn} 
              saveHistory={saveHistory} 
              annotations={annotations} 
            />
          ))}
        </div>
      </main>

      {/* Signature Modal (3-Way) */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121826] rounded-3xl w-full max-w-xl overflow-hidden border border-slate-700 shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h3 className="text-xl font-bold text-white">Create Signature</h3>
              <button onClick={() => setIsSignModalOpen(false)} className="text-slate-400 hover:text-white p-1 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 px-6 pt-4 gap-6">
              {[
                { id: "draw", label: "Draw" },
                { id: "type", label: "Type" },
                { id: "upload", label: "Upload" },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setSignTab(tab.id as any)}
                  className={`pb-3 text-sm font-bold transition-colors border-b-2 ${signTab === tab.id ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 bg-[#0B0F19]">
              
              {signTab === "draw" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {["#000000", "#1d4ed8", "#b91c1c"].map(c => (
                      <button key={c} onClick={() => setCurrentColor(c)} className={`w-8 h-8 rounded-full border-2 ${currentColor === c ? "border-white" : "border-transparent"}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div 
                    ref={signCanvasRef}
                    className="w-full h-48 bg-white rounded-2xl cursor-crosshair relative overflow-hidden shadow-inner border border-slate-300"
                    onMouseDown={onSignPointerDown}
                    onMouseMove={onSignPointerMove}
                    onMouseUp={onSignPointerUp}
                    onMouseLeave={onSignPointerUp}
                    onTouchStart={onSignPointerDown}
                    onTouchMove={onSignPointerMove}
                    onTouchEnd={onSignPointerUp}
                  >
                    <div className="absolute inset-x-8 bottom-12 border-b-2 border-dashed border-slate-200 pointer-events-none" />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {signStrokes.map((stroke, i) => (
                        <path key={i} d={pathD(stroke)} fill="none" stroke={currentColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      ))}
                      {isSignDrawing && signStroke.length > 0 && (
                        <path d={pathD(signStroke)} fill="none" stroke={currentColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                  </div>
                </div>
              )}

              {signTab === "type" && (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Type your name here..." 
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    className="w-full bg-white text-black px-4 py-4 rounded-xl text-xl border-none outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all"
                  />
                  <div className="flex gap-2">
                    {["#000000", "#1d4ed8", "#b91c1c"].map(c => (
                      <button key={c} onClick={() => setCurrentColor(c)} className={`w-8 h-8 rounded-full border-2 ${currentColor === c ? "border-white" : "border-transparent"}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "var(--font-caveat)", name: "Caveat", label: "Cursive 1" },
                      { id: "var(--font-pacifico)", name: "Pacifico", label: "Cursive 2" },
                      { id: "var(--font-inter)", name: "Inter", label: "Standard" }
                    ].map(font => (
                      <button 
                        key={font.id}
                        onClick={() => setSignFont(font.id)}
                        className={`p-4 rounded-xl border text-center transition-all bg-white text-black ${signFont === font.id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-200"}`}
                        style={{ fontFamily: font.id }}
                      >
                        <span className="text-xl">{typedSignature || "Signature"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {signTab === "upload" && (
                <div className="h-48 border-2 border-dashed border-slate-600 hover:border-indigo-500 bg-slate-800/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                  <input type="file" accept="image/png, image/jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleSignatureUpload} />
                  <Upload size={32} className="text-indigo-400 mb-3" />
                  <p className="text-white font-bold">Click or drag image to upload</p>
                  <p className="text-slate-400 text-sm mt-1">PNG or JPEG, transparent background recommended</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-800">
                <button onClick={() => { setSignStrokes([]); setTypedSignature(""); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  Clear
                </button>
                <button 
                  onClick={handleCreateSignature} 
                  disabled={
                    (signTab === "draw" && signStrokes.length === 0) || 
                    (signTab === "type" && !typedSignature) ||
                    (signTab === "upload") // upload handles itself directly
                  } 
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Create
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
