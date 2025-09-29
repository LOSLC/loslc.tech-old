"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiWithErrorHandling as api } from "@/lib/api/client";
import { resolveRequest } from "@/lib/api/request";

export interface User {
	id: string;
	email: string;
	username: string;
	fullName: string;
	profilePictureFileId?: string;
	joinedAt: string;
	lastUpdated: string;
	isBanned: boolean;
	isVerified: boolean;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	logout: () => Promise<void>;
	refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API function to get current user
const getCurrentUser = async (): Promise<User> => {
	const promise = api.get("users/me").json<User>();
	const [response, error] = await resolveRequest(promise);
	if (error) {
		throw new Error(error.message);
	}
	return response;
};

// API function to logout
const logoutUser = async (): Promise<void> => {
	const promise = api.post("auth/logout").json();
	const [, error] = await resolveRequest(promise);
	if (error) {
		throw new Error(error.message);
	}
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["auth/me"],
		queryFn: getCurrentUser,
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	useEffect(() => {
		setIsAuthenticated(!!user);
	}, [user]);

	const logout = async () => {
		try {
			await logoutUser();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			// Clear all queries and reset auth state
			queryClient.clear();
			setIsAuthenticated(false);
		}
	};

	const refetchUser = () => {
		refetch();
	};

	return (
		<AuthContext.Provider
			value={{
				user: user || null,
				isLoading,
				isAuthenticated,
				logout,
				refetchUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
