"use client";

import Script from "next/script";

export default function CPAGripLoader() {
  return (
    <Script
      src="/scripts/cpagrip.js"
      strategy="afterInteractive"
    />
  );
}
