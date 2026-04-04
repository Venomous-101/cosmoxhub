import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePageContent from "@/components/HomePageContent";

export const metadata: Metadata = {
  title: "CosmoxHub — 26+ Free Online Tools | AI, PDF, Image, Text & More",
  description: "All the tools you need in one place. AI Image Upscaler, BG Remover, PDF Merger, QR Generator, Image Converter. All free, 100% private, no signup.",
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
