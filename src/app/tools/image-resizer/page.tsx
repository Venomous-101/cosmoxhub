"use client";
import { useState } from "react";
import { Maximize2, Upload, Download } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainRatio, setMaintainRatio] = useState(true);

  const [resizing, setResizing] = useState(false);
  const [resizedUrl, setResizedUrl] = useState("");

  const handleUpload = (f: File) => {
    setFile(f);
    setResizedUrl("");
    const url = URL.createObjectURL(f);
    setImgUrl(url);

    const img = new Image();
    img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
      setWidth(val);
      if (maintainRatio && originalWidth > 0) {
          setHeight(Math.round(val * (originalHeight / originalWidth)));
      }
  };

  const handleHeightChange = (val: number) => {
      setHeight(val);
      if (maintainRatio && originalHeight > 0) {
          setWidth(Math.round(val * (originalWidth / originalHeight)));
      }
  };

  const resize = () => {
    if (!file || !imgUrl) return;
    setResizing(true);
    
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setResizedUrl(canvas.toDataURL(file.type));
        }
        setResizing(false);
    };
    img.src = imgUrl;
  };

  const download = () => {
    if (!resizedUrl || !file) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    a.download = `resized-${file.name}`;
    a.click();
  };

  return (
    <ToolLayout title="Image Resizer" description="Resize images to any dimension securely in your browser. Original quality is preserved." icon={Maximize2} color="#10b981">
      {!file ? (
        <div 
          className="upload-zone flex flex-col items-center justify-center p-12 border-2 border-dashed border-emerald-500/30 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-colors" 
          onClick={() => document.getElementById("resize-input")?.click()}
          title="Click to upload an image"
        >
            <Upload className="mb-4 text-emerald-500 w-10 h-10" />
            <p className="text-slate-400 text-sm">Drop an image here or <span className="text-emerald-500 font-medium">click to browse</span></p>
            <input 
              id="resize-input" 
              type="file" 
              accept="image/*" 
              className="hidden"
              title="File input for image to resize"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} 
            />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
            <div className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-[#050510] border border-emerald-500/10 rounded-xl relative">
                {/* Preview */}
                <div className="text-center bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">Original Image ({originalWidth}x{originalHeight})</p>
                    <img 
                      src={imgUrl} 
                      alt="Original" 
                      className="max-w-full max-h-[300px] rounded-lg object-contain bg-slate-950/50 mx-auto border border-slate-800" 
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-col h-full justify-center">
                    <h3 className="text-slate-100 text-lg font-semibold mb-6 flex items-center gap-2">
                      <Maximize2 size={18} className="text-emerald-500" /> Resize Settings
                    </h3>
                    
                    <div className="flex flex-col gap-5 mb-6">
                        <div>
                            <label htmlFor="width-input" className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Width (px)</label>
                            <input 
                              id="width-input"
                              type="number" 
                              title="New image width in pixels"
                              value={width || ""} 
                              onChange={(e) => handleWidthChange(Number(e.target.value))} 
                              className="input-field w-full p-3 bg-[#050510] border border-emerald-500/20 rounded-lg text-slate-200 focus:border-emerald-500/50 outline-none transition-colors" 
                            />
                        </div>
                        <div>
                            <label htmlFor="height-input" className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Height (px)</label>
                            <input 
                              id="height-input"
                              type="number" 
                              title="New image height in pixels"
                              value={height || ""} 
                              onChange={(e) => handleHeightChange(Number(e.target.value))} 
                              className="input-field w-full p-3 bg-[#050510] border border-emerald-500/20 rounded-lg text-slate-200 focus:border-emerald-500/50 outline-none transition-colors" 
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 text-slate-300 text-sm font-medium cursor-pointer mb-8 group hover:text-emerald-400 transition-colors w-fit p-2 rounded-lg hover:bg-emerald-500/5 -ml-2">
                        <input 
                          type="checkbox" 
                          title="Maintain aspect ratio"
                          checked={maintainRatio} 
                          onChange={(e) => setMaintainRatio(e.target.checked)} 
                          className="w-4 h-4 rounded accent-emerald-500 cursor-pointer" 
                        />
                        Maintain aspect ratio
                    </label>

                    <div className="flex gap-4 mt-auto border-t border-slate-800/50 pt-6">
                        <button 
                          className="btn-primary flex-1 py-2.5 bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white rounded-lg transition-all" 
                          onClick={resize} 
                          disabled={resizing || width <= 0 || height <= 0}
                          title="Resize the image"
                        >
                            {resizing ? "Resizing..." : "Resize Image"}
                        </button>
                        <button 
                          className="btn-secondary flex-1 py-2.5 font-medium text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all rounded-lg" 
                          onClick={() => { setFile(null); setResizedUrl(""); }}
                          title="Upload a different image"
                        >
                          Replace Image
                        </button>
                    </div>
                </div>
            </div>

            {resizedUrl && (
                <div className="card p-8 text-center bg-[#050510] border border-emerald-500/20 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <div className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full font-medium text-sm mb-6 border border-emerald-500/20">
                      ✅ Resized Successfully ({width}x{height})
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 inline-block mb-8 max-w-full">
                      <img 
                        src={resizedUrl} 
                        alt="Resized Result" 
                        className="max-w-full max-h-[400px] rounded-lg object-contain mx-auto shadow-lg" 
                      />
                    </div>
                    <button 
                      className="btn-primary flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)] font-medium text-white rounded-lg transition-all hover:-translate-y-0.5" 
                      onClick={download}
                      title="Download the resized image"
                    >
                        <Download size={18} /> Download Resized Image
                    </button>
                </div>
            )}
        </div>
      )}
    </ToolLayout>
  );
}
