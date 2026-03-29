"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Cake, 
  Sparkles, 
  Zap, 
  CalendarDays,
  Target,
  Timer,
  TrendingUp,
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
    if (!birthDate) return null;
    const start = new Date(birthDate);
    const end = new Date(targetDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return null;

    // Exact Age Calculation
    let exactYears = end.getFullYear() - start.getFullYear();
    let exactMonths = end.getMonth() - start.getMonth();
    let exactDays = end.getDate() - start.getDate();

    if (exactDays < 0) {
        exactMonths--;
        // Get number of days in the previous month
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        exactDays += prevMonth.getDate();
    }
    if (exactMonths < 0) {
        exactYears--;
        exactMonths += 12;
    }

    // Total stats
    const totalMonths = exactYears * 12 + exactMonths;
    const totalWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    const totalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const totalHours = Math.floor(diffMs / (60 * 60 * 1000));
    const totalMinutes = Math.floor(diffMs / (60 * 1000));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Calculate Next Birthday
    const nextBday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (nextBday < end) nextBday.setFullYear(end.getFullYear() + 1);
    const daysUntilNext = Math.ceil((nextBday.getTime() - end.getTime()) / (24 * 60 * 60 * 1000));

    return {
      exactYears,
      exactMonths,
      exactDays,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilNext: daysUntilNext === 366 ? 0 : daysUntilNext
    };
  }, [birthDate, targetDate]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CosmoxHub Age Calculator",
    "operatingSystem": "Any",
    "applicationCategory": "ToolApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
       "Exact Age Calculation (Years, Months, Days)",
       "Detailed life breakdown in hours and seconds",
       "Next Birthday Countdown Timer",
       "Client-side Privacy Data Protection"
    ]
  };

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age and see a specific breakdown of your life in months, weeks, days, hours, and seconds."
      icon={Cake}
      color="#ec4899"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Input Panel */}
        <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-600 to-rose-600 shadow-[0_2px_15px_rgba(236,72,153,0.3)]" />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <label htmlFor="birthDate" className="text-slate-400 text-sm font-bold block">Date of Birth</label>
              <input 
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-lg font-bold rounded-2xl px-6 py-4 outline-none focus:border-pink-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="targetDate" className="text-slate-400 text-sm font-bold block">Calculate Age At</label>
              <input 
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-lg font-bold rounded-2xl px-6 py-4 outline-none focus:border-rose-500/50 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <AnimatePresence mode="wait">
          {!lifeStats ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] text-center px-8"
            >
              <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center mb-6 border border-pink-500/20">
                  <CalendarDays className="w-10 h-10 text-pink-500 opacity-40" />
              </div>
              <h3 className="text-2xl font-black text-white/40 mb-2">Awaiting Input</h3>
              <p className="max-w-xs text-slate-500 font-medium">
                  Please select your Date of Birth above to calculate your exact age.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Main Result Hero */}
              <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-10 opacity-10 pointer-events-none">
                      <Cake size={250} className="text-white" />
                  </div>
                  <div className="relative z-10 text-center md:text-left mb-8 md:mb-0 w-full">
                      <div className="text-pink-100 font-bold uppercase tracking-widest mb-6 text-sm">Your Exact Age</div>
                      <div className="grid grid-cols-3 gap-4 md:flex items-end md:gap-10 justify-center md:justify-start">
                          <div className="text-center">
                              <span className="block text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-2">{lifeStats.exactYears}</span>
                              <span className="text-sm md:text-lg font-bold text-pink-200">Years</span>
                          </div>
                          <div className="text-center">
                              <span className="block text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-2">{lifeStats.exactMonths}</span>
                              <span className="text-sm md:text-lg font-bold text-pink-200">Months</span>
                          </div>
                          <div className="text-center">
                              <span className="block text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-2">{lifeStats.exactDays}</span>
                              <span className="text-sm md:text-lg font-bold text-pink-200">Days</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="relative z-10 bg-black/20 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-center min-w-[200px] shrink-0 mt-6 md:mt-0">
                      <div className="text-pink-100/80 text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                          <Sparkles size={14} className="text-white" /> Next Birthday
                      </div>
                      <div className="text-4xl font-black text-white tabular-nums tracking-tighter mb-1">{lifeStats.daysUntilNext}</div>
                      <div className="text-xs font-bold uppercase text-pink-200 tracking-wider">Days Remaining</div>
                  </div>
              </div>

              {/* Extras Grid */}
              <h3 className="text-xl font-black text-white px-2 pt-4">Detailed Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnalyticCard icon={TrendingUp} label="Total Months" value={lifeStats.totalMonths} iconBg="bg-blue-500/20" iconColor="text-blue-400" />
                  <AnalyticCard icon={CalendarDays} label="Total Weeks" value={lifeStats.totalWeeks} iconBg="bg-cyan-500/20" iconColor="text-cyan-400" />
                  <AnalyticCard icon={Calendar} label="Total Days" value={lifeStats.totalDays} iconBg="bg-amber-500/20" iconColor="text-amber-400" />
                  <AnalyticCard icon={Clock} label="Total Hours" value={lifeStats.totalHours} iconBg="bg-emerald-500/20" iconColor="text-emerald-400" />
                  <AnalyticCard icon={Timer} label="Total Minutes" value={lifeStats.totalMinutes} iconBg="bg-indigo-500/20" iconColor="text-indigo-400" />
                  <AnalyticCard icon={Zap} label="Total Seconds" value={lifeStats.totalSeconds} iconBg="bg-rose-500/20" iconColor="text-rose-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
