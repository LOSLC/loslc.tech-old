"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, User2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/core/miscellaneous/ThemeSwitcher";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

interface NavItem {
	href: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
	{ href: "/dashboard", label: "Overview", icon: LayoutDashboard },
	{ href: "/dashboard/orders", label: "Order History", icon: ShoppingBag },
	{ href: "/dashboard/settings", label: "Profile Settings", icon: User2 },
	{ href: "/", label: "Home", icon: Home },
];

function Sidebar() {
	const pathname = usePathname();
	return (
		<div className="hidden lg:flex lg:w-56 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card/95 backdrop-blur">
			<div className="flex items-center justify-between px-4 h-14 border-b border-border">
				<span className="text-sm font-semibold">Dashboard</span>
				<ThemeSwitcher />
			</div>
			<nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
				{navItems.map((item) => {
					const Icon = item.icon;
					const active =
						item.href === "/"
							? pathname === "/"
							: pathname === item.href ||
								(item.href !== "/dashboard" && pathname.startsWith(item.href));
					return (
						<Button
							key={item.href}
							variant={active ? "secondary" : "ghost"}
							size="sm"
							className="w-full justify-start gap-2"
							asChild
						>
							<Link href={item.href}>
								<Icon className="w-4 h-4" />
								<span className="text-sm">{item.label}</span>
							</Link>
						</Button>
					);
				})}
			</nav>
		</div>
	);
}

function MobileTopBar() {
	return (
		<div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-b border-border flex items-center justify-between px-4 h-14">
			<span className="text-sm font-semibold">Dashboard</span>
			<ThemeSwitcher />
		</div>
	);
}

function MobileBottomNav() {
	const pathname = usePathname();
	return (
		<div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur">
			<nav className="flex items-center justify-around px-2 py-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					const active =
						item.href === "/"
							? pathname === "/"
							: pathname === item.href ||
								(item.href !== "/dashboard" && pathname.startsWith(item.href));
					return (
						<Button
							key={item.href}
							variant="ghost"
							size="sm"
							className={cn(
								"flex flex-col items-center gap-0.5 h-auto p-2",
								active && "text-primary",
							)}
							asChild
						>
							<Link href={item.href}>
								<Icon
									className={cn(
										"w-5 h-5",
										active ? "text-primary" : "text-muted-foreground",
									)}
								/>
								<span className="text-[10px] font-medium leading-none">
									{item.label.split(" ")[0]}
								</span>
							</Link>
						</Button>
					);
				})}
			</nav>
		</div>
	);
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="min-h-screen bg-background">
			<Sidebar />
			<MobileTopBar />
			<MobileBottomNav />
			{/* Increased top padding for more breathing room on all breakpoints.
          Desktop previously had almost no offset; now consistent spacing. */}
			<main className="lg:ml-56 pt-20 sm:pt-24 lg:pt-14 pb-28 lg:pb-16 transition-padding">
				{/* Replaced generic container with custom spacing for wider side gutters on large screens */}
				<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
					{children}
				</div>
			</main>
		</div>
	);
}
