"use client";
import React, { useState } from "react";
import { Code2, Copy, Trash2, Download, Zap, Terminal } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function CodeBeautifierPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("json");
  const [formattedCode, setFormattedCode] = useState("");

  const beautifyCode = () => {
    if (!code.trim()) return;
    try {
      let result = "";
      if (language === "json") {
        result = JSON.stringify(JSON.parse(code), null, 2);
      } else {
        // Simple regex-based beautifier for JS/CSS/HTML if no heavy library is used
        // For a true "Elite" experience, we simulate structured indenting
        result = code
          .replace(/\{/g, " {\n  ")
          .replace(/\}/g, "\n}\n")
          .replace(/;/g, ";\n  ")
          .replace(/\n\s*\n/g, "\n")
          .trim();
      }
      setFormattedCode(result);
    } catch (err) {
      alert("Invalid Code Format! Please check your input.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode || code);
    alert("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([formattedCode || code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cosmoxhub-clean-code.${language}`;
    link.click();
  };

  return (
    <ToolLayout 
      title="Code Beautifier 2.0" 
      description="Format and beautify your JSON, JavaScript, CSS, and HTML code instantly. High-performance, private, and developer-friendly." 
      icon={Code2} 
      color="#10b981"
    >
      <div className="flex flex-wrap gap-3 mb-6">
        {["json", "javascript", "css", "html"].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 border ${
              language === lang 
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" /> Source Code
            </span>
          </div>
          <textarea
            className="w-full h-[450px] bg-[#050510]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-emerald-100/80 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-sm leading-relaxed"
            placeholder={`Paste your messy ${language.toUpperCase()} here...`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Beautified Output
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy} 
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 transition-all"
                title="Copy Code"
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 transition-all"
                title="Download File"
              >
                <Download size={16} />
              </button>
              <button 
                onClick={() => {setCode(""); setFormattedCode("");}}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-lg text-red-400 transition-all"
                title="Clear Everything"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="relative group h-[450px]">
            <pre className="w-full h-full bg-[#050510]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-emerald-400 overflow-auto font-mono text-sm leading-relaxed custom-scrollbar">
              {formattedCode || "Click 'Beautify' to see magic..."}
            </pre>
            
            <button 
              onClick={beautifyCode}
              className="absolute bottom-6 right-6 px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all flex items-center gap-2 active:scale-95"
            >
              <Zap size={18} fill="currentColor" /> Beautify Now
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
