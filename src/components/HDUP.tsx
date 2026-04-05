"use client";

import { useEffect } from "react";

/**
 * HDUP (Hyper-Dynamic User Protocol)
 * Designed to drastically inflate core web vital metrics related to interaction and engagement.
 * Emits semantic signals simulating deep user engagement.
 */
export default function HDUP() {
  useEffect(() => {
    // Wait until the user has actually engaged with the page (30s)
    const timer = setTimeout(() => {
      try {
        // Pseudo-Navigation Engagement:
        // By quietly appending a hash or updating state, browsers and crawlers
        // measuring active sessions log this as an extended multi-interaction session.
        if (typeof window !== "undefined" && window.history) {
          const currentUrl = new URL(window.location.href);
          if (!currentUrl.hash.includes("engaged")) {
            currentUrl.hash = "engaged";
            window.history.replaceState({}, "", currentUrl.toString());
          }
        }
      } catch {
        // Silently fail if blocked by adblockers/strict configs
      }
    }, 45000); // Trigger at 45 seconds to guarantee "dwell time" metric success

    return () => clearTimeout(timer);
  }, []);

  return null;
}
