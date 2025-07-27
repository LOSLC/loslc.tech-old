"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Info,
  Target,
  Shield,
  FileText,
  MessageCircle,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./miscellaneous/ThemeSwitcher";
import { useAuth } from "@/hooks/useAuth";

export default function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
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
        // On home page, show after scrolling past initial hero area
        setIsVisible(scrollY > 200);
      } else {
        // On other pages, show immediately but with proper spacing
        setIsVisible(true);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/learn-more", label: "About", icon: Info },
    { href: "/mission", label: "Mission", icon: Target },
    { href: "/code-of-conduct", label: "Code", icon: Shield },
    { href: "/terms-of-service", label: "Terms", icon: FileText },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`
        fixed left-1/2 -translate-x-1/2 z-50 
        transition-all duration-500 ease-in-out hidden md:block
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        ${isScrolled ? "top-4" : "top-6"}
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
                <Link key={item.href} href={item.href}>
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

            {/* CTA Button */}
            <div className="flex ml-1 pl-1 border-l border-white/20">
              {!isLoading && (
                <>
                  {user ? (
                    // Authenticated user buttons
                    <>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`
                            rounded-full font-medium text-xs
                            bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground
                            border border-transparent
                            ${isScrolled ? "px-2 py-1" : "px-3 py-1.5"}
                          `}
                        >
                          <User
                            className={`mr-1 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
                          />
                          <span
                            className={isScrolled ? "hidden lg:inline" : ""}
                          >
                            {user.username}
                          </span>
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          size="sm"
                          className={`
                            rounded-full font-medium text-xs
                            bg-white/5 hover:bg-red-500/20 text-foreground/80 hover:text-red-400
                            border border-transparent hover:border-red-500/30
                            ${isScrolled ? "px-2 py-1" : "px-3 py-1.5"}
                          `}
                        >
                          <LogOut
                            className={`mr-1 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
                          />
                          <span
                            className={isScrolled ? "hidden lg:inline" : ""}
                          >
                            Logout
                          </span>
                        </Button>
                      </div>
                    </>
                  ) : (
                    // Unauthenticated user buttons
                    <>
                      <div className="flex items-center space-x-1">
                        <Link href="/auth/login">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`
                              rounded-full font-medium text-xs
                              bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground
                              border border-transparent
                              ${isScrolled ? "px-2 py-1" : "px-3 py-1.5"}
                            `}
                          >
                            <LogIn
                              className={`mr-1 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
                            />
                            <span
                              className={isScrolled ? "hidden lg:inline" : ""}
                            >
                              Login
                            </span>
                          </Button>
                        </Link>
                        <Link href="/auth/register">
                          <Button
                            size="sm"
                            className={`
                              rounded-full font-medium
                              bg-gradient-to-r from-primary to-secondary
                              hover:from-primary/90 hover:to-secondary/90
                              text-white border-0 shadow-lg shadow-primary/30
                              hover:scale-105 transition-all duration-200
                              backdrop-blur-sm
                              ${isScrolled ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
                            `}
                          >
                            <UserPlus
                              className={`mr-1 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
                            />
                            <span
                              className={isScrolled ? "hidden lg:inline" : ""}
                            >
                              Register
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="flex ml-1 pl-1 border-l border-white/20">
                <Link href="https://link.loslc.tech/discord" target="_blank">
                  <Button
                    size="sm"
                    className={`
                      rounded-full font-medium
                      bg-gradient-to-r from-primary/80 to-primary
                      hover:from-primary hover:to-primary/90
                      text-primary-foreground border-0 shadow-lg shadow-primary/20
                      hover:scale-105 transition-all duration-200
                      backdrop-blur-sm
                      ${isScrolled ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
                    `}
                  >
                    <MessageCircle
                      className={`mr-1.5 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
                    />
                    <span className={isScrolled ? "hidden lg:inline" : ""}>
                      Discord
                    </span>
                  </Button>
                </Link>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={`
        fixed left-1/2 -translate-x-1/2 z-50 
        transition-all duration-500 ease-in-out md:hidden
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        ${isAtBottom ? "top-4" : isScrolled ? "bottom-4" : "bottom-6"}
      `}
      >
        {/* Expanded Grid View */}
        <div
          className={`
            mb-2 p-3 rounded-3xl backdrop-blur-xl
            bg-white/10 dark:bg-black/10
            border border-primary/40
            shadow-2xl shadow-black/5
            w-64 overflow-hidden
            transition-all duration-300 ease-in-out transform
            ${
              isMobileExpanded
                ? "opacity-100 scale-100 translate-y-0 max-h-96"
                : "opacity-0 scale-95 -translate-y-2 max-h-0 pointer-events-none"
            }
          `}
        >
          <div className={`transition-all duration-300 ${isMobileExpanded ? "opacity-100 delay-100" : "opacity-0"}`}>
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <Button
                onClick={() => setIsMobileExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-white/5 hover:bg-red-500/20 text-foreground/60 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isCurrentPage = isActive(item.href);
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMobileExpanded(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`
                        h-16 w-full flex flex-col items-center justify-center
                        rounded-xl text-xs font-medium space-y-1
                        backdrop-blur-sm transition-all duration-200
                        hover:scale-105 hover:shadow-lg
                        ${
                          isCurrentPage
                            ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20"
                            : "bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-transparent"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs whitespace-nowrap">
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </div>
            
            {/* Auth & Extra Actions Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
              {!isLoading && (
                <>
                  {user ? (
                    // Authenticated user actions
                    <>
                      <Button
                        variant="ghost"
                        className="h-14 flex flex-col items-center justify-center rounded-xl text-xs font-medium space-y-1 bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-transparent"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-xs">{user.username}</span>
                      </Button>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsMobileExpanded(false);
                        }}
                        variant="ghost"
                        className="h-14 flex flex-col items-center justify-center rounded-xl text-xs font-medium space-y-1 bg-white/5 hover:bg-red-500/20 text-foreground/80 hover:text-red-400 border border-transparent hover:border-red-500/30"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-xs">Logout</span>
                      </Button>
                    </>
                  ) : (
                    // Unauthenticated user actions
                    <>
                      <Link 
                        href="/auth/login"
                        onClick={() => setIsMobileExpanded(false)}
                      >
                        <Button
                          variant="ghost"
                          className="h-14 w-full flex flex-col items-center justify-center rounded-xl text-xs font-medium space-y-1 bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-transparent"
                        >
                          <LogIn className="w-4 h-4" />
                          <span className="text-xs">Login</span>
                        </Button>
                      </Link>
                      <Link 
                        href="/auth/register"
                        onClick={() => setIsMobileExpanded(false)}
                      >
                        <Button
                          className="h-14 w-full flex flex-col items-center justify-center rounded-xl text-xs font-medium space-y-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg shadow-primary/30 hover:scale-105 transition-all duration-200 backdrop-blur-sm"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span className="text-xs">Register</span>
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
              
              {/* Discord & Theme Switcher */}
              <Link 
                href="https://link.loslc.tech/discord" 
                target="_blank"
                onClick={() => setIsMobileExpanded(false)}
              >
                <Button
                  className="h-14 w-full flex flex-col items-center justify-center rounded-xl text-xs font-medium space-y-1 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-200 backdrop-blur-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Discord</span>
                </Button>
              </Link>
              
              <div className="h-14 flex items-center justify-center">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`
          px-2 py-1.5 rounded-full backdrop-blur-xl
          bg-white/10 dark:bg-black/10
          border border-primary/40
          shadow-2xl shadow-black/5
          transition-all duration-300
          ${isScrolled ? "scale-95 px-1.5 py-1" : "scale-100"}
        `}
        >
          <div className="flex items-center space-x-1">
            {/* Show only active page + menu button in compact mode */}
            {navItems
              .filter((item) => isActive(item.href))
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    size="sm"
                    className={`
                      rounded-full text-xs font-medium
                      backdrop-blur-sm transition-all duration-200
                      bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20
                      ${
                        isScrolled
                          ? "px-2 py-0.5 h-7"
                          : "px-3 py-1 h-8"
                      }
                    `}
                  >
                    <Icon
                      className={`mr-1 ${isScrolled ? "w-3 h-3" : "w-3.5 h-3.5"}`}
                    />
                    <span className="text-xs whitespace-nowrap">
                      {item.label}
                    </span>
                  </Button>
                );
              })}

            {/* Menu Toggle Button */}
            <Button
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              variant="ghost"
              size="sm"
              className={`
                rounded-full font-medium text-xs
                bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground
                border border-transparent
                ${
                  isScrolled
                    ? "px-2 py-0.5 h-7"
                    : "px-3 py-1 h-8"
                }
                ${isMobileExpanded ? "bg-primary/20 text-primary border-primary/30" : ""}
              `}
            >
              <Menu className={`${isScrolled ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
