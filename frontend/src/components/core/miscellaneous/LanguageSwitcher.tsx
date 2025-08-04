"use client";

import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  className?: string;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher({
  className: cn,
  isScrolled = false,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`
            rounded-full transition-all duration-200
            hover:scale-105 hover:shadow-lg backdrop-blur-sm
            bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground
            border border-transparent hover:border-white/20
            ${isScrolled ? "px-2 py-1 h-7" : "px-3 py-1.5 h-8"} ${cn ? cn : ""}
          `}
        >
          <Languages
            className={`${isScrolled ? "w-3 h-3" : "w-4 h-4"} mr-1.5`}
          />
          <span className={`${isScrolled ? "text-xs" : "text-sm"} font-medium`}>
            {currentLanguage.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <span className="mr-2">{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
