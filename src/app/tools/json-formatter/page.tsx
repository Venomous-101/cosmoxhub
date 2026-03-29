"use client";

import { useState, useCallback } from "react";
import { 
  Braces, 
  Trash2, 
  AlertCircle, 
  Settings, 
  Minimize,
  Maximize,
  ArrowRightLeft,
  FileCode,
  Zap,
  Sparkles
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion } from "framer-motion";

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const processJSON = useCallback((mode: "beautify" | "minify") => {
    if (!input.trim()) return;
    
    try {
      const parsed = JSON.parse(input);
      let result = "";
      
      if (mode === "beautify") {
        result = JSON.stringify(parsed, null, indentSize);
      } else {
        result = JSON.stringify(parsed);
      }
      
      setFormatted(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setFormatted("");
    }
  }, [input, indentSize]);

  const copyToClipboard = () => {
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite JSON Formatter & Validator",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperTool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Real-time JSON validation",
       "High-fidelity beautification",
       "Aggressive minification for APIs",
       "Elite collapsible code view",
       "Zero-latency client-side processing"
    ]
  };

  return (
    <ToolLayout
      title="Elite JSON Formatter"
      description="Validate, beautify, and minify JSON data. The ultimate elite workspace for developers seeking precision and speed."
      icon={Braces}
      color="#3b82f6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Workspace */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Input Pane */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col min-h-[500px] shadow-2xl relative"
            >
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <FileCode size={12} /> Raw Input
                    </span>
                    <button 
                        onClick={() => setInput("")} 
                        title="Clear Input"
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-600 hover:text-rose-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    title="JSON Input Area"
                    placeholder='{"key": "Paste raw JSON here..."}'
                    className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-slate-300 font-mono text-sm resize-none outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-800"
                />
            </motion.div>

            {/* Output Pane */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col min-h-[500px] shadow-2xl relative group"
            >
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Sparkles size={12} /> Formatted Output
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={copyToClipboard}
                            disabled={!formatted}
                            title="Copy Formated JSON"
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                copied ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-white/5 text-slate-400 border-white/10 hover:border-blue-500/30 hover:text-white"
                            } disabled:opacity-30`}
                        >
                            {copied ? "COPIED" : "COPY"}
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl p-6 overflow-auto relative">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                <AlertCircle className="text-rose-500" size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">Validation Error</h4>
                                <p className="text-[10px] text-rose-500 uppercase tracking-widest font-black max-w-[200px] leading-tight opacity-70">
                                    {error}
                                </p>
                            </div>
                        </div>
                    ) : formatted ? (
                        <pre className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                            {formatted}
                        </pre>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-20 group-hover:opacity-30 transition-opacity">
                            <ArrowRightLeft size={48} className="text-slate-500 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Awaiting Transformation</p>
                        </div>
                    )}
                </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_2px_15px_rgba(59,130,246,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-blue-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Parser Config</h3>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Tab Indentation</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[2, 4].map(size => (
                            <button
                                key={size}
                                onClick={() => setIndentSize(size)}
                                title={`Set Indent to ${size} Spaces`}
                                className={`py-2 rounded-xl text-[10px] font-black border transition-all ${
                                    indentSize === size ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20" : "bg-white/5 text-slate-500 border-white/5 hover:border-blue-500/30"
                                }`}
                            >
                                {size} SPACES
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 space-y-3">
                    <button
                        onClick={() => processJSON("beautify")}
                        title="Beautify JSON"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-black font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <Maximize size={16} className="group-hover:scale-110 transition-transform" /> Beautify JSON
                    </button>
                    
                    <button
                        onClick={() => processJSON("minify")}
                        title="Minify JSON"
                        className="w-full bg-white/5 border border-white/10 hover:border-blue-500/30 text-white font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <Minimize size={16} className="text-blue-500" /> Minify Content
                    </button>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 text-blue-500 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                        <Zap size={16} className="shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold uppercase leading-tight tracking-wider relative z-10">
                            Elite validation engine checks for syntax errors, missing commas, and redundant keys in real-time.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 rounded-3xl p-6 shadow-xl text-center">
            <h4 className="text-white font-bold text-sm mb-2">Dev Tip</h4>
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Minified JSON is 20-40% smaller in size, making it the elite choice for high-speed API data transfer.
            </p>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
