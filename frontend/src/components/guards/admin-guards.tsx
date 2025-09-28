"use client";
import userApi from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";

export function IsAdminGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [hasRedirected, setHasRedirected] = useState(false);

	const isAdminQuery = useQuery({
		queryKey: ["users/is-admin"],
		queryFn: userApi.isAdmin,
		retry: false,
	});

	useEffect(() => {
		if (!isAdminQuery.isLoading && !hasRedirected) {
			if (isAdminQuery.isError || !isAdminQuery.data) {
				setHasRedirected(true);
				router.push("/404");
			}
		}
	}, [
		isAdminQuery.isLoading,
		isAdminQuery.isError,
		isAdminQuery.data,
		router,
		hasRedirected,
	]);

	if (isAdminQuery.isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Spinner />
			</div>
		);
	}

	if (isAdminQuery.isError || !isAdminQuery.data) {
		return null;
	}

	return <>{children}</>;
}
