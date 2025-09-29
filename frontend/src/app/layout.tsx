import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ProgressProvider from "@/components/core/providers/ProgressProvider";
import { ThemeProvider } from "@/components/core/providers/ThemeProvider";
import { Providers } from "@/lib/providers";
import { AuthProvider } from "@/lib/providers/auth-provider";

export const metadata: Metadata = {
	metadataBase: new URL("https://loslc.tech"),
	title: "LOSL-C - Linux & Open-Source Lovers Community",
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
		title: "LOSL-C - Linux & Open-Source Lovers Community",
		description:
			"Empowering African developers through Linux, Open-Source, and Cybersecurity education. Join our thriving tech community in Togo and across Africa.",
		url: "https://loslc.tech",
		siteName: "LOSL-C",
		images: [
			{
				url: "/cover.png",
				width: 1200,
				height: 630,
				alt: "LOSL-C - Linux & Open-Source Lovers Community",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "LOSL-C - Linux & Open-Source Lovers Community",
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
				<Providers>
					<ProgressProvider>
						<ThemeProvider attribute={"class"} defaultTheme="dark" enableSystem>
							<AuthProvider>
								{children}
								<Toaster />
							</AuthProvider>
						</ThemeProvider>
					</ProgressProvider>
				</Providers>
			</body>
		</html>
	);
}
