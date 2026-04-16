"use client";

import { useState, useCallback } from "react";
import { 
  PlaySquare,
  Download, 
  Trash2, 
  Link as LinkIcon, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Settings, 
  Zap, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Sparkles, 
  Image as ImageIcon,
  Maximize,
  Monitor,
  Smartphone,
  Eye,
  RefreshCcw,
  HelpCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion, AnimatePresence } from "framer-motion";

export default function YoutubeThumbnailClient() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Copy the URL of the YouTube video you want. 2. Paste the link into the 'Asset Destination URL' field. 3. Our system will automatically extract the video ID and fetch images. 4. Browse the gallery of available resolutions (Ultra HD, SD, HQ, MQ). 5. Click the red 'Download' button to save the assets.",
      icon: HelpCircle
    },
    {
      title: "High-Fidelity Extraction",
      content: "We use direct API handoffs to fetch thumbnails in their original quality. If the creator uploaded a 1080p 'Max Res' thumbnail, you'll be able to download it in its full glory without any additional compression.",
      icon: Maximize
    },
    {
      title: "Universal Link Parsing",
      content: "Our engine is built to handle all YouTube link formats. Whether it's a standard watch link, a 'Shorts' vertical video, or a shortened youtu.be link, CosmoxHub handles the parsing in real-time.",
      icon: Zap
    },
    {
      title: "Creator Workflow",
      content: "Perfect for designers and content managers. Extract images for moodboards, blog headers, or social media promotions without having to take manual screenshots or use browser inspect tools.",
      icon: PlaySquare
    }
  ];

  const faqs = [
    {
      question: "Why can't I see the 'Ultra HD' version for some videos?",
      answer: "YouTube only generates the 'maxresdefault' resolution if the original video was uploaded in 720p or higher. For older or lower-resolution videos, the standard and high-quality versions will be the maximum available."
    },
    {
      question: "Is this tool free for commercial use?",
      answer: "Yes, our tool is free. However, please remember that thumbnails are the intellectual property of the video creator. Ensure you have the right to use the image for your specific purpose."
    },
    {
      question: "Can I download thumbnails from YouTube Shorts?",
      answer: "Absolutely. Simply paste the 'Shorts' URL just like a regular video link, and our tool will extract the visual assets instantly."
    }
  ];

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
      link.download = `CosmoxHub-yt-thumb-${id}-${resolution}.jpg`;
      link.click();
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader - Free Online Utility Tool"
      description="Extract high-resolution YouTube thumbnails instantly with our high-speed free online tool. Support for Ultra HD, HD, and SD resolutions."
      icon={PlaySquare}
      color="#ff0000"
    >
      <div className="space-y-12">
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
                            title="YouTube Video URL"
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
                        title="Clear Input"
                        className="p-5 bg-white/5 hover:bg-rose-500/10 rounded-2xl text-slate-600 hover:text-rose-500 border border-white/5 hover:border-rose-500/30 transition-all active:scale-95"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </motion.div>

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
                            <div className="aspect-video relative overflow-hidden bg-black/40">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img loading="lazy" decoding="async" 
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

                            <div className="p-8 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{res.label}</div>
                                    <div className="text-white text-xs font-black uppercase tracking-tighter">Asset Optimized for Distribution</div>
                                </div>
                                
                                <button 
                                    onClick={() => downloadImage(videoId!, res.id)}
                                    title={`Download ${res.label}`}
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
      </div>

      {/* SEO Enrichment Layer */}
      <div className="max-w-4xl mx-auto space-y-12 py-12">
        <ToolGuide 
          toolName="YouTube Thumbnail Downloader" 
          sections={guideSections}
          faqs={faqs}
        />

        <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed italic">
            Visual storytelling starts with the right cover. Our **YouTube Thumbnail Downloader - Free Online Utility Tool** is designed for creators, marketers, and researchers who need high-resolution assets from any video on the platform. Whether you are analyzing competitors&apos; design trends, creating a blog post feature image, or just need a high-quality still for your collection, CosmoxHub provides a one-click solution. Simply paste the YouTube URL, and our engine instantly fetches all available resolutions, from standard definitions to 1080p &apos;Max Res&apos; thumbnails.
          </p>
          <p className="text-slate-400 leading-relaxed mt-4">
            Simplicity and speed are the hallmarks of our **YouTube Thumbnail Downloader**. There are no accounts to create and no software to install. By leveraging the official YouTube image API, we ensure that you always get the most accurate and high-quality frames available. It is the perfect free online tool for anyone looking to streamline their creative workflow. Like all tools at CosmoxHub, this downloader is optimized for both desktop and mobile, ensuring you can grab the visuals you need, whenever and wherever you need them.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
