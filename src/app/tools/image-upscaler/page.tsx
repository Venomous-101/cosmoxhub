import { Metadata } from "next";
import ImageUpscalerClient from "./ImageUpscalerClient";

export const metadata: Metadata = {
  title: "Image Upscaler - Free Online Utility Tool | CosmoXHub",
  description: "Upscale and enhance your low-res images into stunning 4K masterpieces with our AI-powered free online tool. 100% private, free, and browser-processed for maximum detail and privacy.",
  keywords: ["image upscaler", "ai upscaler", "enhance images", "4k upscale", "free online tool", "cosmoxhub"],
  openGraph: {
    title: "Image Upscaler - Free Online Utility Tool | CosmoXHub",
    description: "Upscale your images to 4K using AI. 100% private and free.",
    type: "website",
  }
};

export default function ImageUpscalerPage() {
  return <ImageUpscalerClient />;
}
