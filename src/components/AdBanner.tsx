"use client";
import { useState, useEffect, useRef } from "react";

interface AdBannerProps {
  type: "leaderboard" | "square" | "native" | "social-bar" | "sidebar";
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
        // Adsterra Banner 728x90 for cosmoxhub.com (ID: 28929226)
        const script1 = document.createElement("script");
        script1.innerHTML = `
          atOptions = {
            'key' : '6bee3dab19d3ac70b0b49fc3d4433a9d',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `;
        const script2 = document.createElement("script");
        script2.src = "https://www.highperformanceformat.com/6bee3dab19d3ac70b0b49fc3d4433a9d/invoke.js";
        
        adContainerRef.current.innerHTML = "";
        adContainerRef.current.appendChild(script1);
        adContainerRef.current.appendChild(script2);
      } else if (type === "native") {
        // Adsterra Native Banner for cosmoxhub.com (ID: 28929225)
        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = "https://pl29029724.profitablecpmratenetwork.com/743a65861fc0e916b7541f00815fa15a/invoke.js";
        
        const container = document.createElement("div");
        container.id = "container-743a65861fc0e916b7541f00815fa15a";
        
        adContainerRef.current.innerHTML = "";
        adContainerRef.current.appendChild(script);
        adContainerRef.current.appendChild(container);
      } else if (type === "sidebar") {
        // Adsterra Banner 160x300 for cosmoxhub.com (ID: 28929227)
        const script1 = document.createElement("script");
        script1.innerHTML = `
          atOptions = {
            'key' : '472b1e21b732fa245e745fc362082852',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        `;
        const script2 = document.createElement("script");
        script2.src = "https://www.highperformanceformat.com/472b1e21b732fa245e745fc362082852/invoke.js";
        
        adContainerRef.current.innerHTML = "";
        adContainerRef.current.appendChild(script1);
        adContainerRef.current.appendChild(script2);
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
    sidebar: "w-full min-h-[300px] max-w-[160px] mx-auto",
  };

  return (
    <div className={`flex flex-col items-center justify-center my-8 ${styleMap[type] || ""} ${className}`}>
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
