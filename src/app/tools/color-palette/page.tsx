import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ColorPaletteClient from "./ColorPaletteClient";

export const metadata = generateToolMetadata({
  toolName: "Color Palette Generator",
  slug: "color-palette",
  description: "Generate beautiful, harmonious color palettes from any base color. Export hex, RGB, HSL codes instantly. Free color scheme creator for designers — no signup.",
  keywords: ["color palette generator", "color scheme generator", "color palette from image", "hex color picker", "color combinations", "design colors", "color wheel"],
});

export default function ColorPalettePage() {
  const faqs = [
    { question: "How do I generate a color palette?", answer: "Enter any hex color or pick one using the color picker, then choose your palette type (complementary, analogous, triadic, etc.). The palette generates instantly." },
    { question: "Can I export the color codes?", answer: "Yes. You can copy hex, RGB, or HSL values for each color with a single click. Perfect for use in CSS, Figma, or any design tool." },
    { question: "Is this tool free?", answer: "100% free, no account required. All palette generation happens in your browser." },
    { question: "What color harmony types are supported?", answer: "Complementary, analogous, triadic, tetradic, split-complementary, and monochromatic schemes are all supported." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Color Palette Generator", slug: "color-palette", description: "Generate beautiful, harmonious color palettes from any base color. Free, instant, browser-based.", faqs }) }}
      />
      <ColorPaletteClient />
    </>
  );
}
