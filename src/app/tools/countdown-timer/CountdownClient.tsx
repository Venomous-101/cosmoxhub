'use client';

import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Calendar, Clock, RotateCcw, Timer } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function CountdownClient() {
  const [targetDate, setTargetDate] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const [isActive, setIsActive] = useState(false);

  // Set default target to exactly 24 hours from now on mount
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tzOffset = tomorrow.getTimezoneOffset() * 60000;
    const localIso = new Date(tomorrow.getTime() - tzOffset).toISOString().slice(0, 16);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTargetDate(localIso);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && targetDate) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const distance = target - now;

        if (distance <= 0) {
          setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
          setIsActive(false);
          clearInterval(interval);
          return;
        }

        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, targetDate]);

  const startCountdown = () => {
    if (targetDate) setIsActive(true);
  };

  const resetCountdown = () => {
    setIsActive(false);
    setTimeLeft(null);
  };

  return (
    <ToolLayout
      title="Countdown Timer"
      description="Create precise, down-to-the-second countdowns for your next big event, product launch, or holiday. 100% browser-side, no server required."
      icon={Timer}
      color="#7c3aed"
    >
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 md:p-10 mb-12 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-zinc-400 mb-2">Event Name (Optional)</label>
            <input 
              id="eventName"
              type="text" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Product Launch, New Year..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              disabled={isActive}
            />
          </div>
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-zinc-400 mb-2">Target Date & Time</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                id="targetDate"
                title="Target Date and Time"
                type="datetime-local" 
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors [color-scheme:dark]"
                disabled={isActive}
              />
            </div>
          </div>
        </div>

        {!isActive && !timeLeft && (
          <div className="flex justify-center">
            <button 
              onClick={startCountdown}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 px-10 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transform hover:-translate-y-1"
            >
              Start Countdown
            </button>
          </div>
        )}

        {(isActive || timeLeft) && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {eventName && (
              <h2 className="text-2xl font-bold text-center text-white mb-8">{eventName}</h2>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { value: timeLeft?.d ?? 0, label: 'Days' },
                { value: timeLeft?.h ?? 0, label: 'Hours' },
                { value: timeLeft?.m ?? 0, label: 'Minutes' },
                { value: timeLeft?.s ?? 0, label: 'Seconds', highlight: true },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl p-6 text-center border ${item.highlight ? 'border-violet-800 bg-violet-900/20' : 'bg-zinc-900/80 border-zinc-800'}`}>
                  <div className={`text-5xl md:text-7xl font-mono font-bold mb-2 ${item.highlight ? 'text-violet-400' : 'text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400'}`}>
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className={`font-medium tracking-widest uppercase text-sm ${item.highlight ? 'text-violet-500/70' : 'text-zinc-500'}`}>{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button 
                onClick={resetCountdown}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Change Target
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <a href="/tools/pomodoro-timer" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-violet-500/50 transition-colors">
          <h3 className="font-semibold text-white mb-1">Pomodoro Timer</h3>
          <p className="text-sm text-zinc-400">Boost your productivity with timed focus.</p>
        </a>
        <a href="/tools/age-calculator" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-violet-500/50 transition-colors">
          <h3 className="font-semibold text-white mb-1">Age Calculator</h3>
          <p className="text-sm text-zinc-400">Calculate exact age to the second.</p>
        </a>
        <a href="/tools/word-counter" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-violet-500/50 transition-colors">
          <h3 className="font-semibold text-white mb-1">Word Counter</h3>
          <p className="text-sm text-zinc-400">Advanced metrics for your event copies.</p>
        </a>
      </div>
    </ToolLayout>
  );
}
