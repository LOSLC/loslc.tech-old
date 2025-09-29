"use client";

import { Calendar, Clock, Code2, MapPin, Network, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface LoslCon2025Props {
	className?: string;
}

// Simple countdown (event date set to 22 Nov 2025 at 08:00 UTC)
const EVENT_DATE = new Date("2025-11-22T08:00:00Z");

export default function LoslCon2025({ className = "" }: LoslCon2025Props) {
	const [timeLeft, setTimeLeft] = useState<string>("");
	const { t } = useTranslation();

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const diff = EVENT_DATE.getTime() - now.getTime();
			if (diff <= 0) {
				setTimeLeft("Live Now");
				clearInterval(interval);
				return;
			}
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			setTimeLeft(`${days}d ${hours}h ${minutes}m`);
		}, 60000);
		// immediate
		const now = new Date();
		const diff = EVENT_DATE.getTime() - now.getTime();
		if (diff <= 0) setTimeLeft("Live Now");
		else {
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			setTimeLeft(`${days}d ${hours}h ${minutes}m`);
		}
		return () => clearInterval(interval);
	}, []);

	return (
		<section
			className={`relative w-full py-24 px-6 overflow-hidden bg-gradient-to-b from-background via-muted/25 to-background ${className}`}
		>
			{/* Ambient shapes */}
			<div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen dark:opacity-60">
				<div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/40 dark:bg-primary/60 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] bg-secondary/30 dark:bg-secondary/50 rounded-full blur-3xl motion-preset-pulse motion-duration-[6s]" />
				<div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/20 dark:bg-accent/40 rounded-full blur-3xl" />
			</div>

			<div className="relative max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/50 text-xs tracking-wide uppercase font-medium text-primary dark:text-primary backdrop-blur-sm">
						{t("loslCon.badge")}
					</div>
					<h2 className="relative font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight">
						<span className="relative inline-block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-[gradient-move_8s_linear_infinite] drop-shadow-[0_0_6px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_12px_rgba(139,92,246,0.8)] dark:filter dark:brightness-150">
							{t("loslCon.title")}
						</span>
						<span
							className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-gradient-to-r from-primary via-secondary to-primary animate-[glow-pulse_4s_ease-in-out_infinite] dark:opacity-90 dark:blur-3xl"
							aria-hidden="true"
						/>
					</h2>
					<p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
						{t("loslCon.description")}
					</p>
				</div>

				{/* Key Info */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
					{[
						{
							icon: <Calendar className="h-5 w-5" />,
							label: t("loslCon.info.date.label"),
							value: t("loslCon.info.date.value"),
						},
						{
							icon: <MapPin className="h-5 w-5" />,
							label: t("loslCon.info.location.label"),
							value: t("loslCon.info.location.value"),
						},
						{
							icon: <Clock className="h-5 w-5" />,
							label: t("loslCon.info.countdown.label"),
							value: timeLeft,
						},
						{
							icon: <Network className="h-5 w-5" />,
							label: t("loslCon.info.focus.label"),
							value: t("loslCon.info.focus.value"),
						},
					].map((item, i) => (
						<div
							key={i}
							className="relative group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 flex flex-col gap-2 overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
						>
							<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
							<div className="relative flex items-center gap-3 text-foreground">
								<span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/15 text-primary border border-primary/20">
									{item.icon}
								</span>
								<div>
									<p className="text-xs uppercase tracking-wide text-muted-foreground/80 font-medium">
										{item.label}
									</p>
									<p className="font-semibold text-sm md:text-base leading-snug">
										{item.value}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Pillars */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
					{[
						{
							icon: <Shield className="w-6 h-6" />,
							title: t("loslCon.pillars.cybersecurity.title"),
							text: t("loslCon.pillars.cybersecurity.text"),
						},
						{
							icon: <Code2 className="w-6 h-6" />,
							title: t("loslCon.pillars.foss.title"),
							text: t("loslCon.pillars.foss.text"),
						},
						{
							icon: <Network className="w-6 h-6" />,
							title: t("loslCon.pillars.collaboration.title"),
							text: t("loslCon.pillars.collaboration.text"),
						},
					].map((p, i) => (
						<div
							key={i}
							className="group relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 overflow-hidden hover:-translate-y-0.5 transition-all cursor-pointer"
						>
							<div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 transition-opacity" />
							<div className="relative flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/20 shrink-0">
									{p.icon}
								</div>
								<div className="space-y-2">
									<h3 className="font-semibold text-lg tracking-tight text-foreground">
										{p.title}
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{p.text}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* CTA */}
				<div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background/80 to-secondary/20 backdrop-blur-md p-10 text-center overflow-hidden">
					<div className="absolute -inset-1 opacity-30 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--color-primary)_/_0.25),transparent_60%),radial-gradient(circle_at_70%_60%,hsl(var(--color-secondary)_/_0.25),transparent_60%)]" />
					<div className="relative">
						<h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
							{t("loslCon.cta.heading")}
						</h3>
						<p className="text-muted-foreground max-w-2xl mx-auto mb-8">
							{t("loslCon.cta.body")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="https://loslcon.loslc.tech/register"
								className="cursor-pointer"
							>
								<Button
									size="lg"
									className="px-8 font-medium shadow-lg shadow-primary/30 hover:scale-[1.05] transition-transform cursor-pointer"
								>
									{t("loslCon.cta.primary")}
								</Button>
							</Link>
							<Link
								href="https://loslcon.loslc.tech"
								className="cursor-pointer"
							>
								<Button
									variant="outline"
									size="lg"
									className="px-8 hover:scale-[1.05] transition-transform cursor-pointer"
								>
									{t("loslCon.cta.secondary")}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Local keyframes for gradient animation */}
			<style jsx>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glow-pulse {
          0%,100% { opacity:0.55; filter:blur(34px) brightness(1.25); }
          50% { opacity:0.85; filter:blur(42px) brightness(1.45); }
        }
        .animate-[gradient-move_8s_linear_infinite] { background-size: 200% 200%; }
      `}</style>
		</section>
	);
}
