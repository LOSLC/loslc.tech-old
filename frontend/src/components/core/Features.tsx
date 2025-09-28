import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Users, Heart, Lightbulb, Globe, BookOpen, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Features() {
	const { t } = useTranslation();
	const features = [
		{
			icon: <Users className="h-8 w-8 text-primary" />,
			title: t("features.items.communityDriven.title"),
			description: t("features.items.communityDriven.description"),
		},
		{
			icon: <Shield className="h-8 w-8 text-primary" />,
			title: t("features.items.cybersecurityFocus.title"),
			description: t("features.items.cybersecurityFocus.description"),
		},
		{
			icon: <Heart className="h-8 w-8 text-primary" />,
			title: t("features.items.passionFoss.title"),
			description: t("features.items.passionFoss.description"),
		},
		{
			icon: <Lightbulb className="h-8 w-8 text-primary" />,
			title: t("features.items.innovationLearning.title"),
			description: t("features.items.innovationLearning.description"),
		},
		{
			icon: <Globe className="h-8 w-8 text-primary" />,
			title: t("features.items.africanTechGrowth.title"),
			description: t("features.items.africanTechGrowth.description"),
		},
		{
			icon: <BookOpen className="h-8 w-8 text-primary" />,
			title: t("features.items.securityEducation.title"),
			description: t("features.items.securityEducation.description"),
		},
	];

	return (
		<section className="w-full py-20 px-6 bg-gradient-to-b from-background via-muted/15 to-background">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-foreground mb-4">
						{t("features.title")}
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						{t("features.subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="border border-border/70 bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 motion-preset-slide-up"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<CardHeader className="pb-4">
								<div className="flex items-center space-x-4">
									{feature.icon}
									<CardTitle className="text-xl">{feature.title}</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base leading-relaxed">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
