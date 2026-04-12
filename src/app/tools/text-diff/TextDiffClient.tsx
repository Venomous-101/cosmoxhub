'use client';

import React, { useState, useMemo } from 'react';
import { diffWordsWithSpace, Change } from 'diff';
import { Trash2, GitCompare } from 'lucide-react';

export default function TextDiffClient() {
  const [original, setOriginal] = useState('This is the original text.\nIt has a few words that will change.');
  const [modified, setModified] = useState('This is the modified text.\nIt has some words that changed.');

  const diffResult = useMemo(() => {
    if (!original && !modified) return [];
    return diffWordsWithSpace(original, modified);
  }, [original, modified]);

  const clearAll = () => {
    setOriginal('');
    setModified('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[300px]">
        
        {/* Original Text */}
        <div className="space-y-3 flex flex-col h-full">
          <label className="block text-sm font-medium text-gray-400">Original Text</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste the original text here..."
            className="flex-grow w-full bg-[#111111] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-sm transition-colors"
          />
        </div>

        {/* Modified Text */}
        <div className="space-y-3 flex flex-col h-full">
          <label className="block text-sm font-medium text-gray-400">Modified Text</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste the modified text here..."
            className="flex-grow w-full bg-[#111111] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-sm transition-colors"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400 flex items-center gap-2">
          <GitCompare className="w-4 h-4" /> Diff Result
        </label>
        <div className="w-full min-h-[200px] p-4 bg-[#111111] border border-white/8 rounded-xl font-mono text-sm whitespace-pre-wrap overflow-x-auto text-gray-300">
          {diffResult.length === 0 ? (
            <span className="text-gray-500 italic">No differences to show. Enter original and modified text.</span>
          ) : (
            diffResult.map((part: Change, index: number) => {
              const colorClass = part.added 
                ? 'bg-emerald-500/20 text-emerald-300' 
                : part.removed 
                  ? 'bg-red-500/20 text-red-300 line-through' 
                  : 'text-gray-300';
              return (
                <span key={index} className={`rounded px-[2px] ${colorClass}`}>
                  {part.value}
                </span>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 bg-[#111111] p-4 sm:p-6 rounded-xl border border-white/8">
        <button
          onClick={clearAll}
          disabled={!original && !modified}
          className="w-full sm:w-auto px-8 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Text
        </button>
      </div>
    </div>
  );
}
