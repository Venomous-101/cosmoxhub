import type { Metadata } from "next";
import MindForgeClient from "./MindForgeClient";

export const metadata: Metadata = {
  title: "MindForge Brain Training — Free Cognitive Game | CosmoxHub",
  description:
    "Train your brain with science-backed cognitive exercises. " +
    "Memory, focus, pattern recognition, and reaction speed games. " +
    "Free, no signup. Based on real neuroscience research.",
  keywords: [
    "brain training game",
    "cognitive training free",
    "memory game online",
    "focus training",
    "IQ training game",
    "brain exercise free",
    "pattern recognition game",
    "reaction time test",
    "working memory game",
  ],
  alternates: { canonical: "https://www.cosmoxhub.com/tools/mind-forge" },
  openGraph: {
    title: "MindForge Brain Training | CosmoxHub",
    description:
      "5 science-backed cognitive games: memory, focus, patterns, reaction speed & verbal fluency. Free, 100% private.",
    url: "https://www.cosmoxhub.com/tools/mind-forge",
    siteName: "CosmoxHub",
    type: "website",
  },
};

export default function MindForgePage() {
  return <MindForgeClient />;
}
