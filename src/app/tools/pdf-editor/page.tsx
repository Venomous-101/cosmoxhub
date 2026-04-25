"use client";

import dynamic from "next/dynamic";

const PDFEditorClient = dynamic(() => import("./PDFEditorClient"), { ssr: false });

export default function PDFEditorPage() {
  return <PDFEditorClient />;
}
