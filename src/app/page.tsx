import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePageContent from "@/components/HomePageContent";

export const metadata: Metadata = {
  title: "Free Online Tools — PDF, Image, AI & More | CosmoxHub",
  description: "26+ free browser-based tools for PDF, images, AI, and text. No signup, no limits, 100% private. Works instantly in your browser on any device.",
  other: {
    "application-name": "CosmoxHub",
    "apple-mobile-web-app-title": "CosmoxHub",
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomePageContent />
      <Footer />
    </>
  );
}
