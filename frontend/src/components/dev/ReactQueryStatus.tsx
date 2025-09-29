import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReactQueryStatusProps {
	isLoading: boolean;
	error: Error | null;
	refetch: () => void;
}

export function ReactQueryStatus({
	isLoading,
	error,
	refetch,
}: ReactQueryStatusProps) {
	const queryClient = useQueryClient();

	const getCacheStatus = () => {
		const cacheKeys = queryClient
			.getQueryCache()
			.getAll()
			.map((query) => query.queryKey);
		const blogCacheKeys = cacheKeys.filter(
			(key) => Array.isArray(key) && key[0] === "blog",
		);
		return blogCacheKeys.length;
	};

	const cachedQueries = getCacheStatus();

	return (
		<div className="fixed bottom-4 right-4 z-50 max-w-sm">
			<div className="bg-card border border-border rounded-lg p-4 shadow-lg">
				<div className="flex items-center justify-between mb-3">
					<h4 className="text-sm font-semibold">React Query Status</h4>
					<Button
						size="sm"
						variant="ghost"
						onClick={refetch}
						disabled={isLoading}
						className="h-6 w-6 p-0"
					>
						<RefreshCw
							className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
						/>
					</Button>
				</div>

				<div className="space-y-2 text-xs">
					{/* Loading Status */}
					<div className="flex items-center justify-between">
						<span>Status:</span>
						<Badge
							variant={
								isLoading ? "secondary" : error ? "destructive" : "default"
							}
						>
							{isLoading ? "Loading..." : error ? "Error" : "Success"}
						</Badge>
					</div>

					{/* Network Status */}
					<div className="flex items-center justify-between">
						<span>Network:</span>
						<div className="flex items-center gap-1">
							{navigator.onLine ? (
								<>
									<Wifi className="w-3 h-3 text-green-500" />
									<span className="text-green-500">Online</span>
								</>
							) : (
								<>
									<WifiOff className="w-3 h-3 text-red-500" />
									<span className="text-red-500">Offline</span>
								</>
							)}
						</div>
					</div>

					{/* Cache Status */}
					<div className="flex items-center justify-between">
						<span>Cached Queries:</span>
						<Badge variant="outline">{cachedQueries}</Badge>
					</div>

					{/* Error Details */}
					{error && (
						<div className="mt-2 p-2 bg-destructive/10 rounded text-xs">
							<div className="text-destructive font-medium">Error:</div>
							<div className="text-muted-foreground truncate">
								{error.message || "Unknown error"}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
