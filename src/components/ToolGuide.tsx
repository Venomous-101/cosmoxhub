"use client";

import { motion } from "framer-motion";
import { HelpCircle, Star, ShieldCheck, Zap, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface GuideSection {
  title: string;
  content: string;
  icon?: LucideIcon;
}

interface ToolGuideProps {
  toolName: string;
  sections: GuideSection[];
  faqs?: { question: string; answer: string }[];
}

export default function ToolGuide({ toolName, sections, faqs }: ToolGuideProps) {
  return (
    <div className="mt-16 space-y-16">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-3xl font-space font-bold text-white mb-3">
          Deep Dive: {toolName} Expert Guide
        </h2>
        <div className="h-1 w-20 bg-indigo-500 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-[#0a0a1f]/40 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                {section.icon ? <section.icon size={20} className="text-indigo-400" /> : <Star size={20} className="text-indigo-400" />}
              </div>
              <h3 className="text-xl font-space font-bold text-white">{section.title}</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      {faqs && faqs.length > 0 && (
        <section className="bg-indigo-500/5 rounded-3xl p-8 border border-indigo-500/10">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-space font-bold text-white">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-slate-200 font-bold flex items-start gap-2">
                  <span className="text-indigo-500 font-mono">Q.</span> {faq.question}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trust Moat */}
      <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-y border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <ShieldCheck size={18} /> 100% Browser Based
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Zap size={18} /> Zero Delay Processing
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Lock size={18} className="text-slate-400" /> No Data Collection
        </div>
      </div>
    </div>
  );
}
