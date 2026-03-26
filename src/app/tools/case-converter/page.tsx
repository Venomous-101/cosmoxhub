"use client";
import { useState } from "react";
import { CaseSensitive, Copy, Check } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState("");

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(() => setCopied(""), 1500);
  };

  const converters = [
    { label: "UPPERCASE", fn: (t: string) => t.toUpperCase(), key: "upper" },
    { label: "lowercase", fn: (t: string) => t.toLowerCase(), key: "lower" },
    { label: "Title Case", fn: (t: string) => t.replace(/\b\w/g, c => c.toUpperCase()), key: "title" },
    { label: "Sentence case", fn: (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(), key: "sentence" },
    { label: "aLtErNaTe", fn: (t: string) => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""), key: "alt" },
    { label: "Reverse Text", fn: (t: string) => t.split("").reverse().join(""), key: "reverse" },
  ];

  return (
    <ToolLayout title="Case Converter" description="Convert text to uppercase, lowercase, title case, sentence case or any other format instantly." icon={CaseSensitive} color="#6366f1">
      <textarea 
        className="input-field w-full min-h-[160px] bg-[#050510] border border-indigo-500/20 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors resize-y" 
        placeholder="Type or paste your text here..."
        title="Input text for case conversion"
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />

      {text && (
        <div className="mt-5 flex flex-col gap-3">
          {converters.map(({ label, fn, key }) => (
            <div key={key} className="card p-4 flex items-center gap-4 bg-[#050510] border border-indigo-500/10 rounded-xl hover:border-indigo-500/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">{label}</div>
                <div className="text-slate-100 text-sm break-words whitespace-pre-wrap">{fn(text)}</div>
              </div>
              <button 
                onClick={() => copy(fn(text), key)}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors ${copied === key ? 'text-emerald-500 bg-emerald-500/10' : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10'}`}
                title={`Copy ${label} result`}
                aria-label={`Copy ${label} result`}
              >
                {copied === key ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
