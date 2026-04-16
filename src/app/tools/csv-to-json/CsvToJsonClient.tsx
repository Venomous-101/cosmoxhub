'use client';

import { useState } from 'react';
import { Copy, Download, RefreshCcw, FileJson, Check, Plus, Trash2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function CsvToJsonClient() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    const input = csvInput.trim();
    if (!input) {
      setJsonOutput('');
      return;
    }

    try {
      const lines = input.split('\n');
      if (lines.length < 2) {
         setError('CSV must have at least one header row and one data row.');
         setJsonOutput('');
         return;
      }

      const parseLine = (line: string) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
             result.push(cur);
             cur = '';
          } else {
             cur += char;
          }
        }
        result.push(cur);
        return result.map(s => s.trim().replace(/^"|"$/g, ''));
      };

      const headers = parseLine(lines[0]);
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentLine = parseLine(lines[i]);
        const obj: Record<string, string> = {};
        
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j] || `Column${j}`] = currentLine[j] || '';
        }
        result.push(obj);
      }

      setJsonOutput(JSON.stringify(result, null, 2));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError('Invalid CSV format.');
      setJsonOutput('');
    }
  };

  const handleCopy = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCsvInput('');
    setJsonOutput('');
    setError('');
  };

  const loadSample = () => {
    setCsvInput(`id,name,email,role\n1,John Doe,john@example.com,Admin\n2,Jane Smith,jane@example.com,User\n3,Bob Wilson,bob@example.com,Editor`);
    setTimeout(handleConvert, 100);
  };

  return (
    <ToolLayout
      title="CSV to JSON Converter"
      description="Convert CSV data into valid structured JSON format instantly. Secure, browser-based, and offline-ready."
      icon={FileJson}
      color="#a855f7"
    >
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* INPUT */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 border-b-0 rounded-t-xl px-4 py-3">
            <span className="font-semibold text-zinc-300">CSV Input</span>
            <div className="flex gap-2">
              <button onClick={loadSample} className="text-xs flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1 px-3 rounded-lg transition-colors">
                <Plus className="w-3 h-3" /> Sample
              </button>
              <button onClick={handleClear} className="text-xs flex items-center gap-1 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-300 py-1 px-3 rounded-lg transition-colors">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="w-full flex-1 min-h-[400px] bg-[#111111] border border-zinc-800 rounded-b-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors resize-y"
            placeholder="id,name,role&#10;1,Alex,Developer&#10;2,Sarah,Designer"
          ></textarea>
          {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"> {error}</p>}
        </div>

        {/* OUTPUT */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 border-b-0 rounded-t-xl px-4 py-3">
            <span className="font-semibold text-zinc-300 flex items-center gap-2">
               <FileJson className="w-4 h-4 text-purple-400" /> JSON Output
            </span>
            <div className="flex gap-2">
               <button onClick={handleCopy} className="text-xs flex items-center gap-1 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 py-1 px-3 rounded-lg transition-colors">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="text-xs flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1 px-3 rounded-lg transition-colors">
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
          </div>
          <div className="w-full flex-1 min-h-[400px] bg-[#0A0A0A] border border-zinc-800 border-l-0 rounded-b-xl p-4 overflow-auto relative font-mono text-sm">
             {jsonOutput ? (
               <pre className="text-green-400 m-0">{jsonOutput}</pre>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-zinc-600 pointer-events-none">
                 Results will appear here
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={handleConvert}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-10 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
        >
          <RefreshCcw className="w-5 h-5" />
          Convert to JSON
        </button>
      </div>

      {/* RELATED TOOLS */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Related Developer Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a href="/tools/json-formatter" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">JSON Formatter</h3>
            <p className="text-sm text-zinc-400">Beautify and validate your JSON data.</p>
          </a>
          <a href="/tools/code-beautifier" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Code Beautifier</h3>
            <p className="text-sm text-zinc-400">Format JS, HTML, CSS instantly.</p>
          </a>
          <a href="/tools/regex-tester" className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-1">Regex Tester</h3>
            <p className="text-sm text-zinc-400">Test live RegEx expressions.</p>
          </a>
        </div>
      </div>
    </ToolLayout>
  );
}
