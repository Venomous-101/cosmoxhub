"use client";
import React, { useState, useMemo } from "react";
import { Type, Download, Trash2, Clock, Zap, BarChart3, Info } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return {
      words: 0,
      chars: 0,
      charsNoSpace: 0,
      sentences: 0,
      paragraphs: 0,
      readTime: 0,
      speakTime: 0,
      density: [] as { word: string; count: number; percent: string }[]
    };

    const wordsArray = trimmed.split(/\s+/).filter(t => /[\p{L}\p{N}]/u.test(t));
    const wordsCount = wordsArray.length;
    const charsCount = text.length;
    const charsNoSpaceCount = text.replace(/\s/g, "").length;
    const sentenceCount = text.split(/[.!?\n]+/).filter(s => s.trim().length > 0).length;
    const paragraphCount = text.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Averages: Reading ~200 WPM, Speaking ~130 WPM
    const readMinutes = wordsCount / 200;
    const speakMinutes = wordsCount / 130;

    // Keyword Density (Filter out digits and single chars for quality)
    const wordFreq: Record<string, number> = {};
    const stopWords = new Set(["the", "and", "a", "an", "is", "in", "it", "to", "for", "with", "on", "as", "at", "by", "this", "that", "of", "from"]);
    
    wordsArray.forEach(w => {
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lower.length > 2 && !stopWords.has(lower)) {
        wordFreq[lower] = (wordFreq[lower] || 0) + 1;
      }
    });

    const density = Object.entries(wordFreq)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / wordsCount) * 100).toFixed(1) + "%"
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      words: wordsCount,
      chars: charsCount,
      charsNoSpace: charsNoSpaceCount,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      readTime: readMinutes,
      speakTime: speakMinutes,
      density
    };
  }, [text]);

  const handleDownload = () => {
    const content = `CosmoxHub Word Counter Report\n\n` +
      `Stats:\n` +
      `- Words: ${stats.words}\n` +
      `- Characters: ${stats.chars}\n` +
      `- Characters (No Space): ${stats.charsNoSpace}\n` +
      `- Sentences: ${stats.sentences}\n` +
      `- Paragraphs: ${stats.paragraphs}\n` +
      `- Reading Time: ${Math.ceil(stats.readTime)} min\n` +
      `- Speaking Time: ${Math.ceil(stats.speakTime)} min\n\n` +
      `Text:\n${text}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cosmoxhub-report-${Date.now()}.txt`;
    link.click();
  };

  return (
    <ToolLayout 
      title="Word Counter Elite 2.0" 
      description="Advanced text analysis tool with keyword density, reading/speaking time, and SEO metrics. Accurate, private, and 100% free." 
      icon={Type} 
      color="#6366f1"
    >
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Words", value: stats.words, icon: Zap, color: "text-indigo-400" },
          { label: "Characters", value: stats.chars, icon: Type, color: "text-blue-400" },
          { label: "Sentences", value: stats.sentences, icon: BarChart3, color: "text-purple-400" },
          { label: "Paragraphs", value: stats.paragraphs, icon: Info, color: "text-pink-400" },
        ].map((s, i) => (
          <div key={i} className="group p-5 bg-[#050510]/60 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all duration-300">
            <div className={`p-2 w-fit rounded-lg bg-white/5 mb-3 group-hover:scale-110 transition-transform ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div className="font-space text-3xl font-black text-white">{s.value.toLocaleString()}</div>
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.1em] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Side */}
        <div className="flex-1">
          <div className="relative group">
            <textarea
              className="w-full min-h-[400px] bg-[#050510]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-slate-200 focus:outline-none focus:border-indigo-500/40 transition-all resize-y font-mono text-sm leading-relaxed shadow-2xl"
              placeholder="Paste your content here for elite analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            <div className="absolute bottom-4 right-4 flex gap-2">
              {text && (
                <>
                  <button 
                    onClick={() => setText("")}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all"
                    title="Clear All"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all"
                    title="Export Report"
                  >
                    <Download size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Side */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Time Analysis */}
          <div className="p-6 bg-[#050510]/60 border border-white/5 rounded-2xl">
            <h4 className="flex items-center gap-2 text-slate-300 text-sm font-bold uppercase tracking-widest mb-5">
              <Clock size={16} className="text-indigo-400" /> Time Metrics
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center group">
                <span className="text-slate-500 text-xs font-medium">Reading Time</span>
                <span className="text-indigo-300 font-space font-bold">{Math.ceil(stats.readTime)} min</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500/40 rounded-full" style={{ width: `${Math.min(100, stats.readTime * 10)}%` }} />
              </div>
              <div className="flex justify-between items-center group pt-2">
                <span className="text-slate-500 text-xs font-medium">Speaking Time</span>
                <span className="text-purple-300 font-space font-bold">{Math.ceil(stats.speakTime)} min</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500/40 rounded-full" style={{ width: `${Math.min(100, stats.speakTime * 10)}%` }} />
              </div>
            </div>
          </div>

          {/* Keyword Density Table */}
          <div className="p-6 bg-[#050510]/60 border border-white/5 rounded-2xl">
            <h4 className="flex items-center gap-2 text-slate-300 text-sm font-bold uppercase tracking-widest mb-5">
              <Zap size={16} className="text-amber-400" /> Top Keywords
            </h4>
            {stats.density.length > 0 ? (
              <div className="space-y-3">
                {stats.density.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <span className="text-slate-400 text-xs truncate max-w-[120px]">{item.word}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-[10px] font-mono">{item.count}x</span>
                      <span className="text-indigo-400 text-xs font-bold font-space min-w-[40px] text-right">{item.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-600 text-xs italic py-4 text-center">
                Analyze some text to see keywords...
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
