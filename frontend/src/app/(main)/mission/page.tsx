"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Target,
	Eye,
	Heart,
	Globe,
	Users,
	Lightbulb,
	BookOpen,
	Code2,
	Award,
	Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";

export default function Mission() {
	const { t } = useTranslation();
	const coreValues = [
		{
			icon: <Heart className="w-8 h-8 text-red-500" />,
			titleKey: "mission.values.openSource.title",
			descriptionKey: "mission.values.openSource.description",
		},
		{
			icon: <Shield className="w-8 h-8 text-blue-500" />,
			titleKey: "mission.values.cybersecurity.title",
			descriptionKey: "mission.values.cybersecurity.description",
		},
		{
			icon: <Users className="w-8 h-8 text-green-500" />,
			titleKey: "mission.values.community.title",
			descriptionKey: "mission.values.community.description",
		},
		{
			icon: <BookOpen className="w-8 h-8 text-purple-500" />,
			titleKey: "mission.values.knowledge.title",
			descriptionKey: "mission.values.knowledge.description",
		},
		{
			icon: <Globe className="w-8 h-8 text-orange-500" />,
			titleKey: "mission.values.innovation.title",
			descriptionKey: "mission.values.innovation.description",
		},
		{
			icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
			titleKey: "mission.values.learning.title",
			descriptionKey: "mission.values.learning.description",
		},
		{
			icon: <Code2 className="w-8 h-8 text-indigo-500" />,
			titleKey: "mission.values.excellence.title",
			descriptionKey: "mission.values.excellence.description",
		},
	];

	const impactGoals = [
		{
			icon: <Users className="w-6 h-6" />,
			titleKey: "mission.goals.community.title",
			descriptionKey: "mission.goals.community.description",
			metricsKey: "mission.goals.community.metrics",
		},
		{
			icon: <BookOpen className="w-6 h-6" />,
			titleKey: "mission.goals.education.title",
			descriptionKey: "mission.goals.education.description",
			metricsKey: "mission.goals.education.metrics",
		},
		{
			icon: <Code2 className="w-6 h-6" />,
			titleKey: "mission.goals.openSource.title",
			descriptionKey: "mission.goals.openSource.description",
			metricsKey: "mission.goals.openSource.metrics",
		},
		{
			icon: <Award className="w-6 h-6" />,
			titleKey: "mission.goals.digital.title",
			descriptionKey: "mission.goals.digital.description",
			metricsKey: "mission.goals.digital.metrics",
		},
	];

	const principles = [
		{
			titleKey: "mission.principles.inclusivity.title",
			descriptionKey: "mission.principles.inclusivity.description",
		},
		{
			titleKey: "mission.principles.practical.title",
			descriptionKey: "mission.principles.practical.description",
		},
		{
			titleKey: "mission.principles.cultural.title",
			descriptionKey: "mission.principles.cultural.description",
		},
		{
			titleKey: "mission.principles.sustainability.title",
			descriptionKey: "mission.principles.sustainability.description",
		},
		{
			titleKey: "mission.principles.collaboration.title",
			descriptionKey: "mission.principles.collaboration.description",
		},
		{
			titleKey: "mission.principles.freedom.title",
			descriptionKey: "mission.principles.freedom.description",
		},
	];

	return (
		<div className="bg-background min-h-screen">
			{/* Header */}
			<div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 pt-32 md:pt-36">
				<div className="max-w-4xl mx-auto px-6">
					<div className="flex items-center space-x-4 mb-6">
						<Target className="w-12 h-12 text-primary" />
						<h1 className="text-5xl font-bold text-foreground">
							{t("mission.title")}
						</h1>
					</div>
					<p className="text-xl text-muted-foreground max-w-3xl">
						{t("mission.subtitle")}
					</p>
				</div>
			</div>

			{/* Mission Statement */}
			<section className="py-16 px-6">
				<div className="max-w-4xl mx-auto">
					<Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
						<CardContent className="p-12 text-center">
							<Target className="w-16 h-16 text-primary mx-auto mb-6" />
							<h2 className="text-4xl font-bold text-foreground mb-6">
								{t("mission.title")}
							</h2>
							<p className="text-[16px] md:text-lg lg:text-xl text-foreground mb-8">
								{t("mission.missionStatement")}
							</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
								<div className="text-center">
									<div className="text-3xl font-bold text-primary">
										{t("mission.statistics.members.number")}
									</div>
									<div className="text-muted-foreground">
										{t("mission.statistics.members.label")}
									</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-primary">
										{t("mission.statistics.workshops.number")}
									</div>
									<div className="text-muted-foreground">
										{t("mission.statistics.workshops.label")}
									</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-primary">
										{t("mission.statistics.cities.number")}
									</div>
									<div className="text-muted-foreground">
										{t("mission.statistics.cities.label")}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Vision */}
			<section className="py-16 px-6 bg-muted/20">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<Card className="border-2 border-primary/20">
								<CardHeader>
									<CardTitle className="flex items-center text-3xl">
										<Eye className="w-10 h-10 text-primary mr-4" />
										{t("mission.visionTitle")}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-xl text-muted-foreground leading-relaxed mb-6">
										{t("mission.visionDescription")}
									</p>
									<p className="text-lg text-muted-foreground leading-relaxed">
										{t("mission.vision2030")}
									</p>
								</CardContent>
							</Card>
						</div>
						<div>
							<Card className="border-2 mt-0 pt-0 border-primary/20 overflow-hidden duration-200 hover:border-primary">
								<CardContent className="p-0">
									<Image
										src="/people.png"
										alt="African tech community collaboration"
										width={600}
										height={400}
										className="w-full h-auto object-cover rounded-t-sm"
									/>
									<div className="p-6">
										<p className="text-center text-muted-foreground font-medium">
											{t("mission.imageCaption")}
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Core Values */}
			<section className="py-16 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t("mission.coreValuesTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							{t("mission.coreValuesSubtitle")}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{coreValues.map((value, index) => (
							<Card
								key={index}
								className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
							>
								<CardContent className="p-6 text-center">
									<div className="mb-4 flex justify-center">{value.icon}</div>
									<CardHeader className="p-0 mb-3">
										<CardTitle className="text-xl">
											{t(value.titleKey)}
										</CardTitle>
									</CardHeader>
									<p className="text-muted-foreground leading-relaxed">
										{t(value.descriptionKey)}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Impact Goals */}
			<section className="py-16 px-6 bg-muted/20">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t("mission.impactGoalsTitle")}
						</h2>
						<p className="text-xl text-muted-foreground">
							{t("mission.impactGoalsSubtitle")}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{impactGoals.map((goal, index) => (
							<Card
								key={index}
								className="border-2 border-border hover:border-primary/50 transition-all duration-300"
							>
								<CardHeader>
									<div className="flex items-start space-x-4">
										<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
											{goal.icon}
										</div>
										<div className="flex-1">
											<CardTitle className="text-xl mb-2">
												{t(goal.titleKey)}
											</CardTitle>
											<p className="text-muted-foreground">
												{t(goal.descriptionKey)}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="bg-primary/5 rounded-lg p-3">
										<p className="text-sm font-semibold text-primary">
											{t(goal.metricsKey)}
										</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Guiding Principles */}
			<section className="py-16 px-6">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t("mission.guidingPrinciplesTitle")}
						</h2>
						<p className="text-xl text-muted-foreground">
							{t("mission.guidingPrinciplesSubtitle")}
						</p>
					</div>

					<div className="space-y-6">
						{principles.map((principle, index) => (
							<Card
								key={index}
								className="hover:shadow-md transition-all duration-300"
							>
								<CardContent className="p-6">
									<h3 className="text-xl font-bold text-foreground mb-3">
										{t(principle.titleKey)}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{t(principle.descriptionKey)}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			{/* Call to Action */}
			<section className="py-16 px-6 bg-primary/5">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl font-bold text-foreground mb-6">
						{t("mission.callToActionTitle")}
					</h2>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						{t("mission.callToActionDescription")}
					</p>
					<Link
						href={"/join"}
						className={`px-8 py-4 text-lg ${buttonVariants({ variant: "default" })}`}
					>
						{t("mission.getInvolvedButton")}
					</Link>
				</div>
			</section>
		</div>
	);
}
