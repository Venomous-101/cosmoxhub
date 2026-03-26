"use client";
import { useState, useEffect } from "react";

interface AdBannerProps {
  type: "leaderboard" | "square" | "native" | "social-bar";
  label?: string;
  className?: string;
}

export default function AdBanner({ type, label = "Advertisement", className = "" }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure layout is ready and avoid hydration issues
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const styleMap: Record<string, string> = {
    leaderboard: "w-full min-h-[90px] md:min-h-[250px] max-w-7xl mx-auto",
    square: "w-full aspect-square max-w-[300px] mx-auto",
    native: "w-full min-h-[200px] rounded-2xl",
    "social-bar": "fixed bottom-0 left-0 w-full z-[100] h-[80px] bg-slate-900/90 backdrop-blur-md border-t border-white/10"
  };

  return (
    <div className={`flex flex-col items-center justify-center my-8 ${styleMap[type]} ${className}`}>
      {type !== "social-bar" && (
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-medium">
          {label}
        </span >
      )}
      
      <div className={`w-full h-full min-h-[inherit] bg-indigo-500/5 border border-dashed border-indigo-500/10 rounded-xl flex items-center justify-center relative overflow-hidden group`}>
        {/* Placeholder Gradient Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <p className="text-slate-500 text-xs text-center px-4 font-light">
          {type === "social-bar" ? "Social Bar Ad Placement" : "Adsterra / Monetag Banner Placement"}
          <br />
          <span className="text-[9px] opacity-60">Ready for script injection</span>
        </p>

        {/* 
          Actual Script Tags will be injected here via the AdScripts component or directly.
          We keep the box visible to ensure layout stability (CLS prevention).
        */}
      </div>
    </div>
  );
}
