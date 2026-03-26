"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";

interface AdBannerProps {
  type: "leaderboard" | "square" | "native" | "social-bar";
  label?: string;
  className?: string;
}

export default function AdBanner({ type, label = "Advertisement", className = "" }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to ensure layout is ready and avoid hydration issues
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && adContainerRef.current) {
      if (type === "leaderboard") {
        // Inject 728x90 Adsterra Script
        const script1 = document.createElement("script");
        script1.innerHTML = `
          atOptions = {
            'key' : '40accf62397b36ec50bd1c324f50cc09',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `;
        const script2 = document.createElement("script");
        script2.src = "https://www.highperformanceformat.com/40accf62397b36ec50bd1c324f50cc09/invoke.js";
        
        adContainerRef.current.innerHTML = "";
        adContainerRef.current.appendChild(script1);
        adContainerRef.current.appendChild(script2);
      } else if (type === "native") {
        // Inject Native Adsterra Script
        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = "https://pl28987163.profitablecpmratenetwork.com/6268a2ea20765f6c9b2f7ce5f78e3815/invoke.js";
        
        const container = document.createElement("div");
        container.id = "container-6268a2ea20765f6c9b2f7ce5f78e3815";
        
        adContainerRef.current.innerHTML = "";
        adContainerRef.current.appendChild(script);
        adContainerRef.current.appendChild(container);
      }
    }
  }, [isVisible, type]);

  if (!isVisible) return null;

  // Social bar handled globally in AdScripts
  if (type === "social-bar") return null;

  const styleMap: Record<string, string> = {
    leaderboard: "w-full min-h-[90px] max-w-7xl mx-auto",
    square: "w-full aspect-square max-w-[300px] mx-auto",
    native: "w-full min-h-[200px] rounded-2xl",
  };

  return (
    <div className={`flex flex-col items-center justify-center my-8 ${styleMap[type]} ${className}`}>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-medium">
        {label}
      </span>
      
      <div 
        ref={adContainerRef}
        className={`w-full h-full min-h-[inherit] flex items-center justify-center relative overflow-hidden`}
      >
        {/* Placeholder Loading State */}
        <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
