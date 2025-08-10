import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      href: "https://github.com/LOSLC",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      label: "X (Twitter)",
      href: "https://link.loslc.tech/x",
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      label: "Instagram",
      href: "https://link.loslc.tech/insta",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      href: "https://link.loslc.tech/linkedin",
    },
  ];

  const quickLinks = [
    { label: t('footer.quick.about'), href: "learn-more" },
    { label: t('footer.quick.projects'), href: "https://github.com/LOSLC" },
    { label: t('footer.quick.contact'), href: "mailto:support@loslc.tech" },
  ];

  return (
    <footer className="w-full bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 cursor-default h-10 bg-primary rounded-lg flex items-center justify-center">
                <Image
                  src={"/favicon.png"}
                  alt="LOSL-C Logo"
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
              <span className="text-2xl cursor-default font-bold text-foreground">
                LOSL-C
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('mission.subtitle')}
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((link, index) => (
                <Link href={link.href} key={index}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:scale-110 transition-all"
                  >
                    {link.icon}
                    <span className="sr-only">{link.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('footer.quickLinks')}
            </h3>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <a
                  target="_blank"
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('footer.contactTitle')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MessageCircle className="w-5 h-5 text-primary" />
                <Link href={"https://link.loslc.tech/discord"}>
                  {t('footer.joinDiscussion')}
                </Link>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <Link href={"mailto:support@loslc.tech"}>
                  support@loslc.tech
                </Link>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="cursor-default">{t('footer.location')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground select-none">
              <span>{t('footer.copyrightPrefix', { year: new Date().getFullYear() })}</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>{t('footer.copyrightSuffix')}</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link
                href="/privacy-policy"
                className="hover:text-primary transition-colors"
              >
                {t('footer.links.privacy')}
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-primary transition-colors"
              >
                {t('footer.links.terms')}
              </Link>
              <Link
                href="/code-of-conduct"
                className="hover:text-primary transition-colors"
              >
                {t('footer.links.code')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
