"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Hourglass, 
  Cake, 
  Sparkles, 
  Zap, 
  CalendarDays,
  Target,
  Timer,
  History,
  TrendingUp,
  Settings
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

const AnalyticCard = ({ icon: Icon, label, value, iconBg, iconColor }: { icon: React.ElementType, label: string, value: number, iconBg: string, iconColor: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/[0.04] border border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.08] transition-all flex flex-col shadow-lg"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
        <Icon size={22} className="shrink-0" />
      </div>
      <div className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</div>
    </div>
    <div className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tighter truncate">
      {value.toLocaleString()}
    </div>
  </motion.div>
);

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const lifeStats = React.useMemo(() => {
    const start = new Date(birthDate);
    const end = new Date(targetDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return null;

    const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(diffMs / (30.44 * 24 * 60 * 60 * 1000));
    const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const minutes = Math.floor(diffMs / (60 * 1000));
    const seconds = Math.floor(diffMs / 1000);

    // Calculate Next Birthday
    const nextBday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (nextBday < end) nextBday.setFullYear(end.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBday.getTime() - end.getTime()) / (24 * 60 * 60 * 1000));

    return {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      daysUntilNext: daysUntil === 366 ? 0 : daysUntil
    };
  }, [birthDate, targetDate]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Elite Age Calculator & Life Analytics",
    "operatingSystem": "Any",
    "applicationCategory": "ToolApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Precision decade, year, month tracking",
       "High-res breakdown (Seconds, Minutes, Hours)",
       "Milestone countdown system",
       "Privacy-first client-side calculation",
       "Elite glassmorphic dashboard"
    ]
  };

  return (
    <ToolLayout
      title="Elite Age Calculator"
      description="Advanced Life Analytics Dashboard. Breakdown your journey into precision milestones from years down to seconds."
      icon={Hourglass}
      color="#ec4899"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">
        {/* Sidebar Controls */}
        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-600 to-rose-600 shadow-[0_2px_15px_rgba(236,72,153,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-pink-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Timeline Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">Date of Genesis</label>
                <div className="relative group/input">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-pink-500 transition-colors" />
                    <input 
                    type="date"
                    aria-label="Date of Genesis"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 text-white text-xs font-bold rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-pink-500/30 transition-all shadow-inner"
                    />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block font-black">Target Horizon</label>
                <div className="relative group/input">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-rose-500 transition-colors" />
                    <input 
                    type="date"
                    aria-label="Target Horizon"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 text-white text-xs font-bold rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-rose-500/30 transition-all"
                    />
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* Main Dashboard */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!lifeStats ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] text-center px-8"
              >
                <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center mb-6 border border-pink-500/20">
                    <CalendarDays className="w-10 h-10 text-pink-500 opacity-40" />
                </div>
                <h3 className="text-2xl font-black text-white/40 mb-2 uppercase tracking-[0.1em]">Awaiting Input</h3>
                <p className="max-w-xs text-slate-600 font-medium text-xs uppercase tracking-widest leading-loose">
                    Specify genesis and horizon dates to generate elite timeline analytics.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-pink-500/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <Cake size={120} className="text-white" />
                    </div>
                    <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                        <div className="text-pink-100/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Life Magnitude</div>
                        <div className="flex items-baseline gap-2 justify-center md:justify-start">
                            <span className="text-7xl font-black text-white tracking-tighter leading-none">{lifeStats.years}</span>
                            <span className="text-2xl font-bold text-pink-100 tracking-tighter">Elite Years</span>
                        </div>
                    </div>
                    
                    <div className="relative z-10 bg-black/20 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-center min-w-[200px]">
                        <div className="text-pink-100/60 text-[9px] font-black uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                            <Sparkles size={12} className="text-white" /> Next Milestone
                        </div>
                        <div className="text-3xl font-black text-white tabular-nums tracking-tighter">{lifeStats.daysUntilNext}</div>
                        <div className="text-[10px] font-black uppercase text-pink-100 tracking-[0.1em]">Days Remaining</div>
                    </div>
                </div>

                {/* Detailed Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnalyticCard icon={TrendingUp} label="Total Months" value={lifeStats.months} iconBg="bg-blue-500/20" iconColor="text-blue-400" />
                    <AnalyticCard icon={CalendarDays} label="Total Weeks" value={lifeStats.weeks} iconBg="bg-cyan-500/20" iconColor="text-cyan-400" />
                    <AnalyticCard icon={Calendar} label="Total Days" value={lifeStats.days} iconBg="bg-amber-500/20" iconColor="text-amber-400" />
                    <AnalyticCard icon={Clock} label="Total Hours" value={lifeStats.hours} iconBg="bg-emerald-500/20" iconColor="text-emerald-400" />
                    <AnalyticCard icon={Timer} label="Total Minutes" value={lifeStats.minutes} iconBg="bg-indigo-500/20" iconColor="text-indigo-400" />
                    <AnalyticCard icon={Zap} label="Total Seconds" value={lifeStats.seconds} iconBg="bg-rose-500/20" iconColor="text-rose-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
}
