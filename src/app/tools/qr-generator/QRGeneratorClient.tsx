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
  Grid,
  HelpCircle,
  Eye,
  CheckCircle2,
  Layers
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion, AnimatePresence } from "framer-motion";
import { QRCode } from "react-qrcode-logo";

export default function QRGeneratorClient() {
  const [text, setText] = useState("");
  const [fgColor, setFgColor] = useState("#000000"); // Primary Ink
  const [bgColor, setBgColor] = useState("#ffffff"); // Void
  const [eyeColor, setEyeColor] = useState("#000000"); // Corner Eyes
  const [transparentBg, setTransparentBg] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [qrStyle, setQrStyle] = useState<"squares" | "dots">("squares");
  const qrRef = useRef<ElementRef<typeof QRCode>>(null);

  // System States
  const [isHovered, setIsHovered] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Smart Validation & Auto-Formatting
  const getProcessedValue = () => {
    const trimmed = text.trim();
    if (!trimmed) return "https://cosmoxhub.com"; // Default payload
    
    // Domain Check
    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/.*)?$/;
    if (domainRegex.test(trimmed)) {
      return `https://${trimmed}`;
    }
    // Email Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed) && (!trimmed.startsWith("mailto:"))) {
      return `mailto:${trimmed}`;
    }
    // Phone Check
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (phoneRegex.test(trimmed) && !trimmed.startsWith("tel:")) {
      return `tel:${trimmed.replace(/[\s-]/g, '')}`;
    }
    return trimmed;
  };

  const processedText = getProcessedValue();

  const getInputFeedback = () => {
    if (!text.trim()) return { msg: "Awaiting Input...", icon: <Sparkles size={14} />, color: "text-amber-500/70", bg: "bg-amber-500/10" };
    if (processedText.startsWith("https://") || processedText.startsWith("http://")) return { msg: "Secure Web URL Detected", icon: <CheckCircle2 size={14} />, color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (processedText.startsWith("mailto:")) return { msg: "Email Contact Detected", icon: <CheckCircle2 size={14} />, color: "text-blue-400", bg: "bg-blue-500/10" };
    if (processedText.startsWith("tel:")) return { msg: "Phone Number Detected", icon: <CheckCircle2 size={14} />, color: "text-amber-400", bg: "bg-amber-500/10" };
    if (processedText.startsWith("WIFI:")) return { msg: "WiFi Network Detected", icon: <CheckCircle2 size={14} />, color: "text-purple-400", bg: "bg-purple-500/10" };
    return { msg: "Standard Text / Data Mode", icon: <Layers size={14} />, color: "text-slate-400", bg: "bg-white/5" };
  };

  const feedback = getInputFeedback();

  const applyPreset = (preset: 'cyber' | 'minimal' | 'corporate' | 'golden') => {
    if (preset === 'cyber') {
      setFgColor("#00ffcc");
      setEyeColor("#ff007f");
      setBgColor("#0a0a1a");
      setQrStyle("dots");
      setTransparentBg(false);
    } else if (preset === 'minimal') {
      setFgColor("#ffffff");
      setEyeColor("#ffffff");
      setBgColor("#000000");
      setQrStyle("squares");
      setTransparentBg(true);
    } else if (preset === 'corporate') {
      setFgColor("#1e3a8a");
      setEyeColor("#0f172a");
      setBgColor("#f8fafc");
      setQrStyle("squares");
      setTransparentBg(false);
    } else if (preset === 'golden') {
      setFgColor("#f59e0b");
      setEyeColor("#eab308");
      setBgColor("#1a1a00");
      setQrStyle("dots");
      setTransparentBg(false);
    }
  };

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Paste your URL or text. 2. Choose 'Squares' or 'Dots'. 3. Customize Colors & Eyes. 4. Upload a Logo. 5. Click 'Capture Branded QR' to download HD.",
      icon: HelpCircle
    },
    {
      title: "Smart Detection Protocol",
      content: "Enter a raw domain (like facebook.com), phone number, or email, and our smart engine automatically formats it securely into a scannable protocol.",
      icon: Sparkles
    },
    {
      title: "Privacy Fortress",
      content: "Your destination URLs and personal data are never tracked. Unlike 'Dynamic' QR tools that route through third-party servers, CosmoXHub generates 'Static' codes locally in your browser for total privacy.",
      icon: QrCode
    }
  ];

  const faqs = [
    {
      question: "Will the QR code work if I add a logo?",
      answer: "Yes! Because we use high-level (Level H) error correction, the code remains readable even with a central logo taking up to 30% of the surface."
    },
    {
      question: "Is the exported image high-resolution?",
      answer: "Absolutely. Our 'HD Ultra-Export' renders a massive 1024x1024 resolution image behind the scenes, ensuring print-perfect quality for billboards or banners."
    },
    {
      question: "Are these QR codes permanent?",
      answer: "Yes, these are 100% 'Static' QR codes. They don't expire, don't require tracking subscriptions, and will work forever."
    }
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = async () => {
    setIsExporting(true);
    // Allow React to render the HD canvas with latest state
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Try HD canvas first, fallback to display canvas
    const hdCanvas = document.getElementById("react-qrcode-hd") as HTMLCanvasElement | null;
    const displayCanvas = document.getElementById("react-qrcode-display") as HTMLCanvasElement | null;
    const canvas = hdCanvas || displayCanvas;
    
    if (canvas) {
      try {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `cosmoxhub-qr-ultra-${Date.now()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (_err) {
        // Silent fallback
      }
    }
    setIsExporting(false);
  };

  const actualBgColor = transparentBg ? "transparent" : bgColor;

  return (
    <ToolLayout
      title="Elite QR Engine - Smart Formatting & HD Export"
      description="Create ultra-premium, branded QR codes with smart format-detection, transparent HD-exports, and custom eye palettes. 100% private and browser-run."
      icon={QrCode}
      color="#f59e0b"
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/5 rounded-[3.5rem] -z-10 blur-xl" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative flex flex-col items-center justify-center min-h-[500px]">
                <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Grid size={120} className="text-white" />
                </div>

                {/* Holographic QR Display Wrapper */}
                <div 
                    className="relative group/qr p-12 bg-black/50 border border-white/5 rounded-[3rem] shadow-inner mb-8 transition-all hover:scale-[1.02] duration-500"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="absolute -inset-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent rounded-[4rem] blur-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative bg-white/5 p-4 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                        {/* Cyberpunk Scanner Animation */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div 
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: [0, 280, 0], opacity: [0, 1, 0.5, 1, 0] }}
                                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute left-0 right-0 h-1 z-20 pointer-events-none bg-amber-400"
                                    style={{
                                        boxShadow: "0 0 20px 5px rgba(251, 191, 36, 0.5), 0 0 40px 10px rgba(251, 191, 36, 0.2)"
                                    }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Standard Display QR Code */}
                        <QRCode
                            id="react-qrcode-display"
                            value={processedText}
                            size={280}
                            fgColor={fgColor}
                            bgColor={transparentBg && bgColor !== "#000000" ? "#ffffff" : bgColor} // Best contrast preview for transparent
                            qrStyle={qrStyle}
                            eyeRadius={qrStyle === 'dots' ? 10 : 0}
                            eyeColor={eyeColor}
                            logoImage={logoBase64 || undefined}
                            logoWidth={60}
                            logoHeight={60}
                            logoOpacity={1}
                            enableCORS={true}
                            ref={qrRef}
                            ecLevel="H"
                        />

                        {/* Hidden HD Generator (1024x1024) */}
                        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                            <QRCode
                                id="react-qrcode-hd"
                                value={processedText}
                                size={1024}
                                fgColor={fgColor}
                                bgColor={actualBgColor}
                                qrStyle={qrStyle}
                                eyeRadius={qrStyle === 'dots' ? 40 : 0}
                                eyeColor={eyeColor}
                                logoImage={logoBase64 || undefined}
                                logoWidth={220}
                                logoHeight={220}
                                logoOpacity={1}
                                enableCORS={true}
                                ecLevel="H"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-md w-full relative z-20">
                    <div className="relative">
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type URL, Phone, or Message..."
                            title="Enter QR destination"
                            aria-label="Enter QR destination"
                            className="w-full bg-[#0a0a1a]/80 backdrop-blur-md border border-white/10 text-white text-center font-bold px-8 py-5 pr-12 rounded-3xl outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all font-mono text-sm resize-none shadow-inner placeholder:text-slate-600 h-[80px]"
                            spellCheck={false}
                        />
                        {text.length > 0 && (
                            <button 
                                onClick={() => setText("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    {/* Smart Feedback Badge */}
                    <div className="mt-4 flex justify-center">
                        <motion.div 
                            key={feedback.msg}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 text-[11px] font-black tracking-widest uppercase ${feedback.bg} ${feedback.color}`}
                        >
                            {feedback.icon}
                            {feedback.msg}
                        </motion.div>
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Action Hub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button 
                onClick={downloadQR}
                disabled={isExporting}
                className={`group p-6 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 border ${
                    isExporting ? "bg-amber-500/50 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-400 shadow-amber-500/20 hover:shadow-amber-500/40 border-amber-400/50"
                }`}
             >
                <div className="p-3 bg-black/10 rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-transform">
                    {isExporting ? <Zap className="text-black animate-pulse" size={24} /> : <Download className="text-black" size={24} />}
                </div>
                <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-black/60">
                        {isExporting ? "Encoding..." : "Export HD Print-Ready"}
                    </div>
                    <div className="text-base font-black text-black leading-none uppercase tracking-tighter mt-1">
                        Ultra-Resolution QR
                    </div>
                </div>
             </button>

             <div className="p-6 bg-[#0a0a1a]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black tracking-widest uppercase">Elite Feature Active</span>
                </div>
                <div className="text-sm font-bold text-white leading-tight">Dynamic Error Healing Active. Up to 30% structural damage resilient.</div>
             </div>
          </div>
        </div>

        {/* Identity Suite Sidebar */}
        <aside className="space-y-6 sticky top-8 z-30">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_2px_20px_rgba(245,158,11,0.4)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <Settings className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Identity Suite</h3>
            </div>

            <div className="space-y-8">
                {/* 1-Click Aesthetics Presets */}
                <div className="space-y-3">
                    <label className="text-amber-500 text-[10px] font-black uppercase tracking-widest block">Elite Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => applyPreset('cyber')} className="py-2.5 bg-[#0a0a1a] border border-[#00ffcc]/30 text-[#00ffcc] rounded-xl text-[10px] font-black uppercase hover:bg-[#00ffcc]/10 transition-colors">Cyberpunk</button>
                        <button onClick={() => applyPreset('minimal')} className="py-2.5 bg-white text-black border border-white/30 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-colors">Minimal Dark</button>
                        <button onClick={() => applyPreset('corporate')} className="py-2.5 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase hover:bg-blue-900/50 transition-colors">Corporate Blue</button>
                        <button onClick={() => applyPreset('golden')} className="py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase hover:bg-amber-500/20 transition-colors">Cosmox Golden</button>
                    </div>
                </div>

                {/* Grid Architecture */}
                <div className="space-y-3 pt-6 border-t border-white/5">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Core Architecture</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                        {(["squares", "dots"] as const).map(style => (
                            <button
                                key={style}
                                onClick={() => setQrStyle(style)}
                                className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                    qrStyle === style ? "bg-amber-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Infinite Palette */}
                <div className="space-y-3 pt-6 border-t border-white/5">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Color Modulation</label>
                    
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <Palette size={14} className="text-slate-400" />
                                <span className="text-[11px] font-bold text-slate-300">Base Ink</span>
                            </div>
                            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <Eye size={14} className="text-slate-400" />
                                <span className="text-[11px] font-bold text-slate-300">Target Eyes</span>
                            </div>
                            <input type="color" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <Layout size={14} className="text-slate-400" />
                                    <span className="text-[11px] font-bold text-slate-300">Background</span>
                                </div>
                                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                    <input type="checkbox" checked={transparentBg} onChange={e => setTransparentBg(e.target.checked)} className="rounded border-none bg-black/50 text-amber-500 focus:ring-1 focus:ring-amber-500" />
                                    <span className="text-[9px] font-bold uppercase text-slate-500">Make Transparent</span>
                                </label>
                            </div>
                            {!transparentBg && (
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Central Motif */}
                <div className="space-y-3 pt-6 border-t border-white/5">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Central Motif (Logo)</label>
                    <label className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/20 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                        <ImageIcon size={18} className="text-amber-500 relative z-10" />
                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest relative z-10">Inject Brand Logo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                    {logoBase64 && (
                        <button onClick={() => setLogoBase64(null)} className="w-full text-center text-[10px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-widest transition-colors py-2">Remove Injected Asset</button>
                    )}
                </div>
            </div>
          </div>
        </aside>
      </div>

      {/* SEO Information Hub */}
      <div className="mt-16 max-w-4xl">
         <ToolGuide 
            toolName="Elite QR Generator" 
            sections={guideSections}
            faqs={faqs}
          />
      </div>
    </ToolLayout>
  );
}

