"use client";
import Script from "next/script";
import { useState, useEffect } from "react";

export default function AdScripts() {
  const [clickCount, setClickCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const THRESHOLD = 5; // Number of clicks before ads activate

  useEffect(() => {
    // Initialize from sessionStorage to maintain state across pages in the same tab
    const savedCount = sessionStorage.getItem("cosmox_click_count");
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      setClickCount(count);
      if (count >= THRESHOLD) setIsActivated(true);
    }

    const handleGlobalClick = () => {
      setClickCount((prev) => {
        const newCount = prev + 1;
        sessionStorage.setItem("cosmox_click_count", newCount.toString());
        
        if (newCount >= THRESHOLD && !isActivated) {
          setIsActivated(true);
        }
        return newCount;
      });
    };

    // Attach listener to capture all user intent
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [isActivated]);

  // Don't render aggressive scripts until threshold is met
  if (!isActivated) {
    return null;
  }

  return (
    <>
      {/* Adsterra: Social Bar (After Grace Period) */}
      <Script 
        id="adsterra-social-bar"
        src="https://pl28987162.profitablecpmratenetwork.com/1a/29/bc/1a29bcd189ce74300c56e9ae7c4f6ec7.js" 
        strategy="afterInteractive" 
      />

      {/* Monetag: MultiTag (After Grace Period - The one with Popunders) */}
      <Script 
        id="monetag-multitag"
        src="https://quge5.com/88/tag.min.js" 
        data-zone="223717" 
        strategy="afterInteractive" 
        data-cfasync="false"
      />
    </>
  );
}
