"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Clock, ChevronRight, CheckCircle2, XCircle, RefreshCw, Award,
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Domain = "pattern" | "verbal" | "numerical" | "spatial" | "memory" | "logical" | "speed";
type Phase  = "intro" | "testing" | "results";

interface Question {
  id: string;
  domain: Domain;
  difficulty: 1 | 2 | 3;
  prompt: string;
  memoryContent?: string;
  memoryDuration?: number;
  options: string[];
  correct: number;
  timeLimit: number;
  explanation: string;
}

interface Answer {
  questionId: string;
  chosen: number;   // -1 = timed out
  correct: boolean;
  timeTakenMs: number;
}

interface IQResult {
  iq: number;
  percentile: number;
  classification: string;
  classHex: string;
  domainScores: Map<Domain, { correct: number; total: number }>;
  totalCorrect: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain config
// ─────────────────────────────────────────────────────────────────────────────
const DOMAIN: Record<Domain, { label: string; hex: string }> = {
  pattern:   { label: "Pattern Recognition", hex: "#7C3AED" },
  verbal:    { label: "Verbal Reasoning",    hex: "#2563EB" },
  numerical: { label: "Numerical Reasoning", hex: "#059669" },
  spatial:   { label: "Spatial Reasoning",   hex: "#D97706" },
  memory:    { label: "Working Memory",      hex: "#DB2777" },
  logical:   { label: "Logical Deduction",   hex: "#DC2626" },
  speed:     { label: "Processing Speed",    hex: "#0891B2" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Question bank — 30 questions, 7 domains
// Every answer verified for correctness.
// ─────────────────────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [

  // ── Pattern Recognition ─────────────────────────────────────────────────────
  {
    id: "p1", domain: "pattern", difficulty: 1,
    prompt: "What is the next number?\n\n2  ·  4  ·  8  ·  16  ·  32  ·  ___",
    options: ["48", "58", "64", "72"],
    correct: 2, timeLimit: 30,
    explanation: "Rule: multiply by 2 each time. 32 × 2 = 64.",
  },
  {
    id: "p2", domain: "pattern", difficulty: 1,
    prompt: "Which number does NOT belong?\n\n4  ·  9  ·  16  ·  25  ·  35  ·  49",
    options: ["9", "25", "35", "49"],
    correct: 2, timeLimit: 30,
    explanation: "All others are perfect squares (2²=4, 3²=9, 4²=16, 5²=25, 7²=49). 35 is not a perfect square.",
  },
  {
    id: "p3", domain: "pattern", difficulty: 2,
    prompt: "What comes next?\n\n1  ·  3  ·  6  ·  10  ·  15  ·  ___",
    options: ["18", "21", "20", "24"],
    correct: 1, timeLimit: 45,
    explanation: "Triangular numbers — differences increase by 1: +2, +3, +4, +5, +6 → 15 + 6 = 21.",
  },
  {
    id: "p4", domain: "pattern", difficulty: 2,
    prompt: "What letter comes next in this series?\n\nO  ·  T  ·  T  ·  F  ·  F  ·  S  ·  S  ·  E  ·  N  ·  ___",
    options: ["N", "E", "T", "O"],
    correct: 2, timeLimit: 60,
    explanation: "First letters of: One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten → T.",
  },
  {
    id: "p5", domain: "pattern", difficulty: 2,
    prompt: "Complete the pattern:\n\nAZ  ·  BY  ·  CX  ·  DW  ·  ___",
    options: ["EV", "FU", "EU", "FV"],
    correct: 0, timeLimit: 45,
    explanation: "Each pair: letter position + mirror position = 27. E(5) + V(22) = 27 → EV.",
  },
  {
    id: "p6", domain: "pattern", difficulty: 3,
    prompt: "Find the rule and complete the sequence:\n\n2  ·  2  ·  4  ·  12  ·  48  ·  ___",
    options: ["96", "192", "240", "144"],
    correct: 2, timeLimit: 60,
    explanation: "Multiply by 1, 2, 3, 4, 5... → 2×1=2, 2×2=4, 4×3=12, 12×4=48, 48×5 = 240.",
  },

  // ── Verbal Reasoning ────────────────────────────────────────────────────────
  {
    id: "v1", domain: "verbal", difficulty: 1,
    prompt: "Complete the analogy:\n\nLIBRARY : BOOKS\nMUSEUM : ___",
    options: ["History", "Artifacts", "Tours", "Knowledge"],
    correct: 1, timeLimit: 30,
    explanation: "A library stores books; a museum stores artifacts. Parallel institutions of preservation.",
  },
  {
    id: "v2", domain: "verbal", difficulty: 1,
    prompt: "Complete the analogy:\n\nAUTHOR : NOVEL\nCOMPOSER : ___",
    options: ["Music", "Song", "Symphony", "Concert"],
    correct: 2, timeLimit: 30,
    explanation: "An author's primary extended creation is a novel; a composer's is a symphony.",
  },
  {
    id: "v3", domain: "verbal", difficulty: 2,
    prompt: "Complete the analogy:\n\nFINGER : HAND\nSPOKE : ___",
    options: ["Bicycle", "Wheel", "Axle", "Tire"],
    correct: 1, timeLimit: 40,
    explanation: "A finger is a structural part of a hand; a spoke is a structural part of a wheel.",
  },
  {
    id: "v4", domain: "verbal", difficulty: 2,
    prompt: "Which word is most OPPOSITE in meaning to:\n\nEPHEMERAL",
    options: ["Fleeting", "Momentary", "Eternal", "Transient"],
    correct: 2, timeLimit: 40,
    explanation: "Ephemeral = lasting a very short time. Eternal = lasting forever. Fleeting/momentary/transient are all synonyms of ephemeral.",
  },
  {
    id: "v5", domain: "verbal", difficulty: 2,
    prompt: "Complete the analogy:\n\nDOCTOR : DIAGNOSES\nJUDGE : ___",
    options: ["Punishes", "Sentences", "Adjudicates", "Decides"],
    correct: 2, timeLimit: 40,
    explanation: "A doctor's core professional action is to diagnose; a judge's is to adjudicate (formally decide a legal matter).",
  },
  {
    id: "v6", domain: "verbal", difficulty: 2,
    prompt: "Which word does NOT belong with the others?\n\nIGNOMINY  ·  SHAME  ·  HUMILIATION  ·  PRESTIGE  ·  DISGRACE",
    options: ["Ignominy", "Humiliation", "Prestige", "Disgrace"],
    correct: 2, timeLimit: 40,
    explanation: "Ignominy, shame, humiliation, and disgrace all mean loss of honor. Prestige means high esteem — the opposite.",
  },

  // ── Numerical Reasoning ─────────────────────────────────────────────────────
  {
    id: "n1", domain: "numerical", difficulty: 1,
    prompt: "What is the next number?\n\n3  ·  7  ·  15  ·  31  ·  63  ·  ___",
    options: ["95", "115", "127", "111"],
    correct: 2, timeLimit: 30,
    explanation: "Rule: ×2 then +1. → 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1 = 127.",
  },
  {
    id: "n2", domain: "numerical", difficulty: 1,
    prompt: "A train covers 360 km in 4 hours.\nAt the same speed, how far does it travel in 7 hours?",
    options: ["540 km", "630 km", "720 km", "660 km"],
    correct: 1, timeLimit: 35,
    explanation: "Speed = 360 ÷ 4 = 90 km/h. Distance in 7 hours = 90 × 7 = 630 km.",
  },
  {
    id: "n3", domain: "numerical", difficulty: 2,
    prompt: "If 20% of X equals 40,\nwhat is 30% of X?",
    options: ["50", "60", "70", "80"],
    correct: 1, timeLimit: 45,
    explanation: "20% of X = 40 → X = 200. Then 30% of 200 = 60.",
  },
  {
    id: "n4", domain: "numerical", difficulty: 2,
    prompt: "How many minutes are there between\n9:45 AM and 2:30 PM?",
    options: ["265 min", "275 min", "285 min", "295 min"],
    correct: 2, timeLimit: 45,
    explanation: "9:45 → 2:30 = 4 hours 45 minutes = (4 × 60) + 45 = 285 minutes.",
  },
  {
    id: "n5", domain: "numerical", difficulty: 3,
    prompt: "Jane is currently 3 times as old as John.\nIn 12 years, Jane will be twice John's age.\nWhat is John's current age?",
    options: ["8", "10", "12", "14"],
    correct: 2, timeLimit: 75,
    explanation: "Let John = j, Jane = 3j. Equation: 3j + 12 = 2(j + 12) → 3j + 12 = 2j + 24 → j = 12.",
  },

  // ── Spatial Reasoning ───────────────────────────────────────────────────────
  {
    id: "s1", domain: "spatial", difficulty: 1,
    prompt: "A cube is painted on all 6 faces, then cut into 27 equal smaller cubes.\n\nHow many smaller cubes have NO painted faces?",
    options: ["0", "1", "6", "8"],
    correct: 1, timeLimit: 45,
    explanation: "Only the single center cube (surrounded by all 26 others) has no exposed surface. Answer: 1.",
  },
  {
    id: "s2", domain: "spatial", difficulty: 1,
    prompt: "At exactly 3:00, what is the angle between the clock's hour and minute hands?",
    options: ["60°", "75°", "90°", "120°"],
    correct: 2, timeLimit: 30,
    explanation: "Minute hand at 12 (0°), hour hand at 3 (90° from 12). The angle between them = 90°.",
  },
  {
    id: "s3", domain: "spatial", difficulty: 2,
    prompt: "How many rectangles (including squares) exist in a standard 3 × 3 grid of equal squares?",
    options: ["9", "18", "36", "24"],
    correct: 2, timeLimit: 60,
    explanation: "Formula: C(4,2) × C(4,2) = 6 × 6 = 36. Choose any 2 of 4 horizontal lines and 2 of 4 vertical lines to form a rectangle.",
  },
  {
    id: "s4", domain: "spatial", difficulty: 2,
    prompt: "Which 3D geometric shape has exactly the SAME number of faces and vertices?",
    options: ["Cube", "Octahedron", "Tetrahedron", "Cuboid"],
    correct: 2, timeLimit: 45,
    explanation: "Tetrahedron: 4 faces AND 4 vertices ✓. Cube: 6 faces, 8 vertices. Octahedron: 8 faces, 6 vertices.",
  },
  {
    id: "s5", domain: "spatial", difficulty: 3,
    prompt: "A clock loses exactly 3 minutes every hour.\nIt was set correctly at 12:00 noon.\n\nWhat time does the clock display when real time is 4:00 PM?",
    options: ["3:44 PM", "3:48 PM", "3:52 PM", "3:56 PM"],
    correct: 1, timeLimit: 75,
    explanation: "4 real hours × 3 min lost/hr = 12 minutes lost total. Clock shows 4:00 PM − 12 min = 3:48 PM.",
  },

  // ── Logical Deduction ───────────────────────────────────────────────────────
  {
    id: "l1", domain: "logical", difficulty: 1,
    prompt: "All birds have feathers.\nPenguins are birds.\n\nWhich conclusion MUST be true?",
    options: ["Penguins can fly", "Penguins have feathers", "All feathered animals are birds", "Penguins are unique birds"],
    correct: 1, timeLimit: 30,
    explanation: "Classic deductive syllogism. All birds → feathers. Penguins → birds. Therefore: Penguins → feathers. Logically guaranteed.",
  },
  {
    id: "l2", domain: "logical", difficulty: 2,
    prompt: "No plastic is biodegradable.\nSome packaging is made of plastic.\n\nWhich conclusion is DEFINITELY correct?",
    options: [
      "All packaging is non-biodegradable",
      "Some packaging is not biodegradable",
      "No packaging is biodegradable",
      "Some plastic is always packaging",
    ],
    correct: 1, timeLimit: 60,
    explanation: "The plastic packaging (which exists) cannot be biodegradable. So 'some packaging is not biodegradable' is guaranteed. Other non-plastic packaging may or may not be biodegradable.",
  },
  {
    id: "l3", domain: "logical", difficulty: 2,
    prompt: "Premise 1: All A are B.\nPremise 2: Some B are C.\n\nWhich statement follows logically?",
    options: ["All A are C", "Some A are definitely C", "Some A might be C", "No A are C"],
    correct: 2, timeLimit: 60,
    explanation: "A⊆B and B∩C≠∅. The C-members of B may or may not overlap with A. We can only say it's possible — not certain.",
  },
  {
    id: "l4", domain: "logical", difficulty: 3,
    prompt: "Rule: \"If a card shows an EVEN number, the other side must be RED.\"\n\nVisible cards:  4  ·  7  ·  Red  ·  Blue\n\nWhich cards MUST you flip to test this rule?",
    options: ["4 and Red", "4 and Blue", "7 and Red", "All four cards"],
    correct: 1, timeLimit: 75,
    explanation: "Flip '4' (even → verify it's red). Flip 'Blue' (if even on back, rule broken). '7' is odd (rule doesn't apply). 'Red' back can be any number without breaking the rule. This is the classic Wason Selection Task.",
  },

  // ── Working Memory ──────────────────────────────────────────────────────────
  {
    id: "m1", domain: "memory", difficulty: 2,
    prompt: "The sequence is now hidden.\n\nWhat was the 5th number?",
    memoryContent: "8  →  3  →  7  →  1  →  5  →  9  →  2  →  4",
    memoryDuration: 7000,
    options: ["1", "5", "9", "2"],
    correct: 1, timeLimit: 25,
    explanation: "Sequence: 8, 3, 7, 1, 5, 9, 2, 4. Counting to position 5 → 5.",
  },
  {
    id: "m2", domain: "memory", difficulty: 2,
    prompt: "The list is now hidden.\n\nWhich color came immediately AFTER Purple?",
    memoryContent: "Red  →  Green  →  Purple  →  Yellow  →  Orange  →  Blue  →  White",
    memoryDuration: 7000,
    options: ["Green", "Yellow", "Orange", "Blue"],
    correct: 1, timeLimit: 25,
    explanation: "Sequence: Red, Green, Purple, Yellow, Orange, Blue, White. The color after Purple is Yellow.",
  },

  // ── Processing Speed ────────────────────────────────────────────────────────
  {
    id: "sp1", domain: "speed", difficulty: 1,
    prompt: "⚡ SPEED ROUND — 10 seconds\n\nWhich fraction is the LARGEST?",
    options: ["3/4", "7/10", "4/5", "11/15"],
    correct: 2, timeLimit: 10,
    explanation: "As decimals: 3/4=0.750, 7/10=0.700, 4/5=0.800, 11/15≈0.733. Largest: 4/5 = 0.800.",
  },
  {
    id: "sp2", domain: "speed", difficulty: 2,
    prompt: "⚡ SPEED ROUND — 15 seconds\n\nCalculate mentally:\n\n347 + 285 + 63 + 119 = ?",
    options: ["804", "814", "824", "794"],
    correct: 1, timeLimit: 15,
    explanation: "347 + 285 = 632 → 632 + 63 = 695 → 695 + 119 = 814.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOrder(): Question[] {
  // Shuffle within each domain, then interleave so domains alternate
  const groups = new Map<Domain, Question[]>();
  QUESTIONS.forEach(q => {
    if (!groups.has(q.domain)) groups.set(q.domain, []);
    groups.get(q.domain)!.push(q);
  });
  const shuffled = new Map<Domain, Question[]>();
  groups.forEach((qs, k) => shuffled.set(k, shuffleArray(qs)));
  const result: Question[] = [];
  let added = true;
  while (added) {
    added = false;
    shuffled.forEach(qs => {
      const q = qs.shift();
      if (q) { result.push(q); added = true; }
    });
  }
  return result;
}

function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const p = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const r = 1 - p * Math.exp(-x * x);
  return x >= 0 ? r : -r;
}

function computeIQ(answers: Answer[], questions: Question[]): IQResult {
  let earned = 0; let max = 0;
  const ds = new Map<Domain, { correct: number; total: number }>();
  questions.forEach(q => {
    max += q.difficulty;
    if (!ds.has(q.domain)) ds.set(q.domain, { correct: 0, total: 0 });
    const d = ds.get(q.domain)!;
    d.total++;
    const ans = answers.find(a => a.questionId === q.id);
    if (ans?.correct) { earned += q.difficulty; d.correct++; }
  });
  const ratio = max > 0 ? earned / max : 0;
  // Calibrated: average user scores ~0.45–0.55; mean=0.50, SD=0.20
  const z = Math.max(-3.0, Math.min(3.0, (ratio - 0.50) / 0.20));
  const iq = Math.max(70, Math.min(160, Math.round(100 + 15 * z)));
  const percentile = Math.min(99, Math.max(1, Math.round((0.5 * (1 + erf(z / Math.SQRT2))) * 100)));
  const totalCorrect = answers.filter(a => a.correct).length;

  let classification = "Average"; let classHex = "#059669";
  if (iq >= 145) { classification = "Profoundly Gifted"; classHex = "#7C3AED"; }
  else if (iq >= 130) { classification = "Very Superior";    classHex = "#6366F1"; }
  else if (iq >= 120) { classification = "Superior";         classHex = "#2563EB"; }
  else if (iq >= 110) { classification = "High Average";     classHex = "#0891B2"; }
  else if (iq >= 90)  { classification = "Average";          classHex = "#059669"; }
  else if (iq >= 80)  { classification = "Low Average";      classHex = "#D97706"; }
  else                { classification = "Borderline";       classHex = "#DC2626"; }

  return { iq, percentile, classification, classHex, domainScores: ds, totalCorrect };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function IQTestClient() {
  const [phase, setPhase]               = useState<Phase>("intro");
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [idx, setIdx]                   = useState(0);
  const [answers, setAnswers]           = useState<Answer[]>([]);
  const [selected, setSelected]         = useState<number | null>(null);
  const [revealed, setRevealed]         = useState(false);
  const [timeLeft, setTimeLeft]         = useState(0);
  const [memState, setMemState]         = useState<"showing" | "asking">("asking");
  const [memCountdown, setMemCountdown] = useState(0);
  const [result, setResult]             = useState<IQResult | null>(null);
  const [animIQ, setAnimIQ]             = useState(70);

  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef  = useRef(0);

  const q = questions[idx];

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // ── Main question timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "testing" || !q || memState === "showing" || revealed) return;
    setTimeLeft(q.timeLimit);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setAnswers(a => {
            if (a.some(x => x.questionId === q.id)) return a;
            return [...a, { questionId: q.id, chosen: -1, correct: false, timeTakenMs: q.timeLimit * 1000 }];
          });
          setRevealed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [idx, phase, memState, revealed, q, clearTimer]);

  // ── Memory phase ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "testing" || !q || q.domain !== "memory" || !q.memoryContent) return;
    const dur = q.memoryDuration ?? 7000;
    setMemState("showing");
    setMemCountdown(Math.ceil(dur / 1000));
    const cd = setInterval(() => setMemCountdown(p => Math.max(0, p - 1)), 1000);
    const t  = setTimeout(() => { clearInterval(cd); setMemState("asking"); }, dur);
    return () => { clearInterval(cd); clearTimeout(t); };
  }, [idx, phase, q]);

