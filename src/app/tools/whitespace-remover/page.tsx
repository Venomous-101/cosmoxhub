"use client";
import { useState } from "react";
import { RemoveFormatting, Copy, Check } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function WhitespaceRemoverPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const removeLeadingTrailing = (t: string) => t.split("\n").map(l => l.trim()).join("\n");
  const removeExtraSpaces = (t: string) => t.replace(/ +/g, " ");
  const removeBlankLines = (t: string) => t.split("\n").filter(l => l.trim()).join("\n");
  const removeAll = (t: string) => t.replace(/\s+/g, " ").trim();

  type Mode = "trimLines" | "extraSpaces" | "blankLines" | "all";
  const [mode, setMode] = useState<Mode>("trimLines");

  const fns: Record<Mode, (t: string) => string> = {
    trimLines: removeLeadingTrailing,
    extraSpaces: removeExtraSpaces,
    blankLines: removeBlankLines,
    all: removeAll,
  };

  const result = text ? fns[mode](text) : "";

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const modes: { key: Mode; label: string }[] = [
    { key: "trimLines", label: "Trim line spaces" },
    { key: "extraSpaces", label: "Remove extra spaces" },
    { key: "blankLines", label: "Remove blank lines" },
    { key: "all", label: "Remove all whitespace" },
  ];

  return (
    <ToolLayout title="Whitespace Remover" description="Remove extra whitespace, blank lines, and unnecessary spaces from any text instantly." icon={RemoveFormatting} color="#6366f1">
      <div className="flex flex-wrap gap-2 mb-5">
        {modes.map(m => (
          <button 
            key={m.key} 
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === m.key ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm" : "border-indigo-500/20 bg-transparent text-slate-400 hover:text-slate-200 hover:border-indigo-500/30"}`}
            title={`Select ${m.label} mode`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <textarea 
        className="input-field w-full min-h-[160px] bg-[#050510] border border-indigo-500/20 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors resize-y" 
        placeholder="Paste your text here..."
        title="Input text targeting whitespace removal"
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />

      {result && (
        <>
          <div className="mt-6 flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Result:</span>
            <button 
              onClick={copy} 
              className="btn-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all"
              title="Copy result"
            >
              {copied ? <><Check size={14} className="text-emerald-500" /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <textarea 
            className="input-field w-full min-h-[160px] bg-[#050510]/50 border border-indigo-500/10 rounded-xl p-4 text-slate-300 outline-none resize-y" 
            value={result} 
            title="Resulting text"
            readOnly 
          />
        </>
      )}
    </ToolLayout>
  );
}
