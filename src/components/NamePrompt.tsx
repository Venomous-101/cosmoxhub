'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

interface NamePromptProps {
  onSave: (name: string) => void;
  onDismiss: () => void;
}

export function NamePrompt({ onSave, onDismiss }: NamePromptProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Card — slides up from bottom on mobile, centered on sm+ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome prompt"
        className="relative bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Close */}
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center mb-4 text-2xl select-none">
          👋
        </div>

        {/* Text */}
        <h3 className="text-white font-bold text-lg mb-1">
          Welcome to CosmoxHub!
        </h3>
        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
          What should we call you? We&apos;ll greet you personally every time you visit.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your first name..."
            autoFocus
            maxLength={30}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#7C3AED]/50 transition-all duration-200"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-[#7C3AED] hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200"
            >
              Let&apos;s go! ⚡
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="px-4 py-2.5 text-gray-500 hover:text-white text-sm transition-colors"
            >
              Skip
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-600 mt-3 text-center">
          Saved locally in your browser only. Never shared.
        </p>
      </div>
    </div>
  );
}
