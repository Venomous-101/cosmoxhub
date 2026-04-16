"use client";

import { useState } from "react";
import { 
  Copy, 
  Trash2, 
  AlignLeft,
  CheckCircle2,
  HelpCircle,
  Zap,
  Maximize,
  Type
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
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

export default function WordCounterClient() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Paste your content into the large 'Text Input' area. 2. Statistics will update instantly as you type. 3. Look at the status deck below to see Word, Character, and Sentence counts. 4. Use the 'Copy Text' button to export your content if needed. 5. Click the trash icon to clear the workspace for new content.",
      icon: HelpCircle
    },
    {
      title: "Reading & Speaking Time",
      content: "We provide estimations based on average adult reading speeds (225 words per minute) and speaking speeds (140 words per minute). This is essential for speechwriters and content marketers aiming for specific audience engagement durations.",
      icon: Zap
    },
    {
      title: "Structural Density Analysis",
      content: "Our engine analyzes sentence and paragraph breaks to give you a structural overview. Maintaining a balanced density of sentences per paragraph is key for readability and SEO ranking.",
      icon: Maximize
    },
    {
      title: "Zero-Latency Privacy",
      content: "Unlike other tools, your text never leaves your computer. All counts and calculations are performed in your browser's RAM, ensuring your sensitive drafts or proprietary code aren't logged on any server.",
      icon: Type
    }
  ];

  const faqs = [
    {
      question: "Are spaces included in the character count?",
      answer: "We provide both! The 'Chars' metric includes every single character including spaces, while 'No Space' specifically excludes white space for strict drafting requirements."
    },
    {
      question: "What is the maximum text limit?",
      answer: "Since the tool runs entirely in your browser, the limit is governed by your device's memory. You can typically process hundreds of thousands of words without any lag."
    },
    {
      question: "How are sentences calculated?",
      answer: "Sentences are identified using punctuation delimiters (. ! ?) combined with line breaks. This provides a realistic count for structured prose."
    }
  ];

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

  return (
    <ToolLayout
      title="Word Counter - Free Online Utility Tool"
      description="Calculate word count, character density, and structural metrics in real-time with our high-speed free online tool. 100% private."
      icon={AlignLeft}
      color="#8b5cf6"
    >
      <div className="space-y-8 max-w-6xl mx-auto">
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
        >
             <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl relative min-h-[350px] flex flex-col">
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

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <MetricCard label="Words" value={stats.words} />
            <MetricCard label="Chars" value={stats.chars} />
            <MetricCard label="No Space" value={stats.charsNoSpaces} />
            <MetricCard label="Paragraphs" value={stats.paragraphs} />
            <MetricCard label="Sentences" value={stats.sentences} />
            <MetricCard label="Reading" value={stats.readingTime.value} unit={stats.readingTime.unit} />
            <MetricCard label="Speaking" value={stats.speakingTime.value} unit={stats.speakingTime.unit} />
        </div>

        {/* SEO Enrichment Layer */}
        <div className="space-y-12 py-12 border-t border-white/5">
          <ToolGuide 
            toolName="Word Counter" 
            sections={guideSections}
            faqs={faqs}
          />

          <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
            <p className="text-slate-400 leading-relaxed italic">
              Precision in writing starts with understanding your constraints. Our **Word Counter - Free Online Utility Tool** is the definitive resource for authors, students, and SEO professionals who need granular control over their content. Whether you are drafting a social media post with strict character limits, an academic essay requiring a specific word count, or professional copy where reading time is critical, CosmoxHub provides instantaneous, multi-dimensional text analysis.
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              The **Word Counter** at CosmoxHub goes beyond simple counting. It offers a sophisticated breakdown of your text&apos;s structure, including sentence density, paragraph counts, and estimated speaking speeds. Designed with a privacy-first architecture, all text remains locally in your browser; we never store or transmit your drafts. It is the ultimate free online tool for anyone looking to refine their writing process, optimize content for search engines, and ensure every word carries its weight.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
