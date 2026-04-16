'use client';

import { useState } from 'react';
import { Copy, Type, Check } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function TextCaseProClient() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convertTo = (type: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab') => {
    let newText = text;
    if (type === 'upper') {
      newText = text.toUpperCase();
    } else if (type === 'lower') {
      newText = text.toLowerCase();
    } else if (type === 'title') {
      newText = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    } else if (type === 'camel') {
      newText = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    } else if (type === 'snake') {
      newText = text.replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_');
    } else if (type === 'kebab') {
      newText = text.replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-');
    }
    setText(newText);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.split(/\r\n|\r|\n/).length;

  return (
    <ToolLayout
      title="Text Case Pro"
      description="Advanced developer text transformations: camelCase, snake_case, kebab-case, and more. Instant and offline-ready."
      icon={Type}
      color="#a855f7"
    >
      {/* STATS */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 md:p-4 text-center">
          <div className="text-2xl font-bold text-white">{charCount}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Characters</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 md:p-4 text-center">
          <div className="text-2xl font-bold text-white">{wordCount}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Words</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 md:p-4 text-center">
          <div className="text-2xl font-bold text-white">{lineCount}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Lines</div>
        </div>
      </div>

      {/* MAIN TOOL */}
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 md:p-8 mb-12 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
           {/* Controls */}
           <div className="flex flex-wrap gap-2">
             <button onClick={() => convertTo('upper')} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">UPPERCASE</button>
             <button onClick={() => convertTo('lower')} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">lowercase</button>
             <button onClick={() => convertTo('title')} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">Title Case</button>
             <button onClick={() => convertTo('camel')} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">camelCase</button>
             <button onClick={() => convertTo('snake')} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">snake_case</button>
             <button onClick={() => convertTo('kebab')} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">kebab-case</button>
           </div>
           
           <button onClick={handleCopy} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
           </button>
        </div>

        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[300px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors resize-y"
            placeholder="Type or paste your text here..."
        ></textarea>
        
        <div className="flex justify-end mt-4">
           <button onClick={() => setText('')} className="text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors">
             Clear Text
           </button>
        </div>
      </div>

      {/* RELATED TOOLS */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Related Utilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a href="/tools/word-counter" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Word Counter</h3>
            <p className="text-sm text-zinc-400">Advanced metrics and keyword density.</p>
          </a>
          <a href="/tools/whitespace-remover" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Whitespace Remover</h3>
            <p className="text-sm text-zinc-400">Clean up text formats instantly.</p>
          </a>
          <a href="/tools/case-converter" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Standard Case Converter</h3>
            <p className="text-sm text-zinc-400">Standard upper/lower case transforms.</p>
          </a>
        </div>
      </div>
    </ToolLayout>
  );
}
