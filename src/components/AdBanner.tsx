"use client";
import { useState, useEffect, useRef } from "react";

interface AdBannerProps {
  type: "leaderboard" | "square" | "native" | "social-bar" | "sidebar";
  label?: string;
  className?: string;
}

export default function AdBanner({ type, label = "Advertisement", className = "" }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure layout is ready
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  // Social bar handled globally in AdScripts
  if (type === "social-bar") return null;

  const styleMap: Record<string, { cl: string; src: string; w: string; h: string }> = {
    leaderboard: { cl: "w-full min-h-[90px] max-w-[728px] mx-auto", src: "/ads/leaderboard.html", w: "728", h: "90" },
    native: { cl: "w-full min-h-[200px] rounded-2xl", src: "/ads/native.html", w: "100%", h: "200" },
    sidebar: { cl: "w-full min-h-[300px] max-w-[160px] mx-auto", src: "/ads/sidebar.html", w: "160", h: "300" },
  };

  const adConfig = styleMap[type];
  if (!adConfig) return null;

  return (
    <div className={`flex flex-col items-center justify-center my-8 bg-transparent ${adConfig.cl} ${className}`}>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-medium">
        {label}
      </span>
      
      <div className={`w-full h-full min-h-[inherit] flex items-center justify-center relative overflow-hidden bg-transparent rounded-xl`}>
        <iframe
          src={adConfig.src}
          width={adConfig.w}
          height={adConfig.h}
          title={`${label || type} Ad`}
          className="border-0 m-0 p-0 block bg-transparent shadow-[0_0_20px_rgba(99,102,241,0.05)] rounded-md"
          scrolling="no"
          style={{ width: adConfig.w.includes('%') ? adConfig.w : `${adConfig.w}px`, height: `${adConfig.h}px` }}
        />
      </div>
    </div>
  );
}
