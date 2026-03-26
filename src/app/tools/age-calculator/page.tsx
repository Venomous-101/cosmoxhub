"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState("");
  
  const calculateAge = () => {
    if (!dob) return null;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate > today) return { error: "Date of birth cannot be in the future." };
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get days in the previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBday) nextBday.setFullYear(today.getFullYear() + 1);
    
    const daysToBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
        years, months, days, totalDays: diffDays, 
        totalWeeks: Math.floor(diffDays / 7),
        totalHours: diffDays * 24,
        nextBdayDays: daysToBday === 365 ? 0 : daysToBday
    };
  };

  const result = calculateAge();

  return (
    <ToolLayout title="Age Calculator" description="Calculate your exact age in years, months, days, weeks, and hours. See how many days left until your next birthday." icon={CalendarDays} color="#f59e0b">
      <div className="card p-6 max-w-[600px] mx-auto w-full">
        <label htmlFor="dobInput" className="block text-slate-100 text-[0.95rem] mb-3 font-medium">
            Enter your Date of Birth:
        </label>
        <div className="flex gap-4">
            <input 
                id="dobInput"
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)}
                className="input-field p-4" 
                title="Date of Birth"
                aria-label="Date of Birth"
            />
            {dob && <button className="btn-secondary" onClick={() => setDob("")} title="Clear Date" aria-label="Clear Date">Clear</button>}
        </div>

        {/* Results */}
        {result && "error" in result ? (
            <div className="mt-6 text-red-500 text-sm">{result.error}</div>
        ) : result && (
            <div className="mt-8">
                {/* Main Age */}
                <div className="text-center p-6 bg-gradient-to-br from-[#f59e0b]/10 to-transparent border border-[#f59e0b]/20 rounded-xl mb-6">
                    <p className="text-slate-400 text-[0.85rem] uppercase tracking-wider mb-2">You are exactly</p>
                    <div className="flex flex-wrap justify-center gap-4 items-baseline">
                        <span className="text-4xl font-extrabold text-[#f59e0b] font-space">{result.years}</span>
                        <span className="text-slate-100">years</span>
                        <span className="text-4xl font-extrabold text-[#f59e0b] font-space">{result.months}</span>
                        <span className="text-slate-100">months</span>
                        <span className="text-4xl font-extrabold text-[#f59e0b] font-space">{result.days}</span>
                        <span className="text-slate-100">days</span>
                        <span className="text-slate-100">old.</span>
                    </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                        <p className="text-slate-400 text-xs mb-1">Total Days Lived</p>
                        <p className="text-slate-100 text-xl font-bold">{result.totalDays.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                        <p className="text-slate-400 text-xs mb-1">Total Weeks Lived</p>
                        <p className="text-slate-100 text-xl font-bold">{result.totalWeeks.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                        <p className="text-slate-400 text-xs mb-1">Total Hours Lived</p>
                        <p className="text-slate-100 text-xl font-bold">{result.totalHours.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                        <p className="text-emerald-500 text-xs mb-1 font-semibold">Days until next birthday 🎂</p>
                        <p className="text-slate-100 text-xl font-bold">{result.nextBdayDays} <span className="text-sm font-normal text-slate-400">days</span></p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </ToolLayout>
  );
}
