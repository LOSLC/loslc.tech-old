"use client";

import { Button } from "@/components/ui/button";
import { Laptop, Stars, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
        console.log("Theme changed to: ", theme);
      }}
      variant="ghost"
      size="sm"
      className="w-10 h-10 p-0 hover:bg-transparent transition-colors duration-200"
    >
      {theme === "dark" ? <Stars className="w-5 h-5 text-foreground/80" /> : theme === "light" ? <Sun className="w-5 h-5 text-foreground/80" /> : <Laptop className="w-5 h-5 text-foreground/80" />}
    </Button>
  );
}
