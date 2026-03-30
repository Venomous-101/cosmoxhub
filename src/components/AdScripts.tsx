"use client";
import Script from "next/script";
import { useState, useEffect } from "react";

/**
 * SmartAdManager: Hybrid Revenue Engine
 * 1. Time-on-Site (5s/15s) - Ensures even idle users generate revenue.
 * 2. Click-Threshold (1/3) - Captures active users instantly.
 * 3. Grace Period - Protects UX by delaying heavy ads.
 */
export default function AdScripts() {
  const [clickCount, setClickCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  useEffect(() => {
    // 1. Session Storage Persistence
    const savedCount = sessionStorage.getItem("cosmox_clicks");
    if (savedCount) setClickCount(parseInt(savedCount, 10));

    // 2. Global Click Tracker
    const handleGlobalClick = () => {
      setClickCount((prev) => {
        const next = prev + 1;
        sessionStorage.setItem("cosmox_clicks", next.toString());
        return next;
      });
    };

    // 3. Time Tracker (Grace Period)
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // 4. Listen for 'tool_complete' custom event (Success Moment)
    const handleSuccess = () => setHasTriggeredSuccess(true);
    window.addEventListener("cosmox_tool_complete", handleSuccess);

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
      clearInterval(timer);
      window.removeEventListener("cosmox_tool_complete", handleSuccess);
    };
  }, []);

  // HYBRID LOGIC
  // Social Bar: Show after 1 click OR 5 seconds
  const showSocialBar = clickCount >= 1 || sessionTime >= 5;
  
  // Popunder: Show after 3 clicks OR 15 seconds OR Tool Completion
  const showPopunder = clickCount >= 3 || sessionTime >= 15 || hasTriggeredSuccess;

  return (
    <>
      {showSocialBar && (
        <>
          {/* Adsterra Social Bar: Non-intrusive notification ad */}
          <Script 
            id="adsterra-social-bar"
            src="https://pl28997791.profitablecpmratenetwork.com/da/cf/3c/dacf3cfc20bc19fd9857f843d4937bef.js" 
            strategy="lazyOnload" 
          />

          {/* Monetag: MultiTag */}
          <Script 
            id="monetag-multitag"
            src="https://quge5.com/88/tag.min.js" 
            data-zone="224063" 
            strategy="lazyOnload" 
            data-cfasync="false"
          />
        </>
      )}

      {showPopunder && (
        /* Adsterra Popunder: High Revenue trigger */
        <Script 
          id="adsterra-popunder"
          src="https://pl28997788.profitablecpmratenetwork.com/8e/db/ca/8edbca55e5c02996547e78e61fd8b641.js" 
          strategy="lazyOnload" 
        />
      )}
    </>
  );
}
