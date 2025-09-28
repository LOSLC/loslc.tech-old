"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Users,
	FileText,
	Upload,
	Shield,
	LayoutDashboard,
	Menu,
	LogOut,
	ShoppingBag,
} from "lucide-react";
import ThemeSwitcher from "@/components/core/miscellaneous/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	HoverCard,
	HoverCardTrigger,
	HoverCardContent,
} from "@/components/ui/hover-card";

interface AdminLayoutProps {
	children: React.ReactNode;
}

interface NavItem {
	href: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	description: string;
}

const navItems: NavItem[] = [
	{
		href: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		description: "Overview and statistics",
	},
	{
		href: "/admin/users",
		label: "User Management",
		icon: Users,
		description: "Manage users, ban/unban, edit profiles",
	},
	{
		href: "/admin/access",
		label: "Access Management",
		icon: Shield,
		description: "Roles and permissions",
	},
	{
		href: "/admin/blog",
		label: "Blog Management",
		icon: FileText,
		description: "Posts, categories, and tags",
	},
	{
		href: "/admin/files",
		label: "File Management",
		icon: Upload,
		description: "Upload and organize media",
	},
	{
		href: "/admin/store",
		label: "Store Management",
		icon: ShoppingBag,
		description: "Items, orders and inventory",
	},
];

function NavContent() {
	const pathname = usePathname();

	return (
		<div className="flex flex-col h-full">
			<div className="p-4 border-b border-border">
				<div className="flex flex-col items-center space-y-2">
					<div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
						<LayoutDashboard className="w-5 h-5 text-primary-foreground" />
					</div>
					<div className="text-center">
						<p className="text-xs font-semibold">Admin</p>
						<p className="text-xs text-muted-foreground">Panel</p>
					</div>
				</div>
			</div>

			<nav className="flex-1 p-3 space-y-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						pathname === item.href ||
						(item.href !== "/admin" && pathname.startsWith(item.href));

					return (
						<HoverCard key={item.href} openDelay={100} closeDelay={0}>
							<HoverCardTrigger asChild>
								<Button
									variant={isActive ? "default" : "ghost"}
									size="sm"
									className={cn(
										"w-full h-14 flex flex-col items-center justify-center p-3 transition-all duration-200",
										"hover:scale-105 hover:shadow-md active:scale-95 group",
										isActive &&
											"shadow-lg bg-gradient-to-br from-primary to-primary/90",
									)}
									asChild
								>
									<Link href={item.href}>
										<Icon
											className={cn(
												"w-5 h-5 mb-1 transition-transform duration-200",
												isActive
													? "text-primary-foreground"
													: "text-muted-foreground group-hover:text-foreground",
												"group-hover:scale-110",
											)}
										/>
									</Link>
								</Button>
							</HoverCardTrigger>
							<HoverCardContent
								side="right"
								className="w-auto p-3 ml-2 shadow-xl border-border"
								sideOffset={8}
							>
								<div className="space-y-1">
									<p className="text-sm font-semibold">{item.label}</p>
									<p className="text-xs text-muted-foreground">
										{item.description}
									</p>
								</div>
							</HoverCardContent>
						</HoverCard>
					);
				})}
			</nav>

			<div className="p-3 border-t border-border">
				<div className="flex flex-col space-y-2">
					{/* Theme Switcher */}
					<div className="flex justify-center">
						<ThemeSwitcher />
					</div>

					<HoverCard openDelay={100} closeDelay={0}>
						<HoverCardTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="w-full h-14 flex flex-col items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all duration-200 group hover:bg-destructive/10"
								asChild
							>
								<Link href="/blog">
									<LogOut className="w-5 h-5 mb-1 text-muted-foreground group-hover:text-destructive transition-colors duration-200" />
									<span className="text-xs font-medium text-muted-foreground group-hover:text-destructive transition-colors duration-200">
										Exit
									</span>
								</Link>
							</Button>
						</HoverCardTrigger>
						<HoverCardContent
							side="right"
							className="w-auto p-3 ml-2 shadow-xl border-border"
							sideOffset={8}
						>
							<div className="space-y-1">
								<p className="text-sm font-semibold">Back to Site</p>
								<p className="text-xs text-muted-foreground">
									Return to main website
								</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				</div>
			</div>
		</div>
	);
}

