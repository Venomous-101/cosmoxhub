"use client";
import React, { useState, useEffect } from "react";
import { Code2, Copy, Trash2, Download, Zap, Terminal, Sparkles, AlertCircle, Check } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

// Client-side libraries
let beautify: any;

export default function CodeBeautifierPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("json");
  const [formattedCode, setFormattedCode] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Dynamically load js-beautify to keep initial bundle light
    import("js-beautify").then((module) => {
      beautify = module;
    });
  }, []);

  const handleBeautify = () => {
    if (!code.trim() || !beautify) return;
    setError("");
    
    try {
      let result = "";
      const options = {
        indent_size: 2,
        space_in_empty_paren: true,
        preserve_newlines: true
      };

      switch (language) {
        case "json":
          result = JSON.stringify(JSON.parse(code), null, 2);
          break;
        case "javascript":
          result = beautify.js(code, options);
          break;
        case "css":
          result = beautify.css(code, options);
          break;
        case "html":
          result = beautify.html(code, options);
          break;
        default:
          result = code;
      }
      setFormattedCode(result);
    } catch (err: any) {
      setError("Invalid code format! Please check your source.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode || code);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedCode || code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const extension = language === "javascript" ? "js" : language;
    link.download = `cosmoxhub-elite-code.${extension}`;
    link.click();
  };

  return (
    <ToolLayout 
      title="Code Beautifier Elite" 
      description="Professional-grade formatting for JSON, JS, CSS, and HTML. 100% Client-Side. Clean, readable, and perfectly indented code in seconds." 
      icon={Code2} 
      color="#10b981"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Settings */}
        <div className="lg:col-span-3 space-y-6">
            <div className="p-6 bg-[#050510]/60 border border-white/5 rounded-3xl">
                <h4 className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                    <Sparkles size={14} className="text-emerald-400" /> Language
                </h4>
                <div className="space-y-2">
                    {["json", "javascript", "css", "html"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {setLanguage(lang); setFormattedCode(""); setError("");}}
                        className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold transition-all border ${
                          language === lang 
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10" 
                            : "bg-white/5 border-transparent text-slate-500 hover:bg-white/10"
                        }`}
                      >
                        {lang.toUpperCase()}
                        {language === lang && <Check size={14} className="float-right mt-0.5" />}
                      </button>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                <div className="text-[10px] text-emerald-400 font-black uppercase mb-2 tracking-widest">Developer Logic</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                   We use standard indentation and spacing rules to ensure your code matches global professional conventions.
                </p>
            </div>
        </div>

        {/* Main Editor Section */}
        <div className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-glow">
                  <Terminal size={14} className="text-emerald-500" /> RAW INPUT
                </span>
                <button 
                   onClick={() => {setCode(""); setFormattedCode(""); setError("");}}
                   className="text-[10px] font-bold text-red-400/60 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                   <Trash2 size={12} /> Clear
                </button>
              </div>
              <textarea
                className="w-full h-[500px] bg-[#050510]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 text-emerald-500/90 focus:outline-none focus:border-emerald-500/30 transition-all font-mono text-sm leading-relaxed custom-scrollbar placeholder:text-slate-700"
                placeholder={`Paste messy ${language.toUpperCase()} here...`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" /> ELITE OUTPUT
                </span>
                <div className="flex gap-4">
                  <button 
                    onClick={handleCopy} 
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${isCopying ? "text-emerald-400" : "text-slate-500 hover:text-white"}`}
                    title="Copy to Clipboard"
                  >
                    {isCopying ? <Check size={12} /> : <Copy size={12} />}
                    {isCopying ? "COPIED" : "COPY"}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-slate-500 hover:text-white transition-all"
                    title="Download Clean File"
                  >
                    <Download size={12} /> DOWNLOAD
                  </button>
                </div>
              </div>
              <div className="relative h-[500px]">
                <pre className="w-full h-full bg-[#050510]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-emerald-400 overflow-auto font-mono text-sm leading-relaxed custom-scrollbar selection:bg-emerald-500/30">
                  {formattedCode || (error ? <span className="text-red-400 flex items-center gap-2"><AlertCircle size={14} /> {error}</span> : "Ready for magic...")}
                </pre>
                
                <button 
                  onClick={handleBeautify}
                  disabled={!code.trim()}
                  className="absolute bottom-6 right-6 px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl shadow-[0_4px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_50px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-20 disabled:translate-y-0 disabled:shadow-none active:scale-95 z-20"
                >
                  <Zap size={20} fill="currentColor" /> BEAUTIFY ELITE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
