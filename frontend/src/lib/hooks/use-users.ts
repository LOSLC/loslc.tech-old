import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type GetUsersQueryDTO,
	type PublicUserDTO,
	type UpdateUserInfoDTO,
	userApi,
} from "@/lib/api/users";

// Query keys factory for consistent cache management
export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (query: GetUsersQueryDTO) =>
		[...userKeys.lists(), { ...query }] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
	publicDetail: (id: string) => [...userKeys.details(), "public", id] as const,
	current: () => [...userKeys.all, "current"] as const,
};

// Get current authenticated user
export const useCurrentUser = () => {
	return useQuery({
		queryKey: userKeys.current(),
		queryFn: userApi.getCurrentUser,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: (failureCount, error: Error) => {
			// Don't retry on 401 (unauthorized)
			if (
				"status" in error &&
				(error as Error & { status?: number }).status === 401
			)
				return false;
			return failureCount < 3;
		},
	});
};

// Get user by ID
export const useUser = (userId: string, enabled = true) => {
	return useQuery({
		queryKey: userKeys.detail(userId),
		queryFn: () => userApi.getUserById(userId),
		enabled: !!userId && enabled,
		staleTime: 10 * 60 * 1000, // 10 minutes - user data doesn't change frequently
	});
};

// Public minimal user
export const usePublicUser = (userId: string, enabled = true) => {
	return useQuery<PublicUserDTO>({
		queryKey: userKeys.publicDetail(userId),
		queryFn: () => userApi.getPublicUser(userId),
		enabled: !!userId && enabled,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};

// Get users with pagination
export const useUsers = (query: GetUsersQueryDTO = {}) => {
	return useQuery({
		queryKey: userKeys.list(query),
		queryFn: () => userApi.getUsers(query),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Update current user mutation
export const useUpdateCurrentUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateUserInfoDTO) => userApi.updateCurrentUser(data),
		onSuccess: (updatedUser) => {
			// Update current user cache
			queryClient.setQueryData(userKeys.current(), updatedUser);

			// Update user detail cache if it exists
			queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

			// Invalidate users list to refetch with updated data
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
		},
		onError: (error) => {
			console.error("Failed to update user:", error);
		},
	});
};

// Prefetch user data for better UX
export const usePrefetchUser = () => {
	const queryClient = useQueryClient();

	return (userId: string) => {
		queryClient.prefetchQuery({
			queryKey: userKeys.detail(userId),
			queryFn: () => userApi.getUserById(userId),
			staleTime: 10 * 60 * 1000, // 10 minutes
		});
	};
};

// Hook to get multiple users efficiently
export const useMultipleUsers = (userIds: string[]) => {
	// Use a single query to fetch multiple users to avoid calling useQuery in a loop
	return useQuery({
		queryKey: ["users", "multiple", ...userIds.sort()],
		queryFn: async () => {
			const promises = userIds.map((id) => userApi.getUserById(id));
			const results = await Promise.allSettled(promises);

			return results.map((result, index) => ({
				userId: userIds[index],
				data: result.status === "fulfilled" ? result.value : null,
				error: result.status === "rejected" ? result.reason : null,
			}));
		},
		enabled: userIds.length > 0,
		staleTime: 10 * 60 * 1000,
	});
};

// Refresh all user-related data
export const useRefreshUserData = () => {
	const queryClient = useQueryClient();

	return () => {
		return queryClient.invalidateQueries({ queryKey: userKeys.all });
	};
};
