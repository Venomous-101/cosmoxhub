"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { X, ShieldCheck, Download, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdBanner from "./AdBanner";

interface DownloadAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  fileName?: string;
}

export default function DownloadAdModal({
  isOpen,
  onClose,
  onComplete,
  fileName = "your file",
}: DownloadAdModalProps) {
  const [countdown, setCountdown] = useState(3);
  // We use refs for callbacks to avoid stale closures & avoid re-triggering the effect
  const onCompleteRef = useRef(onComplete);
  const onCloseRef = useRef(onClose);
  const completedRef = useRef(false); // prevent double-fire

  // Keep refs in sync without retriggering effect
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const triggerLocker = useCallback(() => {
    try {
      if (
        typeof window !== "undefined" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (window as any).call_locker === "function"
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).call_locker();
      }
    } catch (e) {
      console.error("CPA Locker error:", e);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      completedRef.current = false;
      return;
    }

    completedRef.current = false;

    // Trigger CPAGrip content locker on open
    triggerLocker();

    // EXPOSE GLOBAL FUNCTION FOR CPAGRIP SUCCESS
    // The user MUST add `window.unlockCosmoxhub();` in CPAGrip's "Javascript on Completion" setting.
    (window as any).unlockCosmoxhub = () => {
      if (!completedRef.current) {
        completedRef.current = true;
        setCountdown(0);
        onCompleteRef.current();
        setTimeout(() => onCloseRef.current(), 1500);
      }
    };

    // Auto-detect CPAGrip bypass if no offers exist by observing DOM or waiting for user unlock.
    // We removed the blind 3-second timer. The download is now STRICTLY tied to CPAGrip completion.

  }, [isOpen, triggerLocker]);

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
            onClick={() => {
              // Closing early cancels the pending download — user must wait
              onCloseRef.current();
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[60] p-4"
          >
            <div className="bg-[#0a0a1f] border border-indigo-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.15)] overflow-hidden relative">
              {/* Top ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-indigo-500/20 blur-[50px] pointer-events-none" />

              <div className="p-8">
                <button
                  onClick={() => onCloseRef.current()}
                  aria-label="Close Modal"
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all"
                >
                  <X size={18} />
                </button>

                <div className="text-center mb-8 relative z-10">
                  <div className="w-16 h-16 mx-auto bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    {countdown > 0 ? (
                      <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
                    ) : (
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">
                    {countdown === 0 ? "Download Unlocked!" : "Action Required"}
                  </h3>

                  {countdown === 0 ? (
                    <p className="text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                      <Download size={16} /> File Downloading...
                    </p>
                  ) : (
                    <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
                      Please complete an offer to securely download{" "}
                      <span className="text-indigo-300 font-bold">{fileName}</span>.
                    </p>
                  )}
                </div>

                {/* Ad Injection Zone */}
                <div className="w-full bg-[#050510] border border-white/5 rounded-2xl overflow-hidden relative">
                  <AdBanner
                    type="native"
                    label="Support CosmoxHub"
                    className="!my-0 !min-h-[250px]"
                  />
                </div>
              </div>

              {/* Progress Bar Component Removed to Reflect Task-Based Unlock */}
              {countdown === 0 && (
                <div className="h-1.5 w-full bg-white/5 overflow-hidden">
                   <motion.div
                     className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                     initial={{ width: "0%" }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 1, ease: "linear" }}
                   />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
