"use client";
import { useState } from "react";
import {
  Sparkles, Copy, Trash2, ArrowRightLeft, BrainCircuit,
  Type, CheckCircle2, Zap, Layers
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

type Framework = "RTF" | "RISEN" | "COSTAR" | "CARE" | "EXPERT";
type AiTarget = "ChatGPT" | "Claude" | "Gemini" | "General";
type Tone = "Professional" | "Creative" | "Technical" | "Friendly";

const FRAMEWORKS: { id: Framework; name: string; desc: string }[] = [
  { id: "RTF", name: "RTF", desc: "Role · Task · Format" },
  { id: "RISEN", name: "RISEN", desc: "Role · Input · Steps · Expectation · Narrowing" },
  { id: "COSTAR", name: "COSTAR", desc: "Context · Objective · Style · Tone · Audience · Response" },
  { id: "CARE", name: "CARE", desc: "Context · Action · Result · Example" },
  { id: "EXPERT", name: "EXPERT", desc: "Elite Role-Stacking Method" },
];

const EXAMPLES = [
  "Write a marketing email for a new SaaS product",
  "Explain quantum computing to a 10-year-old",
  "Create a Python script to scrape websites",
  "Design a 30-day fitness plan for beginners",
];

export default function AIPromptOptimizerPage() {
  const [input, setInput] = useState("");
  const [optimized, setOptimized] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [framework, setFramework] = useState<Framework>("RTF");
  const [target, setTarget] = useState<AiTarget>("General");
  const [tone, setTone] = useState<Tone>("Professional");

  const buildPrompt = (raw: string, fw: Framework, t: AiTarget, tn: Tone): string => {
    const toneMap: Record<Tone, string> = {
      Professional: "authoritative, data-driven, and precise",
      Creative: "imaginative, engaging, and narrative-driven",
      Technical: "systematic, code-ready, and specification-level accurate",
      Friendly: "warm, approachable, and conversational",
    };
    const targetMap: Record<AiTarget, string> = {
      ChatGPT: "Optimized for GPT-4o's instruction-following strengths.",
      Claude: "Structured for Claude's document-analysis and reasoning capabilities.",
      Gemini: "Tailored for Gemini's multimodal chain-of-thought processing.",
      General: "Universal prompt structure compatible with any frontier model.",
    };

    switch (fw) {
      case "RTF":
        return `[ROLE] Act as a world-class expert and senior consultant with 15+ years of specialized experience in the domain of this task.\n\n[TASK] Your task is to comprehensively and thoroughly address the following request:\n"${raw}"\n\n[FORMAT] Structure your response using:\n• Clear section headers for each major point\n• Bullet points for key insights and sub-topics\n• Concrete examples where applicable\n• An actionable summary conclusion\n\n[CONSTRAINTS] Maintain a ${toneMap[tn]} tone throughout. Avoid generic advice — be specific and insightful. ${targetMap[t]}`;

      case "RISEN":
        return `[ROLE] You are a deep domain expert — a specialist operating at the frontier of knowledge in this area.\n\n[INPUT] The core request is:\n"${raw}"\n\n[STEPS]\n1. Analyze the core problem or objective\n2. Research and identify best-practice solutions\n3. Synthesize information into actionable insights\n4. Present findings in a structured, clear format\n\n[EXPECTATION] Deliver a response that is accurate, comprehensive, and ${toneMap[tn]}. Avoid vagueness — every point must be substantiated.\n\n[NARROWING] Focus exclusively on what is directly relevant to the request. Do not digress. ${targetMap[t]}`;

      case "COSTAR":
        return `[CONTEXT] The following request requires expert-level analysis and a structured response:\n"${raw}"\n\n[OBJECTIVE] Provide a comprehensive, actionable, and high-value output that directly addresses the stated need.\n\n[STYLE] ${toneMap[tn].charAt(0).toUpperCase() + toneMap[tn].slice(1)} writing style.\n\n[TONE] ${tn} — ensuring the response feels ${toneMap[tn]}.\n\n[AUDIENCE] Assume the reader has intermediate-to-expert level knowledge in the relevant domain.\n\n[RESPONSE FORMAT] Structured output with headers, bullet points, examples, and a clear conclusion. ${targetMap[t]}`;

      case "CARE":
        return `[CONTEXT] Background and situation:\nThe following task requires specialized expertise:\n"${raw}"\n\n[ACTION] Provide a step-by-step, comprehensive response covering:\n• Core analysis of the subject\n• Practical recommendations with reasoning\n• Common pitfalls to avoid\n• Optimization strategies for best results\n\n[RESULT] The expected outcome is a clear, ${toneMap[tn]} response that directly solves the stated problem with measurable value.\n\n[EXAMPLE] Where applicable, include a specific, concrete example to illustrate your key points. ${targetMap[t]}`;

      case "EXPERT":
        return `[ELITE ROLE-STACK PROTOCOL]\nYou are simultaneously operating as:\n① A world-renowned expert in the relevant domain\n② A best-selling author who explains complex ideas brilliantly\n③ A strategic advisor focused on actionable outcomes\n\n[PRIMARY DIRECTIVE]\n"${raw}"\n\n[EXECUTION PARAMETERS]\n• Tone: ${toneMap[tn]}\n• Depth: Expert-level (do not oversimplify)\n• Format: Use headers, bullets, and structured sections\n• Length: Comprehensive — cover all critical angles\n• Perspective: Multi-disciplinary where relevant\n\n[QUALITY GATE] Before finalizing, review your response for: accuracy, completeness, and practical applicability. ${targetMap[t]}`;

      default:
        return raw;
    }
  };

  const optimizePrompt = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setOptimized(buildPrompt(input, framework, target, tone));
      setIsProcessing(false);
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Elite AI Prompt Optimizer"
      description="Transform simple ideas into precision-engineered AI prompts. Multi-framework engine supports RTF, RISEN, COSTAR, CARE, and Expert methods."
      icon={Sparkles} color="#8b5cf6"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CosmoxHub Elite AI Prompt Optimizer",
        "operatingSystem": "Any", "applicationCategory": "AIUtility",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "featureList": ["5 prompt frameworks (RTF, RISEN, COSTAR, CARE, Expert)", "AI model targeting", "Tone control", "100% client-side"]
      })}} />

      <div className="space-y-8">
        {/* Controls Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Framework */}
            <div className="space-y-3">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block flex items-center gap-2"><Layers size={11} className="text-purple-500" /> Framework</label>
              <div className="space-y-1.5">
                {FRAMEWORKS.map(fw => (
                  <button key={fw.id} onClick={() => setFramework(fw.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all border ${framework === fw.id ? "bg-purple-500/15 border-purple-500/40 text-purple-300" : "bg-white/[0.03] border-white/5 text-slate-500 hover:border-white/10"}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{fw.name}</span>
                    <span className="text-[8px] text-slate-600">{fw.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target & Tone */}
            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block flex items-center gap-2"><BrainCircuit size={11} className="text-purple-500" /> AI Target</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["ChatGPT", "Claude", "Gemini", "General"] as AiTarget[]).map(t => (
                    <button key={t} onClick={() => setTarget(t)}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${target === t ? "bg-purple-500 text-white border-purple-500 shadow-lg" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Output Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Professional", "Creative", "Technical", "Friendly"] as Tone[]).map(t => (
                    <button key={t} onClick={() => setTone(t)}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${tone === t ? "bg-indigo-500 text-white border-indigo-500 shadow-lg" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block flex items-center gap-2"><Zap size={11} className="text-purple-500" /> Quick Examples</label>
              <div className="space-y-2">
                {EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => setInput(ex)}
                    className="w-full text-left px-4 py-2.5 bg-white/[0.03] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 rounded-xl text-[10px] font-medium text-slate-500 hover:text-slate-300 transition-all leading-tight">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dual Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl flex flex-col min-h-[380px]">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2"><Type size={13} className="text-purple-500" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Raw Idea Input</span></div>
              <button onClick={() => setInput("")} aria-label="Clear input" title="Clear input" className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent p-6 text-slate-200 text-sm font-medium outline-none resize-none leading-relaxed placeholder:text-slate-800"
              placeholder={"Describe what you want the AI to do...\n\nExample: Write a compelling homepage for a B2B SaaS startup that helps small businesses manage their finances."}
              value={input} onChange={(e) => setInput(e.target.value)}
            />
            <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-mono">{input.length} chars</span>
              <button onClick={optimizePrompt} disabled={isProcessing || !input.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 disabled:opacity-50 transition-all">
                {isProcessing ? <><Sparkles size={13} className="animate-spin" /> Building...</> : <><ArrowRightLeft size={13} /> Optimize</>}
              </button>
            </div>
          </motion.div>

          {/* Output */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0a1a]/80 border border-purple-500/10 rounded-[2rem] overflow-hidden shadow-xl flex flex-col min-h-[380px] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-transparent pointer-events-none" />
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2"><BrainCircuit size={13} className="text-amber-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimized Prompt · {framework}</span></div>
              {optimized && (
                <button onClick={handleCopy} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${copied ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-slate-400 border-white/10 hover:border-purple-500/30"}`}>
                  {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto p-6 relative z-10">
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Engineering Prompt...</p>
                  </motion.div>
                ) : optimized ? (
                  <motion.pre key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans selection:bg-purple-500/30">
                    {optimized}
                  </motion.pre>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <Sparkles size={48} className="text-slate-500 mb-4" />
                    <p className="text-sm text-slate-500">Your engineered prompt will appear here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </ToolLayout>
  );
}
