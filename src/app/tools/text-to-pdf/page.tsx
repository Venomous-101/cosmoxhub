"use client";
import { useState } from "react";
import { FileDown, FileText, Settings, Type, Layout } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";

export default function TextToPdfPage() {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      const maxWidth = width - margin * 2;
      const startY = height - margin;
      let currentY = startY;

      // Simple line wrapping
      const words = text.split(/\s+/);
      let currentLine = "";
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const testLineWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
        
        if (testLineWidth > maxWidth) {
          page.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          currentY -= fontSize + 5;
          currentLine = word;

          if (currentY < margin) {
            page = pdfDoc.addPage();
            currentY = startY;
          }
        } else {
          currentLine = testLine;
        }
      }

      // Draw last line
      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cosmoxhub_document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout 
      title="Text to PDF Converter" 
      description="Quickly convert plain text into a professional PDF document. Perfect for notes, simple documents, and reports." 
      icon={FileText} 
      color="#3b82f6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-0 overflow-hidden min-h-[500px] flex flex-col">
            <div className="bg-slate-800/50 px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Content Editor</span>
              <span className="text-xs text-slate-500">{text.length || 0} characters</span>
            </div>
            <textarea 
              className="flex-1 w-full bg-transparent p-6 text-slate-200 outline-none resize-none font-serif leading-relaxed text-lg"
              placeholder="Start typing or paste your content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="card p-6 border-white/10">
            <h3 className="flex items-center gap-2 text-indigo-400 font-semibold mb-6">
              <Settings size={18} /> DOCUMENT SETTINGS
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Type size={16} className="text-slate-400" /> Font Size
                  </label>
                  <span className="text-indigo-400 font-mono text-sm">{fontSize}px</span>
                </div>
                <input 
                  type="range" min="8" max="24" step="1" 
                  aria-label="Font Size"
                  className="w-full accent-indigo-500 cursor-pointer"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Layout size={16} className="text-slate-400" /> Margins
                  </label>
                  <span className="text-indigo-400 font-mono text-sm">{margin}px</span>
                </div>
                <input 
                  type="range" min="20" max="100" step="5" 
                  aria-label="Margins"
                  className="w-full accent-indigo-500 cursor-pointer"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <button 
                onClick={generatePdf}
                disabled={!text.trim() || isGenerating}
                className="w-full btn-primary py-4 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
              >
                <FileDown size={20} />
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
            <h4 className="text-indigo-400 text-sm font-bold mb-2 flex items-center gap-2">
              <FileText size={14} /> PRIVACY FIRST
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your text never leaves your device. The PDF is generated entirely in your browser using client-side encryption. Safe, secure, and lightning fast.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
