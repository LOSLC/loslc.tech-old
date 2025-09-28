"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartLocal } from "./CartProvider";
import { cn } from "@/lib/utils";

export function CartIconButton({ className }: { className?: string }) {
	const { setOpen, open, items } = useCartLocal();
	const totalQty = items.reduce((s, it) => s + it.quantity, 0);
	return (
		<button
			type="button"
			aria-label="Shopping cart"
			onClick={() => setOpen(!open)}
			className={cn(
				"relative inline-flex items-center justify-center rounded-full border border-border/60 bg-background/70 backdrop-blur px-3 py-2 hover:bg-background transition",
				className,
			)}
		>
			<ShoppingCart className="w-5 h-5" />
			<span className="sr-only">Open cart panel</span>
			<span
				aria-label={`${totalQty} items in cart`}
				className={cn(
					"absolute -top-1 -right-1 min-w-[18px] h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center shadow",
					totalQty === 0 && "opacity-0 scale-75",
				)}
			>
				{totalQty}
			</span>
		</button>
	);
}
