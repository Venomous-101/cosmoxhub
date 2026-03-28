"use client";
import React, { useState } from "react";
import { Sparkles, Copy, Trash2, ArrowRightLeft, BrainCircuit, Type, FileJson } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function AIPromptOptimizerPage() {
  const [input, setInput] = useState("");
  const [optimized, setOptimized] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const optimizePrompt = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    
    // Professional Prompt Engineering Pattern (RTF: Role, Task, Format)
    setTimeout(() => {
      const Role = "Acting as an expert consultant with 15+ years of experience in the field, ";
      const Task = `your task is to thoroughly address the following: "${input}". `;
      const Context = "Ensure the response is accurate, creative, and takes into account current industry trends and best practices. ";
      const Format = "Format the output using clear headings, bullet points for readability, and provide a concluding actionable summary.";
      const Constraints = "\n\nConstraints: Avoid generic advice, be specific, and maintain a professional yet engaging tone.";

      setOptimized(Role + Task + Context + Format + Constraints);
      setIsProcessing(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimized);
    alert("Optimized Prompt Copied!");
  };

  return (
    <ToolLayout 
      title="AI Prompt Optimizer" 
      description="Transform simple ideas into professional, high-converting AI prompts. Engine-optimized for ChatGPT, Claude, and Gemini to get 10x better results." 
      icon={Sparkles} 
      color="#8b5cf6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Phase */}
        <div className="space-y-6">
            <div className="p-6 bg-[#050510]/60 border border-white/5 rounded-3xl">
                <h4 className="flex items-center gap-2 text-slate-300 text-sm font-bold uppercase tracking-widest mb-4">
                    <Type size={16} className="text-purple-400" /> Original Idea
                </h4>
                <textarea 
                    className="w-full h-[300px] bg-transparent border-none text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none font-medium leading-relaxed"
                    placeholder="Describe what you want the AI to do (e.g., 'Write an email about product launch')..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {input.length} Characters
                    </span>
                    <button 
                        onClick={() => setInput("")}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <button 
                onClick={optimizePrompt}
                disabled={isProcessing || !input}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 overflow-hidden group relative"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Sparkles size={20} className="relative z-10" />
                <span className="relative z-10 uppercase tracking-widest text-sm">{isProcessing ? "Optimizing..." : "Generate Pro Prompt"}</span>
                <ArrowRightLeft size={18} className="relative z-10 ml-2 opacity-50" />
            </button>
        </div>

        {/* Output Phase */}
        <div className="space-y-6">
            <div className="p-6 bg-[#050510]/80 backdrop-blur-3xl border border-purple-500/20 rounded-3xl relative overflow-hidden h-[450px] flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] pointer-events-none" />
                
                <h4 className="flex items-center justify-between text-slate-300 text-sm font-bold uppercase tracking-widest mb-6">
                    <div className="flex items-center gap-2">
                        <BrainCircuit size={16} className="text-amber-400" /> Optimized Result
                    </div>
                    {optimized && (
                        <button 
                           onClick={handleCopy}
                           className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-indigo-400 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                           <Copy size={16} /> <span className="text-[10px]">COPY</span>
                        </button>
                    )}
                </h4>

                <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                    {optimized ? (
                        <p className="text-slate-200 leading-relaxed italic whitespace-pre-wrap selection:bg-purple-500/30">
                            {optimized}
                        </p>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                            <FileJson size={64} className="mb-4 text-slate-500" />
                            <p className="text-sm">Your optimized prompt will appear here.<br/>Ready to win the AI game?</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                <div className="flex items-center gap-3 text-amber-400 mb-2">
                    <Sparkles size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Pro Tip</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                    A good prompt always defines a **Role**, asks for a specific **Task**, and sets a **Format**. CosmoxHub handles this structure for you automatically.
                </p>
            </div>
        </div>
      </div>
    </ToolLayout>
  );
}
