import { Tailwind, pixelBasedPreset } from "@react-email/components";
import type React from "react";

export function EmailTailwindWrapper({
  children,
}: { children: React.ReactNode }) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      {children}
    </Tailwind>
  );
}
