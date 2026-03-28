"use client";

import { useState, useCallback } from "react";
import { 
  PlaySquare,
  Download, 
  Trash2, 
  Link as LinkIcon, 
  Settings, 
  Zap, 
  Sparkles, 
  Image as ImageIcon,
  Maximize,
  Monitor,
  Smartphone,
  Eye,
  RefreshCcw
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function YouTubeThumbnailPage() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  const extractId = useCallback((input: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = input.match(regExp);
    const id = (match && match[7].length === 11) ? match[7] : null;
    setVideoId(id);
    return id;
  }, []);

  const handleUrlChange = (val: string) => {
    setUrl(val);
    extractId(val);
  };

  const resolutions = [
    { id: "maxresdefault", label: "Ultra High Definition", quality: "4K/HD", icon: Maximize },
    { id: "sddefault", label: "Standard Definition", quality: "SD", icon: Monitor },
    { id: "hqdefault", label: "High Quality", quality: "HQ", icon: Eye },
    { id: "mqdefault", label: "Medium Quality", quality: "LQ", icon: Smartphone },
  ];

  const downloadImage = async (id: string, resolution: string) => {
    const imageUrl = `https://img.youtube.com/vi/${id}/${resolution}.jpg`;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cosmoxhub-yt-thumb-${id}-${resolution}.jpg`;
      link.click();
    } catch {
      // Direct open if fetch fails due to CORS
      window.open(imageUrl, '_blank');
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite YouTube Thumbnail Downloader",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Real-time YouTube URL ID extraction",
       "High-res maxresdefault fetch engine",
       "Multi-resolution visual asset gallery",
       "Elite one-tap discovery/download protocol",
       "Zero-latency client-side parsing"
    ]
  };

  return (
    <ToolLayout
      title="Elite Thumbnail Lab"
      description="Extract high-resolution YouTube thumbnails instantly. The ultimate visual asset downloader for elite content creators."
      icon={PlaySquare}
      color="#ff0000"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-12">
        {/* Top Intelligence Bar */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative max-w-4xl mx-auto"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent rounded-[2.5rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 group-hover:scale-105 group-hover:bg-red-500/20 transition-all duration-500 shrink-0 shadow-lg shadow-red-500/5">
                    <LinkIcon className="text-red-500" size={24} />
                </div>
                
                <div className="flex-1 w-full space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-2">Asset Destination URL</div>
                    <div className="relative">
                        <input 
                            type="text"
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="Paste YouTube Video URL (e.g. https://youtu.be/...)"
                            className="w-full bg-black/40 border border-white/5 text-white font-mono text-sm px-6 py-5 rounded-2xl outline-none focus:border-red-500/30 transition-all shadow-inner placeholder:text-slate-800"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                             <RefreshCcw size={16} className={`text-slate-700 ${url ? 'animate-spin' : ''}`} />
                        </div>
                    </div>
                </div>

                <div className="shrink-0 flex gap-2">
                    <button 
                        onClick={() => { setUrl(""); setVideoId(null); }}
                        className="p-5 bg-white/5 hover:bg-rose-500/10 rounded-2xl text-slate-600 hover:text-rose-500 border border-white/5 hover:border-rose-500/30 transition-all active:scale-95"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </motion.div>

        {/* Dynamic Asset Grid */}
        <AnimatePresence mode="wait">
            {!videoId ? (
                <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]"
                >
                    <div className="w-24 h-24 bg-red-500/5 rounded-full flex items-center justify-center border border-red-500/10 shadow-2xl animate-pulse">
                        <ImageIcon size={40} className="text-red-500 opacity-20" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-white/30 uppercase tracking-[0.15em] mb-2 leading-none">Awaiting Stream</h4>
                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Provide video coordinates for high-fidelity extraction.</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="gallery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {resolutions.map((res, idx) => (
                        <motion.div
                            key={res.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl group/card ring-1 ring-white/5"
                        >
                            {/* Visual Asset Container */}
                            <div className="aspect-video relative overflow-hidden bg-black/40">
                                <img 
                                    src={`https://img.youtube.com/vi/${videoId}/${res.id}.jpg`}
                                    alt={res.label}
                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                                    <res.icon size={12} className="text-red-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/80">{res.quality}</span>
                                </div>
                            </div>

                            {/* Info & Action Bar */}
                            <div className="p-8 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{res.label}</div>
                                    <div className="text-white text-xs font-black uppercase tracking-tighter">Asset Optimized for Distribution</div>
                                </div>
                                
                                <button 
                                    onClick={() => downloadImage(videoId, res.id)}
                                    className="p-4 bg-red-500 hover:bg-red-600 rounded-2xl text-black shadow-lg shadow-red-500/20 active:scale-90 transition-all"
                                >
                                    <Download size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Elite Footer Meta */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 pt-12 border-t border-white/5">
            <div className="flex-1 p-8 bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem] flex items-start gap-4">
                <Settings size={20} className="text-red-500 shrink-0 mt-1" />
                <div>
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-white mb-2 italic flex items-center gap-2">
                       Protocol 4.0 Discovery <Sparkles size={12} className="text-red-500" />
                   </h5>
                   <p className="text-[10px] text-slate-500 font-bold leading-relaxed tracking-wider uppercase opacity-80">
                       Uses standard REST API handoffs to fetch high-resolution bitmaps directly from YouTube&apos;s static CDN servers.
                   </p>
                </div>
            </div>
            
            <div className="flex-1 p-8 bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem] flex items-start gap-4 ring-1 ring-red-500/5">
                <Zap size={20} className="text-red-500 shrink-0 mt-1" />
                <div>
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-white mb-2 italic">Creator Handoff</h5>
                   <p className="text-[10px] text-slate-500 font-bold leading-relaxed tracking-wider uppercase opacity-80">
                       Elite thumbnails are automatically parsed from standard URLs, Shorts, and legacy embed links in real-time.
                   </p>
                </div>
            </div>
        </div>
      </div>
    </ToolLayout>
  );
}
