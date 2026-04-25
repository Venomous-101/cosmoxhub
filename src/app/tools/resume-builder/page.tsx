import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import ResumeBuilderClient from "./ResumeBuilderClient";

export const metadata = generateToolMetadata({
  toolName: "Resume Builder Pro",
  slug: "resume-builder",
  description: "Create a professional, ATS-friendly resume online for free. Beautiful templates, PDF export, privacy-first — all data stays in your browser. No signup required.",
  keywords: [
    "resume builder free",
    "cv maker online",
    "ats friendly resume builder",
    "professional resume template",
    "free resume creator",
    "resume pdf download",
    "cv builder no signup",
    "free resume maker",
  ],
});

export default function ResumeBuilderPage() {
  const faqs = [
    { question: "Is this resume builder really free?", answer: "Yes. Resume Builder Pro is part of CosmoxHub's free tool suite — no hidden subscriptions, no watermarks, no signup required." },
    { question: "Can I save my resume and edit it later?", answer: "Yes. Your resume data is saved in your browser's local storage. As long as you use the same browser, your data will be there when you return." },
    { question: "Is my personal data private?", answer: "Completely. All data stays in your browser. Nothing is uploaded to any server. Your name, contact information, and work history are never transmitted anywhere." },
    { question: "Is this resume ATS-compatible?", answer: "Yes. Our builder uses standard fonts, clean hierarchy, and logical structure to ensure your resume passes ATS screening systems used by major employers." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateWebAppJsonLd({
            toolName: "Resume Builder Pro",
            slug: "resume-builder",
            description: "Free ATS-friendly professional resume builder with PDF export. No signup. 100% browser-based.",
            faqs,
          }),
        }}
      />
      <ResumeBuilderClient />
    </>
  );
}
