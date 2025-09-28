"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
	const { t } = useTranslation();
	return (
		<div className="bg-background min-h-screen">
			{/* Header */}
			<div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-32 md:pt-36">
				<div className="max-w-4xl mx-auto px-6">
					<div className="flex items-center space-x-4 mb-4">
						<Shield className="w-12 h-12 text-primary" />
						<h1 className="text-5xl font-bold text-foreground">
							{t("privacyPolicy.title")}
						</h1>
					</div>
					<p className="text-xl text-muted-foreground">
						{t("privacyPolicy.subtitle")}
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						{t("privacyPolicy.lastUpdated")}
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-4xl mx-auto px-6 py-12">
				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Eye className="w-5 h-5 text-primary" />
								<span>{t("privacyPolicy.sections.infoCollect.title")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="font-semibold text-foreground mb-2">
									{t("privacyPolicy.sections.infoCollect.personalTitle")}
								</h4>
								<p className="text-muted-foreground">
									{t("privacyPolicy.sections.infoCollect.personalDesc")}
								</p>
								<ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
									{(
										t("privacyPolicy.sections.infoCollect.personalItems", {
											returnObjects: true,
										}) as string[]
									).map((item, i) => (
										<li key={i}>{item}</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="font-semibold text-foreground mb-2">
									{t("privacyPolicy.sections.infoCollect.usageTitle")}
								</h4>
								<p className="text-muted-foreground">
									{t("privacyPolicy.sections.infoCollect.usageDesc")}
								</p>
								<ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
									{(
										t("privacyPolicy.sections.infoCollect.usageItems", {
											returnObjects: true,
										}) as string[]
									).map((item, i) => (
										<li key={i}>{item}</li>
									))}
								</ul>
								<p className="text-muted-foreground mt-2 text-sm">
									<strong>{t("common.note", { defaultValue: "Note:" })}</strong>{" "}
									{t("privacyPolicy.sections.infoCollect.note")}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Users className="w-5 h-5 text-primary" />
								<span>{t("privacyPolicy.sections.howWeUse.title")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("privacyPolicy.sections.howWeUse.intro")}
							</p>
							<ul className="list-disc list-inside text-muted-foreground space-y-2">
								{(
									t("privacyPolicy.sections.howWeUse.items", {
										returnObjects: true,
									}) as string[]
								).map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Lock className="w-5 h-5 text-primary" />
								<span>{t("privacyPolicy.sections.security.title")}</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="font-semibold text-foreground mb-2">
									{t("privacyPolicy.sections.security.securityMeasures")}
								</h4>
								<p className="text-muted-foreground">
									{t("privacyPolicy.sections.security.securityDesc")}
								</p>
								<ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
									{(
										t("privacyPolicy.sections.security.securityItems", {
											returnObjects: true,
										}) as string[]
									).map((item, i) => (
										<li key={i}>{item}</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="font-semibold text-foreground mb-2">
									{t("privacyPolicy.sections.security.retention")}
								</h4>
								<p className="text-muted-foreground">
									{t("privacyPolicy.sections.security.retentionDesc")}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("privacyPolicy.sections.sharing.title")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("privacyPolicy.sections.sharing.intro")}
							</p>
							<ul className="list-disc list-inside text-muted-foreground space-y-2">
								{(
									t("privacyPolicy.sections.sharing.items", {
										returnObjects: true,
									}) as string[]
								).map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("privacyPolicy.sections.rights.title")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("privacyPolicy.sections.rights.intro")}
							</p>
							<ul className="list-disc list-inside text-muted-foreground space-y-2">
								{(
									t("privacyPolicy.sections.rights.items", {
										returnObjects: true,
									}) as string[]
								).map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ul>
							<p className="text-muted-foreground mt-4">
								{t("privacyPolicy.sections.rights.contact")}{" "}
								<strong>support@loslc.tech</strong>
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("privacyPolicy.sections.cookies.title")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("privacyPolicy.sections.cookies.intro")}
							</p>
							<ul className="list-disc list-inside text-muted-foreground space-y-2">
								{(
									t("privacyPolicy.sections.cookies.items", {
										returnObjects: true,
									}) as string[]
								).map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ul>
							<p className="text-muted-foreground mt-4">
								<strong>
									{t("privacyPolicy.sections.cookies.noteStrong")}
								</strong>{" "}
								{t("privacyPolicy.sections.cookies.note")}
							</p>
							<p className="text-muted-foreground mt-4">
								{t("privacyPolicy.sections.cookies.browser")}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>
								{t("privacyPolicy.sections.thirdParty.title")}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("privacyPolicy.sections.thirdParty.intro")}
							</p>
							<ul className="list-disc list-inside text-muted-foreground space-y-2">
								{(
									t("privacyPolicy.sections.thirdParty.items", {
										returnObjects: true,
									}) as string[]
								).map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ul>
							<p className="text-muted-foreground mt-4">
								<strong>
									{t("privacyPolicy.sections.thirdParty.privacyApproachStrong")}
								</strong>{" "}
								{t("privacyPolicy.sections.thirdParty.privacyApproach")}
							</p>
							<p className="text-muted-foreground mt-4">
								{t("privacyPolicy.sections.thirdParty.review")}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("privacyPolicy.sections.updates.title")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								{t("privacyPolicy.sections.updates.text")}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("privacyPolicy.sections.contact.title")}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								{t("privacyPolicy.sections.contact.intro")}
							</p>
							<div className="space-y-2 text-muted-foreground">
								<p>
									<strong>{t("privacyPolicy.sections.contact.email")}:</strong>{" "}
									privacy@loslc.tech
								</p>
								<p>
									<strong>
										{t("privacyPolicy.sections.contact.general")}:
									</strong>{" "}
									support@loslc.tech
								</p>
								<p>
									<strong>
										{t("privacyPolicy.sections.contact.address")}:
									</strong>{" "}
									{t("privacyPolicy.sections.contact.addressValue")}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
