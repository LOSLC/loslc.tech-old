"use client";
import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	useEffect,
} from "react";
import {
	useCart,
	useCartItems,
	useAddToCart,
	useUpdateCartItem,
	useRemoveCartItem,
	useClearCart,
} from "@/lib/hooks/use-store";
import { storeApi } from "@/lib/api/store";
import { useAuth } from "@/lib/providers/auth-provider";

// UI Cart item shape (derived from server cart items which contain their own id)
export interface CartItemUI {
	cartItemId: string; // server cart item id
	id: string; // product id
	name: string;
	price: number; // cents per unit
	image?: string | null;
	quantity: number;
	variantIds?: string[];
	variantsDetailed?: {
		id: string;
		value: string;
		characteristicId: string;
		characteristicName?: string;
	}[];
}

interface CartState {
	items: CartItemUI[];
	addItem: (item: {
		id: string;
		name: string;
		price: number;
		image?: string | null;
		quantity?: number;
		variantIds?: string[];
	}) => void;
	updateQuantity: (cartItemId: string, quantity: number) => void;
	removeItem: (cartItemId: string) => void;
	clear: () => void;
	subtotal: number;
	open: boolean;
	setOpen: (v: boolean) => void;
	count: number;
	loading: boolean;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const { isAuthenticated } = useAuth();
	// Server cart queries (run but we'll ignore data if not authenticated)
	const { data: cartData } = useCart();
	const { data: cartItemsData, isLoading: loadingItems } = useCartItems();

	// Detailed info cache per cart item id
	const [details, setDetails] = useState<Record<string, any>>({});
	const [loadingDetails, setLoadingDetails] = useState(false);

	// Fetch details for any new cart items not yet loaded
	useEffect(() => {
		if (!isAuthenticated) return; // do not fetch while logged out
		const ids = (cartItemsData || []).map((c: any) => c.id);
		const missing = ids.filter((id) => !details[id]);
		if (!missing.length) return;
		let cancelled = false;
		(async () => {
			setLoadingDetails(true);
			try {
				for (const id of missing) {
					const d = await storeApi.getCartItemDetails(id);
					if (cancelled) return;
					setDetails((prev) => ({ ...prev, [id]: d }));
				}
			} finally {
				if (!cancelled) setLoadingDetails(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [cartItemsData, details, isAuthenticated]);
	const addMut = useAddToCart();
	const updMut = useUpdateCartItem();
	const delMut = useRemoveCartItem();
	const clearMut = useClearCart();

	const uiItems: CartItemUI[] = useMemo(() => {
		if (!isAuthenticated) return [];
		return (cartItemsData || []).map((ci: any) => {
			const detail = details[ci.id];
			return {
				cartItemId: ci.id,
				id: ci.itemId,
				name: detail?.item?.name || ci.item?.name || ci.itemName || "Item",
				price: ci.unitPrice ?? detail?.item?.price ?? ci.item?.price ?? 0,
				image: detail?.item?.images?.[0] || ci.item?.images?.[0] || null,
				quantity: ci.quantity,
				variantIds:
					detail?.selectedVariants?.map((v: any) => v.id) ||
					ci.variantIds ||
					[],
				variantsDetailed: detail?.selectedVariants,
			};
		});
	}, [cartItemsData, details, isAuthenticated]);

	const addItem: CartState["addItem"] = useCallback(
		(item) => {
			if (!isAuthenticated) return;
			addMut.mutate({
				itemId: item.id,
				quantity: item.quantity || 1,
				variantIds:
					item.variantIds && item.variantIds.length
						? item.variantIds
						: undefined,
			});
		},
		[addMut, isAuthenticated],
	);

	const updateQuantity: CartState["updateQuantity"] = useCallback(
		(cartItemId, quantity) => {
			if (!isAuthenticated) return;
			updMut.mutate({ id: cartItemId, quantity: Math.max(1, quantity) });
		},
		[updMut, isAuthenticated],
	);

	const removeItem: CartState["removeItem"] = useCallback(
		(cartItemId) => delMut.mutate(cartItemId),
		[delMut],
	);

	const clear = useCallback(() => {
		if (!isAuthenticated) return;
		clearMut.mutate();
	}, [clearMut, isAuthenticated]);

	const subtotal = useMemo(
		() => uiItems.reduce((s, it) => s + it.price * it.quantity, 0),
		[uiItems],
	);

	const value: CartState = useMemo(
		() => ({
			items: uiItems,
			addItem,
			updateQuantity,
			removeItem,
			clear,
			subtotal,
			open,
			setOpen,
			count: uiItems.length,
			loading: isAuthenticated ? loadingItems || loadingDetails : false,
		}),
		[
			uiItems,
			addItem,
			updateQuantity,
			removeItem,
			clear,
			subtotal,
			open,
			loadingItems,
			loadingDetails,
			isAuthenticated,
		],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartLocal() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCartLocal must be used within CartProvider");
	return ctx;
}
