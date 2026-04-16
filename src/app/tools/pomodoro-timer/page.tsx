import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import PomodoroClient from "./PomodoroClient";

export const metadata = generateToolMetadata({
  toolName: "Pomodoro Timer",
  slug: "pomodoro-timer",
  description: "Free online Pomodoro Timer with 25-minute focus intervals and 5-minute break timers. Boost your productivity with sound notifications and beautiful UI.",
  keywords: ["pomodoro timer", "tomato timer", "study timer", "focus timer", "25 minute timer", "productivity timer", "free pomodoro app"],
});

export default function PomodoroPage() {
  const faqs = [
    { question: "What is the Pomodoro technique?", answer: "The Pomodoro Technique is a time management method that uses a timer to break work into 25-minute intervals, separated by short breaks. This helps maximize focus and reduce mental fatigue." },
    { question: "How long is a Pomodoro?", answer: "A standard Pomodoro is 25 minutes of deep focus, followed by a 5-minute short break. After completing four Pomodoros, you take a longer 15-30 minute break." },
    { question: "Does the timer loop automatically?", answer: "Currently, you need to manually click to the next phase to ensure you are fully ready to start the next focus or break session." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Pomodoro Timer", slug: "pomodoro-timer", description: "Free online Pomodoro Timer with 25-minute focus periods and 5-minute breaks.", faqs }) }}
      />
      <PomodoroClient />
    </>
  );
}
