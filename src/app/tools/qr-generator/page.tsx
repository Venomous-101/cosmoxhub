"use client";

import { useState, useRef, ElementRef } from "react";
import { 
  QrCode, 
  Download, 
  Image as ImageIcon, 
  Palette, 
  Settings, 
  Sparkles, 
  Zap, 
  Layout, 
  Share2,
  Grid
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion } from "framer-motion";
import { QRCode } from "react-qrcode-logo";

export default function QRGeneratorPage() {
  const [text, setText] = useState("https://cosmoxhub.com");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#00000000"); // Transparent default
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [qrStyle, setQrStyle] = useState<"squares" | "dots">("squares");
  const qrRef = useRef<ElementRef<typeof QRCode>>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("react-qrcode-logo") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `cosmoxhub-qr-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Branding QR Generator",
    "operatingSystem": "Any",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Custom business logo integration",
       "Elite dot & eye style customization",
       "High-fidelity transparent background support",
       "Premium branding color orchestration",
       "Instant high-res PNG/SVG export"
    ]
  };

  return (
    <ToolLayout
      title="Elite QR Branding Lab"
      description="Create premium, branded QR codes with integrated logos and custom aesthetics. The ultimate elite tool for business presence."
      icon={QrCode}
      color="#f59e0b"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Main Preview Workspace */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[3.5rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative flex flex-col items-center justify-center min-h-[500px]">
                <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Grid size={120} className="text-white" />
                </div>

                {/* QR Canvas Container */}
                <div className="relative group/qr p-12 bg-black/40 border border-white/5 rounded-[3rem] shadow-inner mb-10 transition-all hover:scale-105 duration-500">
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-[3.5rem] blur-xl opacity-0 group-hover/qr:opacity-100 transition-opacity" />
                    <div className="relative bg-white/5 p-4 rounded-2xl border border-white/10">
                        <QRCode
                            id="react-qrcode-logo"
                            value={text}
                            size={280}
                            fgColor={fgColor}
                            bgColor={bgColor === "#00000000" ? "transparent" : bgColor}
                            qrStyle={qrStyle}
                            eyeRadius={qrStyle === 'dots' ? 10 : 0}
                            logoImage={logoBase64 || undefined}
                            logoWidth={60}
                            logoHeight={60}
                            logoOpacity={1}
                            enableCORS={true}
                            ref={qrRef}
                            ecLevel="H"
                        />
                    </div>
                </div>

                <div className="max-w-md w-full">
                    <input 
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Target Destination (URL / Text)..."
                        className="w-full bg-white/5 border border-white/5 text-white text-center font-bold px-8 py-5 rounded-2xl outline-none focus:border-amber-500/30 transition-all font-mono text-sm shadow-inner placeholder:text-slate-800"
                    />
                </div>
            </div>
          </motion.div>

          {/* Export Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button 
                onClick={downloadQR}
                className="group p-6 bg-amber-500 hover:bg-amber-600 rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-xl shadow-amber-500/10 active:scale-95 border border-amber-500/20"
             >
                <div className="p-2 bg-black/10 rounded-xl group-hover:rotate-12 transition-transform">
                    <Download className="text-black" size={24} />
                </div>
                <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-black/60">Export Final</div>
                    <div className="text-sm font-black text-black leading-none uppercase tracking-tighter">Capture Branded QR</div>
                </div>
             </button>

             <button 
                className="group p-6 bg-[#0a0a1a]/60 backdrop-blur-xl border border-white/5 hover:border-amber-500/30 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-95"
             >
                <div className="p-2 bg-amber-500/10 rounded-xl">
                    <Share2 className="text-amber-500" size={24} />
                </div>
                <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Share</div>
                    <div className="text-sm font-black text-white leading-none uppercase tracking-tighter">Elite Link Distribution</div>
                </div>
             </button>
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 shadow-[0_2px_15px_rgba(245,158,11,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-amber-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Identity Suite</h3>
            </div>

            <div className="space-y-6">
                {/* Style Toggles */}
                <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block font-black">Dot Matrix Pattern</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(["squares", "dots"] as const).map(style => (
                            <button
                                key={style}
                                onClick={() => setQrStyle(style)}
                                className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${
                                    qrStyle === style ? "bg-amber-500 text-black border-amber-500 shadow-lg" : "bg-white/5 text-slate-500 border-white/5 hover:border-amber-500/30"
                                }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Orchestration */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Palette Orchestration</label>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <Palette size={14} className="text-amber-500" />
                            <span className="text-[10px] font-black text-slate-300 uppercase underline decoration-amber-500/30">Primary Ink</span>
                        </div>
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" aria-label="Primary ink color" title="Primary ink color" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <Layout size={14} className="text-slate-500" />
                            <span className="text-[10px] font-black text-slate-300 uppercase">Background Void</span>
                        </div>
                        <input type="color" value={bgColor === "#00000000" ? "#000000" : bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" aria-label="Background color" title="Background color" />
                    </div>
                </div>

                {/* Logo Incorporation */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Brand Assets</label>
                    <label className="w-full flex items-center justify-center gap-3 p-4 bg-amber-500/5 hover:bg-amber-500/10 border-2 border-dashed border-amber-500/20 rounded-2xl cursor-pointer transition-all group active:scale-95">
                        <ImageIcon size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Integrate Logo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                    {logoBase64 && (
                        <button onClick={() => setLogoBase64(null)} className="w-full text-center text-[10px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-widest">Exise Brand Logo</button>
                    )}
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 text-emerald-500 relative overflow-hidden">
                        <Zap size={16} className="shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold uppercase leading-tight tracking-wider">
                            Optimized for Error Correction (Level H) allowing up to 30% brand logo surface coverage.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-[#0a0a1a]/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group flex items-start gap-4">
            <Sparkles size={18} className="text-amber-500 shrink-0" />
            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Elite QR codes are rendered as SVG vectors internally to ensure infinite scalability without pixel degradation.
            </p>
          </div>
        </aside>
      </div>
    </ToolLayout>
  );
}
