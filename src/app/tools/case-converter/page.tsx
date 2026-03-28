"use client";

import { useState, useEffect } from "react";
import { 
  Type, 
  Copy, 
  Trash2, 
  Settings, 
  CheckCircle2, 
  Sparkles,
  Zap,
  AlignLeft,
  ChevronRight,
  RefreshCcw,
  ZapOff
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [transformation, setTransformation] = useState<string>("Original");

  const updateText = (newText: string, label: string) => {
    setText(newText);
    setTransformation(label);
  };

  const toSentence = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitle = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toSnake = (str: string) => {
    return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map(x => x.toLowerCase())
      .join('_') || "";
  };

  const toCamel = (str: string) => {
    const s = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map(x => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase())
      .join('') || "";
    return s.charAt(0).toLowerCase() + s.slice(1);
  };

  const toPascal = (str: string) => {
    return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map(x => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase())
      .join('') || "";
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
    "name": "CosmoxHub Elite Case Converter",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert Sentence, Title, Lower, Upper",
      "Developer focus: snake_case, camelCase, PascalCase",
      "Real-time live formatting",
      "Batch text transformations",
      "Secure client-side execution"
    ]
  };

  return (
    <ToolLayout
      title="Elite Case Converter"
      description="Transform text between different casings. Perfect for developers, writers, and designers managing bulk content strings."
      icon={Type}
      color="#f59e0b"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start text-white">
        {/* Main Editor */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[3rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-4 shadow-2xl relative min-h-[450px] flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                        <AlignLeft size={16} className="text-amber-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{transformation}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setText("")}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
                        title="Wipe Session"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg ${
                            copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500 text-black border-amber-500/20 hover:scale-105 active:scale-95 shadow-amber-500/20"
                        } border`}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "SECURED" : "SCRAPE OUTPUT"}
                    </button>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your source text here for elite transformation..."
                className="flex-1 w-full bg-transparent p-8 text-slate-300 font-medium leading-relaxed resize-none outline-none selection:bg-amber-500/30 font-mono text-base placeholder:text-slate-700"
              />

              <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">
                    Elite Input Monitoring Active
                </div>
                <div className="flex gap-4">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{text.split(/\s+/).filter(w => w).length} Words</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{text.length} Assets</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_2px_15px_rgba(245,158,11,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-amber-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Image Logic</h3>
            </div>

            <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-4 italic">Standard Conventions</label>
                {[
                    { id: "UPPER", label: "UPPER CASE", fn: (s: string) => s.toUpperCase() },
                    { id: "lower", label: "lower case", fn: (s: string) => s.toLowerCase() },
                    { id: "Title", label: "Capitalize Words", fn: toTitle },
                    { id: "Sentence", label: "Sentence case", fn: toSentence }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => updateText(m.fn(text), m.label)}
                        className="w-full text-left p-4 rounded-[1.25rem] bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all group flex items-center justify-between animate-in slide-in-from-right-4 duration-500"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{m.label}</span>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                    </button>
                ))}

                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mt-8 mb-4 italic">Developer Suite</label>
                {[
                    { id: "snake", label: "snake_case", fn: toSnake },
                    { id: "camel", label: "camelCase", fn: toCamel },
                    { id: "pascal", label: "PascalCase", fn: toPascal }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => updateText(m.fn(text), m.label)}
                        className="w-full text-left p-4 rounded-[1.25rem] bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all group flex items-center justify-between"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 group-hover:text-amber-400">{m.label}</span>
                        <ChevronRight size={14} className="text-amber-900 group-hover:text-amber-500" />
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
                <button
                    onClick={() => updateText("", "Wiped")}
                    className="w-full py-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={12} /> Clear Session
                </button>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> Pro Insight
            </h4>
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Elite Engine uses complex tokenization to identify word-boundaries, ensuring clean transitions even with heavily specialized strings.
            </p>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
