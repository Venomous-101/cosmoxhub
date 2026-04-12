/**
 * FFmpeg WASM Preloader
 *
 * Strategy:
 * 1. HOVER PRELOAD  — triggered when user hovers Video to GIF card.
 *    Uses fetch() to pull the WASM files from unpkg into the browser's
 *    HTTP cache. FFmpeg's own toBlobURL() also uses fetch internally,
 *    so if the files are cached, load() becomes near-instant.
 *
 * 2. BROWSER CACHE  — browser automatically caches the WASM response
 *    based on unpkg's Cache-Control headers (immutable, 1 year).
 *    Second visit = 0ms download.
 */

const FFMPEG_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
const WASM_URLS = [
  `${FFMPEG_BASE}/ffmpeg-core.js`,
  `${FFMPEG_BASE}/ffmpeg-core.wasm`,
];

let preloadStarted = false;

/**
 * Call this on hover of the Video to GIF card.
 * Safe to call multiple times — runs only once per session.
 */
export function preloadFFmpegWasm(): void {
  if (preloadStarted) return;
  if (typeof window === "undefined") return;
  preloadStarted = true;

  // Use fetch with low-priority to avoid competing with page resources.
  // The response goes into the browser's HTTP cache automatically.
  WASM_URLS.forEach((url) => {
    fetch(url, {
      // @ts-ignore — 'low' is valid in modern browsers
      priority: "low",
      // cache: 'force-cache' uses existing cache if available, else fetches
      cache: "force-cache",
    }).catch(() => {
      // Silently ignore — this is best-effort preloading
    });
  });
}

/**
 * Reset for testing purposes only.
 */
export function _resetPreloadState(): void {
  preloadStarted = false;
}
