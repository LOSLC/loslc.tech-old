import type { Metadata } from "next";
import "./globals.css";
import FloatingNav from "@/components/core/FloatingNav";
import { ThemeProvider } from "@/components/core/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "LOSL-C - Linux, Open-Source & Cybersecurity Community",
  description: `We're a thriving community of Linux, Open-Source, and Cybersecurity enthusiasts based in Togo (Africa).
     Our goal is to promote technological advancement across the continent through Open-Source software,
     Linux systems, cybersecurity practices, and open collaboration. Join us to build a secure digital future for Africa!`,
  keywords: [
    "Linux",
    "Open Source",
    "Cybersecurity",
    "Africa",
    "Togo",
    "Technology",
    "Community",
    "Security",
    "LOSL-C",
  ],
  authors: [{ name: "LOSL-C Community" }],
  creator: "LOSL-C",
  publisher: "LOSL-C",
  openGraph: {
    title: "LOSL-C - Linux, Open-Source & Cybersecurity Community",
    description:
      "Empowering African developers through Linux, Open-Source, and Cybersecurity education. Join our thriving tech community in Togo and across Africa.",
    url: "https://loslc.tech",
    siteName: "LOSL-C",
    images: [
      {
        url: "/cover.png",
        width: 1200,
        height: 630,
        alt: "LOSL-C - Linux, Open-Source & Cybersecurity Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOSL-C - Linux, Open-Source & Cybersecurity Community",
    description:
      "Empowering African developers through Linux, Open-Source, and Cybersecurity education.",
    images: ["/cover.png"],
  },
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ThemeProvider attribute={"class"} defaultTheme="dark" enableSystem>
          <FloatingNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
