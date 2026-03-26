"use client";
import { useState, useEffect } from "react";
import { AlignLeft, Copy, Check } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const words = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat"
];

const generateParagraph = (isFirst: boolean) => {
  let p = isFirst ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " : "";
  const length = Math.floor(Math.random() * 20) + 30; // 30-50 words
  for (let i = isFirst ? 8 : 0; i < length; i++) {
      p += words[Math.floor(Math.random() * words.length)] + " ";
  }
  p = p.trim() + ".";
  return p.charAt(0).toUpperCase() + p.slice(1);
};

export default function LoremIpsumPage() {
  const [paragraphs, setParagraphs] = useState(3);
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setText(Array.from({ length: paragraphs }, (_, i) => generateParagraph(i === 0)).join("\n\n"));
  }, [paragraphs]);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate dummy placeholder text for your mockups, designs, and prototypes instantly." icon={AlignLeft} color="#6366f1">
      <div className="card p-6 mb-6 flex flex-wrap gap-4 items-center bg-[#050510] border border-indigo-500/10 rounded-xl">
        <label htmlFor="paragraphs-count" className="text-slate-200 font-medium">Paragraphs:</label>
        <input 
          id="paragraphs-count"
          type="number" 
          min="1" 
          max="50" 
          title="Number of paragraphs to generate"
          value={paragraphs} 
          onChange={(e) => setParagraphs(Number(e.target.value) || 1)}
          className="input-field w-24 bg-[#050510] border border-indigo-500/20 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors" 
        />
          
        <button 
          onClick={copy} 
          className="btn-primary ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all w-fit bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_4px_20px_rgba(99,102,241,0.25)]" 
          title="Copy generated text"
        >
            {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Text</>}
        </button>
      </div>

      <div 
        className="input-field w-full min-h-[300px] bg-[#050510]/50 border border-indigo-500/10 rounded-xl p-6 text-slate-300 outline-none whitespace-pre-wrap leading-relaxed overflow-y-auto"
        title="Generated Lorem Ipsum text"
      >
        {text}
      </div>
    </ToolLayout>
  );
}
