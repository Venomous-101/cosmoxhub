"use client";
import { useState, useEffect, useRef } from "react";

interface AdBannerProps {
  type: "leaderboard" | "square" | "native" | "social-bar" | "sidebar";
  label?: string;
  className?: string;
}

export default function AdBanner({ type, label = "Advertisement", className = "" }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const nativeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500); // Wait 1.5s to ensure layout stability
    return () => clearTimeout(timer);
  }, []);

  // For native ads, we inject purely via DOM to ensure it has full page context
  useEffect(() => {
    if (isVisible && type === "native" && nativeContainerRef.current && nativeContainerRef.current.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://pl29029724.profitablecpmratenetwork.com/743a65861fc0e916b7541f00815fa15a/invoke.js";
      script.async = true;
      script.dataset.cfasync = "false";
      nativeContainerRef.current.appendChild(script);

      const div = document.createElement("div");
      div.id = "container-743a65861fc0e916b7541f00815fa15a";
      nativeContainerRef.current.appendChild(div);
    }
  }, [isVisible, type]);

  if (!isVisible) return <div className={`min-h-[90px] w-full animate-pulse bg-white/5 rounded-xl ${className}`} />;

  if (type === "social-bar") return null; // handled in AdScripts

  if (type === "native") {
    return (
      <div className={`flex flex-col items-center justify-center my-8 bg-transparent w-full min-h-[200px] rounded-2xl ${className}`}>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-medium">{label}</span>
        <div ref={nativeContainerRef} className="w-full flex justify-center" />
      </div>
    );
  }

  // document.write scripts need iframe srcDoc to work properly in React
  const generateAdHtml = (w: number, h: number, key: string) => `<!DOCTYPE html>
<html>
  <head>
    <style>body { margin: 0; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }</style>
  </head>
  <body>
    <script type="text/javascript">
      var atOptions = { 'key' : '${key}', 'format' : 'iframe', 'height' : ${h}, 'width' : ${w}, 'params' : {} };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
  </body>
</html>`;

  const configs: Record<string, { cl: string; w: number; h: number; key: string }> = {
    leaderboard: { cl: "w-full min-h-[90px] max-w-[728px] mx-auto", w: 728, h: 90, key: "6bee3dab19d3ac70b0b49fc3d4433a9d" },
    sidebar: { cl: "w-full min-h-[300px] max-w-[160px] mx-auto", w: 160, h: 300, key: "472b1e21b732fa245e745fc362082852" },
  };

  const adConfig = configs[type];
  if (!adConfig) return null;

  return (
    <div className={`flex flex-col items-center justify-center my-8 bg-transparent ${adConfig.cl} ${className}`}>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-medium">{label}</span>
      <iframe
        srcDoc={generateAdHtml(adConfig.w, adConfig.h, adConfig.key)}
        width={adConfig.w}
        height={adConfig.h}
        title={`${label || type} Ad`}
        className="border-0 m-0 p-0 block bg-transparent rounded-md"
        scrolling="no"
        style={{ width: `${adConfig.w}px`, height: `${adConfig.h}px` }}
      />
    </div>
  );
}
