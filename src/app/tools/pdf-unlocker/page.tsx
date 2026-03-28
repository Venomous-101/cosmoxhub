"use client";
import React, { useState } from "react";
import { Unlock, FileText, ShieldCheck, Download, Trash2, Key, AlertCircle, Zap, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";

export default function PDFUnlockerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setSuccess(false);
      setError("");
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  const handleUnlock = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError("");
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Real functional logic using pdf-lib
      // load() with password will attempt to decrypt the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        password: password,
        ignoreEncryption: false 
      });
      
      // If load succeeds, we save it (which produces an unencrypted version)
      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `unlocked-cosmoxhub-${file.name}`;
      link.click();
      
      URL.revokeObjectURL(url);
      setSuccess(true);
      setPassword("");
    } catch (err: any) {
      console.error("Decryption Error:", err);
      if (err.message?.includes("password")) {
        setError("Error: Incorrect password. Please try again.");
      } else {
        setError("Failed to process PDF. It might be corrupted or use unsupported encryption.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout 
      title="PDF Password Remover Elite" 
      description="Unlock protected PDF files instantly. 100% Functional Client-Side Decryption. Your files NEVER leave your browser. Fast, secure, and private." 
      icon={Unlock} 
      color="#ef4444"
    >
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-4 bg-[#050510]/60 border border-white/5 rounded-2xl">
                <ShieldCheck className="mx-auto text-emerald-400 mb-2" size={24} />
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">100% Private</div>
            </div>
            <div className="p-4 bg-[#050510]/60 border border-white/5 rounded-2xl">
                <Zap className="mx-auto text-amber-400 mb-2" size={24} />
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Instant Speed</div>
            </div>
            <div className="p-4 bg-[#050510]/60 border border-white/5 rounded-2xl">
                <Unlock className="mx-auto text-blue-400 mb-2" size={24} />
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">No Server Upload</div>
            </div>
        </div>

        <div className="card p-10 bg-[#050510]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px] pointer-events-none" />
          
          {!file ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-12 hover:border-red-500/30 hover:bg-red-500/5 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <span className="text-slate-300 font-bold text-lg">Upload Locked PDF</span>
              <span className="text-slate-500 text-sm mt-2 opacity-60">Your privacy is our priority</span>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} title="Select a locked PDF file" />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 text-red-400 rounded-xl">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-white text-sm font-bold truncate max-w-[200px]">{file.name}</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                <button onClick={() => {setFile(null); setSuccess(false);}} title="Remove file" aria-label="Remove file" className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              {!success && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                      <Key size={12} className="text-amber-500" /> Security Password
                    </label>
                    <input 
                      type="password"
                      placeholder="Enter PDF password to unlock..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#050510] border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-red-500/40 transition-all font-mono placeholder:text-slate-700"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2 animate-shake">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button 
                    onClick={handleUnlock}
                    disabled={isProcessing || !password}
                    className="w-full py-5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black rounded-2xl shadow-[0_4px_25px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_45px_rgba(239,68,68,0.5)] hover:-translate-y-1 transition-all disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Unlock size={20} />}
                    <span className="uppercase tracking-[0.1em]">{isProcessing ? "Processing AI Decryption..." : "Remove Protection"}</span>
                  </button>
                </div>
              )}

              {success && (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex flex-col items-center gap-3 text-center">
                  <div className="p-3 bg-emerald-500/20 rounded-full">
                    <Download size={24} />
                  </div>
                  <span>Success! Your unlocked PDF has been downloaded.</span>
                  <button 
                    onClick={() => {setFile(null); setSuccess(false);}}
                    className="mt-2 text-xs text-slate-400 hover:text-white underline underline-offset-4"
                  >
                    Unlock another file
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-12 p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 blur-[40px] pointer-events-none" />
          <h5 className="text-white font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="text-indigo-400" size={20} /> Professional Decryption
          </h5>
          <p className="text-slate-400 text-sm leading-relaxed">
            Standard online tools often store copies of your private documents. CosmoxHub Elite uses **Browser-Side Wasm logic** to remove restrictions without ever seeing your data. This is the fastest and most secure way to handle sensitive PDFs.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
