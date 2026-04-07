"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ShieldCheck, RefreshCcw, Copy, CheckCircle2, Zap, Fingerprint, History,
  Settings, Lock, ShieldAlert, Sparkles, Trash2, Info, HelpCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion } from "framer-motion";

export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [copied, setCopied] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Select your desired password length (8-100 characters). 2. Toggle character sets like 'Uppercase', 'Numbers', and 'Symbols'. 3. Observe the real-time 'Entropy' meter for security strength. 4. Click 'Capture' to copy the secure string. 5. Use the 'Recent Genealogies' section to retrieve recently generated passwords.",
      icon: HelpCircle
    },
    {
      title: "Entropy & Security",
      content: "Entropy measures the randomness of your password in bits. Higher bits mean exponential difficulty for attackers. We use the browser's crypto.getRandomValues() API to ensure cryptographically secure randomness that exceeds industry standards.",
      icon: Zap
    },
    {
      title: "Character Orchestration",
      content: "Customize your defense. Use 'No Confusion' to exclude ambiguous characters like 'l' and '1' or 'O' and '0', ensuring your passwords are easy to read while remaining structurally sound.",
      icon: Lock
    },
    {
      title: "Local Fortress",
      content: "Your passwords never leave your device. All generation happens locally in your browser's memory. This 'Zero-Knowledge' approach ensures that even CosmoxHub cannot see the passwords you create.",
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      question: "Is it safe to generate passwords online?",
      answer: "Yes, specifically with CosmoxHub. Unlike server-side generators, our tool runs entirely in your browser. No data is sent to any server, making it as safe as generating a password offline."
    },
    {
      question: "What is a 'Good' entropy score?",
      answer: "A score above 60 bits is generally considered strong for average use. For high-security accounts, aim for 80 bits or higher, which our tool easily provides with longer lengths and symbol inclusion."
    },
    {
      question: "Does this tool store my password history?",
      answer: "Only temporarily in your current browser session. Once you refresh or close the page, the 'Recent Genealogies' history is wiped forever."
    }
  ];
  
  const { password, entropy } = useMemo(() => {
    const sets = {
      uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
      lowercase: "abcdefghijkmnopqrstuvwxyz",
      numbers: "23456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
      ambiguous: "il1Lo0O"
    };

    let charPool = "";
    if (options.uppercase) charPool += sets.uppercase;
    if (options.lowercase) charPool += sets.lowercase;
    if (options.numbers) charPool += sets.numbers;
    if (options.symbols) charPool += sets.symbols;
    if (!options.excludeAmbiguous) charPool += sets.ambiguous;

    if (refreshSeed < 0) return { password: "", entropy: 0 }; 

    if (!charPool) return { password: "", entropy: 0 };

    let generated = "";
    const array = new Uint32Array(length);
    if (typeof window !== "undefined") {
      window.crypto.getRandomValues(array);
    }
    
    for (let i = 0; i < length; i++) {
      generated += charPool[array[i] % charPool.length];
    }
    
    const ent = Math.log2(Math.pow(charPool.length, length));
    
    return { password: generated, entropy: Math.round(ent) };
  }, [length, options, refreshSeed]);

  useEffect(() => {
    const tid = setTimeout(() => {
      if (password) {
        setHistory(prev => {
          if (prev[0] === password) return prev;
          return [password, ...prev.filter(p => p !== password)].slice(0, 5);
        });
      }
    }, 0);
    return () => clearTimeout(tid);
  }, [password]);

  const regenerate = () => setRefreshSeed(s => s + 1);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    if (entropy > 80) return "emerald";
    if (entropy > 60) return "blue";
    if (entropy > 40) return "amber";
    return "rose";
  };

  const strengthColor = getStrengthColor();

  return (
    <ToolLayout
      title="Password Generator - Free Online Utility Tool"
      description="Forge cryptographically secure passwords with real-time entropy analysis using our high-speed free online tool. 100% private and browser-side."
      icon={ShieldCheck}
      color="#10b981"
    >
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-[3.5rem] -z-10`} />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Fingerprint size={120} className="text-white" />
                </div>

                <div className="text-center mb-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 ${
                      strengthColor === "emerald" ? "bg-emerald-500/10 border border-emerald-500/20" :
                      strengthColor === "blue" ? "bg-blue-500/10 border border-blue-500/20" :
                      strengthColor === "amber" ? "bg-amber-500/10 border border-amber-500/20" :
                      "bg-rose-500/10 border border-rose-500/20"
                    }`}>
                        <Zap size={14} className={
                          strengthColor === "emerald" ? "text-emerald-500" :
                          strengthColor === "blue" ? "text-blue-500" :
                          strengthColor === "amber" ? "text-amber-500" : "text-rose-500"
                        } />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                          strengthColor === "emerald" ? "text-emerald-500" :
                          strengthColor === "blue" ? "text-blue-500" :
                          strengthColor === "amber" ? "text-amber-500" : "text-rose-500"
                        }`}>
                            {entropy > 80 ? 'CRACK-PROOF ENTROPY' : entropy > 60 ? 'HIGH SECURITY' : 'STANDARD VAULT'}
                        </span>
                    </div>
                </div>

                <div className="relative group/output max-w-2xl mx-auto mb-12">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-violet-500/20 rounded-3xl blur opacity-30 group-hover/output:opacity-50 transition-all duration-700" />
                    <div className="relative bg-[#02020a] border border-white/5 rounded-3xl p-8 flex items-center justify-between gap-4">
                        <div className="text-xl md:text-3xl font-black text-white tracking-widest tabular-nums font-mono truncate">
                            {password}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button 
                                onClick={regenerate}
                                title="Regenerate Password"
                                className="p-3 bg-white/5 hover:bg-emerald-500/10 rounded-2xl text-slate-500 hover:text-emerald-500 transition-all active:rotate-180"
                            >
                                <RefreshCcw size={20} />
                            </button>
                            <button 
                                onClick={() => copyToClipboard(password)}
                                title="Copy Password"
                                className={`flex items-center gap-2 p-3 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-500 text-black border-emerald-500/10 hover:scale-105 active:scale-95"
                                }`}
                            >
                                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                <span className="hidden sm:inline">{copied ? "COPIED" : "CAPTURE"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className={
                              strengthColor === "emerald" ? "text-emerald-500" :
                              strengthColor === "blue" ? "text-blue-500" :
                              strengthColor === "amber" ? "text-amber-500" : "text-rose-500"
                            } />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Defense level</span>
                        </div>
                        <span className={`text-[11px] font-black tracking-tighter ${
                          strengthColor === "emerald" ? "text-emerald-500" :
                          strengthColor === "blue" ? "text-blue-500" :
                          strengthColor === "amber" ? "text-amber-500" : "text-rose-500"
                        }`}>{entropy} BITS OF ENTROPY</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(entropy, 100)}%` }}
                            className={`h-full bg-gradient-to-r rounded-full ${
                              strengthColor === "emerald" ? "from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                              strengthColor === "blue" ? "from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" :
                              strengthColor === "amber" ? "from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]" :
                              "from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                            }`}
                        />
                    </div>
                </div>
            </div>
          </motion.div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-500/10 rounded-xl">
                    <History size={16} className="text-slate-500" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Recent Genealogies</h4>
            </div>
            <div className="space-y-2">
                {history.map((pw, i) => (
                    <div 
                        key={i} 
                        className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group"
                    >
                        <code className="text-slate-500 font-mono text-xs tracking-wider group-hover:text-slate-300 transition-colors">{pw}</code>
                        <button 
                            onClick={() => copyToClipboard(pw)}
                            title="Copy previous password"
                            className="p-2 text-slate-800 hover:text-emerald-500 transition-colors"
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Vault Core</h3>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Length</label>
                        <span className="text-emerald-500 font-black text-xs">{length} CHARS</span>
                    </div>
                    <input 
                        type="range"
                        min="8"
                        max="100"
                        title="Password Length"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-4">Encryption Logic</label>
                    <div className="grid grid-cols-1 gap-2">
                         {Object.entries({
                            uppercase: "ABC Uppercase",
                            lowercase: "abc Lowercase",
                            numbers: "123 Numbers",
                            symbols: "#$& Symbols",
                            excludeAmbiguous: "No Confusion"
                        }).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof options] }))}
                                title={`Toggle ${label}`}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                    options[key as keyof typeof options] ? "bg-emerald-500/10 border-emerald-500/30 text-white" : "bg-white/5 border-transparent text-slate-500 opacity-60 hover:opacity-100"
                                }`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                                {options[key as keyof typeof options] ? <Lock size={14} className="text-emerald-500" /> : <ShieldAlert size={14} />}
                            </button>
                         ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 text-emerald-500 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                        <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold uppercase leading-tight tracking-wider relative z-10">
                            Forged with Window.Crypto API for maximum randomness entropy.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </aside>

        {/* SEO Enrichment Layer */}
        <div className="lg:col-span-2 space-y-12 py-12">
          <ToolGuide 
            toolName="Password Generator" 
            sections={guideSections}
            faqs={faqs}
          />

          <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
            <p className="text-slate-400 leading-relaxed italic">
              Securing your digital life starts with a strong foundation. Our **Password Generator - Free Online Utility Tool** is engineered to provide high-entropy, unbreakable strings that protect your most sensitive accounts. Whether you need a simple 12-character combination for a new social media profile or a complex 64-character sequence for enterprise-level security, CosmoxHub gives you full control over length, symbols, numbers, and casing.
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              Safety is at the core of our **Password Generator**. Unlike many online generators that might log your credentials or send them across the web, CosmoxHub's algorithm runs entirely on your local machine. Your passwords are never stored, never transmitted, and never seen by anyone else. It is the ultimate free online tool for individuals and businesses who refuse to compromise on cybersecurity. Generate, copy, and protect your digital assets with absolute confidence.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
