import { Metadata } from "next";
import BGRemoverClient from "./BGRemoverClient";

export const metadata: Metadata = {
  title: "BG Remover - Free Online Utility Tool | CosmoXHub",
  description: "Instantly remove backgrounds from any image with our AI-powered free online tool. 100% private, browser-side processing. No upload to server required. Perfect for product photos and ID backdrops.",
  keywords: ["background remover", "remove bg", "transparent background", "ai image editor", "free online tool", "cosmoxhub"],
  openGraph: {
    title: "BG Remover - Free Online Utility Tool | CosmoXHub",
    description: "Instantly remove backgrounds from any image with AI. 100% private and free.",
    type: "website",
  }
};

export default function BackgroundRemoverPage() {
  return <BGRemoverClient />;
}
