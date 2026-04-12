'use client';

import React, { useState, useRef } from 'react';
import { Upload, Copy, Trash2, Image as ImageIcon, FileCode } from 'lucide-react';

export default function ImageToBase64Client() {
  const [base64, setBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [copied, setCopied] = useState(false);
  const [includePrefix, setIncludePrefix] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Create base64
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setBase64(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearAll = () => {
    setBase64('');
    setPreviewUrl('');
    setFilename('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getOutputText = () => {
    if (!base64) return '';
    return includePrefix ? base64 : base64.split(',')[1];
  };

  const copyToClipboard = async () => {
    const text = getOutputText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-400">Upload Image</label>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 sm:h-80 bg-[#111111] hover:bg-[#141414] border-2 border-dashed border-white/10 hover:border-[#7C3AED]/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group relative overflow-hidden"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            {previewUrl ? (
              <>
                <img loading="lazy" decoding="async" src={previewUrl} alt="Preview" className="w-full h-full object-contain absolute inset-0 p-4 opacity-50 group-hover:opacity-30 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center p-4 bg-[#0A0A0A]/80 rounded-lg backdrop-blur-sm border border-white/8">
                  <ImageIcon className="w-8 h-8 text-[#A78BFA] mb-2" />
                  <p className="text-white font-medium truncate max-w-[200px]">{filename}</p>
                  <p className="text-sm text-gray-400 mt-1">Click to change image</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-[#A78BFA]" />
                </div>
                <p className="text-white font-medium mb-1">Click or drag image to upload</p>
                <p className="text-sm text-gray-400">Supports PNG, JPG, GIF, WebP, SVG</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-medium text-gray-400">Base64 Output</label>
            {base64 && (
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                <input 
                  type="checkbox" 
                  checked={includePrefix} 
                  onChange={(e) => setIncludePrefix(e.target.checked)}
                  className="rounded border-white/20 bg-[#111111] text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                Include `data:image...`
              </label>
            )}
          </div>
          
          <div className="relative h-64 sm:h-80">
            <textarea
              readOnly
              value={getOutputText()}
              placeholder="Base64 string will appear here..."
              className="w-full h-full bg-[#111111] text-white border border-white/8 rounded-xl p-4 focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/40 resize-none font-mono text-xs sm:text-sm transition-colors"
            />
            {base64 && (
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-gray-400 hover:text-white rounded-lg border border-white/8 transition-colors flex items-center justify-center group"
                title="Copy Base64"
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

      {(base64 || previewUrl) && (
        <div className="flex flex-wrap items-center justify-center gap-4 bg-[#111111] p-4 sm:p-6 rounded-xl border border-white/8">
          <button
            onClick={copyToClipboard}
            className="flex-1 sm:flex-none min-w-[140px] px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            Copy Base64
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
      )}
    </div>
  );
}
