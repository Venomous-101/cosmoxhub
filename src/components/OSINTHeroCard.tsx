"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((char, i) => {
        if (i < iter) return text[i];
        if (char === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      iter += 0.4;
      if (iter >= text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{display}</span>;
}

export default function OSINTHeroCard() {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Particle/scan effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let frame: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Scan line
      const y = (t % canvas.height);
      const grad = ctx.createLinearGradient(0, y - 20, 0, y + 20);
      grad.addColorStop(0, "rgba(0,255,136,0)");
      grad.addColorStop(0.5, "rgba(0,255,136,0.06)");
      grad.addColorStop(1, "rgba(0,255,136,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - 20, canvas.width, 40);
      t += 1.5;
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  return (
    <Link href="/osint" className="block group">
      <div
        className="relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, #000a04 0%, #000d0a 50%, #00120c 100%)",
          borderColor: hovered ? "rgba(0,255,136,0.5)" : "rgba(0,255,136,0.15)",
          boxShadow: hovered ? "0 0 40px rgba(0,255,136,0.15), inset 0 0 40px rgba(0,255,136,0.03)" : "0 0 20px rgba(0,255,136,0.05)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Scan canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Corner brackets */}
        {[["top-2 left-2 border-t border-l", "border-green-400/60"],
          ["top-2 right-2 border-t border-r", "border-green-400/60"],
          ["bottom-2 left-2 border-b border-l", "border-green-400/60"],
          ["bottom-2 right-2 border-b border-r", "border-green-400/60"]
        ].map(([pos, col], i) => (
          <div key={i} className={`absolute w-4 h-4 ${pos} ${col} transition-all duration-300`}
            style={{ borderWidth: "2px", borderColor: hovered ? "rgba(0,255,136,0.8)" : "rgba(0,255,136,0.3)" }} />
        ))}

        <div className="relative z-10 p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#00ff88" }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "#00ff88" }} />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase" style={{ color: "#00ff88" }}>LIVE · OSINT INTEL</span>
            </div>
            <span className="text-[10px] font-mono text-green-600 tracking-widest">SYS::ACTIVE</span>
          </div>

          {/* Title */}
          <div className="mb-3">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-1" style={{ color: "#00ff88", textShadow: hovered ? "0 0 20px rgba(0,255,136,0.5)" : "none" }}>
              {hovered ? <GlitchText text="OSINT DASHBOARD" /> : "OSINT DASHBOARD"}
            </h3>
            <p className="text-xs font-mono text-green-700">Open Source Intelligence · Developer Privacy Audit · Infrastructure Mapping</p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {["GitHub Intel", "Email Harvest", "Infra Graph", "Metadata", "Wayback", "Username Race"].map(f => (
              <span key={f} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                style={{ background: "rgba(0,255,136,0.05)", borderColor: "rgba(0,255,136,0.2)", color: "#4ade80" }}>
                {f}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-green-800">6 modules · real data · free</span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold transition-all duration-300"
              style={{ color: hovered ? "#00ff88" : "#16a34a" }}>
              ENTER DASHBOARD
              <span className="transition-transform duration-300" style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}>→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
