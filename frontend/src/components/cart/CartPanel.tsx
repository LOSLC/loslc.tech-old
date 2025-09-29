"use client";
import { AlertCircle, Lock, Minus, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCartLocal } from "./CartProvider";

function formatPrice(cents: number) {
	return `$${(cents / 100).toFixed(2)}`;
}

export function CartPanel() {
	const {
		open,
		setOpen,
		items,
		subtotal,
		updateQuantity,
		removeItem,
		clear,
		loading,
	} = useCartLocal();
	const ref = useRef<HTMLDivElement | null>(null);

	// close on escape
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape" && open) setOpen(false);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, setOpen]);

	// trap focus basic
	useEffect(() => {
		if (!open) return;
		const el = ref.current;
		if (!el) return;
		const focusable = el.querySelectorAll<HTMLElement>("button, [href], input");
		focusable[0]?.focus();
	}, [open]);

	return (
		<div
			aria-hidden={!open}
			className={cn(
				"fixed inset-0 z-50 pointer-events-none",
				open && "pointer-events-auto",
			)}
		>
			{/* backdrop */}
			<div
				onClick={() => setOpen(false)}
				className={cn(
					"absolute inset-0 bg-background/40 backdrop-blur-sm opacity-0 transition-opacity",
					open && "opacity-100",
				)}
			/>
			<aside
				ref={ref}
				role="dialog"
				aria-label="Shopping cart"
				className={cn(
					"absolute right-0 top-0 h-full w-[380px] max-w-full bg-background/95 backdrop-blur-xl border-l border-border/60 shadow-xl flex flex-col translate-x-full transition-transform duration-300",
					open && "translate-x-0",
				)}
			>
				<header className="flex items-center justify-between p-4 border-b border-border/50">
					<h2 className="text-sm font-semibold tracking-wide uppercase">
						Cart
					</h2>
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="p-2 rounded-md hover:bg-muted/50"
						aria-label="Close cart"
					>
						<X className="w-4 h-4" />
					</button>
				</header>
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{loading && (
						<div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3 animate-pulse">
							<p className="text-sm font-medium">Loading cart...</p>
						</div>
					)}
					{!loading && items.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
							<AlertCircle className="w-6 h-6" />
							<p className="text-sm font-medium">Your cart is empty</p>
							<p className="text-xs">Browse the store to add items.</p>
						</div>
					)}
					{!loading &&
						items.map((it) => {
							const variantKey =
								it.variantsDetailed && it.variantsDetailed.length
									? it.variantsDetailed
											.map((v) =>
												v.characteristicName
													? `${v.characteristicName}: ${v.value}`
													: v.value,
											)
											.join(" | ")
									: null;
							return (
								<div
									key={it.cartItemId}
									className="flex gap-3 group border border-border/40 rounded-lg p-3 bg-card/60 backdrop-blur-sm"
								>
									<div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
										{it.image ? (
											<img
												src={`/api/files/${it.image}/download`}
												alt={it.name}
												className="object-cover w-full h-full"
											/>
										) : (
											<span className="text-[10px] text-muted-foreground">
												No Image
											</span>
										)}
									</div>
									<div className="flex-1 flex flex-col text-xs gap-1">
										<div className="flex items-start justify-between gap-2">
											<div className="space-y-1">
												<p className="font-medium text-foreground line-clamp-2 text-sm">
													{it.name}
												</p>
												{variantKey && (
													<p className="text-[10px] text-muted-foreground">
														Variants: {variantKey}
													</p>
												)}
												<p className="font-mono text-[11px]">
													{formatPrice(it.price)}
												</p>
											</div>
											<button
												type="button"
												aria-label="Remove item"
												onClick={() => removeItem(it.cartItemId)}
												className="opacity-60 hover:opacity-100 text-destructive"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
										<div className="flex items-center gap-2 pt-1">
											<div className="flex items-center rounded-md border border-border/60 bg-background/60">
												<button
													type="button"
													className="px-2 py-1 hover:text-primary"
													onClick={() =>
														updateQuantity(it.cartItemId, it.quantity - 1)
													}
												>
													<Minus className="w-3 h-3" />
												</button>
												<span className="px-2 w-6 text-center font-mono">
													{it.quantity}
												</span>
												<button
													type="button"
													className="px-2 py-1 hover:text-primary"
													onClick={() =>
														updateQuantity(it.cartItemId, it.quantity + 1)
													}
												>
													<Plus className="w-3 h-3" />
												</button>
											</div>
											<span className="ml-auto text-[11px] font-mono text-muted-foreground">
												{formatPrice(it.price * it.quantity)}
											</span>
										</div>
									</div>
								</div>
							);
						})}
				</div>
				<footer className="border-t border-border/50 p-4 space-y-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span className="font-mono font-semibold">
							{formatPrice(subtotal)}
						</span>
					</div>
					<button
						type="button"
						disabled
						className="w-full flex items-center justify-center gap-2 rounded-md bg-muted text-muted-foreground py-2 text-sm cursor-not-allowed"
						aria-label="Checkout coming soon"
					>
						<Lock className="w-4 h-4" />
						Checkout (Coming soon)
					</button>
					{items.length > 0 && (
						<button
							type="button"
							onClick={clear}
							className="w-full text-[11px] text-destructive/80 hover:text-destructive underline"
						>
							Clear cart
						</button>
					)}
				</footer>
			</aside>
		</div>
	);
}
