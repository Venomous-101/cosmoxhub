import { Metadata } from "next";
import OSINTDashboard from "./OSINTDashboard";

export const metadata: Metadata = {
  title: "OSINT::NEXUS | Open Source Intelligence Dashboard",
  description: "Advanced Open Source Intelligence gathering. Map infrastructure, extract GitHub commit emails, profile usernames, and analyze historical data.",
  robots: { index: false, follow: false }, // Prevent indexing of OSINT dashboard to keep it low-profile
};

export default function OSINTPage() {
  return <OSINTDashboard />;
}
