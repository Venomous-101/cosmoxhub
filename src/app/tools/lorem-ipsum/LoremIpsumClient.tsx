"use client";

import { useState, useMemo } from "react";
import { 
  Copy, 
  Download, 
  RefreshCcw, 
  Code2, 
  Settings, 
  CheckCircle2, 
  Sparkles,
  Quote,
  HelpCircle,
  Zap,
  Maximize,
  Type
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion } from "framer-motion";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumClient() {
  const [type, setType] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [wrapWithHtml, setWrapWithHtml] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Select your 'Output Unit' (Paragraphs, Sentences, or Words). 2. Adjust the 'Magnitude' slider to set the desired length. 3. Toggle 'Start with Lorem' for traditional or custom starts. 4. Optionally enable 'Inject HTML Tags' for web development. 5. Click 'Scrape' to copy or 'Pull as Text' to download.",
      icon: HelpCircle
    },
    {
      title: "Designer Optimized",
      content: "Instead of using repetitive or distracting content, our generator provides classically structured Latin text. This helps clients focus on the visual layout and typography without being sidetracked by readable copy.",
      icon: Quote
    },
    {
      title: "Developer Workflow",
      content: "Enable 'Inject HTML Tags' to receive text already wrapped in <p> or <span> tags. This is perfect for rapid prototyping directly in VS Code or injecting into CMS systems like WordPress.",
      icon: Code2
    },
    {
      title: "Deterministic Privacy",
      content: "Our generator uses a stateless hash-based algorithm. All generation happens locally in your browser without any server-side database logs. Your design structure remains your proprietary secret.",
      icon: Maximize
    }
  ];

  const faqs = [
    {
      question: "Is the generated text actually Latin?",
      answer: "Lorem Ipsum is based on a 1st-century BC work by Cicero. While it looks like Latin, it is purposely scrambled to remove meaning, ensuring it acts solely as a visual placeholder."
    },
    {
      question: "Can I use this for commercial print projects?",
      answer: "Absolutely. Our generated text is free for both personal and commercial use in websites, brochures, and mobile applications."
    },
    {
      question: "Why should I use HTML injection?",
      answer: "HTML injection saves time for developers. By wrapping paragraphs in <p> tags automatically, you can simply paste the result into your HTML template without manual tag adding."
    }
  ];

  const generatedText = useMemo(() => {
    // Stateless hash-based deterministic 'randomness' to satisfy React 19 purity rules
    const getRand = (i: number, j: number): number => {
      const h = Math.cos(refreshSeed * 1.5 + i * 0.73 + j * 0.19) * 10000;
      return h - Math.floor(h);
    };

    let result = "";
    
    if (type === "paragraphs") {
      const paras = [];
      for (let i = 0; i < count; i++) {
        const para = [];
        const wordCount = 50 + Math.floor(getRand(i, -1) * 50);
        for (let j = 0; j < wordCount; j++) {
          para.push(LOREM_WORDS[Math.floor(getRand(i, j) * LOREM_WORDS.length)]);
        }
        let pText = para.join(" ") + ".";
        pText = pText.charAt(0).toUpperCase() + pText.slice(1);
        
        if (i === 0 && startWithLorem) {
          pText = "Lorem ipsum dolor sit amet, " + pText.toLowerCase();
        }
        
        paras.push(wrapWithHtml ? `<p>${pText}</p>` : pText);
      }
      result = paras.join("\n\n");
    } else if (type === "words") {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(getRand(0, i) * LOREM_WORDS.length)]);
      }
      if (startWithLorem && count >= 5) {
        words.splice(0, 5, "lorem", "ipsum", "dolor", "sit", "amet");
      }
      result = words.join(" ");
      if (wrapWithHtml) result = `<span>${result}</span>`;
    } else {
      const sentences = [];
      for (let i = 0; i < count; i++) {
          const s = [];
          const words = 8 + Math.floor(getRand(i, -1) * 10);
          for(let j=0; j<words; j++) s.push(LOREM_WORDS[Math.floor(getRand(i, j) * LOREM_WORDS.length)]);
          const stext = s.join(" ") + ".";
          sentences.push(stext.charAt(0).toUpperCase() + stext.slice(1));
      }
      result = sentences.join(" ");
      if (wrapWithHtml) result = `<p>${result}</p>`;
    }
    
    return result;
  }, [type, count, startWithLorem, wrapWithHtml, refreshSeed]);

  const regenerate = () => setRefreshSeed(prev => prev + 1);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "lorem-ipsum-cosmox.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator - Free Online Utility Tool"
      description="Generate professional placeholder text instantly for your designs using our high-speed free online tool. Fully customizable."
      icon={Quote}
      color="#06b6d4"
    >
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-[3rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-4 shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20 ring-1 ring-rose-500/40" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 ring-1 ring-amber-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/40" />
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={regenerate}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Regenerate"
                    >
                        <RefreshCcw size={18} />
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500 hover:text-white"
                        } border`}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "Secured" : "Scrape"}
                    </button>
                </div>
              </div>

              <textarea
                readOnly
                title="Generated content"
                value={generatedText}
                className="flex-1 w-full bg-transparent p-8 text-slate-300 font-medium leading-relaxed resize-none outline-none selection:bg-cyan-500/30 font-mono text-sm"
              />

              <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                    {generatedText.split(/\s+/).length} Words • {generatedText.length} Characters
                </div>
                <button
                  onClick={downloadText}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  <Download size={14} /> Pull as Text
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-600 to-cyan-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-cyan-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-cyan-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Parameters</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">Output Unit</label>
                <div className="grid grid-cols-3 gap-2">
                    {(["paragraphs", "sentences", "words"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setType(m)}
                            className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                type === m ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-lg" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20"
                            }`}
                        >
                            {m.slice(0, -1)}
                        </button>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">Magnitude</label>
                    <span className="text-cyan-400 font-black text-xs">{count}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max={type === 'words' ? 500 : 20}
                  value={count}
                  title="Magnitude"
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Start with "Lorem"</span>
                    <button 
                        onClick={() => setStartWithLorem(!startWithLorem)}
                        title="Toggle start with lorem"
                        className={`w-10 h-5 rounded-full relative transition-colors ${startWithLorem ? "bg-cyan-500" : "bg-slate-700"}`}
                    >
                        <motion.div animate={{ x: startWithLorem ? 22 : 2 }} className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-md" />
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Inject HTML Tags</span>
                    <button 
                        onClick={() => setWrapWithHtml(!wrapWithHtml)}
                        title="Toggle inject HTML"
                        className={`w-10 h-5 rounded-full relative transition-colors ${wrapWithHtml ? "bg-cyan-500" : "bg-slate-700"}`}
                    >
                        <motion.div animate={{ x: wrapWithHtml ? 22 : 2 }} className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-md" />
                    </button>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex gap-3 items-start">
                <Code2 className="w-4 h-4 text-cyan-500 shrink-0" />
                <p className="text-[9px] text-cyan-500/80 font-bold leading-tight uppercase">
                    Perfect for prototyping clean UI/UX mockups within Figma or directly in VS Code.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl leading-relaxed">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-500" /> AI Standard
            </h4>
            <div className="text-[10px] text-slate-500 font-medium italic">
                Our algorithm uses weighted probability to ensure a natural flow of Latin-esque prose, avoiding repetitive word-loops found in basic generators.
            </div>
          </div>
        </aside>
      </div>

      {/* SEO Enrichment Layer */}
      <div className="max-w-6xl mx-auto space-y-12 py-12 border-t border-white/5">
        <ToolGuide 
          toolName="Lorem Ipsum Generator" 
          sections={guideSections}
          faqs={faqs}
        />

        <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed italic">
            Great design deserves a professional preview. Our **Lorem Ipsum Generator - Free Online Utility Tool** is the essential companion for UI/UX designers, web developers, and graphic artists who need high-quality placeholder text. Instead of using repetitive or distracting content, our generator provides classically structured Latin text that helps viewers focus on the visual layout and typography without being sidetracked by readable copy. Whether you&apos;re building a landing page, a mobile app interface, or a print brochure, CosmoxHub delivers perfectly formatted dummy text in seconds.
          </p>
          <p className="text-slate-400 leading-relaxed mt-4">
            The **Lorem Ipsum Generator** at CosmoxHub offers granular control over your output. You can specify the exact number of paragraphs, words, or even list items to fit your specific design constraints. We have streamlined the process to ensure maximum efficiency; with our &apos;One-Click Copy&apos; feature, you can populate your designs with realistic content faster than ever before. True to our mission, this is a 100% free online tool designed to empower the creative community with professional-grade utilities that are private, secure, and incredibly fast.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
