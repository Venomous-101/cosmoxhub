'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Upload, Film, ArrowRight, Download, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function VideoToGifClient() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  const [fps, setFps] = useState(10);
  const [scale, setScale] = useState(320); // Width scale

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    setIsLoading(true);
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setLoaded(true);
    } catch (err) {
      console.error('Error loading ffmpeg', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setGifUrl(null);
    setProgress(0);
  };

  const convertToGif = async () => {
    if (!ffmpegRef.current || !videoFile || !loaded) return;
    
    setIsProcessing(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;
    
    try {
      // Write file to memory
      await ffmpeg.writeFile(videoFile.name, await fetchFile(videoFile));
      
      // Execute command: ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos" -c:v gif output.gif
      await ffmpeg.exec([
        '-i', videoFile.name,
        '-vf', `fps=${fps},scale=${scale}:-1:flags=lanczos`,
        '-c:v', 'gif',
        'output.gif'
      ]);
      
      // Read result
      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: 'image/gif' });
      setGifUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Conversion Failed', error);
      alert('Error converting video. The video might be too large or unsupported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setGifUrl(null);
    setProgress(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* FFmpeg engine loading state */}
      {!loaded && (
        <div className="w-full rounded-xl border border-white/8 bg-[#111111] p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[120px]">
          {isLoading ? (
            <>
              {/* Animated spinner */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-[#7C3AED]/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-[#7C3AED] animate-spin" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Loading Video Engine</p>
                <p className="text-gray-500 text-xs mt-1">
                  Downloading FFmpeg WebAssembly (~15MB) — one-time load, runs 100% in your browser.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-semibold text-sm">Engine failed to load</p>
                <p className="text-gray-500 text-xs mt-1">
                  Please ensure your browser supports WebAssembly and try refreshing the page.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Input & Settings */}
        <div className="space-y-6 bg-[#111111] p-6 rounded-xl border border-white/8 flex flex-col justify-between">
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-400">Upload Video</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 bg-[#0A0A0A] hover:bg-[#1A1A1A] border-2 border-dashed border-white/10 hover:border-[#7C3AED]/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleVideoUpload} 
                accept="video/mp4, video/webm, video/quicktime" 
                className="hidden" 
              />
              <Upload className="w-6 h-6 text-[#A78BFA] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">{videoFile ? videoFile.name : 'Click to upload video'}</p>
              <p className="text-xs text-gray-500 mt-1">MP4, WebM, MOV supported (up to 50MB recommended)</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Frames Per Second (FPS)</span>
                <span>{fps} fps</span>
              </div>
              <input 
                type="range" min="5" max="30" value={fps} 
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full accent-[#7C3AED]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Output Width (px)</span>
                <span>{scale}px</span>
              </div>
              <input 
                type="range" min="160" max="800" step="10" value={scale} 
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-[#7C3AED]"
              />
            </div>
          </div>

          <button
            disabled={!loaded || !videoFile || isProcessing}
            onClick={convertToGif}
            className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-4"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing {progress}%
              </>
            ) : (
              <>
                Convert to GIF <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Right: Preview & Output */}
        <div className="space-y-6 flex flex-col">
          
          <div className="bg-[#111111] border border-white/8 rounded-xl h-48 sm:h-64 flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-1 rounded-md z-10 text-gray-300">Input</span>
            {videoUrl ? (
              <video src={videoUrl} controls className="max-w-full max-h-full" />
            ) : (
              <span className="text-gray-500 italic">No video selected</span>
            )}
          </div>

          <div className="flex-grow bg-[#111111] border border-[#7C3AED]/20 rounded-xl h-48 sm:h-64 flex flex-col items-center justify-center relative overflow-hidden">
             <span className="absolute top-2 left-2 bg-[#7C3AED]/20 text-[#A78BFA] text-xs px-2 py-1 rounded-md z-10 border border-[#7C3AED]/40">Output GIF</span>
             {gifUrl ? (
               <img src={gifUrl} alt="Converted GIF" className="max-w-full max-h-full object-contain" />
             ) : (
               <div className="text-gray-500 italic flex items-center gap-2">
                 {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-[#7C3AED]" />}
                 {isProcessing ? 'Encoding...' : 'Generated GIF will appear here'}
               </div>
             )}
          </div>

        </div>

      </div>

      <div className="flex justify-center bg-[#111111] p-4 sm:p-6 rounded-xl border border-white/8 gap-4">
        {gifUrl && (
          <button
            onClick={() => saveAs(gifUrl, 'converted.gif')}
            className="flex-1 sm:flex-none px-8 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download GIF
          </button>
        )}
        <button
          onClick={resetAll}
          className="px-8 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          Reset All
        </button>
      </div>

    </div>
  );
}
