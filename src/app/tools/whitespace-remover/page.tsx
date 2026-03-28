"use client";

import { useState, useEffect } from "react";
import { 
  Eraser, 
  Copy, 
  Trash2, 
  Settings, 
  CheckCircle2, 
  Sparkles,
  Zap,
  AlignLeft,
  Scissors,
  Layers,
  Minimize2,
  Maximize2
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function WhitespaceRemoverPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ saved: 0 });

  const cleanText = (mode: "all" | "lines" | "double" | "single-line") => {
    let originalLength = text.length;
    let result = text;

    switch (mode) {
      case "all":
        result = text.replace(/\s+/g, ' ').trim();
        break;
      case "lines":
        result = text.split('\n').filter(line => line.trim()).join('\n');
        break;
      case "double":
        result = text.replace(/ +(?= )/g, '');
        break;
      case "single-line":
        result = text.replace(/\r?\n|\r/g, " ").replace(/\s+/g, ' ').trim();
        break;
    }

    setText(result);
    setStats({ saved: originalLength - result.length });
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Whitespace Remover",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Remove all redundant spaces",
       "Strip empty line breaks",
       "Convert multi-line to single-line",
       "Real-time space saving analytics",
       "Elite code-ready formatting"
    ]
  };

  return (
    <ToolLayout
      title="Elite Whitespace Remover"
      description="Clean and compress your text or code. Strip redundant spaces and line breaks with our high-precision elite engine."
      icon={Eraser}
      color="#10b981"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Editor */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[3rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-4 shadow-2xl relative min-h-[450px] flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <Scissors size={16} className="text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cleaner Workspace</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setText("")}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
                        title="Reset"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg ${
                            copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-500 text-black border-emerald-500/20 hover:scale-[1.02] active:scale-95 shadow-emerald-500/20"
                        } border`}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "SECURED" : "SCRAPE CLEAN TEXT"}
                    </button>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your source code or text for elite cleaning..."
                className="flex-1 w-full bg-transparent p-8 text-slate-300 font-medium leading-relaxed resize-none outline-none selection:bg-emerald-500/30 font-mono text-base placeholder:text-slate-800"
              />

              <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">
                    Real-time Filtering Mode Active
                </div>
                <div className="flex gap-4">
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{stats.saved} Chars Excised</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_2px_15px_rgba(16,185,129,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Cleaning Logic</h3>
            </div>

            <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-4 italic">Excise Presets</label>
                
                <button
                    onClick={() => cleanText("all")}
                    className="w-full text-left p-4 rounded-[1.25rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Layers size={14} className="text-slate-600 group-hover:text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Strip All Spaces</span>
                    </div>
                </button>

                <button
                    onClick={() => cleanText("lines")}
                    className="w-full text-left p-4 rounded-[1.25rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Minimize2 size={14} className="text-slate-600 group-hover:text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Remove Empty Lines</span>
                    </div>
                </button>

                <button
                    onClick={() => cleanText("double")}
                    className="w-full text-left p-4 rounded-[1.25rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Maximize2 size={14} className="text-slate-600 group-hover:text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Single Space Only</span>
                    </div>
                </button>

                <button
                    onClick={() => cleanText("single-line")}
                    className="w-full text-left p-4 rounded-[1.25rem] bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <AlignLeft size={14} className="text-emerald-500 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 group-hover:text-emerald-400">Force Single Line</span>
                    </div>
                </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 items-start relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    <Zap size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-emerald-500/80 font-bold leading-tight uppercase relative z-10">
                        Optimized for minifying text for storage or API payloads.
                    </p>
                </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" /> Technology
            </h4>
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Uses recursive regex pattern matching to identify and destroy hidden non-breaking spaces and redundant line termination characters.
            </p>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
