"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

// Define user type based on your backend's user model
export interface User {
	id: string;
	email: string;
	username: string;
	fullName: string;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
	// Add other user properties as needed
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	setUser: (user: User | null) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const queryClient = useQueryClient();

	// Check if user is authenticated on mount
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			// TODO: Implement a "me" endpoint in your backend to get current user
			// const response = await api.get('auth/me').json<User>();
			// setUser(response);

			// For now, we'll check if there are any stored user data or cookies
			// This is a placeholder - replace with actual auth check
			setIsLoading(false);
		} catch {
			setUser(null);
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		queryClient.clear();
		// Clear any stored auth data
		if (typeof window !== "undefined") {
			localStorage.removeItem("user");
		}
	};

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated: !!user,
		setUser,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Hook to require authentication
export function useRequireAuth() {
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			// Redirect to login page
			window.location.href = "/login";
		}
	}, [isAuthenticated, isLoading]);

	return { isAuthenticated, isLoading };
}
