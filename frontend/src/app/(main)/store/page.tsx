"use client";
import Link from "next/link";
import React from "react";
import { useCartLocal } from "@/components/cart/CartProvider";
import { ProductCarousel } from "@/components/store/product-carousel";

// Assuming a design system with these components exists similar to blog
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStoreItems } from "@/lib/hooks/use-store";
import { StoreItem } from "@/lib/types/store";
import { cn } from "@/lib/utils";

export default function StorePage() {
	const [search, setSearch] = React.useState("");
	const { data: items, isLoading } = useStoreItems({ published: true, search });

	const featured = (items || []).filter((i) => i.featured);
	const regular = (items || []).filter((i) => !i.featured);

	return (
		<div className="relative min-h-screen">
			<div className="pointer-events-none fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background" />
				<div className="absolute inset-0 backdrop-blur-sm" />
				<div
					className="absolute inset-0 opacity-60 mix-blend-screen"
					style={{
						backgroundImage:
							"radial-gradient(circle at 20% 20%, hsl(var(--primary)/0.15), transparent 60%), radial-gradient(circle at 80% 60%, hsl(var(--secondary)/0.2), transparent 55%)",
					}}
				/>
			</div>
			<section className="mx-auto max-w-6xl px-4 pt-28 md:pt-36 pb-20">
				<header className="mb-12 flex flex-col items-center text-center gap-6">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
						Store
					</h1>
					<p className="max-w-2xl text-sm md:text-base text-muted-foreground">
						Discover curated digital products & resources. Crafted with quality,
						delivered instantly.
					</p>
					<div className="relative w-full max-w-md">
						<Input
							placeholder="Search products"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-4 pr-10 bg-background/60 backdrop-blur border border-border/60"
						/>
					</div>
				</header>

				{isLoading && (
					<div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
						Loading items...
					</div>
				)}

				{!isLoading && featured.length > 0 && (
					<div className="mb-20 space-y-6">
						<h2 className="text-lg font-semibold tracking-wide uppercase text-primary/80">
							Featured
						</h2>
						<div className="grid gap-8 md:grid-cols-2">
							{featured.map((item) => (
								<FeaturedCard key={item.id} item={item} />
							))}
						</div>
					</div>
				)}

				{!isLoading && (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold tracking-wide uppercase text-muted-foreground/80">
								All Products
							</h2>
							<span className="text-xs text-muted-foreground">
								{regular.length + featured.length} items
							</span>
						</div>
						{regular.length === 0 && featured.length === 0 && (
							<div className="text-sm text-muted-foreground italic py-10 text-center">
								No products available yet.
							</div>
						)}
						<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{regular.map((item) => (
								<ItemCard key={item.id} item={item} />
							))}
						</div>
					</div>
				)}
			</section>
		</div>
	);
}

function FeaturedCard({ item }: { item: StoreItem }) {
	const images = item.images || [];
	const { addItem, setOpen } = useCartLocal();
	const [adding, setAdding] = React.useState(false);
	function handleAdd(e: React.MouseEvent) {
		e.preventDefault();
		setAdding(true);
		addItem({
			id: item.id,
			name: item.name,
			price: item.price,
			image: images[0],
			variantIds: [],
		});
		setTimeout(() => {
			setAdding(false);
			setOpen(true);
		}, 300);
	}
	return (
		<Link
			href={`/store/${item.id}`}
			className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-lg ring-1 ring-white/5 hover:shadow-primary/20 transition flex flex-col"
		>
			<div className="relative w-full rounded-t-xl">
				<ProductCarousel imageIds={images} aspect="aspect-video" />
			</div>
			<div className="flex flex-col p-6 gap-4 flex-1">
				<div className="flex-1 space-y-3">
					<h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
						{item.name}
					</h3>
					<p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
						{item.description}
					</p>
				</div>
				<div className="flex items-center justify-between pt-2 gap-3">
					<span className="text-base font-mono tracking-tight">
						${(item.price / 100).toFixed(2)}
					</span>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="secondary"
							className="group-hover:scale-105 transition-transform"
						>
							View
						</Button>
						<Button
							size="sm"
							variant={adding ? "secondary" : "default"}
							onClick={handleAdd}
							disabled={adding}
							className="transition"
						>
							{adding ? "Added" : "Add"}
						</Button>
					</div>
				</div>
			</div>
		</Link>
	);
}

function ItemCard({ item }: { item: StoreItem }) {
	const images = item.images || [];
	const { addItem, setOpen } = useCartLocal();
	const [adding, setAdding] = React.useState(false);
	function handleAdd(e: React.MouseEvent) {
		e.preventDefault();
		setAdding(true);
		addItem({
			id: item.id,
			name: item.name,
			price: item.price,
			image: images[0],
			variantIds: [],
		});
		setTimeout(() => {
			setAdding(false);
			setOpen(true);
		}, 250);
	}
	return (
		<Link
			href={`/store/${item.id}`}
			className="group relative flex flex-col rounded-lg border border-border/40 bg-background/60 backdrop-blur hover:border-border/80 transition overflow-hidden"
		>
			<div className="relative w-full">
				<ProductCarousel
					imageIds={images}
					aspect="aspect-video"
					showDots={false}
				/>
			</div>
			<div className="flex flex-col p-4 gap-3 flex-1">
				<h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
					{item.name}
				</h3>
				<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
					{item.description}
				</p>
				<div className="mt-auto flex items-center justify-between pt-1 gap-2">
					<span className="text-xs font-mono">
						${(item.price / 100).toFixed(2)}
					</span>
					<div className="flex gap-2 items-center">
						<span className="text-[10px] uppercase tracking-wide text-primary/70">
							View
						</span>
						<button
							onClick={handleAdd}
							className={cn(
								"text-[10px] px-2 py-1 rounded-full border border-primary/40 hover:bg-primary/10 transition",
								adding && "bg-primary/20 text-primary",
							)}
							disabled={adding}
							aria-label="Add to cart"
						>
							{adding ? "Added" : "+ Cart"}
						</button>
					</div>
				</div>
			</div>
		</Link>
	);
}
