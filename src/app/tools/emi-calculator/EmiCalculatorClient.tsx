'use client';

import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Percent, CalendarDays, RefreshCcw } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function EmiCalculatorClient() {
  const [principal, setPrincipal] = useState<number | ''>(50000);
  const [rate, setRate] = useState<number | ''>(7.5);
  const [tenureYears, setTenureYears] = useState<number | ''>(5);

  const calculateEMI = () => {
    const p = Number(principal);
    const r = Number(rate) / 12 / 100; // Monthly interest rate
    const n = Number(tenureYears) * 12; // Total number of months

    if (!p || !r || !n || p <= 0 || r < 0 || n <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    if (r === 0) {
       const emi = p / n;
       return {
         emi,
         totalInterest: 0,
         totalPayment: p
       };
    }

    const emi = p * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi,
      totalInterest,
      totalPayment
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = useMemo(() => calculateEMI(), [principal, rate, tenureYears]);

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setTenureYears('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <ToolLayout
      title="EMI Calculator"
      description="Calculate Equated Monthly Installments for home, car, or personal loans instantly. Professional, secure, and offline-ready."
      icon={Calculator}
      color="#10b981"
    >
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* INPUTS */}
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-400" />
              Loan Details
            </h2>
            <button
              onClick={handleReset}
              className="text-zinc-500 hover:text-white transition-colors"
              title="Reset Fields"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Loan Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-zinc-500" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Interest Rate (Yearly)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent className="w-5 h-5 text-zinc-500" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
                  value={rate}
                  onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 7.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Loan Tenure (Years)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays className="w-5 h-5 text-zinc-500" />
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white mb-8 text-center">Payment Summary</h2>

          <div className="bg-[#111111] p-6 rounded-xl border border-zinc-800 mb-6 text-center shadow-inner">
            <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest mb-2">Monthly EMI</p>
            <p className="text-4xl font-bold text-green-400">{formatCurrency(results.emi)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800 text-center">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1">Total Interest</p>
              <p className="text-lg font-bold text-white">{formatCurrency(results.totalInterest)}</p>
            </div>
            <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800 text-center">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1">Total Payment</p>
              <p className="text-lg font-bold text-white">{formatCurrency(results.totalPayment)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED TOOLS */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Related Utilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a href="/tools/age-calculator" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-green-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Age Calculator</h3>
            <p className="text-sm text-zinc-400">Calculate age and time intervals.</p>
          </a>
          <a href="/tools/pomodoro-timer" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-green-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Pomodoro Timer</h3>
            <p className="text-sm text-zinc-400">Manage time intervals recursively.</p>
          </a>
          <a href="/tools/countdown-timer" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-green-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Countdown Timer</h3>
            <p className="text-sm text-zinc-400">Track exact time left until specific dates.</p>
          </a>
        </div>
      </div>
    </ToolLayout>
  );
}
