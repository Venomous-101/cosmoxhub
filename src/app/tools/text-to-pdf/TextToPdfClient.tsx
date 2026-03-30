"use client";
import { useState } from "react";
import {
  FileDown, FileText, Settings, Type, Layout, Sparkles,
  ShieldCheck, Zap, Monitor, Bold, Italic, AlignLeft,
  AlignCenter, AlignRight, Underline, HelpCircle
} from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion } from "framer-motion";

type FontType = "TimesRoman" | "Helvetica" | "Courier";
type Orientation = "portrait" | "landscape";
type Alignment = "left" | "center" | "right";

interface TextSegment {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export default function TextToPdfClient() {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(50);
  const [fontType, setFontType] = useState<FontType>("Helvetica");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [alignment, setAlignment] = useState<Alignment>("left");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lineSpacing, setLineSpacing] = useState(1.5);

  const guideSections = [
    {
      title: "How to Use (Step-by-Step)",
      content: "1. Type or paste your content into the 'Document Workspace'. 2. Use the toolbar to apply **bold**, *italic*, or __underline__ formatting. 3. Adjust the font family, size, and line spacing in the 'Document Engine'. 4. Set your preferred page orientation and margins. 5. Click 'Export PDF' to download your professional document instantly.",
      icon: HelpCircle
    },
    {
      title: "Rich Text Formatting",
      content: "Our engine supports markdown-inspired syntax. Use double asterisks for bold, single asterisks for italic, and double underscores for underlining. This allows you to create structured documents that stand out.",
      icon: Type
    },
    {
      title: "Custom Layouts",
      content: "Tailor your document to your needs. Switch between Portrait and Landscape modes, and fine-tune margins to ensure your text fits perfectly on a standard A4 page.",
      icon: Layout
    },
    {
      title: "100% Client-Side Privacy",
      content: "Your data never leaves your machine. The PDF is assembled entirely within your browser's memory using our high-performance engine, ensuring total security for your private drafts.",
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      question: "Are there any file size limits?",
      answer: "No. Since the tool runs in your browser, the only limit is your device's memory. You can generate documents as long as your text requires."
    },
    {
      question: "Does it support international characters?",
      answer: "We support standard Latin character sets in our Sans, Serif, and Mono fonts. This covers the majority of European and Western languages."
    },
    {
      question: "Is the generated PDF compatible with Adobe Reader?",
      answer: "Yes, our PDFs follow the standard PDF specification and are compatible with all major readers, including Adobe Acrobat, Chrome PDF Viewer, and mobile apps."
    }
  ];

