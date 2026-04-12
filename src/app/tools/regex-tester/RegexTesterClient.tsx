'use client';

import React, { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('[a-z]+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello world! This is a test string to match regex: 12345.');

  const result = useMemo(() => {
    let error = '';
    let matches: { text: string; isMatch: boolean }[] = [];
    let matchCount = 0;

    if (!pattern) return { error, matches, matchCount };

    try {
      const regex = new RegExp(pattern, flags);
      // To highlight matches properly, we need to split the string based on matches
      // using replace or matchAll if the 'g' flag is present.
      
      if (flags.includes('g')) {
        let lastIndex = 0;
        let match;
        // prevent infinite loop for zero-length match
        if (regex.source === '(?:)') {
           error = 'Empty capturing group is not supported in global mode for matching visualization.';
           return { error, matches, matchCount };
        }
        
        while ((match = regex.exec(testString)) !== null) {
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          if (match.index > lastIndex) {
            matches.push({ text: testString.substring(lastIndex, match.index), isMatch: false });
          }
          matches.push({ text: match[0], isMatch: true });
          lastIndex = match.index + match[0].length;
          matchCount++;
        }
        if (lastIndex < testString.length) {
          matches.push({ text: testString.substring(lastIndex), isMatch: false });
        }
      } else {
        // Non-global regex
        const match = regex.exec(testString);
        if (match) {
          if (match.index > 0) {
            matches.push({ text: testString.substring(0, match.index), isMatch: false });
          }
          matches.push({ text: match[0], isMatch: true });
          if (match.index + match[0].length < testString.length) {
            matches.push({ text: testString.substring(match.index + match[0].length), isMatch: false });
          }
          matchCount = 1;
        } else {
          matches.push({ text: testString, isMatch: false });
        }
      }
    } catch (e: any) {
      error = e.message;
    }

    return { error, matches, matchCount };
  }, [pattern, flags, testString]);

  const clearAll = () => {
    setPattern('');
    setTestString('');
  };

  return (
    <div className="space-y-6">
      
      {/* Pattern & Flags */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow space-y-3">
          <label className="block text-sm font-medium text-gray-400">Regular Expression</label>
          <div className="flex items-center bg-[#111111] border border-white/8 rounded-xl px-4 py-2 focus-within:border-[#7C3AED]/40 focus-within:ring-1 focus-within:ring-[#7C3AED]/40 transition-colors">
            <span className="text-gray-500 font-mono text-lg mr-2">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Pattern..."
              className="w-full bg-transparent text-[#A78BFA] font-mono focus:outline-none text-base"
            />
            <span className="text-gray-500 font-mono text-lg ml-2">/</span>
          </div>
        </div>
        
        <div className="w-full sm:w-32 space-y-3">
          <label className="block text-sm font-medium text-gray-400">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gmi"
            className="w-full bg-[#111111] text-[#A78BFA] border border-white/8 rounded-xl px-4 py-2 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 font-mono text-base transition-colors"
          />
        </div>
      </div>

      {result.error && (
        <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {result.error}
        </div>
      )}

      {/* Editor & Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[300px]">
        
        {/* Test String */}
        <div className="space-y-3 flex flex-col h-full">
          <label className="block text-sm font-medium text-gray-400">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Type text to test against..."
            className="flex-grow w-full bg-[#111111] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-sm transition-colors"
          />
        </div>

        {/* Highlight Result */}
        <div className="space-y-3 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-medium text-gray-400">Matches Result</label>
            <span className="text-xs px-2 py-1 bg-[#1A1A1A] text-gray-300 rounded border border-white/8">
              {result.matchCount} matches
            </span>
          </div>
          <div className="flex-grow w-full bg-[#111111] border border-white/8 rounded-xl p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-gray-300">
            {result.matches.length > 0 ? (
              result.matches.map((part, index) => (
                <span 
                  key={index} 
                  className={part.isMatch ? 'bg-[#7C3AED]/40 text-white rounded px-[2px] border-b border-[#7C3AED]' : ''}
                >
                  {part.text}
                </span>
              ))
            ) : (
              <span className="italic text-gray-500">No matches found.</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-[#111111] p-4 sm:p-6 rounded-xl border border-white/8">
        <button
          onClick={clearAll}
          disabled={!pattern && !testString}
          className="w-full sm:w-auto px-8 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </div>
  );
}
