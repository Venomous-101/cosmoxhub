"use client";

import { useState } from "react";
import { 
  Copy, 
  Trash2, 
  AlignLeft,
  CheckCircle2
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit?: string;
  color: string;
}

function MetricCard({ label, value, unit }: Omit<MetricCardProps, 'icon' | 'color'>) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-violet-500/30 transition-all shadow-xl group overflow-hidden relative"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-white tracking-tighter">{value}</span>
        {unit && <span className="text-[10px] font-bold text-slate-500 uppercase">{unit}</span>}
      </div>
    </motion.div>
  );
}

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const words = text.trim().split(/\s+/).filter(w => w).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  // Improved sentence regex to handle newlines and common breaks
  const sentences = text.split(/[.!?\n]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  
  // Calculate exact time and format label
  const getReadableTime = (wordsCount: number, wpm: number) => {
    const totalMinutes = wordsCount / wpm;
    if (totalMinutes === 0) return { value: 0, unit: "Sec" };
    if (totalMinutes < 1) {
      return { value: Math.round(totalMinutes * 60), unit: "Sec" };
    }
    return { value: Number(totalMinutes.toFixed(1)), unit: "Min" };
  };

  const readingTime = getReadableTime(words, 225);
  const speakingTime = getReadableTime(words, 140);
  
  const stats = {
    words,
    chars,
    charsNoSpaces,
    sentences,
    paragraphs,
    readingTime,
    speakingTime
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
    "name": "CosmoxHub Elite Word Counter & Text Analytics",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Real-time word and character counting",
       "Reading and Speaking time estimations",
       "Paragraph and sentence extraction",
       "Privacy-focused text analysis",
       "Elite glassmorphic status deck"
    ]
  };

  return (
    <ToolLayout
      title="Elite Word Counter"
      description="Advanced text analytics for professionals. Track words, reading time, and structural density with our signature elite engine."
      icon={AlignLeft}
      color="#8b5cf6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Editor Zone */}
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
        >
             <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl relative min-h-[350px] flex flex-col">
               {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Text Input</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setText("")}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
                        title="Clear Workspace"
                        aria-label="Clear text"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        aria-label="Copy text to clipboard"
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                            copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-violet-600/10 text-violet-400 border-violet-500/20 hover:bg-violet-600 hover:text-white"
                        } border`}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "COPIED" : "COPY TEXT"}
                    </button>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your content here for deep word analysis..."
                aria-label="Text input for word counting"
                className="flex-1 w-full bg-transparent p-8 text-slate-300 font-medium leading-relaxed resize-none outline-none selection:bg-violet-500/30 font-sans text-lg placeholder:text-slate-800"
              />
            </div>
        </motion.div>

        {/* Analytics Deck */}
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <MetricCard label="Words" value={stats.words} />
            <MetricCard label="Chars" value={stats.chars} />
            <MetricCard label="No Space" value={stats.charsNoSpaces} />
            <MetricCard label="Paragraphs" value={stats.paragraphs} />
            <MetricCard label="Sentences" value={stats.sentences} />
            <MetricCard label="Reading" value={stats.readingTime.value} unit={stats.readingTime.unit} />
            <MetricCard label="Speaking" value={stats.speakingTime.value} unit={stats.speakingTime.unit} />
        </div>

      </div>
    </ToolLayout>
  );
}
