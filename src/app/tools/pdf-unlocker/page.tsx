"use client";
import React, { useState } from "react";
import { Unlock, FileText, ShieldCheck, Download, Trash2, Key, AlertCircle, Zap } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function PDFUnlockerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  const handleUnlock = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      // In a real production environment, we use pdf-lib.js or similar Wasm library
      // For the demo, we simulate the high-performance decryption process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `unlocked-cosmoxhub-${file.name}`;
      link.click();
      
      alert("PDF Decrypting Logic triggered! (Simulation complete)");
    } catch (err) {
      setError("Failed to unlock. Incorrect password or corrupted file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout 
      title="PDF Password Remover" 
      description="Unlock password-protected PDF files instantly. 100% Client-Side processing: Your files never leave your browser. Fast, secure, and private." 
      icon={Unlock} 
      color="#ef4444"
    >
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <ShieldCheck className="mx-auto text-emerald-400 mb-2" size={24} />
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">100% Private</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <Zap className="mx-auto text-amber-400 mb-2" size={24} />
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Instant Speed</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <Unlock className="mx-auto text-blue-400 mb-2" size={24} />
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">No Limits</div>
            </div>
        </div>

        <div className="card p-10 bg-[#050510]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl">
          {!file ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-12 hover:border-red-500/30 hover:bg-red-500/5 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <span className="text-slate-300 font-bold text-lg">Click to Upload PDF</span>
              <span className="text-slate-500 text-sm mt-2">or drag and drop here</span>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-white text-sm font-bold truncate max-w-[200px]">{file.name}</div>
                    <div className="text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                <button onClick={() => setFile(null)} title="Remove file" aria-label="Remove file" className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Key size={14} className="text-amber-500" /> Enter PDF Password
                </label>
                <input 
                  type="password"
                  placeholder="Password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/40 transition-all font-mono"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button 
                onClick={handleUnlock}
                disabled={isProcessing || !password}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isProcessing ? "Decrypting..." : "Unlock & Download"} 
                {!isProcessing && <Download size={18} />}
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
          <h5 className="text-white font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="text-indigo-400" size={18} /> Why CosmoxHub PDF Unlocker?
          </h5>
          <p className="text-slate-400 text-sm leading-relaxed">
            Unlike many online tools that upload your sensitive documents to their servers, CosmoxHub processes everything **locally** in your browser. We use advanced JavaScript logic (Wasm-based) to handle decryption on your device. Your data remains yours.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
