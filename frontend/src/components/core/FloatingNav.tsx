"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Info,
  Target,
  Shield,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./miscellaneous/ThemeSwitcher";

export default function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const pathname = usePathname();

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
              <Link href="https://link.loslc.tech/discord" target="_blank">
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
                  <MessageCircle
                    className={`mr-1.5 ${isScrolled ? "w-3 h-3" : "w-4 h-4"}`}
                  />
                  <span className={isScrolled ? "hidden lg:inline" : ""}>
                    Join Discord
                  </span>
                </Button>
              </Link>
              <ThemeSwitcher />
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
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrentPage = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`
                      rounded-full text-xs font-medium
                      backdrop-blur-sm transition-all duration-200
                      hover:scale-105 hover:shadow-lg
                      ${isScrolled 
                        ? "px-1 py-0.5 min-w-[28px] h-7" 
                        : "px-1.5 py-1 min-w-[32px] h-8"
                      }
                      ${
                        isCurrentPage
                          ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20"
                          : "bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-transparent"
                      }
                    `}
                  >
                    <Icon
                      className={`${isScrolled ? "w-3 h-3" : "w-3.5 h-3.5"} ${isCurrentPage ? "mr-1" : ""}`}
                    />
                    <span className={`${isCurrentPage ? "inline" : "hidden"} text-xs whitespace-nowrap`}>
                      {item.label}
                    </span>
                  </Button>
                </Link>
              );
            })}

            {/* Mobile CTA Button */}
            <div className="flex ml-0.5 pl-0.5 border-l border-white/20">
              <Link href="https://link.loslc.tech/discord" target="_blank">
                <Button
                  size="sm"
                  className={`
                    rounded-full font-medium
                    bg-gradient-to-r from-primary to-secondary
                    hover:from-primary/90 hover:to-secondary/90
                    text-white border-0 shadow-lg shadow-primary/30
                    hover:scale-105 transition-all duration-200
                    backdrop-blur-sm
                    ${isScrolled 
                      ? "px-1 py-0.5 min-w-[28px] h-7" 
                      : "px-1.5 py-1 min-w-[32px] h-8"
                    }
                  `}
                >
                  <MessageCircle
                    className={`${isScrolled ? "w-3 h-3" : "w-3.5 h-3.5"}`}
                  />
                  <span className="hidden sm:inline ml-1 text-xs">
                    Join
                  </span>
                </Button>
              </Link>
              <div className="ml-0.5">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
}
