"use client";

import { useRef } from "react";
import AboutSection from "@/components/core/AboutSection";
import CallToAction from "@/components/core/CallToAction";
import CommunityStats from "@/components/core/CommunityStats";
import Features from "@/components/core/Features";
import Hero from "@/components/core/Hero";
import LoslCon2025 from "@/components/core/LoslCon2025";
import Testimonials from "@/components/core/Testimonials";

export default function Home() {
	const aboutSectionRef = useRef<HTMLDivElement | null>(null);

	return (
		<div className="bg-background min-h-screen flex flex-col cursor-default">
			<div className="flex-1 flex flex-col">
				<div className="min-h-screen flex items-stretch">
					<Hero nextPageRef={aboutSectionRef} />
				</div>
				<AboutSection ref={aboutSectionRef} />
				<Features />
				<CommunityStats />
				<Testimonials />
				<LoslCon2025 />
				<CallToAction />
			</div>
		</div>
	);
}
