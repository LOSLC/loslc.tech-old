import type { Metadata } from "next";
import Footer from "@/components/core/Footer";
import JoinClient from "./parts/join-client";

export const metadata: Metadata = {
  title: "Join LOSL-C – All Community Links",
  description:
    "All the ways to join and follow LOSL-C: Discord, WhatsApp, LinkedIn, Instagram, and X.",
};

export default function JoinPage() {
  return (
    <div className="bg-background min-h-screen">
      <JoinClient />
      <Footer />
    </div>
  );
}
