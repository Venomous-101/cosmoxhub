import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import MindForgeClient from "./MindForgeClient";

export const metadata = generateToolMetadata({
  toolName: "MindForge Brain Training",
  slug: "mind-forge",
  description: "Train your brain with 5 science-backed cognitive games: Memory Matrix, Focus Flow, Pattern Prophet, Speed Synapse, and Word Weave. Track your cognitive scores daily. Free.",
  keywords: ["brain training", "cognitive games", "memory game online", "brain test", "focus training", "reaction time test", "cognitive training app", "mindforge"],
});

export default function MindForgePage() {
  const faqs = [
    { question: "What cognitive skills does MindForge train?", answer: "Working memory (Memory Matrix), sustained attention (Focus Flow), fluid intelligence / pattern recognition (Pattern Prophet), neural processing speed (Speed Synapse), and verbal fluency (Word Weave)." },
    { question: "Is the brain training scientifically backed?", answer: "Yes. Each game is based on validated clinical cognitive tests: Corsi Block Test, Continuous Performance Test (CPT), Raven's Progressive Matrices, Hick's Law reaction time, and FAS Verbal Fluency." },
    { question: "Are my scores saved?", answer: "Scores are saved locally in your browser using localStorage. They persist between sessions but are not uploaded to any server." },
    { question: "How long should I train each day?", answer: "Research suggests 10–15 minutes of focused daily cognitive training produces the most measurable improvements in working memory and processing speed." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "MindForge Brain Training", slug: "mind-forge", description: "5 science-backed cognitive games for memory, focus, pattern recognition, speed, and verbal fluency.", faqs }) }}
      />
      <MindForgeClient />
    </>
  );
}
