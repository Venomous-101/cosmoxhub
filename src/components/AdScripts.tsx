"use client";
import Script from "next/script";
import { useState, useEffect } from "react";

export default function AdScripts() {
  const [clickCount, setClickCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const THRESHOLD = 9; // Number of clicks before ads activate

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
        src="https://pl28997791.profitablecpmratenetwork.com/da/cf/3c/dacf3cfc20bc19fd9857f843d4937bef.js" 
        strategy="afterInteractive" 
      />

      {/* Adsterra: Popunder (After Grace Period) */}
      <Script 
        id="adsterra-popunder"
        src="https://pl28997788.profitablecpmratenetwork.com/8e/db/ca/8edbca55e5c02996547e78e61fd8b641.js" 
        strategy="afterInteractive" 
      />

      {/* Monetag: MultiTag (After Grace Period - The one with Popunders) */}
      <Script 
        id="monetag-multitag"
        src="https://quge5.com/88/tag.min.js" 
        data-zone="224063" 
        strategy="afterInteractive" 
        data-cfasync="false"
      />
    </>
  );
}
