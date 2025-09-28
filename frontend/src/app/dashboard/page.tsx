"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi, UserDTO } from "@/lib/api/users";
import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CalendarDays,
	CheckCircle2,
	Info,
	MessageSquare,
	BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverviewPage() {
	const { t } = useTranslation();
	const { user: authUser, isLoading: authLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!authLoading && !authUser) router.push("/login");
	}, [authLoading, authUser, router]);

	const { data: user, isLoading } = useQuery<UserDTO>({
		queryKey: ["dashboard/user"],
		queryFn: userApi.getCurrentUser,
		enabled: !!authUser,
	});

	const joinedDate = useMemo(() => {
		try {
			return user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "";
		} catch {
			return "";
		}
	}, [user?.joinedAt]);

	if (authLoading || isLoading) {
		return <div className="pt-24">{t("common.loading", "Loading...")}</div>;
	}
	if (!user) return null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					{t("dashboard.overviewTitle", "Overview")}
				</h1>
				<p className="text-muted-foreground mt-1 text-sm max-w-2xl">
					{t(
						"dashboard.overviewSubtitle",
						"A quick glance at your account status and recent activity.",
					)}
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Info className="w-4 h-4" />{" "}
							{t("dashboard.accountOverview", "Account Overview")}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-xs space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">
								{t("dashboard.memberSince", "Member since")}
							</span>
							<div className="flex items-center gap-1.5">
								<CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />{" "}
								<span>{joinedDate}</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">
								{t("dashboard.verification", "Verification")}
							</span>
							<div className="flex items-center gap-1.5">
								<CheckCircle2
									className={`w-3.5 h-3.5 ${user.isVerified ? "text-green-600" : "text-muted-foreground"}`}
								/>{" "}
								<span>
									{user.isVerified
										? t("dashboard.verifiedYes", "Verified")
										: t("dashboard.verifiedNo", "Not verified")}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="md:col-span-1 lg:col-span-2">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							{t("dashboard.quickActions", "Quick Actions")}
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3 sm:grid-cols-2">
						<Link
							href="/forum"
							className="group flex items-start gap-3 p-4 rounded-md border bg-muted/30 hover:bg-muted transition-colors"
						>
							<MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
							<div className="space-y-1">
								<p className="text-xs font-medium leading-none">
									{t("dashboard.quickForum", "View the Forum")}
								</p>
								<p className="text-[11px] text-muted-foreground">
									{t(
										"dashboard.quickForumHint",
										"See discussions & participate.",
									)}
								</p>
							</div>
						</Link>
						<Link
							href="/blog"
							className="group flex items-start gap-3 p-4 rounded-md border bg-muted/30 hover:bg-muted transition-colors"
						>
							<BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
							<div className="space-y-1">
								<p className="text-xs font-medium leading-none">
									{t("dashboard.quickBlog", "View the Blog")}
								</p>
								<p className="text-[11px] text-muted-foreground">
									{t("dashboard.quickBlogHint", "Latest updates & articles.")}
								</p>
							</div>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
