'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Eye, Code2 } from 'lucide-react';
import { marked } from 'marked';
import ToolLayout from '@/components/ToolLayout';

export default function MarkdownToHtmlClient() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nWrite some **Markdown** here!');
  const [html, setHtml] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const parsed = marked.parse(markdown);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHtml(parsed as string);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setHtml('<p>Error parsing markdown</p>');
    }
  }, [markdown]);

  const copyToClipboard = async () => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const clearAll = () => {
    setMarkdown('');
  };

  return (
    <ToolLayout
      title="Markdown to HTML Converter"
      description="Convert Markdown to clean HTML instantly. Preview the rendered output or copy raw HTML code. Free, browser-based, no data uploaded."
      icon={Code2}
      color="#7c3aed"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[500px]">
        
        {/* Editor Side */}
        <div className="space-y-3 flex flex-col h-full">
          <label htmlFor="markdownInput" className="block text-sm font-medium text-gray-400">Markdown Input</label>
          <textarea
            id="markdownInput"
            title="Markdown Input"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            className="flex-grow w-full bg-[#111111] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-sm transition-colors"
          />
        </div>

        {/* Output Side */}
        <div className="space-y-3 flex flex-col h-full relative">
          <div className="flex justify-between items-end">
            <label htmlFor="htmlOutput" className="block text-sm font-medium text-gray-400">Output Result</label>
            <div className="flex bg-[#111111] rounded-lg border border-white/8 overflow-hidden">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 ${viewMode === 'preview' ? 'bg-[#7C3AED] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 ${viewMode === 'code' ? 'bg-[#7C3AED] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Code2 className="w-3 h-3" /> HTML
              </button>
            </div>
          </div>
          
          <div className="flex-grow relative bg-[#111111] border border-white/8 rounded-xl overflow-hidden flex flex-col">
            {viewMode === 'preview' ? (
              <div 
                className="w-full h-full p-4 overflow-y-auto prose prose-invert prose-p:text-gray-300 max-w-none text-sm break-words"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <textarea
                id="htmlOutput"
                title="HTML Output"
                readOnly
                value={html}
                className="w-full h-full bg-transparent text-[#A78BFA] p-4 focus:outline-none resize-none font-mono text-xs sm:text-sm"
              />
            )}
            
            {html && viewMode === 'code' && (
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-gray-400 hover:text-white rounded-lg border border-white/8 transition-colors flex items-center justify-center group"
                title="Copy HTML"
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
          onClick={copyToClipboard}
          disabled={!html}
          className="flex-1 sm:flex-none min-w-[140px] px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy HTML
        </button>
        
        <div className="w-full sm:w-auto flex-grow sm:flex-grow-0" />
        
        <button
          onClick={clearAll}
          className="flex-1 sm:flex-none px-6 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
      </div>
    </ToolLayout>
  );
}
