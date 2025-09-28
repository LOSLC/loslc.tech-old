"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import Link from "next/link";
import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, List, ShoppingBag } from "lucide-react";

function statusLabel(o: any) {
	if (o.accepted) return "Accepted";
	if (o.confirmed) return "Confirmed";
	if (o.paid) return "Paid";
	return "Pending";
}

export default function OrdersPage() {
	const { t } = useTranslation();
	const { user, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const [page, setPage] = useState(1);
	const pageSize = 10;

	useEffect(() => {
		if (!authLoading && !user) router.push("/login");
	}, [authLoading, user, router]);

	const { data, isLoading } = useQuery({
		queryKey: ["dashboard", "orders", page],
		queryFn: () => ordersApi.listPaginated(page, pageSize),
		enabled: !!user,
	});

	if (authLoading || isLoading) {
		return <div className="pt-24">{t("common.loading", "Loading...")}</div>;
	}

	const empty = (data?.total ?? 0) === 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<ShoppingBag className="w-6 h-6" />
				<h1 className="text-2xl font-bold">
					{t("orders.title", "Order History")}
				</h1>
			</div>
			{empty && (
				<Card>
					<CardContent className="py-10 text-center space-y-3">
						<List className="w-8 h-8 mx-auto text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							{t("orders.empty", "You have not placed any orders yet.")}
						</p>
						<Button asChild size="sm">
							<Link href="/store">
								{t("orders.visitStore", "Visit the Store")}
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
			{!empty && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							{t("orders.listTitle", "Your Orders")}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="text-left border-b border-border">
									<tr className="h-9">
										<th className="font-medium">
											{t("orders.id", "Order ID")}
										</th>
										<th className="font-medium">{t("orders.date", "Date")}</th>
										<th className="font-medium">
											{t("orders.status", "Status")}
										</th>
										<th className="font-medium">
											{t("orders.total", "Total")}
										</th>
									</tr>
								</thead>
								<tbody>
									{data?.data.map((o) => (
										<tr
											key={o.id}
											className="border-b last:border-0 border-border/60 hover:bg-muted/40 cursor-pointer"
											onClick={() => router.push(`/dashboard/orders/${o.id}`)}
										>
											<td className="py-2 pr-4 font-mono text-xs">
												{o.id.slice(0, 8)}…
											</td>
											<td className="py-2 pr-4">
												{new Date(o.createdAt).toLocaleDateString()}
											</td>
											<td className="py-2 pr-4">
												{t(
													`orders.status.${statusLabel(o).toLowerCase()}`,
													statusLabel(o),
												)}
											</td>
											<td className="py-2 pr-4">
												{o.totalAmount
													? `${o.totalAmount.toFixed(2)} ${o.currency ?? ""}`
													: "-"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="flex items-center justify-between mt-4 text-xs">
							<span>
								{t("orders.pagination", "Page {{page}} of {{pages}}", {
									page: data?.page,
									pages: data?.pages,
								})}
							</span>
							<div className="flex gap-2">
								<Button
									size="sm"
									variant="outline"
									disabled={page === 1}
									onClick={() => setPage((p) => Math.max(1, p - 1))}
								>
									{t("orders.prev", "Prev")}
								</Button>
								<Button
									size="sm"
									variant="outline"
									disabled={page === data?.pages}
									onClick={() =>
										setPage((p) => Math.min(data?.pages ?? p, p + 1))
									}
								>
									{t("orders.next", "Next")}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
			<div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/dashboard")}
					className="gap-1"
				>
					<ArrowLeft className="w-4 h-4" />{" "}
					{t("orders.backOverview", "Back to Overview")}
				</Button>
			</div>
		</div>
	);
}