  const parseText = (raw: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|[^*_]+)/g;
    const matches = raw.match(regex) || [raw];
    for (const part of matches) {
      if (part.startsWith("**") && part.endsWith("**")) {
        segments.push({ text: part.slice(2, -2), bold: true, italic: false, underline: false });
      } else if (part.startsWith("*") && part.endsWith("*")) {
        segments.push({ text: part.slice(1, -1), bold: false, italic: true, underline: false });
      } else if (part.startsWith("__") && part.endsWith("__")) {
        segments.push({ text: part.slice(2, -2), bold: false, italic: false, underline: true });
      } else {
        segments.push({ text: part, bold: false, italic: false, underline: false });
      }
    }
    return segments;
  };

  const generatePdf = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const pageW = orientation === "portrait" ? 595.27 : 841.89;
      const pageH = orientation === "portrait" ? 841.89 : 595.27;

      const fonts = {
        regular: await pdfDoc.embedFont(
          fontType === "Helvetica" ? StandardFonts.Helvetica :
          fontType === "Courier" ? StandardFonts.Courier : StandardFonts.TimesRoman
        ),
        bold: await pdfDoc.embedFont(
          fontType === "Helvetica" ? StandardFonts.HelveticaBold :
          fontType === "Courier" ? StandardFonts.CourierBold : StandardFonts.TimesRomanBold
        ),
        italic: await pdfDoc.embedFont(
          fontType === "Helvetica" ? StandardFonts.HelveticaOblique :
          fontType === "Courier" ? StandardFonts.CourierOblique : StandardFonts.TimesRomanItalic
        ),
        boldItalic: await pdfDoc.embedFont(
          fontType === "Helvetica" ? StandardFonts.HelveticaBoldOblique :
          fontType === "Courier" ? StandardFonts.CourierBoldOblique : StandardFonts.TimesRomanBoldItalic
        ),
      };

      let page = pdfDoc.addPage([pageW, pageH]);
      const maxWidth = pageW - margin * 2;
      const lineH = fontSize * lineSpacing;
      let currentY = pageH - margin;

      const addNewPage = () => {
        page = pdfDoc.addPage([pageW, pageH]);
        currentY = pageH - margin;
      };

      const lines = text.split("\n");

      for (const rawLine of lines) {
        if (currentY < margin + lineH) addNewPage();

        if (rawLine.trim() === "") {
          currentY -= lineH;
          continue;
        }

        const segments = parseText(rawLine);
        type Word = { word: string; seg: TextSegment };
        const words: Word[] = [];
        for (const seg of segments) {
          const ws = seg.text.split(/\s+/).filter(Boolean);
          for (const w of ws) {
            words.push({ word: w, seg });
          }
        }

        let currentWords: Word[] = [];

        const drawLine = (wordList: Word[]) => {
          if (wordList.length === 0) return;
          const lineText = wordList.map(w => w.word).join(" ");
          const totalW = fonts.regular.widthOfTextAtSize(lineText, fontSize);
          let startX = margin;
          if (alignment === "center") startX = (pageW - totalW) / 2;
          else if (alignment === "right") startX = pageW - margin - totalW;

          let xCursor = startX;
          for (let wi = 0; wi < wordList.length; wi++) {
            const { word, seg } = wordList[wi];
            const font = seg.bold && seg.italic ? fonts.boldItalic :
                         seg.bold ? fonts.bold :
                         seg.italic ? fonts.italic : fonts.regular;
            const wordText = wi < wordList.length - 1 ? word + " " : word;
            const wWidth = font.widthOfTextAtSize(wordText, fontSize);
            page.drawText(wordText, { x: xCursor, y: currentY, size: fontSize, font, color: rgb(0.05, 0.05, 0.1) });
            if (seg.underline) {
              page.drawLine({ start: { x: xCursor, y: currentY - 1.5 }, end: { x: xCursor + wWidth, y: currentY - 1.5 }, thickness: 0.7, color: rgb(0.05, 0.05, 0.1) });
            }
            xCursor += wWidth;
          }
          currentY -= lineH;
          if (currentY < margin + lineH) addNewPage();
        };

        for (const wordObj of words) {
          const testLine = [...currentWords, wordObj].map(w => w.word).join(" ");
          const testW = fonts.regular.widthOfTextAtSize(testLine, fontSize);
          if (testW > maxWidth && currentWords.length > 0) {
            drawLine(currentWords);
            currentWords = [wordObj];
          } else {
            currentWords.push(wordObj);
          }
        }
        if (currentWords.length > 0) {
          drawLine(currentWords);
          currentWords = [];
        }
        currentY -= fontSize * 0.3;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `cosmoxhub-doc-${Date.now()}.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const insertMarkup = (tag: string) => {
    const el = document.getElementById("txt-pdf-editor") as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    const selected = text.slice(start, end) || "text";
    const before = text.slice(0, start), after = text.slice(end);
    const wrapped = `${tag}${selected}${tag}`;
    setText(before + wrapped + after);
    setTimeout(() => { el.selectionStart = start + tag.length; el.selectionEnd = start + tag.length + selected.length; el.focus(); }, 0);
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <ToolLayout
      title="Text to PDF - Free Online Utility Tool"
      description="Convert plain text into professional PDF documents instantly with our high-speed free online tool. Support for custom formatting and paper sizes."
      icon={FileText} color="#3b82f6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_2px_15px_rgba(59,130,246,0.4)]" />
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-blue-500/10 rounded-2xl"><Settings className="w-5 h-5 text-blue-500" /></div>
              <h3 className="text-xl font-black text-white tracking-tight">Document Engine</h3>
            </div>

            <div className="space-y-7">
              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Font Family</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ id: "Helvetica", l: "Sans" }, { id: "TimesRoman", l: "Serif" }, { id: "Courier", l: "Mono" }].map(f => (
                    <button key={f.id} onClick={() => setFontType(f.id as FontType)}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${fontType === f.id ? "bg-blue-500 text-white border-blue-500 shadow-lg" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"}`}>
                      {f.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Type size={11} className="text-blue-500" /> Font Size</label>
                  <span className="text-blue-400 font-mono text-xs font-bold">{fontSize}pt</span>
                </div>
                <input type="range" min="8" max="32" step="1" value={fontSize} onChange={(e) => setFontSize(+e.target.value)}
                  aria-label="Font size" title="Font size"
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Line Spacing</label>
                  <span className="text-blue-400 font-mono text-xs font-bold">{lineSpacing.toFixed(1)}×</span>
                </div>
                <input type="range" min="1" max="3" step="0.1" value={lineSpacing} onChange={(e) => setLineSpacing(+e.target.value)}
                  aria-label="Line spacing" title="Line spacing"
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Layout size={11} className="text-blue-500" /> Margin</label>
                  <span className="text-blue-400 font-mono text-xs font-bold">{margin}px</span>
                </div>
                <input type="range" min="10" max="100" step="5" value={margin} onChange={(e) => setMargin(+e.target.value)}
                  aria-label="Page margin" title="Page margin"
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>

              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Alignment</label>
                <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                  {[{ id: "left", icon: AlignLeft }, { id: "center", icon: AlignCenter }, { id: "right", icon: AlignRight }].map(a => (
                    <button key={a.id} onClick={() => setAlignment(a.id as Alignment)}
                      aria-label={`Align ${a.id}`} title={`Align ${a.id}`}
                      className={`flex items-center justify-center py-2.5 rounded-xl transition-all ${alignment === a.id ? "bg-blue-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                      <a.icon size={15} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Orientation</label>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                  {(["portrait", "landscape"] as Orientation[]).map(o => (
                    <button key={o} onClick={() => setOrientation(o)}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orientation === o ? "bg-blue-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                      {o.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generatePdf} disabled={!text.trim() || isGenerating}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:shadow-[0_0_50px_rgba(59,130,246,0.45)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:grayscale disabled:translate-y-0 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                {isGenerating ? <Zap size={16} className="animate-pulse" /> : <FileDown size={18} />}
                {isGenerating ? "Assembling PDF..." : "Export PDF"}
              </button>
            </div>
          </motion.div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 flex items-start gap-4">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">Your text is processed 100% locally. Zero server uploads. Military-grade privacy by design.</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm min-h-[600px] flex flex-col shadow-2xl hover:border-white/10 transition-all">

            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Monitor size={13} className="text-slate-500" />
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Document Workspace</span>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { icon: Bold, tag: "**", title: "Bold (**text**)" },
                  { icon: Italic, tag: "*", title: "Italic (*text*)" },
                  { icon: Underline, tag: "__", title: "Underline (__text__)" },
                ].map(btn => {
                  const Icon = btn.icon;
                  return (
                    <button key={btn.tag} onClick={() => insertMarkup(btn.tag)} title={btn.title}
                      className="p-2 bg-white/5 hover:bg-blue-500/20 border border-white/5 hover:border-blue-500/30 rounded-xl text-slate-500 hover:text-blue-400 transition-all">
                      <Icon size={14} />
                    </button>
                  );
                })}
                <div className="w-px h-5 bg-white/5 mx-1" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500/40" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                </div>
              </div>
            </div>

            <div className="px-8 py-3 border-b border-white/[0.03] flex items-center gap-6 bg-blue-500/[0.02]">
              {[{ tag: "**bold**", icon: Bold }, { tag: "*italic*", icon: Italic }, { tag: "__underline__", icon: Underline }].map(h => {
                const Icon = h.icon;
                return (
                  <span key={h.tag} className="flex items-center gap-1.5 text-[9px] text-slate-600 font-mono">
                    <Icon size={10} className="text-blue-500/40" /> {h.tag}
                  </span>
                );
              })}
            </div>

            <textarea
              id="txt-pdf-editor"
              className={`flex-1 w-full bg-transparent p-10 text-slate-200 outline-none resize-none leading-relaxed placeholder:text-slate-800 text-base
                ${fontType === "Courier" ? "font-mono" : fontType === "Helvetica" ? "font-sans" : "font-serif"}`}
              placeholder={"Start typing your document...\n\nUse **bold**, *italic*, __underline__ for rich formatting.\nEach new line becomes a paragraph in the PDF."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />

            <div className="px-8 py-4 border-t border-white/5 flex items-center justify-between text-[10px] font-medium text-slate-600 uppercase tracking-widest bg-white/[0.01]">
              <span className="flex items-center gap-2"><Sparkles size={11} className="text-blue-400" /> Ready for Export</span>
              <span className="font-mono">{wordCount} words · {charCount} chars</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SEO Enrichment Layer */}
      <div className="max-w-6xl mx-auto space-y-12 py-12 border-t border-white/5">
        <ToolGuide 
          toolName="Text to PDF" 
          sections={guideSections}
          faqs={faqs}
        />

        <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed italic">
            Documentation should be accessible, professional, and immutable. Our **Text to PDF - Free Online Utility Tool** is a streamlined solution for users who need to transform raw text into polished, shareable PDF documents. Whether you&apos;re a developer archiving logs, a writer preserving a draft, or a student formatting an assignment, our tool bridges the gap between simple text input and high-quality document output. By converting your content into the universally accepted PDF format, CosmoXHub ensures your message remains consistent across all devices and operating systems.
          </p>
          <p className="text-slate-400 leading-relaxed mt-4">
            The **Text to PDF** at CosmoXHub is engineered for speed and precision, offering a &apos;Zero-Configuration&apos; experience while maintaining elite performance. We understand that in a fast-paced digital environment, you need tools that work instantly without the overhead of heavy software suites. Our converter supports multi-page generation and preserves your text&apos;s structural flow perfectly. As a core part of the CosmoXHub PDF suite, this is a 100% free online tool that operates exclusively in your browser. This means your sensitive documents are never uploaded to a server, providing the ultimate layer of privacy and security for your professional data.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
