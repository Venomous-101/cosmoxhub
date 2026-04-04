"use client";
import { useState, useEffect } from "react";

/**
 * SmartAdManager: Hybrid Revenue Engine for cosmoxhub.com
 * 1. Time-on-Site (5s/15s) - Ensures even idle users generate revenue.
 * 2. Click-Threshold (1/3) - Captures active users instantly.
 * 3. Grace Period - Protects UX by delaying heavy ads.
 */
export default function AdScripts() {
  const [clickCount, setClickCount] = useState<number>(0);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    // 1. Session Storage Initialization
    const savedCount = sessionStorage.getItem("cosmox_clicks");
    if (savedCount && parseInt(savedCount, 10) > clickCount) {
      setClickCount(parseInt(savedCount, 10));
    }

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

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
      clearInterval(timer);
    };
  }, []);

  // HYBRID LOGIC
  // 1. Social Bar: Show almost immediately, it's non-intrusive (Push/Banner style).
  const showSocialBar = clickCount >= 1 || sessionTime >= 2;
  
  // 2. Monetag MultiTag (Redirects): Extreme delay down to 30 clicks to preserve pure UX.
  const showMonetag = clickCount >= 30;

  // 3. Adsterra Popunder (Redirect): Staggered to prevent ads firing simultaneously. Triggers at 40 clicks.
  const showAdsterraPopunder = clickCount >= 40;

  // Next.js <Script> component often fails when conditionally rendered late (due to the grace period).
  // Vanilla DOM injection guarantees execution for these global scripts.
  useEffect(() => {
    const injectGlobalScript = (id: string, src: string, dataZone?: string) => {
      if (document.getElementById(id)) return;
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      if (dataZone) {
        script.setAttribute("data-zone", dataZone);
        script.setAttribute("data-cfasync", "false");
      }
      document.head.appendChild(script);
    };

    if (showSocialBar) {
      // Adsterra Social Bar (In-page banner)
      injectGlobalScript(
        "adsterra-social-bar",
        "https://pl29029722.profitablecpmratenetwork.com/87/ab/13/87ab1391d5a52a4d08b31bc409aa5f95.js"
      );
    }

    if (showMonetag) {
      // Monetag MultiTag (Can cause redirects)
      injectGlobalScript(
        "monetag-multitag",
        "https://quge5.com/88/tag.min.js",
        "224064"
      );
    }

    if (showAdsterraPopunder) {
      // Adsterra Popunder (Redirect)
      injectGlobalScript(
        "adsterra-popunder",
        "https://pl29029721.profitablecpmratenetwork.com/95/74/4e/95744e8e431f6b57cffc3c6e368328a3.js"
      );
    }
  }, [showSocialBar, showMonetag, showAdsterraPopunder]);

  return null;
}
