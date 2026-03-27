"use client";
import { useState } from "react";
import { Code, Copy, Check, Trash2, AlignLeft, AlertCircle } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonFormatterPage() {
  const [json, setJson] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = (val: string) => {
    setJson(val);
    if (!val.trim()) {
      setFormatted("");
      setError("");
      return;
    }

    try {
      const parsed = JSON.parse(val);
      setFormatted(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e: unknown) {
      setFormatted("");
      setError(e instanceof Error ? e.message : "Invalid JSON format");
    }
  };

  const clearAll = () => {
    setJson("");
    setFormatted("");
    setError("");
  };

  const copyToClipboard = () => {
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="JSON Formatter & Validator" 
      description="Clean, prettify, and validate your JSON data instantly. A secure developer tool that works entirely in your browser." 
      icon={Code} 
      color="#10b981"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full h-[600px]">
        {/* Input Area */}
        <div className="card p-0 flex flex-col h-full border-white/5">
          <div className="bg-slate-800/50 px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider">INPUT RAW JSON</span>
            <button 
              onClick={clearAll}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
              title="Clear All"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea 
            className="flex-1 w-full bg-transparent p-6 text-slate-300 outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder='Paste your JSON here... { "key": "value" }'
            value={json}
            onChange={(e) => formatJson(e.target.value)}
          />
        </div>

        {/* Output Area */}
        <div className="card p-0 flex flex-col h-full border-indigo-500/20 bg-slate-900/50">
          <div className="bg-indigo-500/10 px-6 py-3 border-b border-indigo-500/20 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 tracking-wider flex items-center gap-2">
              <AlignLeft size={14} /> FORMATTED OUTPUT
            </span>
            <button 
              disabled={!formatted}
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-xs font-bold py-1.5 px-3 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 disabled:opacity-50 transition-all border border-indigo-500/30"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
          <div className="flex-1 relative overflow-hidden group">
            {error ? (
              <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center bg-rose-500/5">
                <AlertCircle className="text-rose-400 mb-4" size={40} />
                <h4 className="text-rose-400 font-bold mb-2">Invalid JSON Format</h4>
                <p className="text-xs text-rose-400/60 font-mono max-w-xs">{error}</p>
              </div>
            ) : formatted ? (
              <pre className="h-full p-6 overflow-auto text-emerald-400 font-mono text-sm leading-relaxed">
                {formatted}
              </pre>
            ) : (
              <div className="h-full flex flex-center items-center justify-center text-slate-600 opacity-50">
                <p className="text-sm">Prettified results will appear here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
