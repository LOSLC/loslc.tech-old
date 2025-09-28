"use client";

import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

// Guard for pages that require authentication
export function AuthGuard({ children, fallback }: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return fallback || null;
	}

	return <>{children}</>;
}

// Guard for pages that should NOT be accessible when authenticated (like auth pages)
export function GuestGuard({ children, fallback }: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (isAuthenticated) {
		return fallback || null;
	}

	return <>{children}</>;
}
