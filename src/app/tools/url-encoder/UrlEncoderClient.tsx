'use client';

import React, { useState } from 'react';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';

export default function UrlEncoderClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (error) {
      setOutput('Error: Invalid input for encoding.');
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (error) {
      setOutput('Error: Invalid input for decoding.');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-400">Input String / URL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your URL or text here..."
            className="w-full h-48 sm:h-64 bg-[#111111] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-sm transition-colors"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-400">Output Result</label>
          <div className="relative h-48 sm:h-64">
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              className="w-full h-full bg-[#111111] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-sm transition-colors"
            />
            {output && (
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-gray-400 hover:text-white rounded-lg border border-white/8 transition-colors flex items-center justify-center group"
                title="Copy result"
              >
                <span className="absolute -top-8 right-0 bg-[#7C3AED] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 bg-[#111111] p-4 sm:p-6 rounded-xl border border-white/8">
        <button
          onClick={handleEncode}
          disabled={!input}
          className="flex-1 sm:flex-none min-w-[140px] px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Encode
        </button>
        <button
          onClick={handleDecode}
          disabled={!input}
          className="flex-1 sm:flex-none min-w-[140px] px-6 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-white/8 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[#A78BFA]"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Decode
        </button>
        <div className="w-full sm:w-auto flex-grow sm:flex-grow-0" />
        <button
          onClick={clearAll}
          disabled={!input && !output}
          className="flex-1 sm:flex-none px-6 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
