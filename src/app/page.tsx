import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePageContent from "@/components/HomePageContent";

export const metadata: Metadata = {
  title: "CosmoxHub — 28+ Free Online Tools | PDF, Image, AI & Text",
  description: "Free online tools for everything. AI Image Upscaler, Background Remover, PDF Merger, QR Code Generator, Image Compressor, HEIC Converter and 22 more. No signup, 100% private.",
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
