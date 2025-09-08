import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
  MoveDown,
  Users,
  Heart,
  Code,
  Globe,
  ArrowRight,
  MessageSquare,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  nextPageRef?: RefObject<HTMLDivElement | null>;
}

export default function Hero({ nextPageRef }: HeroProps) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col h-full w-full justify-between items-center overflow-hidden bg-gradient-to-br from-background via-muted/15 to-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary motion-preset-spin motion-duration-[20s]"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-secondary motion-preset-bounce motion-duration-[3s]"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-accent motion-preset-pulse motion-duration-[4s]"></div>
        <div className="absolute top-40 right-1/4 w-48 h-48 rounded-md border border-primary/30 rotate-45 motion-preset-spin motion-duration-[30s]"></div>
        <div className="absolute bottom-40 left-1/3 w-36 h-36 rounded-md border border-secondary/30 -rotate-12 motion-preset-spin motion-duration-[25s]"></div>
        <div className="absolute top-1/3 right-64 text-5xl opacity-10 font-mono">{`</>`}</div>
      </div>

      {/* Illustrations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 md:top-10 md:-right-10 lg:top-20 lg:-right-5 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 opacity-50 md:opacity-70 hidden xs:block transform -rotate-12">
          <Image
            src="/illustrations/creativity.svg"
            alt="Creative ideas"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute -bottom-10 -left-10 md:-bottom-5 md:-left-5 w-40 h-40 md:w-48 md:h-48 opacity-50 md:opacity-70 hidden sm:block transform rotate-12">
          <Image
            src="/illustrations/ideas.svg"
            alt="Innovative ideas"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute bottom-20 -right-10 w-32 h-32 md:w-40 md:h-40 opacity-50 md:opacity-70 hidden md:block transform -rotate-6">
          <Image
            src="/illustrations/aha.svg"
            alt="Aha moment"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mt-10 z-10 p-4 sm:p-6 flex flex-col w-full md:w-10/12 lg:w-8/12 text-center">
        <div className="mb-4 sm:mb-6 cursor-default">
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("hero.badgeText")}
          </span>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8 relative">
          <div className="absolute -inset-6 sm:-inset-8 opacity-20">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="absolute text-[10px] select-none sm:text-xs font-mono text-primary/70"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 90 - 45}deg)`,
                }}
              >
                {
                  [
                    "const",
                    "import",
                    "function",
                    "return",
                    "&&",
                    "GitHub",
                    "git",
                    "Tech",
                    "Community",
                  ][i]
                }
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-lg"></div>
            <Image
              src="/linuxpingouin.png"
              alt="Linux Penguin"
              width={100}
              height={100}
              className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] motion-preset-slide-down motion-duration-700 relative"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center motion-preset-pop motion-delay-500">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="motion-preset-slide-up motion-delay-300 cursor-default">
          <h1 className="text-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight relative block mb-2 sm:mb-4 leading-tight">
            {t("hero.title")}{" "}
            <span className="text-primary">{t("hero.titleHighlight")}</span>
            <span className="whitespace-nowrap">
              {" "}
              {t("hero.titleSuffix")}
              <span className="relative ml-2 inline-block">
                <span className="absolute -inset-1 bg-secondary/20 rounded blur-sm"></span>
                <span className="relative text-secondary">
                  {t("hero.titleLocation")}
                </span>
              </span>
            </span>
          </h1>
        </div>

        <div className="motion-preset-slide-up motion-delay-400 mb-6 sm:mb-8">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8 motion-preset-slide-up motion-delay-500">
          {[
            {
              icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" />,
              text: t("hero.features.openSource"),
            },
            {
              icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
              text: t("hero.features.cybersecurity"),
            },
            {
              icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
              text: t("hero.features.mentorship"),
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center duration-200 hover:border-primary hover:bg-accent/50 justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-foreground p-1.5 sm:p-2 rounded-lg border border-accent/80 bg-foreground/5 cursor-pointer"
            >
              <span className="text-primary">{feature.icon}</span>
              <span className="cursor-default">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center motion-preset-slide-up motion-delay-600">
      <Link href={"/auth/register"} className="cursor-pointer">
            <Button
              size="default"
        className="px-4 sm:px-8 py-2 sm:py-6 text-sm sm:text-lg font-medium hover:scale-105 transition-all duration-200 group bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full sm:w-auto cursor-pointer"
            >
              {t("hero.cta.primary")}
              <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
      <Link href="/join" className="cursor-pointer">
            <Button
              variant="outline"
              size="default"
        className="px-4 sm:px-8 py-2 sm:py-6 text-sm sm:text-lg font-medium hover:scale-105 transition-all duration-200 group border-2 w-full sm:w-auto cursor-pointer"
            >
              {t("common.joinCommunity")}
              <MessageSquare className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-4 mt-6 sm:mt-10 text-muted-foreground text-xs sm:text-sm motion-preset-slide-up motion-delay-700">
          <div className="flex items-center gap-1 sm:gap-2 select-none">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="cursor-default">{t("hero.stats.members")}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Code className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="cursor-default">{t("hero.stats.projects")}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="cursor-default">{t("hero.stats.countries")}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          nextPageRef?.current?.scrollIntoView({ behavior: "smooth" });
        }}
        className="w-8 h-8 mb-3 z-20 shadow-sm ring-1 ring-border/60 motion-preset-oscillate motion-duration-2000 hover:scale-110 transition-all duration-200 cursor-pointer"
        aria-label="Scroll down"
      >
        <MoveDown className="w-4 h-4 sm:w-6 sm:h-6" />
      </Button>
    </div>
  );
}
