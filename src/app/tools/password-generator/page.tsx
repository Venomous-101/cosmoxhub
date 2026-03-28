"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  ShieldCheck, 
  RefreshCcw, 
  Copy, 
  CheckCircle2, 
  Settings, 
  Zap, 
  Lock, 
  Eye, 
  EyeOff,
  ShieldAlert,
  Fingerprint,
  History,
  Sparkles
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [copied, setCopied] = useState(false);
  const [entropy, setEntropy] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
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

    if (!charPool) return;

    let generated = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      generated += charPool[array[i] % charPool.length];
    }

    setPassword(generated);
    setHistory(prev => [generated, ...prev].slice(0, 5));
    
    // Entropy calculation: log2(pool^length)
    const ent = Math.log2(Math.pow(charPool.length, length));
    setEntropy(Math.round(ent));
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Password Vault & Generator",
    "operatingSystem": "Any",
    "applicationCategory": "SecurityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Cryptographically secure randomness",
       "High-precision entropy analyzer",
       "Custom character set orchestration",
       "One-tap secure vault copy",
       "Privacy-first offline generation"
    ]
  };

  const getStrengthColor = () => {
    if (entropy > 80) return "emerald";
    if (entropy > 60) return "blue";
    if (entropy > 40) return "amber";
    return "rose";
  };

  return (
    <ToolLayout
      title="Elite Password Vault"
      description="Forge cryptographically secure passwords with real-time entropy analysis. The ultimate elite defense for your digital identity."
      icon={ShieldCheck}
      color="#10b981"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Main Interface */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${getStrengthColor()}-500/10 to-transparent rounded-[3.5rem] -z-10`} />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Fingerprint size={120} className="text-white" />
                </div>

                <div className="text-center mb-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-${getStrengthColor()}-500/10 border border-${getStrengthColor()}-500/20 rounded-full mb-4`}>
                        <Zap size={14} className={`text-${getStrengthColor()}-500`} />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-${getStrengthColor()}-500`}>
                            {entropy > 80 ? 'CRACK-PROOF ENTROPY' : entropy > 60 ? 'HIGH SECURITY' : 'STANDARD VAULT'}
                        </span>
                    </div>
                </div>

                <div className="relative group/output max-w-2xl mx-auto mb-12">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-violet-500/20 rounded-3xl blur opacity-30 group-hover/output:opacity-50 transition-all duration-700" />
                    <div className="relative bg-[#02020a] border border-white/5 rounded-3xl p-8 flex items-center justify-between gap-4">
                        <div className="text-2xl md:text-3xl font-black text-white tracking-widest tabular-nums font-mono truncate">
                            {password}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button 
                                onClick={generatePassword}
                                className="p-3 bg-white/5 hover:bg-emerald-500/10 rounded-2xl text-slate-500 hover:text-emerald-500 transition-all active:rotate-180"
                            >
                                <RefreshCcw size={20} />
                            </button>
                            <button 
                                onClick={() => copyToClipboard(password)}
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

                {/* Strength Meter */}
                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className={`text-${getStrengthColor()}-500`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Defense level</span>
                        </div>
                        <span className={`text-[11px] font-black tracking-tighter text-${getStrengthColor()}-500`}>{entropy} BITS OF ENTROPY</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(entropy, 100)}%` }}
                            className={`h-full bg-gradient-to-r from-${getStrengthColor()}-600 to-${getStrengthColor()}-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]`}
                        />
                    </div>
                </div>
            </div>
          </motion.div>

          {/* History */}
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
                            className="p-2 text-slate-800 hover:text-emerald-500 transition-colors"
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
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

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group flex items-start gap-4">
            <Sparkles size={18} className="text-emerald-500 shrink-0" />
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Elite passwords exceed 80 bits of entropy, making them computationally impossible to crack via modern brute-force techniques.
            </p>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
