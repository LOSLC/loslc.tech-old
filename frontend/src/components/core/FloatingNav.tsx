"use client";

import { useState, useEffect } from "react";
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
    { href: "/code-of-conduct", label: t("nav.code"), icon: Shield },
    { href: "/terms-of-service", label: t("nav.terms"), icon: FileText },
    { href: "/blog", label: t("blog.badge"), icon: Book },
  ];

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
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="cursor-pointer">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium
                      backdrop-blur-sm transition-all duration-200
                      hover:scale-105 hover:shadow-lg
                      ${isScrolled ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
                      ${
                        isActive(item.href)
                          ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20"
                          : "bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-transparent"
                      }
                    `}
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

            {/* CTA Button and User Section */}
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
                    <span className="text-sm font-medium">{t("common.joinCommunity")}</span>
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
