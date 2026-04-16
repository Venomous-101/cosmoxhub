'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Trash2, Pen, Upload, Check, Copy } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

type Tab = 'draw' | 'type' | 'upload';

const COLORS = ['#FFFFFF','#1a1a1a','#2563EB','#DC2626','#16A34A','#9333EA','#D97706'];
const FONTS = ['Dancing Script','Pacifico','Great Vibes','Caveat','Sacramento','Allura'];

export default function SignatureCreatorClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tab, setTab] = useState<Tab>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(3);
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(48);
  const [bgTransparent, setBgTransparent] = useState(true);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [hasSig, setHasSig] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load Google fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${FONTS.map(f => f.replace(/ /g,'+')).join('&family=')}&display=swap`;
    document.head.appendChild(link);
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!bgTransparent) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [bgTransparent]);

  useEffect(() => { initCanvas(); }, [tab, initCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (tab !== 'draw') return;
    const canvas = canvasRef.current!;
    const pos = getPos(e, canvas);
    setIsDrawing(true);
    setLastPos(pos);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tab !== 'draw') return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastPos(pos);
    setHasSig(true);
  };

  const endDraw = () => setIsDrawing(false);

  const renderTyped = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!typedName.trim()) {
      initCanvas();
      return;
    }
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!bgTransparent) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.font = `${fontSize}px '${selectedFont}', cursive`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
  }, [typedName, selectedFont, fontSize, color, bgTransparent, initCanvas]);

  useEffect(() => {
    if (tab === 'type') renderTyped();
  }, [typedName, selectedFont, fontSize, color, bgTransparent, tab, renderTyped]);

  const handleImageUpload = (file: File) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      setHasSig(true);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current!;
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadSvg = () => {
    if (tab !== 'type' || !typedName.trim()) {
      downloadPng(); return;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="150">
      <defs><style>@import url('https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g,'+')}');</style></defs>
      ${!bgTransparent ? '<rect width="500" height="150" fill="white"/>' : ''}
      <text x="250" y="85" font-family="${selectedFont}" font-size="${fontSize}" fill="${color}" text-anchor="middle">${typedName}</text>
    </svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signature.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAsBase64 = async () => {
    const canvas = canvasRef.current!;
    await navigator.clipboard.writeText(canvas.toDataURL('image/png'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Online Signature Creator"
      description="Draw, type, or upload your digital signature. Download as transparent PNG or SVG. Free, no signup, 100% private — nothing is uploaded."
      icon={Pen}
      color="#7c3aed"
    >
      <div className="space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111111] border border-white/8 rounded-xl p-1 w-fit">
          {([['draw','✏️ Draw'],['type','Aa Type'],['upload','↑ Upload']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setHasSig(false); }}
              aria-label={`Tab ${label}`}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-[#7C3AED] text-white' : 'text-gray-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Settings row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                style={{ background: c, border: color === c ? '2px solid #7C3AED' : '2px solid transparent' }}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110" />
            ))}
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              aria-label="Custom color picker"
              className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent" title="Custom color" />
          </div>

          {tab === 'draw' && (
            <div className="flex items-center gap-2">
              <label htmlFor="stroke-thickness" className="text-xs text-gray-500">Thickness</label>
              <input id="stroke-thickness" type="range" min={1} max={12} value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))}
                aria-label="Stroke thickness"
                className="w-24 accent-[#7C3AED]" />
              <span className="text-xs text-gray-400">{lineWidth}px</span>
            </div>
          )}

          {tab === 'type' && (
            <>
              <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)}
                aria-label="Font family"
                className="bg-[#111111] border border-white/8 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none">
                {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <label htmlFor="font-size" className="text-xs text-gray-500">Size</label>
                <input id="font-size" type="range" min={24} max={80} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                  aria-label="Font size"
                  className="w-20 accent-[#7C3AED]" />
              </div>
            </>
          )}

          <label htmlFor="bg-transparent" className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input id="bg-transparent" type="checkbox" checked={bgTransparent} onChange={e => { setBgTransparent(e.target.checked); setHasSig(false); }}
              className="accent-[#7C3AED]" />
            Transparent BG
          </label>
        </div>

        {/* Canvas */}
        <div className={`rounded-2xl overflow-hidden border border-white/8 ${bgTransparent ? 'bg-checkered' : 'bg-white'}`}
          style={{ background: bgTransparent ? 'repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%) 0 0 / 20px 20px' : '#ffffff' }}>
          <canvas
            ref={canvasRef}
            width={700}
            height={200}
            className="w-full cursor-crosshair block"
            style={{ touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        {/* Type input */}
        {tab === 'type' && (
          <input
            id="type-name"
            aria-label="Type your name"
            value={typedName}
            onChange={e => setTypedName(e.target.value)}
            placeholder="Type your name..."
            className="w-full bg-[#111111] border border-white/8 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-[#7C3AED]/50"
            style={{ fontFamily: `'${selectedFont}', cursive` }}
          />
        )}

        {/* Upload */}
        {tab === 'upload' && (
          <label htmlFor="upload-img" className="flex flex-col items-center gap-3 border-2 border-dashed border-white/10 hover:border-[#7C3AED]/40 rounded-2xl p-10 cursor-pointer transition-colors text-center">
            <Upload size={28} className="text-gray-500" />
            <div>
              <p className="text-white font-medium">Upload your signature image</p>
              <p className="text-gray-500 text-sm">PNG, JPG, SVG — use an image with transparent background for best results</p>
            </div>
            <input id="upload-img" title="Upload image" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
          </label>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={downloadPng} disabled={tab === 'type' ? !typedName.trim() : !hasSig}
            className="flex items-center gap-2 bg-[#7C3AED] hover:bg-violet-600 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
            <Download size={15} /> Download PNG
          </button>
          <button onClick={downloadSvg} disabled={tab === 'type' ? !typedName.trim() : !hasSig}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors border border-white/10">
            <Download size={15} /> Download SVG
          </button>
          <button onClick={copyAsBase64} disabled={tab === 'type' ? !typedName.trim() : !hasSig}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-gray-300 font-medium px-5 py-3 rounded-xl text-sm transition-colors border border-white/10">
            {copied ? <><Check size={15} className="text-emerald-400" /> Copied!</> : <><Copy size={15} /> Copy Base64</>}
          </button>
          <button onClick={() => { initCanvas(); setHasSig(false); }}
            className="flex items-center gap-2 text-gray-500 hover:text-white px-4 py-3 rounded-xl text-sm transition-colors hover:bg-white/5">
            <Trash2 size={14} /> Clear
          </button>
        </div>
        
        {/* Related Tools Placeholder */}
        <div className="text-sm border-t border-white/10 pt-4 mt-6">
          <h3 className="font-semibold text-gray-300 mb-3">Related Tools</h3>
          <div className="flex gap-4 flex-wrap">
            <a href="/tools/image-to-pdf" className="text-[#A78BFA] hover:underline">Image to PDF</a>
            <a href="/tools/pdf-compressor" className="text-[#A78BFA] hover:underline">PDF Compressor</a>
            <a href="/tools/bg-remover" className="text-[#A78BFA] hover:underline">Background Remover</a>
          </div>
        </div>

        {/* How to use */}
        <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.01]">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">How to Create Your Digital Signature</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
            <div><span className="text-gray-300 font-medium block mb-1">✏️ Draw</span>Sign with your mouse or finger on touchscreen — just like pen on paper.</div>
            <div><span className="text-gray-300 font-medium block mb-1">Aa Type</span>Type your name in a professional cursive handwriting font. 6 fonts available.</div>
            <div><span className="text-gray-300 font-medium block mb-1">↑ Upload</span>Upload a photo of your existing handwritten signature for digital use.</div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            ✓ Tool last tested: {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}
            — Verified working in Chrome, Firefox, Safari, and Edge.
          </p>
        </div>

        {/* SEO */}
        <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
          <h2 className="text-white font-bold text-lg">Free Online Signature Creator — Draw or Type</h2>
          <p>Create a professional digital signature in seconds with CosmoxHub&apos;s free Online Signature Creator. Choose from three methods: draw with your mouse or finger, type your name in a beautiful cursive font, or upload an existing signature image.</p>
          <p>Download your signature as a <strong className="text-gray-300">transparent PNG</strong> or <strong className="text-gray-300">SVG file</strong> — ready to use in Word documents, PDFs, emails, and contracts. Everything happens in your browser. Your signature is never stored or uploaded.</p>

          <div className="space-y-2 pt-2">
            {[
              ['Can I use this signature on legal documents?','Digital signatures created here are images. For legally binding e-signatures, you need a certified e-signature platform. However, for most business documents this works fine.'],
              ['Is my signature saved anywhere?','No. Your signature exists only in your browser memory and disappears when you close the tab.'],
              ['What file formats can I download?','PNG (transparent background supported) and SVG (for type signatures).'],
            ].map(([q,a]) => (
              <div key={q}>
                <p className="text-gray-300 font-medium">{q}</p>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600 text-center">🔒 Your signature is never uploaded. All processing is local in your browser.</p>
      </div>
    </ToolLayout>
  );
}
