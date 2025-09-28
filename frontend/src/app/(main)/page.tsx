"use client";

import Hero from "@/components/core/Hero";
import AboutSection from "@/components/core/AboutSection";
import Features from "@/components/core/Features";
import CommunityStats from "@/components/core/CommunityStats";
import Testimonials from "@/components/core/Testimonials";
import CallToAction from "@/components/core/CallToAction";
import LoslCon2025 from "@/components/core/LoslCon2025";
import { useRef } from "react";

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
