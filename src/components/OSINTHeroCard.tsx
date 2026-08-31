"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";

function GlitchText({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iter = 0;
    const iv = setInterval(() => {
      setDisplay(text.split("").map((ch, i) => {
        if (i < iter) return text[i];
        if (ch === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      iter += 0.6;
      if (iter >= text.length) clearInterval(iv);
    }, 35);
    return () => clearInterval(iv);
  }, [text, active]);
  return <>{display}</>;
}

const FEATURES = [
  { label: "GitHub Intel",       desc: "Harvest exposed emails from public commits",     icon: "⚡", risk: "HIGH" },
  { label: "Email Harvest",      desc: "Timezone & work pattern inference from activity", icon: "📧", risk: "HIGH" },
  { label: "Infra Graph",        desc: "Map subdomains, IPs & reverse DNS pivots",        icon: "🌐", risk: "MED"  },
  { label: "Metadata Extractor", desc: "Deep forensics from PDF, DOCX & image files",    icon: "🔬", risk: "MED"  },
  { label: "Wayback Timeline",   desc: "Full historical archive of any domain",           icon: "📅", risk: "LOW"  },
  { label: "Username Race",      desc: "Probe 22+ platforms simultaneously in real-time", icon: "👤", risk: "MED"  },
];

const RISK_COLORS: Record<string, string> = {
  HIGH: "text-red-400 border-red-500/50 bg-red-500/10",
  MED:  "text-amber-400 border-amber-500/50 bg-amber-500/10",
  LOW:  "text-green-400 border-green-500/50 bg-green-500/10",
};

export default function OSINTHeroCard() {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Scan line + rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Matrix rain columns
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1).map(() => Math.random() * canvas.height);
    let scanY = 0;
    let frame: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 10, 4, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix rain characters
      ctx.fillStyle = "rgba(0, 255, 136, 0.15)";
      ctx.font = "12px monospace";
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * 20, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 14;
      });

      // Scan line
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, "rgba(0,255,136,0)");
      grad.addColorStop(0.5, "rgba(0,255,136,0.08)");
      grad.addColorStop(1, "rgba(0,255,136,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, canvas.width, 60);
      scanY = (scanY + 2) % canvas.height;

      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #000a04 0%, #000d08 60%, #001208 100%)",
        border: `1px solid ${hovered ? "rgba(0,255,136,0.45)" : "rgba(0,255,136,0.15)"}`,
        boxShadow: hovered
          ? "0 0 60px rgba(0,255,136,0.12), 0 0 120px rgba(0,255,136,0.06), inset 0 0 60px rgba(0,255,136,0.03)"
          : "0 0 30px rgba(0,255,136,0.05)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Corner brackets */}
      {(["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2",
         "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"] as const
      ).map((cls, i) => (
        <div
          key={i}
          className={`absolute w-6 h-6 ${cls} transition-all duration-500`}
          style={{ borderColor: hovered ? "rgba(0,255,136,0.9)" : "rgba(0,255,136,0.3)" }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10">

        {/* Top status bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#00ff88" }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#00ff88" }} />
            </div>
            <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase" style={{ color: "#00ff88" }}>
              SYSTEM ONLINE · OSINT INTELLIGENCE LAYER
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-green-700 tracking-widest">
            <span className="px-2 py-1 border border-green-900 rounded bg-green-950/50">AUTH:BYPASS</span>
            <span className="px-2 py-1 border border-green-900 rounded bg-green-950/50">ANON:TRUE</span>
          </div>
        </div>

        {/* Main title */}
        <div className="mb-4">
          <div className="text-[10px] font-mono text-green-800 tracking-[0.4em] uppercase mb-3">
            {'>'} PROJECT_NEXUS v2.1 — CLASSIFIED
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-4 font-mono"
            style={{
              color: "#00ff88",
              textShadow: hovered ? "0 0 40px rgba(0,255,136,0.6), 0 0 80px rgba(0,255,136,0.3)" : "0 0 20px rgba(0,255,136,0.3)",
            }}
          >
            <GlitchText text="OSINT DASHBOARD" active={hovered} />
          </h2>
          <p className="text-sm md:text-base font-mono text-green-700 max-w-2xl leading-relaxed">
            Open Source Intelligence Platform · Developer Privacy Audit · Infrastructure Reconnaissance · 
            Real-time data. Zero cost. No signup. Fully operational.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent my-8" />

        {/* Feature buttons - THE MAIN UPGRADE */}
        <div className="mb-8">
          <div className="text-[10px] font-mono text-green-800 tracking-[0.3em] uppercase mb-4">
            AVAILABLE MODULES [{FEATURES.length}]
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
                className="group text-left p-4 rounded-lg border transition-all duration-300 relative overflow-hidden"
                style={{
                  background: activeFeature === i ? "rgba(0,255,136,0.08)" : "rgba(0,255,136,0.03)",
                  borderColor: activeFeature === i ? "rgba(0,255,136,0.6)" : "rgba(0,255,136,0.15)",
                  boxShadow: activeFeature === i ? "0 0 20px rgba(0,255,136,0.1), inset 0 0 20px rgba(0,255,136,0.05)" : "none",
                }}
              >
                {/* Sweep effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, transparent 40%, rgba(0,255,136,0.04) 100%)" }}
                />
                <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{f.icon}</span>
                    <span
                      className="text-sm font-bold font-mono tracking-wider"
                      style={{ color: activeFeature === i ? "#00ff88" : "#4ade80" }}
                    >
                      {f.label}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${RISK_COLORS[f.risk]}`}>
                    {f.risk}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-green-800 leading-relaxed relative z-10">{f.desc}</p>
                <div
                  className="mt-2 text-[10px] font-mono font-bold transition-all duration-300 flex items-center gap-1"
                  style={{ color: activeFeature === i ? "#00ff88" : "transparent" }}
                >
                  ACTIVATE MODULE <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-green-500/15">
          <div className="text-xs font-mono text-green-800 space-y-1">
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 6 active modules · real API data</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Legal OSINT only · public data sources</div>
          </div>
          <Link
            href="/osint"
            className="group relative inline-flex items-center gap-3 font-mono font-black text-sm px-8 py-4 rounded-lg border transition-all duration-300 overflow-hidden"
            style={{
              color: "#00ff88",
              borderColor: "rgba(0,255,136,0.5)",
              background: "rgba(0,255,136,0.08)",
              boxShadow: "0 0 20px rgba(0,255,136,0.1)",
            }}
          >
            <span className="absolute inset-0 bg-[#00ff88] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <span className="relative">ENTER INTELLIGENCE DASHBOARD</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
