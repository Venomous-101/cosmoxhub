'use client';

import { useState, useRef } from 'react';
import { Download, Copy, Check, FileText, Upload, X, Bold, Italic, AlignLeft, AlignCenter, AlignRight, List } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

// ─── helpers ───────────────────────────────────────────────────────────────

function htmlToDocxXml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  const paragraphs = div.innerText.split('\n').filter(Boolean);
  return paragraphs.map(p => `<w:p><w:r><w:t xml:space="preserve">${p.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</w:t></w:r></w:p>`).join('');
}

async function downloadAsDocx(htmlContent: string, filename = 'document') {
  const paragraphXml = htmlToDocxXml(htmlContent);

  const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${paragraphXml}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const relsContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const wordRelsContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

  const contentTypesContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  zip.file('_rels/.rels', relsContent);
  zip.file('[Content_Types].xml', contentTypesContent);
  zip.file('word/document.xml', docxContent);
  zip.file('word/_rels/document.xml.rels', wordRelsContent);

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAsTxt(text: string, filename = 'document') {
  const div = document.createElement('div');
  div.innerHTML = text;
  const plain = div.innerText;
  const blob = new Blob([plain], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── component ─────────────────────────────────────────────────────────────

export default function TextToWordClient() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('document');
  const [downloading, setDownloading] = useState(false);

  const updateCounts = () => {
    const text = editorRef.current?.innerText || '';
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  };

  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      if (editorRef.current) {
        editorRef.current.innerText = text;
        updateCounts();
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadDocx = async () => {
    const html = editorRef.current?.innerHTML || '';
    if (!html.trim() || html === '<br>') return;
    setDownloading(true);
    try {
      await downloadAsDocx(html, fileName);
    } catch (e) {
      console.error(e);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    const text = editorRef.current?.innerText || '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      updateCounts();
    }
  };

  const TOOLBAR = [
    { icon: <Bold size={14}/>, cmd: 'bold', title: 'Bold' },
    { icon: <Italic size={14}/>, cmd: 'italic', title: 'Italic' },
    { type: 'sep' },
    { icon: <AlignLeft size={14}/>, cmd: 'justifyLeft', title: 'Align Left' },
    { icon: <AlignCenter size={14}/>, cmd: 'justifyCenter', title: 'Center' },
    { icon: <AlignRight size={14}/>, cmd: 'justifyRight', title: 'Align Right' },
    { type: 'sep' },
    { icon: <List size={14}/>, cmd: 'insertUnorderedList', title: 'Bullet List' },
  ];

  return (
    <ToolLayout
      title="Text to Word Converter"
      description="Type or paste text — download as a .docx Word file instantly. Supports rich formatting, .txt upload, and bulk download. No signup, 100% private."
      icon={FileText}
      color="#7c3aed"
    >
      <div className="space-y-5">

        {/* File name input */}
        <div className="flex items-center gap-3">
          <label htmlFor="filename-input" className="text-xs text-gray-500 uppercase tracking-wider shrink-0">File name:</label>
          <input
            id="filename-input"
            aria-label="File name"
            value={fileName}
            onChange={e => setFileName(e.target.value || 'document')}
            className="bg-[#111111] border border-white/8 rounded-xl px-3 py-2 text-white text-sm w-48 focus:outline-none focus:border-[#7C3AED]/50"
            placeholder="document"
          />
          <span className="text-gray-600 text-sm">.docx</span>
        </div>

        {/* Editor Card */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 flex-wrap">
            {/* Font size */}
            <select
              title="Font Size"
              aria-label="Font size"
              onChange={e => execCmd('fontSize', e.target.value)}
              className="bg-white/5 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none border border-white/8 mr-1"
            >
              <option value="">Size</option>
              {['1','2','3','4','5','6','7'].map((v,i) => (
                <option key={v} value={v}>{[8,10,12,14,18,24,36][i]}pt</option>
              ))}
            </select>

            {TOOLBAR.map((item, i) =>
              item.type === 'sep'
                ? <div key={i} className="w-px h-5 bg-white/10 mx-1" />
                : (
                  <button key={i} title={item.title}
                    onMouseDown={e => { e.preventDefault(); execCmd(item.cmd!); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    {item.icon}
                  </button>
                )
            )}

            {/* Color picker */}
            <input type="color" aria-label="Text Color" title="Text Color" defaultValue="#ffffff"
              onChange={e => execCmd('foreColor', e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border border-white/8 p-0.5" />

            <div className="flex-1" />

            {/* Upload TXT */}
            <label htmlFor="upload-txt" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white cursor-pointer transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
              <Upload size={13} />
              Upload .txt
              <input id="upload-txt" title="Upload .txt file" type="file" accept=".txt" className="hidden"
                onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>

            <button onClick={clearEditor} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
              <X size={13} /> Clear
            </button>
          </div>

          {/* Editable area */}
          <div
            id="text-editor"
            role="textbox"
            aria-label="Rich text editor"
            aria-multiline="true"
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={updateCounts}
            className="min-h-[280px] p-5 text-white text-sm leading-relaxed focus:outline-none"
            style={{ fontFamily: 'Arial, sans-serif' }}
            data-placeholder="Type or paste your text here..."
          />

          {/* Stats bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 text-xs text-gray-600">
            <span>Words: <span className="text-gray-400">{wordCount}</span> &nbsp;|&nbsp; Characters: <span className="text-gray-400">{charCount}</span></span>
            <span>🔒 Nothing is uploaded to any server</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadDocx}
            disabled={downloading}
            className="flex items-center gap-2 bg-[#7C3AED] hover:bg-violet-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            <Download size={15} />
            {downloading ? 'Preparing...' : 'Download .docx'}
          </button>

          <button
            onClick={() => {
              const text = editorRef.current?.innerText || '';
              downloadAsTxt(text, fileName);
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors border border-white/10"
          >
            <Download size={15} />
            Download .txt
          </button>

          <button onClick={handleCopy}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors border border-white/10">
            {copied ? <><Check size={15} className="text-emerald-400" /> Copied!</> : <><Copy size={15} /> Copy Text</>}
          </button>
        </div>

        {/* How to use */}
        <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.01]">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">How to Convert Text to Word</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-gray-500">
            <div><span className="text-gray-300 font-medium block mb-1">01. Write or paste</span>Type directly in the editor, paste text, or upload a .txt file.</div>
            <div><span className="text-gray-300 font-medium block mb-1">02. Format (optional)</span>Use the toolbar to bold, italicize, align, or change font size.</div>
            <div><span className="text-gray-300 font-medium block mb-1">03. Download</span>Click &quot;Download .docx&quot; — your Word file saves instantly.</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
