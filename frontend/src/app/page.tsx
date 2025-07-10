"use client";

import Hero from "@/components/core/Hero";
import AboutSection from "@/components/core/AboutSection";
import Features from "@/components/core/Features";
import CommunityStats from "@/components/core/CommunityStats";
import Testimonials from "@/components/core/Testimonials";
import CallToAction from "@/components/core/CallToAction";
import Footer from "@/components/core/Footer";
import { useRef } from "react";

export default function Home() {
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="bg-background min-h-[940px] h-screen">
      <div className="h-full">
        <Hero nextPageRef={aboutSectionRef} />
      </div>
      <AboutSection ref={aboutSectionRef} />
      <Features />
      <CommunityStats />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
