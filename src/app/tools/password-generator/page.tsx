"use client";
import { useState, useEffect } from "react";
import { KeyRound, Copy, Check, RefreshCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const Checkbox = ({ id, label, checked, onChange }: { id: string, label: string, checked: boolean, onChange: (c: boolean) => void }) => (
  <label htmlFor={id} className="flex items-center justify-between py-3 cursor-pointer border-b border-white/5">
    <span className="text-slate-100 text-[0.95rem]">{label}</span>
    <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-[18px] h-[18px] accent-[#f59e0b]" title={label} aria-label={label} />
  </label>
);

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setLowercase(true);
      charset = "abcdefghijklmnopqrstuvwxyz";
    }

    let result = "";
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => generatePassword(), 0);
    return () => clearTimeout(timeoutId);
  }, [length, uppercase, lowercase, numbers, symbols]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Calculate strength roughly
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score += 2;
    if (password.length >= 16) score++;
    if (uppercase) score++;
    if (numbers) score++;
    if (symbols) score += 2;

    if (score < 4) return { label: "Weak", color: "text-red-500" };
    if (score < 6) return { label: "Good", color: "text-[#f59e0b]" };
    return { label: "Strong", color: "text-emerald-500" };
  };

  const strength = getStrength();

  return (
    <ToolLayout title="Password Generator" description="Generate strong, secure, and random passwords. Processed 100% on your device, we don't store or transmit your passwords." icon={KeyRound} color="#f59e0b">
      <div className="card p-6 max-w-[600px] mx-auto w-full">
        
        {/* Output Box */}
        <div className="relative mb-8">
          <input type="text" value={password} readOnly className="input-field text-2xl p-5 pr-16 font-mono text-[#f59e0b] bg-[#f59e0b]/5 border border-[#f59e0b]/20" title="Generated Password" aria-label="Generated Password" />
          
          <button onClick={copy} title="Copy Password" aria-label="Copy Password"
            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer transition-colors ${copied ? "text-emerald-500" : "text-slate-400 hover:text-slate-300"}`}>
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>

        {/* Strength Meter */}
        <div className="flex items-center justify-between mb-8">
            <span className="text-slate-400 text-[0.85rem] uppercase tracking-wider">Password Strength</span>
            <span className={`font-bold text-[0.95rem] ${strength.color}`}>{strength.label}</span>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-8">
            <div>
                <div className="flex justify-between mb-2">
                    <label htmlFor="passwordLength" className="text-slate-100 text-[0.95rem]">Password Length</label>
                    <span className="text-[#f59e0b] font-bold">{length}</span>
                </div>
                <input id="passwordLength" type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-[#f59e0b] h-1 bg-white/10 appearance-none outline-none rounded-sm" title="Password Length" aria-label="Password Length" />
            </div>

            <div className="mt-4">
                <Checkbox id="chkUppercase" label="Uppercase (A-Z)" checked={uppercase} onChange={setUppercase} />
                <Checkbox id="chkLowercase" label="Lowercase (a-z)" checked={lowercase} onChange={setLowercase} />
                <Checkbox id="chkNumbers" label="Numbers (0-9)" checked={numbers} onChange={setNumbers} />
                <Checkbox id="chkSymbols" label="Symbols (!@#$)" checked={symbols} onChange={setSymbols} />
            </div>
        </div>

        <button className="btn-primary w-full justify-center p-4 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)] text-slate-900 text-base font-medium" onClick={generatePassword} title="Generate New Password" aria-label="Generate New Password">
            <RefreshCw size={18} /> Generate New Password
        </button>
      </div>
    </ToolLayout>
  );
}
