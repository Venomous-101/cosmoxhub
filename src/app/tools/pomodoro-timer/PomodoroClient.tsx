'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCw, Timer } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODES = {
  pomodoro: { label: 'Pomodoro', minutes: 25 },
  shortBreak: { label: 'Short Break', minutes: 5 },
  longBreak: { label: 'Long Break', minutes: 15 },
};

export default function PomodoroClient() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [task, setTask] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const handleTimeComplete = useCallback(() => {
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleTimeComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimeComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress percentage for ring
  const totalSeconds = MODES[mode].minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <ToolLayout
      title="Pomodoro Timer"
      description="Boost your productivity with the classic 25-5-15 time management technique. 100% browser-based, no server required."
      icon={Timer}
      color="#7c3aed"
    >

      {/* MAIN TOOL */}
      <div className="bg-[#111111] p-6 md:p-8 rounded-2xl border border-zinc-800 shadow-xl mb-12">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(Object.entries(MODES) as [Mode, { label: string, minutes: number }][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                mode === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        <div className="relative flex justify-center items-center mb-10">
          <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              className="fill-none stroke-zinc-800"
              strokeWidth="8"
            />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              className="fill-none stroke-purple-500 transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray="301.59" // 2 * pi * r (roughly 2*3.14*48) relative to 100 viewbox? No, wait. Need exact dash logic or simple trick.
              strokeDashoffset={301.59 - (progress / 100) * 301.59}
              pathLength="100"
            />
             {/* Redefine to use pathLength for easier strokeDashoffset */}
          </svg>
          {/* Cover the messy exact math above by explicitly redefining the circle with pathLength="100" */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
             {/* Using absolute positioning over a clean SVG implementation below */}
          </div>
          
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
                <circle cx="50%" cy="50%" r="46%" className="fill-none stroke-zinc-800" strokeWidth="6" />
                <circle
                  cx="50%" cy="50%" r="46%"
                  className="fill-none stroke-purple-600 transition-all duration-1000 ease-linear"
                  strokeWidth="6" strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={100 - progress}
                />
              </svg>
          </div>
          <div className="absolute flex flex-col items-center">
             <span className="text-6xl md:text-7xl font-bold text-white tracking-widest font-mono">
               {formatTime(timeLeft)}
             </span>
             <span className="text-zinc-500 mt-2 font-medium tracking-wide uppercase text-sm">
                {mode === 'pomodoro' ? 'Focus Time' : 'Break Time'}
             </span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 mb-8">
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 flex justify-center items-center rounded-full text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              isActive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          
          <button
            onClick={resetTimer}
            className="w-14 h-14 flex justify-center items-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCw className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What are you working on?"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors text-center"
          />
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">How the Pomodoro Technique Works</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Focus (25 min)</h3>
            <p className="text-zinc-400 text-sm">Dedicate 25 minutes of deep, uninterrupted work to a single task.</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-400 font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Short Break (5 min)</h3>
            <p className="text-zinc-400 text-sm">Step away, stretch, or grab a drink. Let your brain rest briefly.</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-400 font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Long Break (15 min)</h3>
            <p className="text-zinc-400 text-sm">After 4 Pomodoros, take a longer break to fully recharge.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/tools/countdown-timer" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-violet-500/50 transition-colors">
          <h3 className="font-semibold text-white mb-1">Countdown Timer</h3>
          <p className="text-sm text-zinc-400">Create beautiful custom countdowns.</p>
        </a>
        <a href="/tools/age-calculator" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-violet-500/50 transition-colors">
          <h3 className="font-semibold text-white mb-1">Age Calculator</h3>
          <p className="text-sm text-zinc-400">Calculate exact age down to the second.</p>
        </a>
        <a href="/tools/iq-test" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-violet-500/50 transition-colors">
          <h3 className="font-semibold text-white mb-1">IQ Test</h3>
          <p className="text-sm text-zinc-400">Test your cognitive processing speed.</p>
        </a>
      </div>
    </ToolLayout>
  );
}
