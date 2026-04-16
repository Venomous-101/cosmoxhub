"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const [isOwner, setIsOwner] = useState(true); // Block by default, unblock after check

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check URL for secret owner flag: ?cosmox_owner=true (visit once to set)
    const params = new URLSearchParams(window.location.search);
    if (params.get("cosmox_owner") === "true") {
      localStorage.setItem("cosmox_owner", "true");
      // Clean URL without reload
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }

    // If owner wants to re-enable tracking: ?cosmox_owner=false
    if (params.get("cosmox_owner") === "false") {
      localStorage.removeItem("cosmox_owner");
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }

    // Check if this browser is marked as owner
    const ownerFlag = localStorage.getItem("cosmox_owner");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOwner(ownerFlag === "true");
  }, []);

  // Don't load GA at all for the owner
  if (!gaId || isOwner) return null;
  
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
