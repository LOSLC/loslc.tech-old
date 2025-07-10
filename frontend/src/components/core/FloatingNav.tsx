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
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./miscellaneous/ThemeSwitcher";

export default function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

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
        fixed z-50 md:hidden transition-all duration-500 ease-in-out
        top-4 right-4 opacity-100
        ${
          pathname === "/"
            ? isVisible
              ? "opacity-100"
              : "opacity-100"
            : "opacity-100"
        }
      `}
      >
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="
            w-12 h-12 rounded-full backdrop-blur-xl border border-primary
            bg-white/10 dark:bg-black/10
            dark:border-white/10
            shadow-2xl shadow-black/5
            hover:scale-105 transition-all duration-200
          "
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 stroke-foreground" />
          ) : (
            <Menu className="w-5 h-5 stroke-foreground" />
          )}
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="
            absolute top-16 right-0 w-56 sm:w-64
            max-h-[80vh] overflow-y-auto
            backdrop-blur-xl bg-white/10 dark:bg-black/10
            border border-white/20 dark:border-white/10
            rounded-2xl shadow-2xl shadow-black/10
            p-3 flex flex-col gap-2
            animate-in slide-in-from-top-5 fade-in duration-200
            origin-top-right
            min-w-0 max-w-[calc(100vw-2rem)]
          "
          >
            <div>
              <ThemeSwitcher />
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`
                      w-full justify-start px-3 py-2.5 rounded-xl text-sm font-medium
                      backdrop-blur-sm transition-all duration-200
                      hover:scale-[1.02] hover:shadow-md
                      ${
                        isActive(item.href)
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <div className="pt-2 mt-2 border-t border-white/20">
              <Link
                href="https://discord.gg/losl-c"
                target="_blank"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  className="
                  w-full px-3 py-2.5 rounded-xl text-sm font-medium
                  bg-gradient-to-r from-primary to-secondary
                  hover:from-primary/90 hover:to-secondary/90
                  text-white border-0 shadow-lg shadow-primary/30
                  hover:scale-[1.02] transition-all duration-200
                "
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Join Discord
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
