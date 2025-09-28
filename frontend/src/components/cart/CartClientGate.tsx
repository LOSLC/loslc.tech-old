"use client";
import React from "react";
import { useAuth } from "@/lib/providers/auth-provider";
import { CartIconButton } from "@/components/cart/CartIcon";
import { CartPanel } from "@/components/cart/CartPanel";

export function CartClientGate() {
	const { isAuthenticated } = useAuth();
	if (!isAuthenticated) return null;
	return (
		<>
			<div className="fixed top-4 right-4 z-40">
				<CartIconButton />
			</div>
			<CartPanel />
		</>
	);
}
