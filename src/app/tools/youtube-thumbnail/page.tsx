"use client";
import { useState } from "react";
import { Video, Download, Link as LinkIcon, AlertCircle, Image as ImageIcon } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function YouTubeThumbnailPage() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const extractVideoId = (input: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = input.match(regex);
    if (match && match[1]) {
      setVideoId(match[1]);
      setError("");
    } else {
      setVideoId(null);
      setError("Please enter a valid YouTube URL");
    }
  };

  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (val.trim()) {
      extractVideoId(val);
    } else {
      setVideoId(null);
      setError("");
    }
  };

  const thumbnailStyles = [
    { label: "Maximum Quality (HD)", suffix: "maxresdefault.jpg", size: "1280x720" },
    { label: "High Quality", suffix: "hqdefault.jpg", size: "480x360" },
    { label: "Standard Quality", suffix: "sddefault.jpg", size: "640x480" },
    { label: "Medium Quality", suffix: "mqdefault.jpg", size: "320x180" },
  ];

  const downloadThumbnail = async (id: string, suffix: string, label: string) => {
    const imageUrl = `https://img.youtube.com/vi/${id}/${suffix}`;
    try {
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `youtube_thumbnail_${label.toLowerCase().replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: Open in new tab if fetch fails (CORS)
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <ToolLayout 
      title="YouTube Thumbnail Downloader" 
      description="Download high-resolution thumbnails for any YouTube video instantly. Just paste the video link and choose your quality." 
      icon={Video} 
      color="#ff0000"
    >
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Input Section */}
        <div className="card p-8">
          <label htmlFor="yt-url" className="label-text mb-4">Paste YouTube Video URL</label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                id="yt-url"
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..."
                className="input-field pl-12"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-rose-400 text-sm bg-rose-400/10 p-3 rounded-xl border border-rose-400/20">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {videoId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {thumbnailStyles.map((style) => (
              <div key={style.suffix} className="card p-4 group overflow-hidden border-white/5 hover:border-indigo-500/30 transition-all">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-900 flex items-center justify-center">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/${style.suffix}`}
                    alt={style.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-md font-mono border border-white/10">
                    {style.size}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-slate-200 font-semibold text-sm">{style.label}</h4>
                    <p className="text-slate-500 text-xs mt-1">Resolution: {style.size}</p>
                  </div>
                  <button 
                    onClick={() => downloadThumbnail(videoId, style.suffix, style.label)}
                    className="btn-primary py-2 px-4 text-xs h-fit flex items-center gap-2 rounded-xl"
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !url && (
            <div className="card p-12 flex flex-col items-center justify-center text-center opacity-50 grayscale">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <ImageIcon size={40} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No URL Entered</h3>
              <p className="text-slate-500 max-w-sm mt-2">Enter a YouTube video link above to see and download available thumbnails.</p>
            </div>
        )}
      </div>
    </ToolLayout>
  );
}
