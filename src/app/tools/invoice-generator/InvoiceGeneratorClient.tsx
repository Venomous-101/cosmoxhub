'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Receipt } from 'lucide-react';

export default function InvoiceGeneratorClient() {
  const [prefix, setPrefix] = useState('INV-');
  const [suffix, setSuffix] = useState('-2026');
  const [startNumber, setStartNumber] = useState(1);
  const [padding, setPadding] = useState(4);
  const [quantity, setQuantity] = useState(50);
  const [copied, setCopied] = useState(false);

  const generatedInvoices = useMemo(() => {
    const results = [];
    const maxQty = Math.min(Math.max(1, quantity), 10000); // safety limit
    
    for (let i = 0; i < maxQty; i++) {
       const currentNum = startNumber + i;
       const paddedNum = String(currentNum).padStart(padding, '0');
       results.push(`${prefix}${paddedNum}${suffix}`);
    }
    return results.join('\n');
  }, [prefix, suffix, startNumber, padding, quantity]);

  const copyToClipboard = async () => {
    if (!generatedInvoices) return;
    try {
      await navigator.clipboard.writeText(generatedInvoices);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const resetDefaults = () => {
    setPrefix('INV-');
    setSuffix('-2026');
    setStartNumber(1);
    setPadding(4);
    setQuantity(50);
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Left: Configuration */}
        <div className="space-y-6 flex flex-col bg-[#111111] p-6 rounded-xl border border-white/8">
           <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
             <Receipt className="w-4 h-4" /> Formatting Rules
           </h3>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="block text-xs font-medium text-gray-400">Prefix</label>
                 <input 
                   type="text" 
                   value={prefix}
                   onChange={(e) => setPrefix(e.target.value)}
                   className="w-full bg-[#0A0A0A] text-white border border-white/8 rounded-lg p-3 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40"
                   placeholder="e.g. INV-"
                 />
              </div>
              <div className="space-y-2">
                 <label className="block text-xs font-medium text-gray-400">Suffix</label>
                 <input 
                   type="text" 
                   value={suffix}
                   onChange={(e) => setSuffix(e.target.value)}
                   className="w-full bg-[#0A0A0A] text-white border border-white/8 rounded-lg p-3 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40"
                   placeholder="e.g. -2026"
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="block text-xs font-medium text-gray-400">Start Number</label>
                 <input 
                   type="number" 
                   value={startNumber}
                   onChange={(e) => setStartNumber(Number(e.target.value) || 0)}
                   className="w-full bg-[#0A0A0A] text-white border border-white/8 rounded-lg p-3 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40"
                 />
              </div>
              <div className="space-y-2">
                 <label className="block text-xs font-medium text-gray-400">Zero Padding</label>
                 <input 
                   type="number" 
                   min="1" max="10"
                   value={padding}
                   onChange={(e) => setPadding(Number(e.target.value) || 1)}
                   className="w-full bg-[#0A0A0A] text-white border border-white/8 rounded-lg p-3 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40"
                 />
              </div>
           </div>

           <div className="space-y-2 border-t border-white/8 pt-4">
              <label className="block text-xs font-medium text-gray-400">Total Quantity to Generate (Max 10k)</label>
              <input 
                type="number" 
                min="1" max="10000"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-full bg-[#0A0A0A] text-white border border-white/8 rounded-lg p-3 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40"
              />
           </div>

           <div className="mt-auto bg-[#0A0A0A] border border-white/5 rounded-lg p-4">
             <p className="text-xs text-gray-500 mb-1">Preview Format:</p>
             <p className="text-[#A78BFA] font-mono text-lg truncate">
               {prefix}{String(startNumber).padStart(padding, '0')}{suffix}
             </p>
           </div>
        </div>

        {/* Right: Output Array */}
        <div className="space-y-3 flex flex-col h-[400px] md:h-auto overflow-hidden">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-medium text-gray-400">Generated Numbers</label>
            <span className="text-xs text-gray-500">{Math.min(quantity, 10000)} items</span>
          </div>
          <div className="relative flex-grow">
            <textarea
              readOnly
              value={generatedInvoices}
              className="w-full h-full bg-[#111111] text-[#A78BFA] border border-white/8 rounded-xl p-4 focus:outline-none font-mono text-sm resize-none"
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-gray-400 hover:text-white rounded-lg border border-white/8 transition-colors flex items-center justify-center group"
              title="Copy All"
            >
              <span className="absolute -top-8 right-0 bg-[#7C3AED] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {copied ? 'Copied!' : 'Copy'}
              </span>
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
      </div>

      <div className="flex justify-center bg-[#111111] p-4 sm:p-6 rounded-xl border border-white/8 gap-4">
        <button
          onClick={copyToClipboard}
          className="flex-1 sm:flex-none px-8 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy All List
        </button>
        <button
          onClick={resetDefaults}
          className="flex-1 sm:flex-none px-8 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Reset Defaults
        </button>
      </div>

    </div>
  );
}
