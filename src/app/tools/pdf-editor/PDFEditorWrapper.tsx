"use client";

import dynamic from "next/dynamic";

const PDFEditorClient = dynamic(() => import("./PDFEditorClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-[#050510]/40 border border-white/5 rounded-[3rem]">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing PDF Engine...</p>
    </div>
  ),
});

export default function PDFEditorWrapper() {
  return <PDFEditorClient />;
}
