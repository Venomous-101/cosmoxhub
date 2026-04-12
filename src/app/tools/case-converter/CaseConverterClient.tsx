"use client";

import { useState } from "react";
import { 
  Type, 
  Copy, 
  Trash2, 
  Settings, 
  CheckCircle2, 
  Zap,
  ChevronRight,
  RefreshCcw,
  HelpCircle,
  Maximize,
  AlignLeft
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion } from "framer-motion";

export default function CaseConverterClient() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [transformation, setTransformation] = useState<string>("Original");

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Paste your raw text into the 'Elite Transformation' area. 2. Navigate to the 'Case Settings' sidebar. 3. Select your desired conversion (UPPERCASE, Title Case, etc.). 4. Observe the real-time transformation in the input area. 5. Click 'Scrape Output' to copy the formatted text to your clipboard.",
      icon: HelpCircle
    },
    {
      title: "Standard Conventions",
      content: "Switch between standard writing formats like 'Sentence case' (capitalizes first letter of sentences) or 'Title Case' (capitalizes first letter of every word). Ideal for creative writing and content management.",
      icon: AlignLeft
    },
    {
      title: "Developer Suite (Coding)",
      content: "Easily convert strings for code variables using snake_case, camelCase, or PascalCase. Our engine uses complex tokenization to identify word-boundaries, ensuring clean transitions even with specialized strings.",
      icon: Zap
    },
    {
      title: "Zero-Data Footprint",
      content: "Your content stays in your browser. All text transformations are executed locally in your RAM. CosmoxHub never uploads, logs, or processes your text on external servers, keeping sensitive data 100% private.",
      icon: Maximize
    }
  ];

  const faqs = [
    {
      question: "Will I lose my original text formatting?",
      answer: "No. The converter adjusts the casing (capitalization) of words but preserves your existing paragraph breaks and spacing for maximum structural integrity."
    },
    {
      question: "Does Title Case handle small words (like 'and')?",
      answer: "Our standard Title Case capitalizes the first letter of all words. For advanced academic APA/MLA title capitalization, manual review of small connectives is recommended."
    },
    {
      question: "Is there a limit to how much text I can convert?",
      answer: "There are no hard limits. You can paste entire documents or long code files and our browser-side engine will transform them instantly without lag."
    }
  ];

  const updateText = (newText: string, label: string) => {
    setText(newText);
    setTransformation(label);
  };

  const toSentence = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitle = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toSnake = (str: string) => {
    return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map(x => x.toLowerCase())
      .join('_') || "";
  };

  const toCamel = (str: string) => {
    const s = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map(x => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase())
      .join('') || "";
    return s.charAt(0).toLowerCase() + s.slice(1);
  };

  const toPascal = (str: string) => {
    return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map(x => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase())
      .join('') || "";
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Case Converter - Free Online Utility Tool"
      description="Transform text between different casings including UPPERCASE, lowercase, Title Case, and more with our high-speed free online tool."
      icon={Type}
      color="#f59e0b"
    >
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start text-white">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[3rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-4 shadow-2xl relative min-h-[450px] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                        <AlignLeft size={16} className="text-amber-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{transformation}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setText("")}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
                        title="Wipe Session"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg ${
                            copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500 text-black border-amber-500/20 hover:scale-105 active:scale-95 shadow-amber-500/20"
                        } border`}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "SECURED" : "SCRAPE OUTPUT"}
                    </button>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your source text here for elite transformation..."
                className="flex-1 w-full bg-transparent p-8 text-slate-300 font-medium leading-relaxed resize-none outline-none selection:bg-amber-500/30 font-mono text-base placeholder:text-slate-700"
              />

              <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">
                    Elite Input Monitoring Active
                </div>
                <div className="flex gap-4">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{text.split(/\s+/).filter(w => w).length} Words</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{text.length} Assets</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_2px_15px_rgba(245,158,11,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-amber-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Case Settings</h3>
            </div>

            <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-4 italic">Standard Conventions</label>
                {[
                    { id: "UPPER", label: "UPPER CASE", fn: (s: string) => s.toUpperCase() },
                    { id: "lower", label: "lower case", fn: (s: string) => s.toLowerCase() },
                    { id: "Title", label: "Capitalize Words", fn: toTitle },
                    { id: "Sentence", label: "Sentence case", fn: toSentence }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => updateText(m.fn(text), m.label)}
                        className="w-full text-left p-4 rounded-[1.25rem] bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all group flex items-center justify-between"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{m.label}</span>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                    </button>
                ))}

                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mt-8 mb-4 italic">Developer Suite</label>
                {[
                    { id: "snake", label: "snake_case", fn: toSnake },
                    { id: "camel", label: "camelCase", fn: toCamel },
                    { id: "pascal", label: "PascalCase", fn: toPascal }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => updateText(m.fn(text), m.label)}
                        className="w-full text-left p-4 rounded-[1.25rem] bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all group flex items-center justify-between"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 group-hover:text-amber-400">{m.label}</span>
                        <ChevronRight size={14} className="text-amber-900 group-hover:text-amber-500" />
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
                <button
                    onClick={() => updateText("", "Wiped")}
                    className="w-full py-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={12} /> Clear Session
                </button>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> Pro Insight
            </h4>
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Elite Engine uses complex tokenization to identify word-boundaries, ensuring clean transitions even with heavily specialized strings.
            </p>
          </div>
        </aside>
      </div>

      {/* SEO Enrichment Layer */}
      <div className="max-w-6xl mx-auto space-y-12 py-12 border-t border-white/5">
        <ToolGuide 
          toolName="Case Converter" 
          sections={guideSections}
          faqs={faqs}
        />

        <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed italic">
            Formatting text shouldn&apos;t be a manual chore. Our **Case Converter - Free Online Utility Tool** is engineered for professionals who need to switch between text styles with surgical precision. Whether you&apos;re normalizing a database export, preparing a title for a blog post, or ensuring your social media captions follow sentence case rules, CosmoxHub provides a comprehensive suite of transformation options. With just one click, you can toggle between UPPERCASE, lowercase, Title Case, Sentence case, and even unconventional formats like iNVERTED cASE.
          </p>
          <p className="text-slate-400 leading-relaxed mt-4">
            The **Case Converter** at CosmoxHub is built for speed and accessibility. We understand that in a fast-paced digital environment, every second counts. That&apos;s why our tool includes one-click &apos;Copy&apos; and &apos;Download&apos; features, allowing you to move your transformed text into your workflow instantly. True to our privacy-first philosophy, all transformations occur in your browser; your content is never uploaded to any server. It is the premier free online tool for writers, developers, and designers who demand excellence and efficiency in their text processing tasks.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
