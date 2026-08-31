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
  { label: "GitHub Intel",       desc: "Harvest exposed emails from public commits & repos",     icon: "⚡", risk: "HIGH" },
  { label: "Email Harvest",      desc: "Timezone & work pattern inference from online activity", icon: "📧", risk: "HIGH" },
  { label: "Infra Graph",        desc: "Map subdomains, IPs & reverse DNS pivots",        icon: "🌐", risk: "MED"  },
  { label: "Metadata Extractor", desc: "Deep forensics from PDF, DOCX & image files",    icon: "🔬", risk: "MED"  },
  { label: "Wayback Timeline",   desc: "Full historical archive & snapshot lookup",       icon: "📅", risk: "LOW"  },
  { label: "Username Race",      desc: "Probe 22+ platforms simultaneously in real-time", icon: "👤", risk: "MED"  },
];

const RISK_COLORS: Record<string, string> = {
  HIGH: "text-red-400 border-red-500/50 bg-red-500/20",
  MED:  "text-amber-400 border-amber-500/50 bg-amber-500/20",
  LOW:  "text-emerald-400 border-emerald-500/50 bg-emerald-500/20",
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
    const resize = () => { 
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth; 
        canvas.height = canvas.parentElement.offsetHeight; 
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Matrix rain columns
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1).map(() => Math.random() * canvas.height);
    let scanY = 0;
    let frame: number;

    const draw = () => {
      ctx.fillStyle = "rgba(4, 15, 10, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix rain characters
      ctx.fillStyle = "rgba(0, 255, 136, 0.22)";
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
      grad.addColorStop(0.5, "rgba(0,255,136,0.12)");
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
      className="relative w-full rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #02120a 0%, #051a10 60%, #072416 100%)",
        border: `1px solid ${hovered ? "rgba(0,255,136,0.6)" : "rgba(0,255,136,0.25)"}`,
        boxShadow: hovered
          ? "0 0 60px rgba(0,255,136,0.2), 0 0 120px rgba(0,255,136,0.1), inset 0 0 40px rgba(0,255,136,0.05)"
          : "0 0 30px rgba(0,255,136,0.08)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-70" />

      {/* Cyber Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Corner brackets */}
      {(["top-4 left-4 border-t-2 border-l-2", "top-4 right-4 border-t-2 border-r-2",
         "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"] as const
      ).map((cls, i) => (
        <div
          key={i}
          className={`absolute w-7 h-7 ${cls} transition-all duration-500 pointer-events-none`}
          style={{ borderColor: hovered ? "#00ff88" : "rgba(0,255,136,0.4)" }}
        />
      ))}

      {/* Card Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-12 flex flex-col justify-between h-full">

        {/* Top status bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00ff88]" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00ff88] shadow-[0_0_12px_#00ff88]" />
            </div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#00ff88]">
              SYSTEM ONLINE · OSINT RECONNAISSANCE SUITE
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300 tracking-wider">
            <span className="px-2.5 py-1 border border-emerald-500/30 rounded-md bg-emerald-950/60 font-bold">AUTH: BYPASS</span>
            <span className="px-2.5 py-1 border border-emerald-500/30 rounded-md bg-emerald-950/60 font-bold">ANON: ENCRYPTED</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="mb-8">
          <div className="text-xs font-mono text-emerald-400 font-semibold tracking-[0.3em] uppercase mb-2">
            &gt; PROJECT_NEXUS v2.4 — CLASSIFIED INTELLIGENCE
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 font-mono"
            style={{
              color: "#00ff88",
              textShadow: hovered ? "0 0 30px rgba(0,255,136,0.7), 0 0 60px rgba(0,255,136,0.4)" : "0 0 20px rgba(0,255,136,0.4)",
            }}
          >
            <GlitchText text="OSINT DASHBOARD" active={hovered} />
          </h2>
          <p className="text-sm md:text-base font-mono text-emerald-100/90 max-w-3xl leading-relaxed">
            Open Source Intelligence Platform · Developer Privacy Audit · Infrastructure Reconnaissance · 
            Real-time data. Zero cost. No signup required. Fully operational client-side engine.
          </p>
        </div>

        {/* Glowing Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/40 to-transparent my-6" />

        {/* Feature Modules Grid */}
        <div className="mb-8">
          <div className="text-xs font-mono text-emerald-400 font-bold tracking-[0.25em] uppercase mb-4 flex items-center justify-between">
            <span>AVAILABLE RECON MODULES [{FEATURES.length}]</span>
            <span className="text-[10px] text-emerald-500">100% PRIVATE</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
                className="group text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                style={{
                  background: activeFeature === i ? "rgba(0,255,136,0.12)" : "rgba(0,255,136,0.04)",
                  borderColor: activeFeature === i ? "rgba(0,255,136,0.7)" : "rgba(0,255,136,0.2)",
                  boxShadow: activeFeature === i ? "0 0 24px rgba(0,255,136,0.15)" : "none",
                }}
              >
                {/* Sweep highlight */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, transparent 40%, rgba(0,255,136,0.08) 100%)" }}
                />
                
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{f.icon}</span>
                      <span
                        className="text-sm font-bold font-mono tracking-wide"
                        style={{ color: activeFeature === i ? "#00ff88" : "#6ee7b7" }}
                      >
                        {f.label}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${RISK_COLORS[f.risk]}`}>
                      {f.risk}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-emerald-200/80 leading-relaxed relative z-10">{f.desc}</p>
                </div>

                <div
                  className="mt-3 text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 pt-2 border-t border-emerald-500/10"
                  style={{ color: activeFeature === i ? "#00ff88" : "rgba(0,255,136,0.6)" }}
                >
                  <span>LAUNCH MODULE</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-emerald-500/20">
          <div className="text-xs font-mono text-emerald-300 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span>6 Active OSINT Modules · Real API Data Engine</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400/80">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Ethical OSINT · Public Data Sources · Zero Telemetry</span>
            </div>
          </div>

          <Link
            href="/osint"
            className="group relative inline-flex items-center justify-center gap-3 font-mono font-black text-sm px-8 py-4 rounded-xl border transition-all duration-300 overflow-hidden shrink-0 w-full sm:w-auto text-center"
            style={{
              color: "#000a04",
              background: "#00ff88",
              borderColor: "#00ff88",
              boxShadow: "0 0 30px rgba(0,255,136,0.4)",
            }}
          >
            <span className="relative z-10">ENTER INTELLIGENCE DASHBOARD</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