function MobileBottomNav() {
	const pathname = usePathname();

	return (
		<div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
			<div className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t border-border">
				<nav className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
					{navItems.slice(0, 4).map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href ||
							(item.href !== "/admin" && pathname.startsWith(item.href));

						return (
							<Button
								key={item.href}
								variant="ghost"
								size="sm"
								className={cn(
									"flex flex-col items-center justify-center p-2 h-auto min-w-0 flex-1 transition-all duration-200",
									"hover:scale-105 active:scale-95",
									isActive && "bg-primary/10 text-primary",
								)}
								asChild
							>
								<Link href={item.href}>
									<Icon
										className={cn(
											"w-5 h-5 mb-1 transition-colors duration-200",
											isActive ? "text-primary" : "text-muted-foreground",
										)}
									/>
									<span
										className={cn(
											"text-xs font-medium truncate transition-colors duration-200",
											isActive ? "text-primary" : "text-muted-foreground",
										)}
									>
										{item.label.split(" ")[0]}
									</span>
								</Link>
							</Button>
						);
					})}

					{/* More menu for additional items */}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="flex flex-col items-center justify-center p-2 h-auto min-w-0 flex-1 hover:scale-105 active:scale-95 transition-all duration-200"
							>
								<Menu className="w-5 h-5 mb-1 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									More
								</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="w-80 p-0">
							<div className="p-4 border-b">
								<h2 className="text-lg font-semibold">Admin Menu</h2>
							</div>
							<div className="p-4 space-y-2">
								{navItems.slice(4).map((item) => {
									const Icon = item.icon;
									const isActive =
										pathname === item.href ||
										(item.href !== "/admin" && pathname.startsWith(item.href));

									return (
										<Button
											key={item.href}
											variant={isActive ? "default" : "ghost"}
											className="w-full justify-start h-auto p-4"
											asChild
										>
											<Link href={item.href}>
												<div className="flex items-center space-x-3">
													<Icon className="w-5 h-5" />
													<div className="text-left">
														<p className="text-sm font-medium">{item.label}</p>
														<p className="text-xs text-muted-foreground">
															{item.description}
														</p>
													</div>
												</div>
											</Link>
										</Button>
									);
								})}

								<div className="pt-2 border-t border-border space-y-2">
									<div className="flex items-center justify-between px-4 py-2">
										<span className="text-sm font-medium">Theme</span>
										<ThemeSwitcher />
									</div>

									<Button
										variant="ghost"
										className="w-full justify-start h-auto p-4 hover:bg-destructive/10"
										asChild
									>
										<Link href="/blog">
											<div className="flex items-center space-x-3">
												<LogOut className="w-5 h-5 text-muted-foreground" />
												<div className="text-left">
													<p className="text-sm font-medium">Back to Site</p>
													<p className="text-xs text-muted-foreground">
														Return to main website
													</p>
												</div>
											</div>
										</Link>
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</nav>
			</div>
		</div>
	);
}

export function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className="min-h-screen bg-background">
			<div className="flex h-screen">
				{/* Desktop Sidebar */}
				<div className="hidden lg:flex lg:w-20 lg:flex-col lg:fixed lg:inset-y-0 z-50">
					<div className="flex flex-col flex-1 border-r border-border bg-card shadow-sm">
						<NavContent />
					</div>
				</div>

				{/* Mobile Header */}
				<div className="lg:hidden fixed top-0 left-0 right-0 z-40">
					<div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
								<LayoutDashboard className="w-4 h-4 text-primary-foreground" />
							</div>
							<h1 className="text-lg font-semibold">Admin Panel</h1>
						</div>
						<ThemeSwitcher />
					</div>
				</div>

				{/* Mobile Bottom Navigation */}
				<MobileBottomNav />

				{/* Main Content */}
				<div className="flex-1 lg:ml-20 pt-14 sm:pt-16 lg:pt-0 pb-20 lg:pb-0">
					<main className="h-full overflow-y-auto">
						<div className="px-3 py-4 sm:p-6 max-w-7xl mx-auto w-full">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
