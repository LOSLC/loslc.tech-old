"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-provider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

function statusLabel(o: any) {
	if (o.accepted) return "Accepted";
	if (o.confirmed) return "Confirmed";
	if (o.paid) return "Paid";
	return "Pending";
}

export default function OrderDetailPage() {
	const { t } = useTranslation();
	const router = useRouter();
	const { user, isLoading: authLoading } = useAuth();
	const params = useParams<{ orderId: string }>();
	const orderId = params.orderId;

	useEffect(() => {
		if (!authLoading && !user) router.push("/login");
	}, [authLoading, user, router]);

	const { data: order, isLoading } = useQuery({
		queryKey: ["dashboard", "orders", "detail", orderId],
		queryFn: () => ordersApi.get(orderId),
		enabled: !!user && !!orderId,
	});

	if (authLoading || isLoading) {
		return <div className="pt-24">{t("common.loading", "Loading...")}</div>;
	}
	if (!order) return null;

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Package className="w-6 h-6" />
				<h1 className="text-2xl font-bold">
					{t("orders.detailTitle", "Order Details")}
				</h1>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{t("orders.summary", "Summary")}
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
					<div>
						<p className="text-muted-foreground">
							{t("orders.id", "Order ID")}
						</p>
						<p className="font-mono text-xs break-all">{order.id}</p>
					</div>
					<div>
						<p className="text-muted-foreground">{t("orders.date", "Date")}</p>
						<p>{new Date(order.createdAt).toLocaleString()}</p>
					</div>
					<div>
						<p className="text-muted-foreground">
							{t("orders.status", "Status")}
						</p>
						<p>
							{t(
								`orders.status.${statusLabel(order).toLowerCase()}`,
								statusLabel(order),
							)}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">
							{t("orders.total", "Total")}
						</p>
						<p>
							{order.totalAmount
								? `${order.totalAmount.toFixed(2)} ${order.currency ?? ""}`
								: "-"}
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{t("orders.items", "Items")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{order.items && order.items.length > 0 ? (
						<div className="space-y-3">
							{order.items.map((it) => (
								<div
									key={it.id}
									className="flex items-center justify-between text-sm border-b last:border-0 border-border/60 py-2"
								>
									<div className="flex-1">
										<p className="font-medium">{it.name}</p>
										<p className="text-xs text-muted-foreground">
											x{it.quantity}
										</p>
									</div>
									<div className="w-24 text-right text-xs">
										{(it.price * it.quantity).toFixed(2)}
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							{t(
								"orders.itemsPlaceholder",
								"Items details are not available yet.",
							)}
						</p>
					)}
				</CardContent>
			</Card>

			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => router.push("/dashboard/orders")}
					className="gap-1"
				>
					<ArrowLeft className="w-4 h-4" />{" "}
					{t("orders.backOrders", "Back to Orders")}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/dashboard")}
					className="gap-1"
				>
					{t("orders.backOverview", "Back to Overview")}
				</Button>
			</div>
		</div>
	);
}
