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
    >
      {theme === "dark" ? <Stars /> : theme === "light" ? <Sun /> : <Laptop />}
    </Button>
  );
}
