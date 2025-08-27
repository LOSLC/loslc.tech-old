"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { FaDiscord, FaWhatsapp } from "react-icons/fa";
import { FaLinkedin, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";

const socials = [
  {
    key: "discord",
    href: "https://link.loslc.tech/discord",
    icon: FaDiscord,
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    ring: "ring-violet-400/60",
  },
  {
    key: "whatsapp",
    href: "https://link.loslc.tech/whatsapp",
  icon: FaWhatsapp,
    gradient: "from-emerald-500 to-green-600",
    ring: "ring-emerald-400/60",
  },
  {
    key: "linkedin",
    href: "https://link.loslc.tech/linkedin",
  icon: FaLinkedin,
    gradient: "from-sky-500 to-blue-600",
    ring: "ring-sky-400/60",
  },
  {
    key: "instagram",
    href: "https://link.loslc.tech/instagram",
  icon: FaInstagram,
    gradient: "from-rose-500 via-fuchsia-500 to-amber-400",
    ring: "ring-rose-400/60",
  },
  {
    key: "x",
    href: "https://link.loslc.tech/x",
  icon: FaXTwitter,
    gradient: "from-zinc-700 to-neutral-900",
    ring: "ring-zinc-400/60",
  },
  {
    key: "github",
    href: "https://link.loslc.tech/gh",
    icon: FaGithub,
    gradient: "from-gray-800 to-zinc-900",
    ring: "ring-gray-400/60",
  },
];

export default function JoinClient() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl bg-primary/40" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full blur-3xl bg-secondary/30" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs tracking-wide bg-primary/15 text-primary border border-primary/30">
            {t("join.badge")}
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
            {t("join.title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {t("join.subtitle")}
          </p>
        </div>
      </section>

      {/* Links Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.key}
                className="group relative border-2 border-border/70 hover:border-primary/40 transition-all duration-300 overflow-hidden"
              >
                {/* Glow gradient */}
                <div
                  aria-hidden
                  className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r ${s.gradient}`}
                />

                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 shrink-0 rounded-xl grid place-items-center text-white bg-gradient-to-br ${s.gradient} ring-2 ${s.ring} shadow-lg shadow-black/10 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold leading-tight">
                          {t(`join.cards.${s.key}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`join.cards.${s.key}.description`)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={s.href}
                      target="_blank"
                      aria-label={`${t("join.open")} ${t(`join.cards.${s.key}.title`)}`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="group/btn hover:scale-105 transition-all"
                      >
                        {t("join.open")}
                        <ExternalLink className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* URL preview */}
                  <div className="mt-5 text-xs text-muted-foreground">
                    {s.href.replace(/^https?:\/\//, "")}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
