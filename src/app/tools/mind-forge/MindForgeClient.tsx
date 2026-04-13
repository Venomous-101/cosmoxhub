"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO ENGINE — Web Audio API (zero packages)
// ─────────────────────────────────────────────────────────────────────────────
function createAudioEngine() {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

  const playTone = (
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.3
  ) => {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch { /* audio blocked — silently fail */ }
  };

  return {
    success:  () => { playTone(523, 0.1); setTimeout(() => playTone(659, 0.1), 100); setTimeout(() => playTone(784, 0.15), 200); },
    error:    () => { playTone(300, 0.15, "sawtooth", 0.2); setTimeout(() => playTone(200, 0.2, "sawtooth", 0.2), 150); },
    tick:     () => playTone(800, 0.05, "square", 0.15),
    levelUp:  () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.12), i * 80)); },
    gameOver: () => { [400, 350, 300, 250].forEach((f, i) => setTimeout(() => playTone(f, 0.15, "sawtooth", 0.2), i * 100)); },
    click:    () => playTone(600, 0.04, "square", 0.1),
  };
}

type AudioEngine = ReturnType<typeof createAudioEngine>;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type GameId     = "memory" | "focus" | "pattern" | "speed" | "words";
type Phase      = "home" | "playing" | "result";
type Difficulty = "easy" | "medium" | "hard";

interface Score {
  gameId:   GameId;
  score:    number;
  level:    number;
  accuracy: number;
  date:     string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────
function loadScores(): Score[] {
  try { return JSON.parse(localStorage.getItem("mindforge_scores") || "[]"); }
  catch { return []; }
}
function saveScore(s: Score) {
  try {
    const all = loadScores();
    all.unshift(s);
    localStorage.setItem("mindforge_scores", JSON.stringify(all.slice(0, 50)));
  } catch { /* storage unavailable */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 1 — MEMORY MATRIX  (Corsi block test)
// ─────────────────────────────────────────────────────────────────────────────
function MemoryMatrix({
  difficulty, onEnd, audio,
}: { difficulty: Difficulty; onEnd: (score: number, accuracy: number) => void; audio: AudioEngine; }) {
  const gridSize  = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
  const seqLength = difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7;

  const [memPhase,     setMemPhase]     = useState<"show" | "recall">("show");
  const [sequence,     setSequence]     = useState<number[]>([]);
  const [highlighted,  setHighlighted]  = useState<number | null>(null);
  const [userClicks,   setUserClicks]   = useState<number[]>([]);
  const [correct,      setCorrect]      = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [round,        setRound]        = useState(1);
  const [feedbackCell, setFeedbackCell] = useState<{ index: number; ok: boolean } | null>(null);

  // track latest values in refs to avoid stale closure issues inside timeouts
  const correctRef      = useRef(correct);
  const totalAnswersRef = useRef(totalAnswers);
  useEffect(() => { correctRef.current = correct; }, [correct]);
  useEffect(() => { totalAnswersRef.current = totalAnswers; }, [totalAnswers]);

  const generateSequence = useCallback((): number[] => {
    const cells = gridSize * gridSize;
    const seq: number[] = [];
    while (seq.length < seqLength) {
      const r = Math.floor(Math.random() * cells);
      if (!seq.includes(r)) seq.push(r);
    }
    return seq;
  }, [gridSize, seqLength]);

  const startRound = useCallback((seq: number[]) => {
    setSequence(seq);
    setUserClicks([]);
    setMemPhase("show");
    setFeedbackCell(null);

    seq.forEach((cell, i) => {
      setTimeout(() => {
        setHighlighted(cell);
        audio?.tick();
        setTimeout(() => {
          setHighlighted(null);
          if (i === seq.length - 1) {
            setTimeout(() => setMemPhase("recall"), 500);
          }
        }, 500);
      }, i * 800);
    });
  }, [audio]);

  // kick off first round once
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startRound(generateSequence());
  }, [generateSequence, startRound]);

  const handleCellClick = useCallback((index: number) => {
    if (memPhase !== "recall") return;

    setUserClicks(prev => {
      const pos       = prev.length;
      const isCorrect = sequence[pos] === index;

      setFeedbackCell({ index, ok: isCorrect });
      setTimeout(() => setFeedbackCell(null), 350);

      if (isCorrect) {
        audio?.success();
        setCorrect(c => c + 1);
        setTotalAnswers(t => t + 1);
        const newClicks = [...prev, index];

        if (newClicks.length === sequence.length) {
          // full sequence matched
          setTimeout(() => {
            if (round >= 5) {
              const c = correctRef.current + 1;
              const t = totalAnswersRef.current + 1;
              onEnd(c * 10, Math.round((c / t) * 100));
            } else {
              setRound(r => r + 1);
              setTimeout(() => startRound(generateSequence()), 600);
            }
          }, 400);
        }
        return newClicks;
      } else {
        audio?.error();
        setTotalAnswers(t => t + 1);
        setTimeout(() => {
          if (round >= 5) {
            const c = correctRef.current;
            const t = totalAnswersRef.current + 1;
            onEnd(c * 10, Math.round((c / t) * 100));
          } else {
            setRound(r => r + 1);
            setTimeout(() => startRound(generateSequence()), 700);
          }
        }, 600);
        return prev;
      }
    });
  }, [memPhase, sequence, audio, round, onEnd, startRound, generateSequence]);

  const cellBase = gridSize === 3 ? "w-20 h-20" : gridSize === 4 ? "w-16 h-16" : "w-12 h-12";

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Status row */}
      <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
        <span className="text-gray-400">Round <span className="text-white font-bold">{round}/5</span></span>
        <span className="text-gray-400">Score <span className="text-[#A78BFA] font-bold">{correct * 10}</span></span>
        <span className={`font-medium px-3 py-1 rounded-full text-xs border ${
          memPhase === "show"
            ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        }`}>
          {memPhase === "show" ? "👀 Watch carefully..." : "🎯 Click the highlighted cells in order"}
        </span>
      </div>

