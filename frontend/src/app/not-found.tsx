"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardContent className="pt-6">
					<div className="text-center space-y-6">
						{/* 404 Graphic */}
						<div className="relative">
							<div className="text-8xl font-bold text-primary/20 select-none">
								404
							</div>
							<div className="absolute inset-0 flex items-center justify-center">
								<HelpCircle className="h-16 w-16 text-muted-foreground animate-pulse" />
							</div>
						</div>

						{/* Error Message */}
						<div className="space-y-2">
							<h1 className="text-2xl font-bold text-foreground">
								Page Not Found
							</h1>
							<p className="text-muted-foreground">
								Sorry, we couldn&apos;t find the page you&apos;re looking for.
								It might have been moved, deleted, or you might have typed the
								wrong URL.
							</p>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3">
							<Button asChild className="w-full">
								<Link href="/">
									<Home className="mr-2 h-4 w-4" />
									Go Home
								</Link>
							</Button>

							<div className="grid grid-cols-2 gap-2">
								<Button variant="outline" asChild>
									<Link href="javascript:history.back()">
										<ArrowLeft className="mr-2 h-4 w-4" />
										Go Back
									</Link>
								</Button>

								<Button variant="outline" asChild>
									<Link href="/blog">
										<Search className="mr-2 h-4 w-4" />
										Explore
									</Link>
								</Button>
							</div>
						</div>

						{/* Helpful Links */}
						<div className="pt-4 border-t">
							<p className="text-sm text-muted-foreground mb-3">
								Looking for something specific?
							</p>
							<div className="flex flex-wrap gap-2 justify-center">
								<Link
									href="/blog"
									className="text-sm text-primary hover:underline"
								>
									Blog
								</Link>
								<span className="text-muted-foreground">•</span>
								<Link
									href="/about"
									className="text-sm text-primary hover:underline"
								>
									About
								</Link>
								<span className="text-muted-foreground">•</span>
								<Link
									href="/contact"
									className="text-sm text-primary hover:underline"
								>
									Contact
								</Link>
								<span className="text-muted-foreground">•</span>
								<Link
									href="/join"
									target="_blank"
									className="text-sm text-primary hover:underline"
								>
									Discord
								</Link>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
