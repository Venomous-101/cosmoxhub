"use client";
import Script from "next/script";
import { useState, useEffect } from "react";

export default function AdScripts() {
  const [clickCount, setClickCount] = useState(0);
  const GLOBAL_THRESHOLD = 30;
  const POPUNDER_THRESHOLD = 45;

  useEffect(() => {
    const savedCount = sessionStorage.getItem("cosmox_click_count");
    if (savedCount) {
      setTimeout(() => {
        setClickCount(parseInt(savedCount, 10));
      }, 0);
    }

    const handleGlobalClick = () => {
      setClickCount((prev) => {
        const newCount = prev + 1;
        sessionStorage.setItem("cosmox_click_count", newCount.toString());
        return newCount;
      });
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const isGlobalActivated = clickCount >= GLOBAL_THRESHOLD;
  const isPopunderActivated = clickCount >= POPUNDER_THRESHOLD;

  return (
    <>
      {/* 30 CLICKS THRESHOLD: Social Bar & Monetag */}
      {isGlobalActivated && (
        <>
          {/* Adsterra: Social Bar */}
          <Script 
            id="adsterra-social-bar"
            src="https://pl28997791.profitablecpmratenetwork.com/da/cf/3c/dacf3cfc20bc19fd9857f843d4937bef.js" 
            strategy="afterInteractive" 
          />

          {/* Monetag: MultiTag */}
          <Script 
            id="monetag-multitag"
            src="https://quge5.com/88/tag.min.js" 
            data-zone="224063" 
            strategy="afterInteractive" 
            data-cfasync="false"
          />
        </>
      )}

      {/* 45 CLICKS THRESHOLD: Adsterra Popunder */}
      {isPopunderActivated && (
        <Script 
          id="adsterra-popunder"
          src="https://pl28997788.profitablecpmratenetwork.com/8e/db/ca/8edbca55e5c02996547e78e61fd8b641.js" 
          strategy="afterInteractive" 
        />
      )}
    </>
  );
}