      {/* Grid */}
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => {
          const isHighlighted = highlighted === i;
          const feedbackOk    = feedbackCell?.index === i && feedbackCell.ok;
          const feedbackBad   = feedbackCell?.index === i && !feedbackCell.ok;
          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={memPhase === "show"}
              className={`${cellBase} rounded-2xl transition-all duration-150 border
                ${isHighlighted
                  ? "bg-[#7C3AED] border-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.6)] scale-110"
                  : feedbackOk
                  ? "bg-emerald-500 border-emerald-400 scale-110"
                  : feedbackBad
                  ? "bg-red-500 border-red-400 scale-90"
                  : memPhase === "recall"
                  ? "bg-[#1a1a2e] border-white/10 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/20 hover:scale-105 cursor-pointer"
                  : "bg-[#1a1a2e] border-white/5 cursor-default"
                }
              `}
            />
          );
        })}
      </div>

      {/* Sequence progress dots */}
      {memPhase === "recall" && (
        <div className="flex gap-1.5">
          {sequence.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
              i < userClicks.length ? "bg-[#7C3AED]" : "bg-white/10"
            }`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 2 — FOCUS FLOW  (Continuous Performance Test)
// ─────────────────────────────────────────────────────────────────────────────
function FocusFlow({
  difficulty, onEnd, audio,
}: { difficulty: Difficulty; onEnd: (score: number, accuracy: number) => void; audio: AudioEngine; }) {
  const shapes  = ["●", "■", "▲", "★", "♦", "⬟", "⬡"];
  const TARGET  = "★";
  const speed   = difficulty === "easy" ? 1400 : difficulty === "medium" ? 900 : 550;

  const [current,     setCurrent]     = useState("");
  const [hits,        setHits]        = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [total,       setTotal]       = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(30);
  const [feedback,    setFeedback]    = useState<"hit" | "false" | null>(null);
  const [active,      setActive]      = useState(true);

  const hitsRef        = useRef(0);
  const falseAlarmsRef = useRef(0);
  const currentRef     = useRef("");
  useEffect(() => { hitsRef.current = hits; }, [hits]);
  useEffect(() => { falseAlarmsRef.current = falseAlarms; }, [falseAlarms]);
  useEffect(() => { currentRef.current = current; }, [current]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let timerId:    ReturnType<typeof setInterval>;

    const showShape = () => {
      const isTarget = Math.random() < 0.35;
      const shape    = isTarget
        ? TARGET
        : shapes.filter(s => s !== TARGET)[Math.floor(Math.random() * (shapes.length - 1))];
      setCurrent(shape);
      setTotal(t => t + 1);
      setTimeout(() => setCurrent(""), speed - 80);
    };

    intervalId = setInterval(showShape, speed);
    timerId    = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalId);
          clearInterval(timerId);
          setActive(false);
          const h  = hitsRef.current;
          const fa = falseAlarmsRef.current;
          const acc = Math.max(0, Math.round((h / Math.max(1, h + fa)) * 100));
          setTimeout(() => onEnd(h * 10 - fa * 5, acc), 400);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => { clearInterval(intervalId); clearInterval(timerId); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTap = () => {
    if (!active) return;
    audio?.click();
    const cur = currentRef.current;
    if (cur === TARGET) {
      setHits(h => h + 1);
      setFeedback("hit");
      audio?.success();
    } else {
      setFalseAlarms(fa => fa + 1);
      setFeedback("false");
      audio?.error();
    }
    setTimeout(() => setFeedback(null), 280);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
        <span className="text-gray-400">Time <span className={`font-bold ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}>{timeLeft}s</span></span>
        <span className="text-gray-400">Hits <span className="text-emerald-400 font-bold">{hits}</span></span>
        <span className="text-gray-400">Errors <span className="text-red-400 font-bold">{falseAlarms}</span></span>
        <span className="text-gray-400">Seen <span className="text-gray-300 font-bold">{total}</span></span>
      </div>

      <p className="text-gray-400 text-sm text-center">
        Tap <strong className="text-white">ONLY</strong> when you see{" "}
        <strong className="text-yellow-400 text-2xl">★</strong> — ignore all other shapes
      </p>

      {/* Stimulus */}
      <div className="w-44 h-44 bg-[#111111] border border-white/8 rounded-3xl flex items-center justify-center shadow-inner">
        <span className={`text-7xl transition-all duration-75 select-none ${
          current === TARGET ? "text-yellow-400 scale-110" :
          current           ? "text-gray-400" : "opacity-0"
        }`}>
          {current || "·"}
        </span>
      </div>

      {/* Tap button */}
      <button
        onClick={handleTap}
        disabled={!active}
        className={`w-36 h-36 rounded-full text-xl font-black text-white
          transition-all duration-75 active:scale-90 select-none
          ${feedback === "hit"
            ? "bg-emerald-500 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-105"
            : feedback === "false"
            ? "bg-red-600 scale-95"
            : "bg-[#7C3AED] hover:bg-violet-600 shadow-[0_0_30px_rgba(124,58,237,0.25)]"
          }
          disabled:opacity-40`}
      >
        TAP
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 3 — PATTERN PROPHET  (Raven's Matrices)
// ─────────────────────────────────────────────────────────────────────────────
const PATTERN_POOL = [
  { seq: [2, 4, 6, 8, "?"],          answer: 10,  options: [10, 9, 12, 16],   hint: "Add 2 each time" },
  { seq: [3, 6, 12, 24, "?"],         answer: 48,  options: [48, 36, 42, 30],  hint: "Multiply by 2" },
  { seq: [1, 4, 9, 16, "?"],          answer: 25,  options: [25, 20, 24, 36],  hint: "Perfect squares: 1², 2², 3²…" },
  { seq: [100, 90, 81, 73, "?"],      answer: 66,  options: [66, 65, 67, 64],  hint: "Differences: 10, 9, 8, 7…" },
  { seq: [1, 1, 2, 3, 5, 8, "?"],    answer: 13,  options: [13, 11, 14, 12],  hint: "Each = sum of the previous two" },
  { seq: [5, 10, 20, 40, "?"],        answer: 80,  options: [80, 60, 70, 90],  hint: "Double each time" },
  { seq: [64, 32, 16, 8, "?"],        answer: 4,   options: [4, 2, 6, 8],     hint: "Halve each time" },
  { seq: [2, 6, 12, 20, "?"],         answer: 30,  options: [30, 28, 32, 24],  hint: "Differences: 4, 6, 8, 10…" },
  { seq: [7, 14, 28, 56, "?"],        answer: 112, options: [112, 84, 98, 120], hint: "Multiply by 2" },
  { seq: [1, 3, 7, 15, "?"],          answer: 31,  options: [31, 29, 33, 27],  hint: "Double and add 1" },
  { seq: [2, 3, 5, 8, 13, "?"],       answer: 21,  options: [21, 18, 20, 24],  hint: "Add previous two numbers" },
  { seq: [1, 8, 27, 64, "?"],         answer: 125, options: [125, 100, 216, 81], hint: "Cube numbers: 1³, 2³, 3³…" },
  { seq: [3, 9, 27, 81, "?"],         answer: 243, options: [243, 162, 189, 324], hint: "Powers of 3" },
  { seq: [0, 3, 8, 15, "?"],          answer: 24,  options: [24, 20, 26, 22],  hint: "n² − 1 pattern" },
  { seq: [1, 2, 4, 7, 11, "?"],       answer: 16,  options: [16, 14, 18, 15],  hint: "Differences: 1, 2, 3, 4, 5…" },
];

function PatternProphet({
  difficulty, onEnd, audio,
}: { difficulty: Difficulty; onEnd: (score: number, accuracy: number) => void; audio: AudioEngine; }) {
  const pickRandom = useCallback(() => {
    const pool = difficulty === "hard" ? PATTERN_POOL : PATTERN_POOL.slice(0, 10);
    return pool[Math.floor(Math.random() * pool.length)];
  }, [difficulty]);

  const [current,   setCurrent]   = useState(() => pickRandom());
  const [options,   setOptions]   = useState<(string | number)[]>(() => [...current.options].sort(() => Math.random() - 0.5));
  const [selected,  setSelected]  = useState<number | null>(null);
  const [score,     setScore]     = useState(0);
  const [correct,   setCorrect]   = useState(0);
  const [total,     setTotal]     = useState(0);
  const [round,     setRound]     = useState(1);
  const [showHint,  setShowHint]  = useState(false);

  const TOTAL_ROUNDS = 8;

  const handleAnswer = (opt: string | number) => {
    if (selected !== null) return;
    const numOpt    = Number(opt);
    const isCorrect = numOpt === current.answer;
    setSelected(numOpt);
    isCorrect ? audio?.success() : audio?.error();

    const pts = isCorrect ? (showHint ? 5 : 10) : 0;
    if (isCorrect) { setScore(s => s + pts); setCorrect(c => c + 1); }
    setTotal(t => t + 1);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        const c = correct + (isCorrect ? 1 : 0);
        const t = total + 1;
        onEnd(score + pts, Math.round((c / t) * 100));
      } else {
        setRound(r => r + 1);
        const next = pickRandom();
        setCurrent(next);
        setOptions([...next.options].sort(() => Math.random() - 0.5));
        setSelected(null);
        setShowHint(false);
      }
    }, 900);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
        <span className="text-gray-400">Round <span className="text-white font-bold">{round}/{TOTAL_ROUNDS}</span></span>
        <span className="text-gray-400">Score <span className="text-[#A78BFA] font-bold">{score}</span></span>
        <span className="text-gray-400">Accuracy <span className="text-emerald-400 font-bold">
          {total > 0 ? Math.round((correct / total) * 100) : 100}%
        </span></span>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-widest">What comes next?</p>

      {/* Sequence tiles */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center">
        {current.seq.map((item, i) => (
          <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center
            text-lg font-black border transition-colors
            ${item === "?"
              ? "bg-[#7C3AED]/20 border-[#7C3AED]/50 text-[#A78BFA] text-2xl animate-pulse"
              : "bg-[#111111] border-white/10 text-white"}`}>
            {item}
          </div>
        ))}
      </div>

      {/* Hint toggle */}
      {!showHint
        ? <button onClick={() => setShowHint(true)} className="text-xs text-gray-700 hover:text-gray-500 transition-colors underline">Show hint (−5 pts)</button>
        : <p className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-2">💡 {current.hint}</p>
      }

      {/* Answer grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={selected !== null}
            className={`py-4 rounded-2xl text-xl font-black border transition-all duration-200
              ${selected === null
                ? "bg-[#111111] border-white/10 text-white hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10 hover:scale-105"
                : opt === current.answer
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : opt === selected
                ? "bg-red-500/20 border-red-500 text-red-300"
                : "bg-[#111111] border-white/5 text-gray-700"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 4 — SPEED SYNAPSE  (Hick's Law / reaction time)
// ─────────────────────────────────────────────────────────────────────────────
function SpeedSynapse({
  onEnd, audio,
}: { difficulty: Difficulty; onEnd: (score: number, accuracy: number) => void; audio: AudioEngine; }) {
  type RTPhase = "wait" | "ready" | "now" | "result" | "toosoon";
  const [rtPhase,      setRtPhase]      = useState<RTPhase>("wait");
  const [reactionTime, setReactionTime] = useState(0);
  const [times,        setTimes]        = useState<number[]>([]);
  const [round,        setRound]        = useState(1);
  const TOTAL_ROUNDS = 5;

  const startRef  = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const timesRef   = useRef<number[]>([]);
  useEffect(() => { timesRef.current = times; }, [times]);

  const startRound = useCallback(() => {
    setRtPhase("ready");
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setRtPhase("now");
      startRef.current = Date.now();
      audio?.tick();
    }, delay);
  }, [audio]);

  useEffect(() => {
    const t = setTimeout(() => startRound(), 500);
    return () => { clearTimeout(t); clearTimeout(timeoutRef.current); };
  }, [startRound]);

  const handleTap = () => {
    if (rtPhase === "ready") {
      clearTimeout(timeoutRef.current);
      setRtPhase("toosoon");
      audio?.error();
      setTimeout(() => startRound(), 1500);
      return;
    }
    if (rtPhase !== "now") return;

    const rt = Date.now() - startRef.current;
    setReactionTime(rt);
    const newTimes = [...timesRef.current, rt];
    setTimes(newTimes);
    audio?.success();
    setRtPhase("result");

    if (round >= TOTAL_ROUNDS) {
      const avg   = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
      const score = Math.max(0, Math.round(1000 - avg / 2));
      const acc   = Math.min(100, Math.round((280 / avg) * 100));
      setTimeout(() => onEnd(score, acc), 1500);
    } else {
      setTimeout(() => {
        setRound(r => r + 1);
        startRound();
      }, 900);
    }
  };

  const bgClass =
    rtPhase === "now"     ? "bg-emerald-500 shadow-[0_0_48px_rgba(52,211,153,0.5)] scale-105" :
    rtPhase === "toosoon" ? "bg-red-600 scale-95" :
    rtPhase === "result"  ? "bg-[#7C3AED] shadow-[0_0_30px_rgba(124,58,237,0.3)]" :
    "bg-[#1a1a1a] border border-white/8";

  const label =
    rtPhase === "wait"    ? "Get ready…"                    :
    rtPhase === "ready"   ? "Wait for green…"               :
    rtPhase === "now"     ? "TAP NOW!"                      :
    rtPhase === "toosoon" ? "Too soon! Wait for green."     :
    `${reactionTime} ms ⚡`;

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b) / times.length) : null;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
        <span className="text-gray-400">Round <span className="text-white font-bold">{round}/{TOTAL_ROUNDS}</span></span>
        {avg !== null && (
          <span className="text-gray-400">Avg <span className="text-[#A78BFA] font-bold">{avg} ms</span></span>
        )}
      </div>

      <button
        onClick={handleTap}
        className={`w-64 h-64 rounded-3xl text-2xl font-black text-white
          transition-all duration-100 select-none active:scale-90
          ${bgClass}`}
      >
        {label}
      </button>

      <div className="text-xs text-gray-700 text-center space-y-0.5">
        <p>Average human reaction time: <span className="text-gray-500">200–250 ms</span></p>
        <p>Trained athletes: <span className="text-gray-500">150–180 ms</span></p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 5 — WORD WEAVE  (FAS Verbal Fluency)
// ─────────────────────────────────────────────────────────────────────────────
const WORD_CATEGORIES = [
  { name: "Animals",     words: ["cat","dog","elephant","lion","tiger","bear","wolf","fox","horse","deer","rabbit","eagle","shark","whale","dolphin","parrot","giraffe","zebra","panda","koala"] },
  { name: "Countries",   words: ["france","japan","brazil","canada","india","china","germany","italy","spain","egypt","mexico","russia","australia","argentina","nigeria","poland","sweden","norway"] },
  { name: "Fruits",      words: ["apple","mango","banana","orange","grape","melon","lemon","peach","plum","cherry","pear","kiwi","fig","lime","guava","papaya","apricot","coconut","strawberry"] },
  { name: "Occupations", words: ["doctor","teacher","pilot","chef","lawyer","engineer","nurse","artist","writer","farmer","soldier","judge","dentist","architect","scientist","mechanic","plumber","surgeon"] },
  { name: "Sports",      words: ["football","cricket","tennis","swimming","boxing","cycling","hockey","golf","skiing","wrestling","rowing","archery","volleyball","basketball","badminton","judo","karate"] },
];

function WordWeave({
  difficulty, onEnd, audio,
}: { difficulty: Difficulty; onEnd: (score: number, accuracy: number) => void; audio: AudioEngine; }) {
  const [category]   = useState(() => WORD_CATEGORIES[Math.floor(Math.random() * WORD_CATEGORIES.length)]);
  const [input,      setInput]      = useState("");
  const [correct,    setCorrect]    = useState<string[]>([]);
  const [invalid,    setInvalid]    = useState<string[]>([]);
  const [submitted,  setSubmitted]  = useState<string[]>([]);
  const [timeLeft,   setTimeLeft]   = useState(difficulty === "easy" ? 60 : difficulty === "medium" ? 45 : 30);
  const [active,     setActive]     = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const correctRef   = useRef(correct);
  const submittedRef = useRef(submitted);
  useEffect(() => { correctRef.current = correct; }, [correct]);
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);

  useEffect(() => {
    inputRef.current?.focus();
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setActive(false);
          const c = correctRef.current.length;
          const s = submittedRef.current.length;
          setTimeout(() => onEnd(c * 10, s > 0 ? Math.round((c / s) * 100) : 0), 400);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = input.trim().toLowerCase();
    if (!word) return;
    setInput("");

    if (submitted.includes(word)) {
      // already tried
      audio?.error();
      return;
    }
    setSubmitted(s => [...s, word]);

    const isValid = category.words.includes(word);
    if (isValid) {
      setCorrect(c => [...c, word]);
      audio?.success();
    } else {
      setInvalid(i => [...i, word]);
      audio?.error();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
        <span className="text-gray-400">Time <span className={`font-bold ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}>{timeLeft}s</span></span>
        <span className="text-gray-400">Words <span className="text-emerald-400 font-bold">{correct.length}</span></span>
        <span className="text-gray-400">Invalid <span className="text-red-400 font-bold">{invalid.length}</span></span>
      </div>

      <div className="text-center space-y-1">
        <p className="text-gray-500 text-xs uppercase tracking-widest">Name as many as you can:</p>
        <h3 className="text-3xl font-black text-[#A78BFA]">{category.name}</h3>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={!active}
          placeholder="Type a word and press Enter…"
          className="flex-1 bg-[#111111] border border-white/10 rounded-xl px-4 py-3
            text-white placeholder-gray-700 focus:outline-none focus:border-[#7C3AED]/50
            text-sm transition-colors"
        />
        <button
          type="submit"
          disabled={!active}
          className="bg-[#7C3AED] hover:bg-violet-600 text-white font-bold px-5 py-3
            rounded-xl transition-colors disabled:opacity-40"
        >
          →
        </button>
      </form>

      <div className="w-full flex flex-wrap gap-2 max-h-40 overflow-y-auto">
        {correct.map(w => (
          <span key={w} className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 px-2.5 py-1 rounded-lg text-xs font-medium">
            ✓ {w}
          </span>
        ))}
        {invalid.map(w => (
          <span key={w} className="bg-red-500/10 text-red-500 border border-red-500/15 px-2.5 py-1 rounded-lg text-xs line-through opacity-60">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
const GAMES = [
  {
    id:        "memory"  as GameId,
    name:      "Memory Matrix",
    icon:      "🧩",
    desc:      "Remember and recall grid positions in order",
    cognitive: "Working Memory",
    science:   "Based on Corsi Block Test — measures visuospatial short-term memory capacity",
    gradient:  "from-violet-600 to-purple-800",
    hex:       "#7C3AED",
  },
  {
    id:        "focus"   as GameId,
    name:      "Focus Flow",
    icon:      "🎯",
    desc:      "Tap only the target shape — ignore distractors",
    cognitive: "Sustained Attention",
    science:   "Based on CPT (Continuous Performance Test) — clinical measure of attentional control",
    gradient:  "from-blue-500 to-indigo-700",
    hex:       "#3B82F6",
  },
  {
    id:        "pattern" as GameId,
    name:      "Pattern Prophet",
    icon:      "🔮",
    desc:      "Complete the number sequence",
    cognitive: "Fluid Intelligence",
    science:   "Based on Raven's Progressive Matrices — the most culture-fair IQ measurement",
    gradient:  "from-emerald-500 to-teal-700",
    hex:       "#10B981",
  },
  {
    id:        "speed"   as GameId,
    name:      "Speed Synapse",
    icon:      "⚡",
    desc:      "Test your neural reaction speed",
    cognitive: "Processing Speed",
    science:   "Based on Hick's Law — fundamental measure of neural transmission speed",
    gradient:  "from-yellow-400 to-orange-600",
    hex:       "#F59E0B",
  },
  {
    id:        "words"   as GameId,
    name:      "Word Weave",
    icon:      "💬",
    desc:      "Name as many items as you can before time runs out",
    cognitive: "Verbal Fluency",
    science:   "Based on FAS Word Fluency Test — measures frontal lobe executive function",
    gradient:  "from-pink-500 to-rose-700",
    hex:       "#EC4899",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MindForgeClient() {
  const [phase,        setPhase]        = useState<Phase>("home");
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [difficulty,   setDifficulty]   = useState<Difficulty>("medium");
  const [lastResult,   setLastResult]   = useState<{ score: number; accuracy: number } | null>(null);
  const [scores,       setScores]       = useState<Score[]>([]);
  const [audio,        setAudio]        = useState<AudioEngine>(null);

  useEffect(() => { setScores(loadScores()); }, []);

  const initAudio = (): AudioEngine => {
    if (audio) return audio;
    const eng = createAudioEngine();
    setAudio(eng);
    return eng;
  };

  const startGame = (gameId: GameId) => {
    const eng = initAudio();
    eng?.click();
    setSelectedGame(gameId);
    setPhase("playing");
  };

  const handleGameEnd = (score: number, accuracy: number) => {
    const result = { score: Math.max(0, score), accuracy: Math.min(100, Math.max(0, accuracy)) };
    setLastResult(result);

    if (selectedGame) {
      const entry: Score = {
        gameId:   selectedGame,
        score:    result.score,
        level:    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3,
        accuracy: result.accuracy,
        date:     new Date().toLocaleDateString(),
      };
      saveScore(entry);
      setScores(loadScores());
    }
    audio?.gameOver();
    setPhase("result");
  };

  const game = GAMES.find(g => g.id === selectedGame);

  const getInsight = (accuracy: number) => {
    if (accuracy >= 90) return { label: "🧠 Elite",       text: "Top-tier cognitive performance. Your neural efficiency rivals trained professionals. Maintain this with daily practice." };
    if (accuracy >= 75) return { label: "⚡ Strong",      text: "Above-average performance. You show well-developed cognitive control. Consistent training will push you further." };
    if (accuracy >= 55) return { label: "📈 Developing",  text: "Solid foundation. Daily focused practice of 5–10 minutes accelerates neural improvement significantly." };
    return                      { label: "🌱 Building",   text: "Every expert started here. Your brain is most plastic right now — the most trainable it will ever be. Keep going." };
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* ── NAV HEADER ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/5 px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-gray-500 hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors w-fit group">
            <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
            Back to All Tools
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-[0_0_30px_rgba(124,58,237,0.15)]">🧠</div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">MindForge</h1>
                <span className="text-xs font-bold bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-inner">
                  Brain Training
                </span>
              </div>
              <p className="text-gray-400 text-base mt-2 leading-relaxed max-w-2xl">
                Science-backed cognitive training. 5 games targeting memory, focus, pattern recognition, processing speed & verbal fluency.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-12">

        {/* ── HOME SCREEN ──────────────────────────────────────────────────────── */}
        {phase === "home" && (
          <div className="space-y-16">

            {/* Difficulty selector */}
            <div className="flex items-center gap-4 flex-wrap bg-[#111111] p-4 rounded-2xl w-fit border border-white/[0.04]">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold ml-2">Difficulty:</span>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200
                      ${difficulty === d
                        ? "bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] scale-105"
                        : "bg-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Game cards */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full"></span>
                <h2 className="text-lg text-white font-bold tracking-wide">Choose a Cognitive Domain</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {GAMES.map(g => {
                  const best = scores.filter(s => s.gameId === g.id).sort((a, b) => b.score - a.score)[0];
                  return (
                    <button
                      key={g.id}
                      onClick={() => startGame(g.id)}
                      className="group flex flex-col text-left bg-[#111111] border border-white/[0.06] rounded-3xl p-6
                        hover:border-[#7C3AED]/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] hover:-translate-y-1
                        transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Gradient glow effect in background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 transition-colors"></div>

                      <span className="text-5xl block mb-6 drop-shadow-lg">{g.icon}</span>

                      <h3 className="text-xl text-white font-black mb-1 group-hover:text-[#A78BFA] transition-colors relative z-10">
                        {g.name}
                      </h3>
                      <p className="text-xs font-bold mb-3 tracking-wide uppercase relative z-10" style={{ color: g.hex }}>{g.cognitive}</p>
                      
                      <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">{g.desc}</p>

                      <div className="w-full flex items-center justify-between pt-4 border-t border-white/5 relative z-10 mt-auto">
                        {best
                          ? <span className="text-xs text-gray-500 font-medium tracking-wide">Best: <span className="text-white font-black ml-1">{best.score} pts</span></span>
                          : <span className="text-xs text-gray-700 font-medium">No plays yet</span>
                        }
                        <span className="text-sm text-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity font-bold bg-[#7C3AED]/10 px-3 py-1 rounded-lg">Play →</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Neuroscience panel */}
            <div className="border-t border-white/[0.06] pt-12 space-y-8">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#10B981] rounded-full"></span>
                <h2 className="text-lg text-white font-bold tracking-wide">The Neuroscience Behind MindForge</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Neuroplasticity",  icon: "🧬", body: "Your brain physically changes with training. New synaptic connections form within days of consistent practice. (Draganski et al., 2004)" },
                  { title: "Working Memory",   icon: "🧠", body: "Working memory is a stronger predictor of academic & professional success than IQ alone in many studies. (Alloway & Alloway, 2010)" },
                  { title: "Transfer Effect",  icon: "🔄", body: "Cognitive training transfers to real-world tasks. Reaction time training improves driving. Memory training accelerates learning speed." },
                  { title: "Optimal Training", icon: "⏱️", body: "5–15 minutes of daily focused cognitive training outperforms 1 hour of passive learning. Consistency beats intensity." },
                ].map(card => (
                  <div key={card.title} className="bg-gradient-to-b from-[#161616] to-[#0A0A0A] border border-white/[0.05] rounded-3xl p-6 shadow-xl">
                    <div className="text-2xl mb-3">{card.icon}</div>
                    <h4 className="text-white text-sm font-bold mb-2 tracking-wide">{card.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed font-medium">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── PLAYING SCREEN ───────────────────────────────────────────────────── */}
        {phase === "playing" && game && (
          <div className="space-y-6">
            {/* Game header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{game.icon}</span>
                <div>
                  <span className="font-bold text-white">{game.name}</span>
                  <span
                    className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ color: game.hex, background: `${game.hex}18`, border: `1px solid ${game.hex}30` }}
                  >
                    {game.cognitive}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPhase("home")}
                className="text-xs text-gray-600 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                ✕ Quit
              </button>
            </div>

            {/* Game arena */}
            <div className="bg-[#111111] border border-white/[0.06] rounded-3xl p-8 flex items-center justify-center min-h-[440px]">
              {selectedGame === "memory"  && <MemoryMatrix  difficulty={difficulty} onEnd={handleGameEnd} audio={audio} />}
              {selectedGame === "focus"   && <FocusFlow     difficulty={difficulty} onEnd={handleGameEnd} audio={audio} />}
              {selectedGame === "pattern" && <PatternProphet difficulty={difficulty} onEnd={handleGameEnd} audio={audio} />}
              {selectedGame === "speed"   && <SpeedSynapse  difficulty={difficulty} onEnd={handleGameEnd} audio={audio} />}
              {selectedGame === "words"   && <WordWeave     difficulty={difficulty} onEnd={handleGameEnd} audio={audio} />}
            </div>
          </div>
        )}

        {/* ── RESULT SCREEN ────────────────────────────────────────────────────── */}
        {phase === "result" && lastResult && game && (() => {
          const insight = getInsight(lastResult.accuracy);
          return (
            <div className="max-w-md mx-auto space-y-8">

              {/* Score hero */}
              <div className="text-center space-y-4 pt-4">
                <div className="text-7xl">{game.icon}</div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-2">Your Score</p>
                  <div className="text-6xl font-black" style={{ color: game.hex }}>
                    {lastResult.score}
                    <span className="text-2xl ml-2 text-gray-500">pts</span>
                  </div>
                  <p className="text-[#A78BFA] mt-2 text-lg font-semibold">{lastResult.accuracy}% accuracy</p>
                </div>
              </div>

              {/* Cognitive insight */}
              <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/25 rounded-2xl p-6 space-y-2">
                <p className="text-[#A78BFA] font-bold text-sm">{insight.label}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{insight.text}</p>
              </div>

              {/* Science fact */}
              <div className="bg-[#111111] border border-white/[0.05] rounded-2xl p-5">
                <p className="text-xs text-gray-600 leading-relaxed">
                  🔬 <span className="text-gray-400">{game.science}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => startGame(selectedGame!)}
                  className="h-12 bg-[#7C3AED] hover:bg-violet-600 text-white font-bold rounded-2xl transition-colors text-sm"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setPhase("home")}
                  className="h-12 bg-white/5 hover:bg-white/10 border border-white/8 text-white font-bold rounded-2xl transition-colors text-sm"
                >
                  All Games
                </button>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
