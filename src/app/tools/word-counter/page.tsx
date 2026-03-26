"use client";
import { useState } from "react";
import { Type } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(t => /[\p{L}\p{N}]/u.test(t)).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?\n]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const readTime = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

  const stats = [
    { label: "Words", value: words },
    { label: "Characters", value: chars },
    { label: "Chars (no spaces)", value: charsNoSpace },
    { label: "Sentences", value: sentences },
    { label: "Paragraphs", value: paragraphs },
    { label: "Read Time", value: `${readTime} min` },
  ];

  return (
    <ToolLayout title="Word & Character Counter" description="Count words, characters, sentences, paragraphs and reading time in real-time. Perfect for essays, articles, social media posts." icon={Type} color="#6366f1">
      {/* Stats row */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="card p-4 text-center bg-[#050510] border border-indigo-500/10 rounded-xl">
            <div className="font-space text-3xl font-bold text-indigo-500">{s.value}</div>
            <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <textarea
        className="input-field w-full min-h-[280px] bg-[#050510] border border-indigo-500/20 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors resize-y"
        placeholder="Start typing or paste your text here..."
        title="Input text to analyze word count"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {text && (
        <button 
          className="btn-secondary mt-4 px-5 py-2.5 rounded-lg font-medium text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all" 
          onClick={() => setText("")} 
          title="Clear all text"
        >
          Clear Text
        </button>
      )}
    </ToolLayout>
  );
}
