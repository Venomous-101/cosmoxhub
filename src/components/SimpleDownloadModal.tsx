"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { X, Download, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  fileName?: string;
}

/**
 * Clean, simple download modal - no ads, no paywalls, no deception.
 * Just a smooth UX for confirming downloads.
 */
export default function SimpleDownloadModal({
  isOpen,
  onClose,
  onComplete,
  fileName = "your file",
}: SimpleDownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleConfirmDownload = useCallback(() => {
    setIsDownloading(true);
    onCompleteRef.current();
    setTimeout(() => {
      setIsDownloading(false);
      onCloseRef.current();
    }, 1000);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050510]/80 backdrop-blur-md"
            onClick={() => onCloseRef.current()}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[60] p-4"
          >
            <div className="bg-[#0a0a1f] border border-indigo-500/20 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.15)] p-8">
              <button
                onClick={() => onCloseRef.current()}
                aria-label="Close"
                className="absolute top-4 right-4 p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X size={18} />
              </button>

              <div className="text-center">
                {!isDownloading ? (
                  <>
                    <div className="w-14 h-14 mx-auto bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
                      <Download className="w-7 h-7 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Download</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Your file <span className="text-indigo-300 font-semibold">{fileName}</span> is ready.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Download Started</h3>
                    <p className="text-emerald-400 text-sm">Check your downloads folder</p>
                  </>
                )}
              </div>

              {!isDownloading && (
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => onCloseRef.current()}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDownload}
                    className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
