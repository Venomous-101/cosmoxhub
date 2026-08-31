"use client";

import dynamic from "next/dynamic";

const PDFEditorClient = dynamic(() => import("./PDFEditorClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading PDF Editor Studio...</p>
      </div>
    </div>
  ),
});

export default function PDFEditorWrapper() {
  return <PDFEditorClient />;
}
