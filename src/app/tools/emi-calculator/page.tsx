import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import EmiCalculatorClient from "./EmiCalculatorClient";

export const metadata = generateToolMetadata({
  toolName: "EMI Calculator",
  slug: "emi-calculator",
  description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans. Free online loan calculator.",
  keywords: ["emi calculator", "loan calculator", "monthly installment calculator", "home loan emi", "car loan emi"],
});

export default function EmiCalculatorPage() {
  const faqs = [
    { question: "What is an EMI?", answer: "An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month." },
    { question: "How is EMI calculated?", answer: "EMI is calculated using the formula: P x R x (1+R)^N / [(1+R)^N-1], where P is Principal, R is monthly interest rate, and N is the number of monthly installments." },
    { question: "Is this calculator accurate?", answer: "Yes, this calculator uses standard banking formulas to precisely calculate your monthly payment, total interest, and total payable amount." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "EMI Calculator", slug: "emi-calculator", description: "Calculate your loan installments accurately and instantly.", faqs }) }}
      />
      <EmiCalculatorClient />
    </>
  );
}
