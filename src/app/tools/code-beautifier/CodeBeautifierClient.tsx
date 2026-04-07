"use client";

import { useState, useCallback } from "react";
import { 
  Code2, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Settings, 
  Zap, 
  Sparkles,
  FileCode,
  Eye
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion } from "framer-motion";
import beautify from "js-beautify";
import ToolGuide from "@/components/ToolGuide";

type Language = "html" | "css" | "js";

export default function CodeBeautifierClient() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("js");
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const beautifyCode = useCallback(() => {
    if (!code.trim()) return;
    
    const options = {
      indent_size: indentSize,
      indent_char: " ",
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: "normal" as const,
      brace_style: "collapse" as const,
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    };

    let result = "";
    if (language === "html") {
      result = beautify.html(code, options);
    } else if (language === "css") {
      result = beautify.css(code, options);
    } else {
      result = beautify.js(code, options);
    }
    
    setCode(result);
  }, [code, language, indentSize]);

  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Elite Code Beautifier"
      description="Format and reorganize messy source code. The ultimate elite lab for HTML, CSS, and JavaScript developers."
      icon={Code2}
      color="#8b5cf6"
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-[3rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-4 shadow-2xl relative min-h-[550px] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
                        <FileCode size={16} className="text-violet-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source Lab</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setCode("")}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
                        title="Reset Environment"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg ${
                            copied ? "bg-violet-500/20 text-violet-400 border-violet-500/30" : "bg-violet-500 text-black border-violet-500/20 hover:scale-[1.02] active:scale-95 shadow-violet-500/20"
                        } border`}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "CAPTURED" : "EXTRACT CLEAN CODE"}
                    </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your messy HTML, CSS, or JS code here for elite reorganization..."
                className="flex-1 w-full bg-transparent p-8 text-slate-300 font-medium leading-relaxed resize-none outline-none selection:bg-violet-500/30 font-mono text-sm placeholder:text-slate-800"
              />

              <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                         <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Compiler Ready</span>
                    </div>
                </div>
                <div className="text-[10px] text-violet-500 font-black uppercase tracking-widest">
                    {code.length} Characters Detected
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_2px_15px_rgba(139,92,246,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-violet-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-violet-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Parser Settings</h3>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Language Context</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(["js", "html", "css"] as Language[]).map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${
                                    language === lang ? "bg-violet-500 text-black border-violet-500 shadow-lg shadow-violet-500/20" : "bg-white/5 text-slate-500 border-white/5 hover:border-violet-500/30"
                                }`}
                            >
                                {lang === 'js' ? 'Script' : lang === 'html' ? 'Layout' : 'Style'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Tab Indentation</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[2, 4].map(size => (
                            <button
                                key={size}
                                onClick={() => setIndentSize(size)}
                                className={`py-2 rounded-xl text-[10px] font-black border transition-all ${
                                    indentSize === size ? "bg-violet-500 text-black border-violet-500 shadow-lg shadow-violet-500/20" : "bg-white/5 text-slate-500 border-white/5 hover:border-violet-500/30"
                                }`}
                            >
                                {size} SPACES
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={beautifyCode}
                        className="w-full bg-violet-500 hover:bg-violet-600 text-black font-black text-[11px] uppercase tracking-[0.15em] py-4 rounded-2xl transition-all shadow-xl shadow-violet-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <Sparkles size={16} className="group-hover:scale-110 transition-transform" /> Beautify Context
                    </button>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl flex gap-3 text-violet-500 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                        <Zap size={16} className="shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold uppercase leading-tight tracking-wider relative z-10">
                            Elite reformatting destroys spaghetti code. Compatible with ES6, HTML5, and CSS3 standards.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Eye size={16} className="text-violet-500" /> Validation
            </h4>
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Uses the industry-standard js-beautify kernel for deterministic code structure and indentation logic.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-20 border-t border-white/5 pt-20">
        <ToolGuide
          toolName="Code Beautifier"
          sections={[
            {
              title: "Input Messy Code",
              content: "Paste your unformatted or minified HTML, CSS, or JavaScript into the Source Lab editor. Our engine handles any degree of nesting complexity."
            },
            {
              title: "Configure Format Settings",
              content: "Choose your target language context and select your preferred indentation size (2 or 4 spaces) to match your project's style guide."
            },
            {
              title: "Execute Beautification",
              content: "Click 'Beautify Context' to instantly reorganize your code. Our logic applies deterministic rules for braces, line breaks, and whitespace."
            },
            {
              title: "Export Clean Code",
              content: "Use the 'Extract Clean Code' button to copy your perfectly formatted snippet. The code is ready for direct deployment or git commits."
            }
          ]}
          faqs={[
            {
              question: "Will my code be sent to a server for formatting?",
              answer: "No. All reformatting logic happens locally in your browser. This makes CosmoxHub the most secure choice for formatting sensitive proprietary code."
            },
            {
              question: "Does it support TypeScript or SCSS?",
              answer: "Yes! Our JavaScript parser handles TypeScript syntax seamlessly, and our CSS engine is highly effective for SCSS and Less structures."
            },
            {
              question: "Can it fix syntax errors?",
              answer: "This is a beautifier, not a linter. It focuses on physical structure and indentation. It will format valid code perfectly but may not correct logical syntax errors."
            }
          ]}
        />

        <div className="mt-20 prose prose-invert max-w-none border border-white/5 bg-white/[0.02] p-12 rounded-[3rem]">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Elite Code Formatting for Professional Workflows</h2>
          <div className="grid md:grid-cols-2 gap-10 text-slate-400 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p>
                Maintaining clean, readable code is essential for modern development, but manual formatting is a massive time sink. CosmoxHub's <span className="text-white font-bold">secure code beautifier</span> provides a professional-grade environment for restructuring messy source files instantly. As a <span className="text-violet-500 font-bold underline">free online utility tool</span>, we prioritize your workflow efficiency without compromising on security.
              </p>
              <p>
                Our engine is optimized to be the <span className="text-white font-bold">fastest code formatter</span> available online. By utilizing <span className="text-white font-bold">local processing</span>, we eliminate the latency of server-side roundtrips while ensuring that your intellectual property remains private. This makes it the ideal choice for developers working with sensitive enterprise systems.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                From complex HTML5 structures to deeply nested JavaScript objects and modern CSS3 layouts, our beautifier applies deterministic rules that satisfy the most rigorous style guides. The interface is designed for high-intensity developer labs, featuring one-click extraction and character count detection for precise code auditing.
              </p>
              <p>
                Join the global development community that relies on CosmoxHub for <span className="text-white font-bold">private, secure, and professional</span> code organization. Scale your productivity and eliminate technical debt with the world's most advanced browser-side code reorganization suite.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