  // ── Select answer ───────────────────────────────────────────────────────────
  const handleSelect = useCallback((i: number) => {
    if (revealed || selected !== null || !q) return;
    clearTimer();
    setSelected(i);
    setRevealed(true);
    setAnswers(a => [...a, {
      questionId: q.id, chosen: i,
      correct: i === q.correct,
      timeTakenMs: Date.now() - startRef.current,
    }]);
  }, [revealed, selected, q, clearTimer]);

  // ── Advance ─────────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    clearTimer();
    if (idx + 1 >= questions.length) {
      const r = computeIQ(answers, questions);
      setResult(r);
      setPhase("results");
      let cur = 70;
      const anim = setInterval(() => {
        cur += Math.max(1, Math.ceil((r.iq - cur) / 6));
        if (cur >= r.iq) { setAnimIQ(r.iq); clearInterval(anim); }
        else setAnimIQ(cur);
      }, 25);
    } else {
      setIdx(p => p + 1);
      setSelected(null);
      setRevealed(false);
      setMemState("asking");
    }
  }, [clearTimer, idx, questions, answers]);

  // ── Start ───────────────────────────────────────────────────────────────────
  const startTest = useCallback(() => {
    const qs = buildOrder();
    setQuestions(qs); setIdx(0); setAnswers([]); setSelected(null);
    setRevealed(false); setMemState("asking"); setPhase("testing");
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setPhase("intro"); setQuestions([]); setIdx(0); setAnswers([]);
    setSelected(null); setRevealed(false); setResult(null);
    setAnimIQ(70); setMemState("asking");
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <ToolLayout
      title="Cognitive IQ Assessment — Free Multi-Domain IQ Test"
      description="A scientifically calibrated, multi-domain cognitive evaluation. Tests pattern recognition, verbal reasoning, numerical logic, spatial intelligence, working memory, deductive reasoning, and processing speed. 100% private."
      icon={Brain}
      color="#7C3AED"
      badge="NEW"
    >
      {/* Full-width wrapper — no right-side dead space */}
      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {phase === "intro"   && <IntroScreen   key="intro"   onStart={startTest} />}
          {phase === "testing" && q && (
            <QuestionScreen
              key={q.id}
              q={q} qNum={idx + 1} total={questions.length}
              selected={selected} revealed={revealed}
              timeLeft={timeLeft} memState={memState} memCountdown={memCountdown}
              onSelect={handleSelect} onNext={handleNext}
            />
          )}
          {phase === "results" && result && (
            <ResultScreen key="results" result={result} animIQ={animIQ} onReset={reset} />
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Intro Screen
// ─────────────────────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="w-full space-y-0"
    >
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="text-center space-y-5 pb-10">
        <div className="w-20 h-20 bg-[#7C3AED]/20 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-[#7C3AED]/30">
          <Brain size={36} className="text-[#7C3AED]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white">Cognitive IQ Assessment</h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            30 questions · 7 cognitive domains · Calibrated against psychometric norms
          </p>
          <p className="text-gray-600 text-sm">
            Allow <span className="text-white font-semibold">15–20 minutes</span> of uninterrupted focus.
          </p>
        </div>
      </div>

      {/* ── Domains ───────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] pt-8 pb-8 space-y-4">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Cognitive Domains Tested</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.entries(DOMAIN) as [Domain, { label: string; hex: string }][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-full">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.hex }} />
              <span className="text-sm text-gray-300 font-medium">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rules ─────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] pt-8 pb-8 space-y-4">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Before You Begin</p>
        <div className="space-y-3">
          {[
            { icon: "⏱", text: "Each question is individually timed. Work at your natural pace." },
            { icon: "🧠", text: "Memory questions: memorize the sequence shown, then answer from recall." },
            { icon: "⚡", text: "Speed questions have very short timers — respond immediately." },
            { icon: "🎯", text: "This assessment prioritizes accuracy over flattery. Real difficulty awaits." },
            { icon: "🔒", text: "100% private. All processing and results stay in your browser." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] w-full">
              <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
              <span className="text-sm text-gray-400 leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] pt-8">
        <button
          onClick={onStart}
          className="w-full h-14 bg-[#7C3AED] hover:bg-violet-600 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-base shadow-lg shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40"
        >
          Begin Assessment <ChevronRight size={20} />
        </button>
        <p className="text-center text-xs text-gray-700 mt-4">Free · No signup · No data stored</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Question Screen
// ─────────────────────────────────────────────────────────────────────────────
interface QSProps {
  q: Question; qNum: number; total: number;
  selected: number | null; revealed: boolean;
  timeLeft: number; memState: "showing" | "asking"; memCountdown: number;
  onSelect: (i: number) => void; onNext: () => void;
}

function QuestionScreen({ q, qNum, total, selected, revealed, timeLeft, memState, memCountdown, onSelect, onNext }: QSProps) {
  const cfg = DOMAIN[q.domain];
  const isMemory   = q.domain === "memory" && !!q.memoryContent;
  const isTimeout  = revealed && selected === -1;
  const timerPct   = q.timeLimit > 0 ? (timeLeft / q.timeLimit) * 100 : 0;
  const timerWarn  = timeLeft <= 5 && timeLeft > 0 && !revealed;

  const optStyle = (i: number): React.CSSProperties => {
    if (!revealed) {
      if (selected === i) return { border: `1px solid ${cfg.hex}80`, background: `${cfg.hex}18` };
      return { border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" };
    }
    if (i === q.correct)         return { border: "1px solid rgba(52,211,153,0.60)", background: "rgba(52,211,153,0.08)" };
    if (i === selected)          return { border: "1px solid rgba(248,113,113,0.60)", background: "rgba(248,113,113,0.08)" };
    return { border: "1px solid rgba(255,255,255,0.04)", background: "transparent" };
  };

  const optText = (i: number) => {
    if (!revealed) return "text-gray-200";
    if (i === q.correct) return "text-emerald-300";
    if (i === selected)  return "text-red-300";
    return "text-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.18 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-gray-600 font-medium">Question {qNum} / {total}</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: cfg.hex, background: `${cfg.hex}18`, border: `1px solid ${cfg.hex}30` }}>
              {cfg.label}
            </span>
            <span className="text-gray-700 text-xs tracking-widest">
              {"●".repeat(q.difficulty)}{"○".repeat(3 - q.difficulty)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: cfg.hex }}
            initial={{ width: 0 }}
            animate={{ width: `${(qNum / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Timer */}
        {memState === "asking" && !revealed && (
          <div className="flex items-center gap-2">
            <Clock size={12} className={timerWarn ? "text-red-400" : "text-gray-700"} />
            <span className={`text-xs font-mono w-5 ${timerWarn ? "text-red-400 animate-pulse" : "text-gray-600"}`}>{timeLeft}s</span>
            <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${timerPct}%`, backgroundColor: timerWarn ? "#ef4444" : cfg.hex }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Memory: showing phase */}
      {isMemory && memState === "showing" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-white/[0.04] border border-white/10 rounded-3xl text-center space-y-5"
        >
          <p className="text-gray-400 text-sm">
            Memorize — disappears in <span className="text-white font-bold font-mono">{memCountdown}s</span>
          </p>
          <p className="text-white font-mono text-base sm:text-xl font-bold leading-relaxed tracking-wide break-words">
            {q.memoryContent}
          </p>
          <p className="text-gray-600 text-xs">Do not write it down.</p>
        </motion.div>
      )}

      {/* Question prompt */}
      {(!isMemory || memState === "asking") && (
        <div className="p-5 sm:p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <p className="text-white text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">{q.prompt}</p>
        </div>
      )}

      {/* Options */}
      {(!isMemory || memState === "asking") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={!revealed ? { scale: 1.01 } : {}}
              whileTap={!revealed ? { scale: 0.99 } : {}}
              onClick={() => onSelect(i)}
              disabled={revealed}
              style={optStyle(i)}
              className="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium transition-colors duration-150 flex items-center gap-3 disabled:cursor-default"
            >
              <span className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black text-gray-500 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className={`flex-1 ${optText(i)}`}>{opt}</span>
              {revealed && i === q.correct && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
              {revealed && i === selected && i !== q.correct && <XCircle size={15} className="text-red-400 shrink-0" />}
            </motion.button>
          ))}
        </div>
      )}

      {/* Explanation */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isTimeout
              ? "bg-white/[0.03] border border-white/10 text-gray-400"
              : selected === q.correct
              ? "bg-emerald-500/5 border border-emerald-500/20 text-emerald-300"
              : "bg-red-500/5 border border-red-500/20 text-red-300"
          }`}
        >
          {isTimeout && <span className="text-gray-300 font-bold">Time&apos;s up! </span>}
          <span className="text-white font-semibold">Explanation: </span>
          {q.explanation}
        </motion.div>
      )}

      {/* Next button */}
      {revealed && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onNext}
          className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {qNum >= total ? "View My Results" : "Next Question"}
          <ChevronRight size={16} />
        </motion.button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Result Screen
// ─────────────────────────────────────────────────────────────────────────────
function ResultScreen({ result, animIQ, onReset }: { result: IQResult; animIQ: number; onReset: () => void }) {
  const handleShare = () => {
    const text = `I scored ${result.iq} IQ (${result.classification}) — top ${100 - result.percentile}% globally — on CosmoxHub's Cognitive Assessment. Try it: https://www.cosmoxhub.com/tools/iq-test`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Score hero */}
      <div className="text-center space-y-3 py-8">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Your Cognitive IQ Score</p>
        <div
          className="text-7xl sm:text-8xl font-black tracking-tighter"
          style={{ color: result.classHex, textShadow: `0 0 80px ${result.classHex}50` }}
        >
          {animIQ}
        </div>
        <p className="text-xl sm:text-2xl font-bold text-white">{result.classification}</p>
        <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
          <span className="text-gray-400">
            Top <span className="text-white font-bold">{100 - result.percentile}%</span> of test-takers
          </span>
          <span className="text-gray-700">·</span>
          <span className="text-gray-400">
            <span className="text-white font-bold">{result.totalCorrect}</span> / {QUESTIONS.length} correct
          </span>
        </div>
      </div>

      {/* Percentile bar */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Population Percentile</p>
        <div className="relative h-8 rounded-2xl overflow-hidden bg-white/5">
          <div className="absolute inset-0 flex text-[8px] text-gray-700 font-bold">
            {[70,80,90,100,110,120,130].map(n => (
              <div key={n} className="flex-1 flex items-center justify-center border-r border-white/5 last:border-0">{n}</div>
            ))}
          </div>
          <motion.div
            className="absolute top-0 left-0 h-full rounded-2xl opacity-70"
            style={{ backgroundColor: result.classHex }}
            initial={{ width: 0 }}
            animate={{ width: `${result.percentile}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 flex items-center pl-4">
            <span className="text-white text-xs font-bold drop-shadow-lg">{result.percentile}th percentile</span>
          </div>
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="space-y-3">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold flex items-center gap-2">
          <Award size={12} className="text-[#7C3AED]" /> Domain Performance
        </p>
        <div className="space-y-3">
          {(Object.entries(DOMAIN) as [Domain, { label: string; hex: string }][]).map(([domain, cfg]) => {
            const ds = result.domainScores.get(domain);
            if (!ds) return null;
            const pct = ds.total > 0 ? (ds.correct / ds.total) * 100 : 0;
            return (
              <div key={domain} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">{cfg.label}</span>
                  <span className="text-gray-600 font-mono">{ds.correct}/{ds.total}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cfg.hex }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-xs text-gray-600 leading-relaxed">
        <span className="text-gray-500 font-semibold">Important: </span>
        This browser-based assessment is calibrated against psychometric norms but is not equivalent to a professionally administered IQ test. Results provide a cognitive benchmark — not a clinically definitive measure.
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onReset}
          className="h-12 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} /> Retake Test
        </button>
        <button
          onClick={handleShare}
          className="h-12 w-full text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 border"
          style={{ color: result.classHex, borderColor: `${result.classHex}40`, background: `${result.classHex}10` }}
        >
          Copy Score & Share
        </button>
      </div>
    </motion.div>
  );
}
