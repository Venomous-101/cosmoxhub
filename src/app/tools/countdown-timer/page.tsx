import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import CountdownClient from "./CountdownClient";

export const metadata = generateToolMetadata({
  toolName: "Countdown Timer",
  slug: "countdown-timer",
  description: "Create an exact countdown timer online. Count down to your next big event, birthday, or vacation in days, hours, minutes, and seconds.",
  keywords: ["countdown timer", "online countdown", "event countdown", "days until calculator", "custom countdown", "vacation countdown"],
});

export default function CountdownPage() {
  const faqs = [
    { question: "How precise is the countdown timer?", answer: "The countdown timer is calculated down to the exact second using your device's native clock, ensuring real-time accuracy without any server latency." },
    { question: "Can I use it for multiple events?", answer: "Currently, it stores one event at a time, but you can easily reset it and set a new target date and time whenever you need." },
    { question: "Will the countdown run offline?", answer: "Yes, once the page loads, the timer runs entirely in your browser. You can lose internet connection and the countdown will continue flawlessly." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Countdown Timer", slug: "countdown-timer", description: "Create an exact countdown timer to your next big event.", faqs }) }}
      />
      <CountdownClient />
    </>
  );
}
