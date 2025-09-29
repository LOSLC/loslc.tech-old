"use client";

import {
	AlertCircle,
	CheckCircle,
	Globe2,
	GraduationCap,
	Handshake,
	Heart,
	MessageCircle,
	Shield,
	Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CodeOfConduct() {
	const { t } = useTranslation();
	return (
		<div className="bg-background min-h-screen">
			{/* Header */}
			<div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-32 md:pt-36">
				<div className="max-w-4xl mx-auto px-6">
					<div className="flex items-center space-x-4 mb-4">
						<Heart className="w-12 h-12 text-primary" />
						<h1 className="text-5xl font-bold text-foreground">
							{t("codeOfConduct.title")}
						</h1>
					</div>
					<p className="text-xl text-muted-foreground">
						{t("codeOfConduct.subtitle")}
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						{t("codeOfConduct.lastUpdated")}
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 py-12">
				<div className="space-y-8">
					{/* Commitment */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Heart className="w-5 h-5 text-primary" />
								<span>{t("codeOfConduct.commitmentTitle")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("codeOfConduct.commitmentText1")}
							</p>
							<p className="text-muted-foreground">
								{t("codeOfConduct.commitmentText2")}
							</p>
						</CardContent>
					</Card>

					{/* Values */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Users className="w-5 h-5 text-primary" />
								<span>{t("codeOfConduct.valuesTitle")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h4 className="font-semibold text-foreground mb-2 flex items-center">
										<Handshake className="mr-2 h-4 w-4 text-primary" />{" "}
										{t("mission.principles.inclusivity.title")}
									</h4>
									<p className="text-muted-foreground text-sm">
										{t("mission.principles.inclusivity.description")}
									</p>
								</div>
								<div>
									<h4 className="font-semibold text-foreground mb-2 flex items-center">
										<GraduationCap className="mr-2 h-4 w-4 text-primary" />{" "}
										{t("mission.values.learning.title")}
									</h4>
									<p className="text-muted-foreground text-sm">
										{t("mission.values.learning.description")}
									</p>
								</div>
								<div>
									<h4 className="font-semibold text-foreground mb-2 flex items-center">
										<Handshake className="mr-2 h-4 w-4 text-primary" />{" "}
										{t("mission.principles.collaboration.title")}
									</h4>
									<p className="text-muted-foreground text-sm">
										{t("mission.principles.collaboration.description")}
									</p>
								</div>
								<div>
									<h4 className="font-semibold text-foreground mb-2 flex items-center">
										<Globe2 className="mr-2 h-4 w-4 text-primary" />{" "}
										{t("mission.values.innovation.title")}
									</h4>
									<p className="text-muted-foreground text-sm">
										{t("mission.values.innovation.description")}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Expected Behavior */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<CheckCircle className="w-5 h-5 text-green-600" />
								<span>{t("codeOfConduct.expectedBehaviorTitle")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("codeOfConduct.expectedBehaviorText")}
							</p>
							<ul className="space-y-3">
								{(
									t("codeOfConduct.expected.items", {
										returnObjects: true,
									}) as Array<{ title: string; description: string }>
								).map((item, idx) => (
									<li key={idx} className="flex items-start space-x-3">
										<CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
										<div>
											<strong className="text-foreground">{item.title}:</strong>
											<span className="text-muted-foreground">
												{" "}
												{item.description}
											</span>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Unacceptable Behavior */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<AlertCircle className="w-5 h-5 text-red-600" />
								<span>{t("codeOfConduct.unacceptableBehaviorTitle")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("codeOfConduct.unacceptableBehaviorText")}
							</p>
							<ul className="space-y-3">
								{(
									t("codeOfConduct.unacceptable.items", {
										returnObjects: true,
									}) as Array<{ title: string; description: string }>
								).map((item, idx) => (
									<li key={idx} className="flex items-start space-x-3">
										<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
										<div>
											<strong className="text-foreground">{item.title}:</strong>
											<span className="text-muted-foreground">
												{" "}
												{item.description}
											</span>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Reporting and Enforcement */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Shield className="w-5 h-5 text-primary" />
								<span>{t("codeOfConduct.reporting.title")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div>
								<h4 className="font-semibold text-foreground mb-2">
									{t("codeOfConduct.reporting.title")}
								</h4>
								<p className="text-muted-foreground mb-3">
									{t("codeOfConduct.reporting.howToIntro")}
								</p>
								<ul className="list-disc list-inside text-muted-foreground space-y-1">
									{(
										t("codeOfConduct.reporting.howToItems", {
											returnObjects: true,
										}) as string[]
									).map((it, i) => (
										<li key={i}>{it}</li>
									))}
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-foreground mb-2">
									{t("codeOfConduct.reporting.responseTitle")}
								</h4>
								<p className="text-muted-foreground mb-2">
									{t("codeOfConduct.reporting.includeIntro")}
								</p>
								<ul className="list-disc list-inside text-muted-foreground space-y-1">
									{(
										t("codeOfConduct.reporting.includeItems", {
											returnObjects: true,
										}) as string[]
									).map((it, i) => (
										<li key={i}>{it}</li>
									))}
								</ul>
								<p className="text-muted-foreground">
									{t("codeOfConduct.reporting.responseText")}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Consequences */}
					<Card>
						<CardHeader>
							<CardTitle>{t("codeOfConduct.consequencesTitle")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("codeOfConduct.consequencesText1")}
							</p>
							<div className="space-y-4">
								{(
									t("codeOfConduct.consequences.items", {
										returnObjects: true,
									}) as Array<{
										step: string;
										title: string;
										description: string;
									}>
								).map((c, i) => (
									<div key={i} className="flex items-start space-x-3">
										<div
											className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
												i === 0
													? "bg-yellow-100 text-yellow-800"
													: i === 1
														? "bg-orange-100 text-orange-800"
														: "bg-red-100 text-red-800"
											}`}
										>
											{c.step}
										</div>
										<div>
											<strong className="text-foreground">{c.title}:</strong>
											<span className="text-muted-foreground">
												{" "}
												{c.description}
											</span>
										</div>
									</div>
								))}
							</div>
							<p className="text-muted-foreground mt-4">
								{t("codeOfConduct.consequencesText2")}
							</p>
						</CardContent>
					</Card>

					{/* Scope */}
					<Card>
						<CardHeader>
							<CardTitle>{t("codeOfConduct.scopeTitle")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("codeOfConduct.scopeText")}
							</p>
							<ul className="list-disc list-inside text-muted-foreground space-y-1">
								{(
									t("codeOfConduct.scope.items", {
										returnObjects: true,
									}) as string[]
								).map((it, i) => (
									<li key={i}>{it}</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Appeals */}
					<Card>
						<CardHeader>
							<CardTitle>{t("codeOfConduct.appealsTitle")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("codeOfConduct.appealsText1")}
							</p>
							<ul className="list-disc list-inside text-muted-foreground space-y-2">
								{(
									t("codeOfConduct.appeals.items", {
										returnObjects: true,
									}) as string[]
								).map((it, i) => (
									<li key={i}>{it}</li>
								))}
							</ul>
							<p className="text-muted-foreground mt-4">
								{t("codeOfConduct.appealsText2")}
							</p>
						</CardContent>
					</Card>

					{/* Contact */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<MessageCircle className="w-5 h-5 text-primary" />
								<span>{t("codeOfConduct.contactTitle")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("codeOfConduct.contactText")}
							</p>
							<div className="space-y-2 text-muted-foreground">
								<p>
									<strong>{t("codeOfConduct.contact.emailLabel")}:</strong>{" "}
									support@loslc.tech
								</p>
								<p>
									<strong>
										{t("codeOfConduct.contact.communityDiscussion")}:
									</strong>{" "}
									Start a conversation in our forums
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
