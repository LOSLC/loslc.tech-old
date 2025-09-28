"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
	Home,
	Info,
	Target,
	Shield,
	FileText,
	MessageCircle,
	Menu,
	X,
	LogIn,
	LogOut,
	User,
	ChevronDown,
	Book,
	ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeSwitcher from "./miscellaneous/ThemeSwitcher";
import LanguageSwitcher from "./miscellaneous/LanguageSwitcher";
import { useAuth } from "@/lib/providers/auth-provider";
import { toast } from "sonner";

export default function FloatingNav() {
	const { t } = useTranslation();
	const { user, logout } = useAuth();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success(t("auth.logoutSuccess"));
		} catch {
			toast.error(t("auth.logoutError"));
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			setIsScrolled(scrollY > 50);

			// Check if user is at the bottom of the page (within 100px)
			const isNearBottom = scrollY + windowHeight >= documentHeight - 100;
			setIsAtBottom(isNearBottom);

			// Show nav after scrolling a bit to avoid overlap with hero content
			if (pathname === "/") {
				setIsVisible(scrollY > 50);
			} else {
				setIsVisible(true);
			}
		};

		// Initial check
		handleScroll();

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [pathname]);

	const navItems = [
		{ href: "/", label: t("nav.home"), icon: Home },
		{ href: "/learn-more", label: t("nav.about"), icon: Info },
		{ href: "/mission", label: t("nav.mission"), icon: Target },
		{ href: "/forum", label: t("nav.forum"), icon: MessageCircle },
		{ href: "/store", label: t("nav.store"), icon: ShoppingBag },
		{ href: "/code-of-conduct", label: t("nav.code"), icon: Shield },
		{ href: "/terms-of-service", label: t("nav.terms"), icon: FileText },
		{ href: "/blog", label: t("blog.badge"), icon: Book },
	];

	// Pagination logic for desktop (show 3 at a time)
	const PAGE_SIZE = 3;
	const [page, setPage] = useState(0);
	const totalPages = Math.ceil(navItems.length / PAGE_SIZE);
	const canPaginate = navItems.length > PAGE_SIZE;
	const atFirst = page === 0;
	const atLast = page === totalPages - 1;
	// Build pages once (cheap) — array of nav item chunks
	const pages = Array.from({ length: totalPages }, (_, i) =>
		navItems.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE),
	);

	const sliderRef = useRef<HTMLDivElement | null>(null);
	const desktopNavRef = useRef<HTMLDivElement | null>(null);
	const [viewportWidth, setViewportWidth] = useState<number | null>(null);

	// Apply transition once (mount) — transform updates animate
	useEffect(() => {
		if (sliderRef.current) {
			sliderRef.current.style.transition =
				"transform 420ms cubic-bezier(.4,.1,.2,1)";
		}
	}, []);

	function nextPage() {
		if (!atLast) setPage((p) => p + 1);
	}
	function prevPage() {
		if (!atFirst) setPage((p) => p - 1);
	}

	// Measure page widths to allow intrinsic nav width & internal arrows
	useEffect(() => {
		const measure = () => {
			if (!sliderRef.current) return;
			const pagesEls = Array.from(
				sliderRef.current.querySelectorAll<HTMLElement>("[data-nav-page]"),
			);
			if (!pagesEls.length) return;
			const widths = pagesEls.map((el) => el.offsetWidth);
			const max = Math.max(...widths);
			if (max && max !== viewportWidth) setViewportWidth(max);
		};
		// defer to next frame for accurate layout after style changes
		requestAnimationFrame(measure);
	}, [page, isScrolled, navItems.length]);

	useEffect(() => {
		const onResize = () => {
			if (!sliderRef.current) return;
			const pagesEls = Array.from(
				sliderRef.current.querySelectorAll<HTMLElement>("[data-nav-page]"),
			);
			if (!pagesEls.length) return;
			const widths = pagesEls.map((el) => el.offsetWidth);
			const max = Math.max(...widths);
			setViewportWidth(max);
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	// Wheel / trackpad support scoped to desktop nav region
	useEffect(() => {
		const el = desktopNavRef.current;
		if (!el || !canPaginate) return;
		let lastScroll = 0;
		const handler = (e: WheelEvent) => {
			// throttle a little to avoid accidental multi page jumps
			const now = Date.now();
			if (now - lastScroll < 300) return;
			const mag = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			if (Math.abs(mag) < 10) return; // ignore tiny moves
			if (mag > 0) nextPage();
			else prevPage();
			lastScroll = now;
		};
		el.addEventListener("wheel", handler, { passive: true });
		return () => el.removeEventListener("wheel", handler);
	}, [canPaginate, page, atFirst, atLast]);

	// Keyboard arrow navigation when container focused
	const onKeyDown = (e: React.KeyboardEvent) => {
		if (!canPaginate) return;
		if (e.key === "ArrowRight") {
			nextPage();
		} else if (e.key === "ArrowLeft") {
			prevPage();
		}
	};

	const isActive = (href: string) => pathname === href;

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			{/* Desktop Navigation */}
			<nav
				className={`
        fixed left-1/2 -translate-x-1/2 z-50 
        transition-all duration-500 ease-in-out hidden md:block
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        ${isScrolled ? "top-5" : "top-8"}
      `}
			>
				<div
					className={`
          px-4 py-2.5 rounded-full backdrop-blur-xl
          bg-white/10 dark:bg-black/10
          border border-primary/40
          shadow-2xl shadow-black/5
          transition-all duration-300
          ${isScrolled ? "scale-95 px-3 py-2" : "scale-100"}
        `}
				>
					<div className="flex items-center space-x-4">
						{/* Slider + Arrows (internal) */}
						<div
							ref={desktopNavRef}
							className="flex items-center gap-2"
							role="navigation"
							aria-label="Primary"
							tabIndex={canPaginate ? 0 : -1}
							onKeyDown={onKeyDown}
						>
							{canPaginate && (
								<button
									type="button"
									onClick={prevPage}
									aria-label="Previous links"
									disabled={atFirst}
									className={`h-7 w-7 flex items-center justify-center rounded-full bg-background/60 backdrop-blur border border-border/50 text-foreground/70 transition hover:text-foreground hover:bg-background/70 ${atFirst ? "opacity-30 cursor-not-allowed" : "hover:scale-110"}`}
								>
									<span aria-hidden>‹</span>
									<span className="sr-only">Previous</span>
								</button>
							)}
							<div
								className="overflow-hidden"
								style={{
									width: viewportWidth ? `${viewportWidth}px` : undefined,
								}}
							>
								<div
									ref={sliderRef}
									className="flex"
									style={{
										transform: viewportWidth
											? `translateX(-${page * viewportWidth}px)`
											: `translateX(-${page * 100}%)`,
										width: viewportWidth
											? `${(viewportWidth || 0) * totalPages}px`
											: undefined,
									}}
								>
									{pages.map((chunk, i) => (
										<div
											key={i}
											data-nav-page
											className="flex gap-1 items-center justify-center"
											style={{
												width: viewportWidth ? `${viewportWidth}px` : undefined,
											}}
											aria-hidden={i !== page}
										>
											{chunk.map((item) => {
												const Icon = item.icon;
												return (
													<Link
														key={item.href}
														href={item.href}
														className="cursor-pointer"
													>
														<Button
															variant="ghost"
															size="sm"
															className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg ${isScrolled ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"} ${isActive(item.href) ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20" : "bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-transparent"}`}
														>
															<Icon
																className={`mr-1.5 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
															/>
															<span className={isScrolled ? "lg:inline" : ""}>
																{item.label}
															</span>
														</Button>
													</Link>
												);
											})}
										</div>
									))}
								</div>
							</div>
							{canPaginate && (
								<button
									type="button"
									onClick={nextPage}
									aria-label="Next links"
									disabled={atLast}
									className={`h-7 w-7 flex items-center justify-center rounded-full bg-background/60 backdrop-blur border border-border/50 text-foreground/70 transition hover:text-foreground hover:bg-background/70 ${atLast ? "opacity-30 cursor-not-allowed" : "hover:scale-110"}`}
								>
									<span aria-hidden>›</span>
									<span className="sr-only">Next</span>
								</button>
							)}
							<span className="sr-only" aria-live="polite">
								Page {page + 1} of {totalPages}
							</span>
						</div>

						{/* CTA + User Section */}
						<div className="flex items-center ml-1 pl-1 border-l border-white/20 space-x-2">
							<Link href="/join" className="cursor-pointer">
								<Button
									size="sm"
									className={`rounded-full font-medium
                    bg-gradient-to-r from-primary to-secondary
                    hover:from-primary/90 hover:to-secondary/90
                    text-white border-0 shadow-lg shadow-primary/30
                    hover:scale-105 transition-all duration-200
                    backdrop-blur-sm
                    ${isScrolled ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
                  `}
								>
									<MessageCircle
										className={`mr-1.5 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
									/>
									<span className={isScrolled ? "hidden lg:inline" : ""}>
										{t("common.joinCommunity")}
									</span>
								</Button>
							</Link>

							<div className="flex items-center">
								<LanguageSwitcher isScrolled={isScrolled} />
								<ThemeSwitcher />
							</div>
							{/* Authentication Section */}
							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className={`
                        rounded-full
                        bg-white/5 hover:bg-white/10
                        text-foreground/80 hover:text-foreground
                        border border-transparent hover:border-white/20
                        transition-all duration-200
                        ${isScrolled ? "px-2 py-1" : "px-3 py-1.5"}
                      `}
										>
											<Avatar
												className={`${isScrolled ? "w-5 h-5" : "w-6 h-6"} mr-2`}
											>
												<AvatarFallback className="bg-primary/20 text-primary">
													{user.username.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span
												className={`${isScrolled ? "hidden lg:inline text-xs" : "text-sm"}`}
											>
												{user.username}
											</span>
											<ChevronDown
												className={`ml-1 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
											/>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link href="/dashboard" className="flex items-center">
												<User className="mr-2 h-4 w-4" />
												Dashboard
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleLogout}
											className="text-destructive"
										>
											<LogOut className="mr-2 h-4 w-4" />
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Link href="/login" className="cursor-pointer">
									<Button
										size="sm"
										variant="outline"
										className={`
                      rounded-full font-medium
                      bg-white/5 hover:bg-white/10
                      text-foreground hover:text-foreground
                      border-white/20 hover:border-white/40
                      transition-all duration-200
                      ${isScrolled ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
                    `}
									>
										<LogIn
											className={`mr-1.5 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
										/>
										<span className={isScrolled ? "hidden lg:inline" : ""}>
											Login
										</span>
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Navigation - App Grid */}
			<div className="md:hidden">
				{/* Backdrop Overlay */}
				<div
					className={`
            fixed inset-0 z-40 bg-black/20 backdrop-blur-sm
            transition-all duration-300 ease-out
            ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
					onClick={closeMobileMenu}
				/>

				{/* Mobile App Grid */}
				<div
					className={`
            fixed bottom-6 left-1/2 -translate-x-1/2 z-50
            transition-all duration-500 ease-out
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
            ${isAtBottom ? "bottom-20" : "bottom-6"}
          `}
				>
					{/* App Grid Container */}
					<div
						className={`
              absolute bottom-16 left-1/2 -translate-x-1/2
              transition-all duration-300 ease-out origin-bottom
              ${
								isMobileMenuOpen
									? "opacity-100 scale-100 translate-y-0"
									: "opacity-0 scale-95 translate-y-2 pointer-events-none"
							}
            `}
					>
						<div
							className="
              p-4 rounded-3xl backdrop-blur-xl
              bg-white/15 dark:bg-black/15
              border border-white/20 dark:border-white/10
              shadow-2xl shadow-black/10
              min-w-[320px] max-w-[350px]
            "
						>
							{/* Navigation Grid */}
							<div className="grid grid-cols-3 gap-4 mb-4">
								{navItems.map((item, index) => {
									const Icon = item.icon;
									const isCurrentPage = isActive(item.href);
									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={closeMobileMenu}
											className={`
                        block group cursor-pointer
                        transition-all duration-200 ease-out
                        ${
													isMobileMenuOpen
														? "animate-in slide-in-from-bottom-2 duration-300"
														: ""
												}
                      `}
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div
												className={`
                          p-4 rounded-2xl text-center h-20 flex flex-col items-center justify-center
                          backdrop-blur-sm transition-all duration-200
                          border select-none
                          ${
														isCurrentPage
															? "bg-primary/20 border-primary/30 text-primary shadow-lg shadow-primary/20 scale-105"
															: "bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-foreground/80 hover:text-foreground hover:bg-white/15 dark:hover:bg-white/10"
													}
                          group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/10
                          group-active:scale-95
                          touch-manipulation
                        `}
											>
												<Icon className="w-7 h-7 mb-2" />
												<span className="text-xs font-medium leading-tight">
													{item.label}
												</span>
											</div>
										</Link>
									);
								})}
							</div>

							{/* Action Items Row */}
							<div className="grid grid-cols-4 gap-3">
								{/* Join Button */}
								<Link
									href="/join"
									onClick={closeMobileMenu}
									className="group col-span-2 cursor-pointer"
								>
									<div
										className="
                    p-3 rounded-xl text-center h-20 flex items-center justify-center
                    bg-gradient-to-r from-primary to-secondary
                    text-white shadow-lg shadow-primary/30
                    transition-all duration-200 select-none
                    group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/40
                    group-active:scale-95
                    touch-manipulation
                  "
									>
										<MessageCircle className="w-5 h-5 mr-2" />
										<span className="text-sm font-medium">
											{t("common.joinCommunity")}
										</span>
									</div>
								</Link>

								<div className="items-center flex">
									<LanguageSwitcher isScrolled={false} />
								</div>

								{/* Theme Switcher */}
								<div
									className="
                  rounded-xl h-16 flex items-center justify-center
                  bg-white/10 dark:bg-white/5
                  border border-white/20 dark:border-white/10
                  transition-all duration-200
                  hover:bg-white/15 dark:hover:bg-white/10
                  hover:scale-105
                  touch-manipulation
                "
								>
									<ThemeSwitcher />
								</div>
							</div>

							{/* Authentication Section - Full Width */}
							<div className="mt-3">
								{user ? (
									<div
										className="
                    p-4 rounded-xl
                    bg-white/10 dark:bg-white/5
                    border border-white/20 dark:border-white/10
                    transition-all duration-200
                    hover:bg-white/15 dark:hover:bg-white/10
                    touch-manipulation
                  "
									>
										{/* User Info */}
										<div className="flex items-center mb-3">
											<Avatar className="w-10 h-10 mr-3">
												<AvatarFallback className="bg-primary/20 text-primary">
													{user.username.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium text-foreground">
													{user.username}
												</p>
												<p className="text-xs text-muted-foreground">
													{user.email}
												</p>
											</div>
										</div>

										{/* User Actions */}
										<div className="grid grid-cols-2 gap-2">
											<Link
												href="/dashboard"
												onClick={closeMobileMenu}
												className="group cursor-pointer"
											>
												<div
													className="
                          p-3 rounded-lg text-center h-12 flex items-center justify-center
                          bg-white/10 dark:bg-white/5
                          border border-white/20 dark:border-white/10
                          transition-all duration-200 select-none
                          group-hover:scale-105 group-hover:bg-white/15 dark:group-hover:bg-white/10
                          group-active:scale-95
                          touch-manipulation
                        "
												>
													<User className="w-4 h-4 mr-2" />
													<span className="text-sm font-medium">Dashboard</span>
												</div>
											</Link>

											<button
												onClick={() => {
													handleLogout();
													closeMobileMenu();
												}}
												className="group cursor-pointer"
											>
												<div
													className="
                          p-3 rounded-lg text-center h-12 flex items-center justify-center
                          bg-white/10 dark:bg-white/5
                          border border-white/20 dark:border-white/10
                          transition-all duration-200 select-none
                          group-hover:scale-105 group-hover:bg-white/15 dark:group-hover:bg-white/10
                          group-active:scale-95
                          touch-manipulation
                          text-destructive
                        "
												>
													<LogOut className="w-4 h-4 mr-2" />
													<span className="text-sm font-medium">Logout</span>
												</div>
											</button>
										</div>
									</div>
								) : (
									<Link
										href="/login"
										onClick={closeMobileMenu}
										className="group block cursor-pointer"
									>
										<div
											className="
                      p-4 rounded-xl text-center h-16 flex items-center justify-center
                      bg-white/10 dark:bg-white/5
                      border border-white/20 dark:border-white/10
                      transition-all duration-200 select-none
                      group-hover:scale-105 group-hover:bg-white/15 dark:group-hover:bg-white/10
                      group-active:scale-95
                      touch-manipulation
                    "
										>
											<LogIn className="w-5 h-5 mr-2" />
											<span className="text-sm font-medium">Login</span>
										</div>
									</Link>
								)}
							</div>
						</div>
					</div>

					{/* Floating Action Button */}
					<div className="relative">
						<Button
							onClick={toggleMobileMenu}
							className={`
                w-14 h-14 rounded-full p-0
                bg-white/15 dark:bg-black/15 backdrop-blur-xl
                border border-white/20 dark:border-white/10
                shadow-2xl shadow-black/10
                hover:bg-white/20 dark:hover:bg-black/20
                hover:scale-110 active:scale-95
                transition-all duration-300 ease-out
                ${isMobileMenuOpen ? "rotate-180" : "rotate-0"}
                ${isAtBottom ? "opacity-10" : "opacity-100"}
              `}
						>
							{isMobileMenuOpen ? (
								<X className="w-6 h-6 text-foreground" />
							) : (
								<Menu className="w-6 h-6 text-foreground" />
							)}
						</Button>

						{/* Active Page Indicator */}
						{navItems.some((item) => isActive(item.href)) && (
							<div
								className="
                absolute -top-1 -right-1 w-4 h-4 
                bg-primary rounded-full
                animate-pulse
                border-2 border-white dark:border-black
              "
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
