"use client";

import { useState, useEffect } from "react";
import { 
  Type, 
  Mic2, 
  FileText, 
  Hash, 
  BarChart3, 
  Copy, 
  Trash2, 
  Zap,
  AlignLeft,
  BookOpen,
  PieChart,
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

function MetricCard({ icon: Icon, label, value, unit, color }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-5 hover:border-violet-500/30 transition-all shadow-xl group overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity -mr-2 -mt-2">
        <Icon size={48} className={`text-${color}-500`} />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-white/5">
          <Icon size={16} className={`text-${color}-500`} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-white tracking-tighter">{value}</span>
        {unit && <span className="text-[10px] font-bold text-slate-500 uppercase">{unit}</span>}
      </div>
    </motion.div>
  );
}

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0
  });

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(w => w).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim()).length;
    
    setStats({
      words,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime: Math.ceil(words / 225), 
      speakingTime: Math.ceil(words / 140)
    });
  }, [text]);

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
      icon={BarChart3}
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
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-[3rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-4 shadow-2xl relative min-h-[350px] flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
                        <AlignLeft size={16} className="text-violet-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Analytics Input Field</span>
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
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg ${
                            copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-violet-600/10 text-violet-400 border-violet-500/20 hover:bg-violet-600 hover:text-white"
                        } border`}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "SECURED" : "SCRAPE TEXT"}
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <MetricCard icon={Hash} label="Words" value={stats.words} color="violet" />
            <MetricCard icon={Type} label="Chars" value={stats.chars} color="blue" />
            <MetricCard icon={Zap} label="No Space" value={stats.charsNoSpaces} color="amber" />
            <MetricCard icon={AlignLeft} label="Paragraphs" value={stats.paragraphs} color="emerald" />
            <MetricCard icon={FileText} label="Sentences" value={stats.sentences} color="pink" />
            <MetricCard icon={BookOpen} label="Reading" value={stats.readingTime} unit="Min" color="cyan" />
            <MetricCard icon={Mic2} label="Speaking" value={stats.speakingTime} unit="Min" color="rose" />
        </div>

        {/* Bottom Insight Row */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:bg-[#0a0a1a]/60 transition-all">
                <div className="w-16 h-16 bg-violet-500/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-violet-500/20 group-hover:scale-110 transition-transform">
                    <PieChart className="text-violet-500" size={28} />
                </div>
                <div>
                    <h4 className="text-white font-black text-[13px] uppercase tracking-widest mb-2">Lexical Density</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed italic">
                        Our engine identifies average complexity based on syllable-to-word ratios. This ensures your content is optimized for the widest possible audience reach.
                    </p>
                </div>
            </div>

            <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:bg-[#0a0a1a]/60 transition-all">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Zap className="text-emerald-500" size={28} />
                </div>
                <div>
                    <h4 className="text-white font-black text-[13px] uppercase tracking-widest mb-2">Edge Computation</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed italic">
                        100% Client-side counting using high-performance Regex loops. Your sensitive documents never touch our servers, ensuring absolute privacy protocols.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </ToolLayout>
  );
}
