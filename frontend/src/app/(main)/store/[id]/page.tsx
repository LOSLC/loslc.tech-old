"use client";
import React from "react";
import { notFound } from "next/navigation";
import { useStoreItem, useItemCharacteristics } from "@/lib/hooks/use-store";
import { useCartLocal } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCarousel } from "@/components/store/product-carousel";
import { useAuth } from "@/lib/providers/auth-provider";

interface Props {
	params: { id: string };
}

export default function StoreItemPage({ params }: Props) {
	// Fetch base item (no details) and characteristics via new endpoint
	const { data: item, isLoading } = useStoreItem(params.id, false);
	const { data: characteristicsData, isLoading: charsLoading } =
		useItemCharacteristics(params.id, true);
	const { addItem, setOpen } = useCartLocal();
	const { isAuthenticated } = useAuth();
	// Map characteristicId -> selected variantId (one per characteristic)
	const [selectedVariantMap, setSelectedVariantMap] = React.useState<
		Record<string, string>
	>({});
	const [quantity, setQuantity] = React.useState(1);

	if (isLoading)
		return (
			<div className="py-40 text-center text-sm text-muted-foreground">
				Loading...
			</div>
		);
	if (!item) return notFound();

	const characteristics = (characteristicsData as any) || [];

	const selectVariant = (characteristicId: string, variantId: string) => {
		setSelectedVariantMap((m) => ({ ...m, [characteristicId]: variantId }));
	};

	const handleAdd = () => {
		const variantIds = Object.values(selectedVariantMap).filter(Boolean);
		addItem({
			id: item.id,
			name: item.name,
			price: item.price,
			image: (item as any).images?.[0],
			quantity,
			variantIds,
		});
		setOpen(true);
	};

	return (
		<div className="relative min-h-screen">
			<div className="pointer-events-none fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background" />
				<div className="absolute inset-0 backdrop-blur-sm" />
				<div
					className="absolute inset-0 opacity-50 mix-blend-screen"
					style={{
						backgroundImage:
							"radial-gradient(circle at 15% 30%, hsl(var(--primary)/0.2), transparent 60%), radial-gradient(circle at 85% 70%, hsl(var(--secondary)/0.25), transparent 55%)",
					}}
				/>
			</div>
			<div className="mx-auto max-w-5xl px-4 pt-28 md:pt-36 pb-16">
				<div className="grid gap-12 md:grid-cols-2 items-start">
					<div className="relative rounded-xl border border-border/60 bg-background/50 backdrop-blur p-6 flex flex-col gap-6 shadow-lg">
						<ProductCarousel
							imageIds={(item as any).images}
							aspect="aspect-video"
						/>
						<div>
							<h1 className="text-3xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
								{item.name}
							</h1>
							<p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
								{item.description}
							</p>
						</div>
						<div className="flex items-center justify-between pt-2">
							<span className="text-2xl font-mono tracking-tight">
								${(item.price / 100).toFixed(2)}
							</span>
							<div className="flex items-center gap-2">
								<Quantity quantity={quantity} setQuantity={setQuantity} />
								{isAuthenticated ? (
									<Button size="lg" onClick={handleAdd}>
										Add to Cart
									</Button>
								) : (
									<Button
										size="lg"
										variant="outline"
										disabled
										title="Login to purchase"
									>
										Sign in to buy
									</Button>
								)}
							</div>
						</div>
					</div>
					<div className="space-y-10">
						{charsLoading && !characteristics?.length && (
							<div className="text-xs text-muted-foreground">
								Loading options...
							</div>
						)}
						{!charsLoading && characteristics.length > 0 && (
							<div className="space-y-8">
								{characteristics.map((c: any) => {
									const selected = selectedVariantMap[c.id];
									return (
										<div key={c.id} className="space-y-3">
											<h2 className="text-sm uppercase tracking-wide font-semibold text-muted-foreground/80">
												{c.name}
											</h2>
											<div className="flex flex-wrap gap-2">
												{(c.variants || []).map((v: any) => {
													const active = selected === v.id;
													return (
														<button
															key={v.id}
															type="button"
															aria-pressed={active}
															aria-label={`${c.name}: ${v.value}`}
															onClick={() => selectVariant(c.id, v.id)}
															className={cn(
																"px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
																active
																	? "bg-primary text-primary-foreground border-primary"
																	: "bg-background/40 border-border/60 hover:bg-background/70",
															)}
														>
															{v.value}
														</button>
													);
												})}
												{(!c.variants || c.variants.length === 0) && (
													<span className="text-[10px] italic text-muted-foreground">
														No variants
													</span>
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}
						{characteristics.length === 0 && (
							<div className="text-xs text-muted-foreground italic">
								No selectable variants for this product.
							</div>
						)}
						<div className="rounded-lg border border-border/60 bg-background/50 backdrop-blur p-5 space-y-4">
							<h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">
								Instant Delivery
							</h2>
							<p className="text-xs leading-relaxed text-muted-foreground">
								After checkout your order will appear in your account dashboard.
								You can manage purchases and access updates anytime.
							</p>
							<p className="text-xs leading-relaxed text-muted-foreground">
								Need help? Contact support and reference order id once
								generated.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Quantity({
	quantity,
	setQuantity,
}: {
	quantity: number;
	setQuantity: (n: number) => void;
}) {
	return (
		<div className="flex items-center rounded-md border border-border/60 bg-background/60 backdrop-blur">
			<button
				type="button"
				onClick={() => setQuantity(Math.max(1, quantity - 1))}
				className="px-2 py-1 text-sm hover:text-primary"
			>
				-
			</button>
			<span className="px-2 text-sm font-mono w-6 text-center">{quantity}</span>
			<button
				type="button"
				onClick={() => setQuantity(quantity + 1)}
				className="px-2 py-1 text-sm hover:text-primary"
			>
				+
			</button>
		</div>
	);
}
