'use client';
import { X } from 'lucide-react';

interface WelcomeToastProps {
  name: string;
  message: string;
  onDismiss: () => void;
}

export function WelcomeToast({ name, message, onDismiss }: WelcomeToastProps) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9998] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
      <div
        className="flex items-center gap-3 bg-[#111111] border border-[#7C3AED]/30 rounded-2xl px-4 py-3.5 shadow-2xl shadow-black/50 cursor-pointer hover:border-[#7C3AED]/60 transition-all duration-200"
        onClick={onDismiss}
        role="status"
        aria-live="polite"
      >
        {/* Avatar */}
        <div className="w-9 h-9 bg-[#7C3AED] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 select-none">
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{message}</p>
          <p className="text-gray-500 text-xs">CosmoxHub is ready for you ⚡</p>
        </div>

        {/* Dismiss */}
        <button
          aria-label="Dismiss"
          className="text-gray-600 hover:text-white transition-colors p-1 shrink-0"
          onClick={e => { e.stopPropagation(); onDismiss(); }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
