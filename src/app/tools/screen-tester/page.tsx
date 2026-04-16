import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ScreenTesterClient from "./ScreenTesterClient";

export const metadata = generateToolMetadata({
  toolName: "Dead Pixel & Screen Tester",
  slug: "screen-tester",
  description: "Test your screen for dead or stuck pixels online. Pure red, green, blue, white, and black full-screen tests for monitor diagnostic.",
  keywords: ["screen tester", "dead pixel test", "monitor tester", "stuck pixel fixer", "check dead pixels", "lcd test online"],
});

export default function ScreenTesterPage() {
  const faqs = [
    { question: "How does the screen test work?", answer: "The tool fills your entire screen with solid colors. By looking closely at each color, you can easily spot pixels that are not displaying the correct color (dead or stuck pixels)." },
    { question: "What is a dead pixel?", answer: "A dead pixel is a pixel that remains black across all colors and doesn't light up. A stuck pixel is one that usually stays one color (like bright green or red) even when the screen is white or black." },
    { question: "Can this fixer dead pixels?", answer: "Hardware diagnostic tools identify the problem. While some 'stuck' pixels can be revived with rapid color cycling, true 'dead' pixels usually require hardware repair." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Dead Pixel & Screen Tester", slug: "screen-tester", description: "Professional screen diagnostic tool for dead pixels.", faqs }) }}
      />
      <ScreenTesterClient />
    </>
  );
}
