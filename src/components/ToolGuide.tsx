"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
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
    <div className="mt-12 space-y-10 max-w-4xl mx-auto">
      {/* Section Cards */}
      <div>
        <h2 className="text-base font-semibold text-gray-400 uppercase tracking-widest mb-5">
          {toolName} — Usage Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  {SectionIcon && (
                    <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                      <SectionIcon size={16} className="text-[#A78BFA]" />
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{section.content}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle size={16} className="text-gray-500" />
            <h2 className="text-base font-semibold text-gray-400 uppercase tracking-widest">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              >
                <h4 className="text-sm font-semibold text-white mb-2">{faq.question}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
