import { generateToolMetadata, generateWebAppJsonLd } from "@/lib/seo-helpers";
import UnitConverterClient from "./UnitConverterClient";

export const metadata = generateToolMetadata({
  toolName: "Universal Unit Converter",
  slug: "unit-converter",
  description: "Convert units of length, weight, temperature, and energy instantly. Supports metric and imperial systems with real-time calculations.",
  keywords: ["unit converter", "length converter", "weight converter", "kg to lbs", "celsius to fahrenheit", "metric to imperial converter"],
});

export default function UnitConverterPage() {
  const faqs = [
    { question: "What units can I convert?", answer: "You can convert common units for Length (meters, inches, miles), Weight (kg, lb, oz), Temperature (Celsius, Fahrenheit, Kelvin), and Energy (Joules, Calories, Watt-hours)." },
    { question: "Are the conversion factors accurate?", answer: "Yes, our tool uses standard SI conversion factors and verified mathematical formulas to ensure exact results." },
    { question: "Does this work offline?", answer: "Once the page is loaded, all calculations happen entirely in your browser, so you don't even need an active internet connection to perform conversions." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebAppJsonLd({ toolName: "Universal Unit Converter", slug: "unit-converter", description: "All-in-one unit converter for quick and accurate calculations.", faqs }) }}
      />
      <UnitConverterClient />
    </>
  );
}
