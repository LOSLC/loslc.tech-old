import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storeApi } from "../api/store";
import {
	AddToCartInput,
	CreateStoreItemInput,
	UpdateCartItemInput,
	UpdateStoreItemInput,
} from "../types/store";

const keys = {
	items: (params?: Record<string, string | number | boolean | undefined>) =>
		["store", "items", params] as const,
	item: (id: string) => ["store", "item", id] as const,
	characteristics: (itemId: string) =>
		["store", "item", itemId, "characteristics"] as const,
	variants: (characteristicId: string) =>
		["store", "characteristic", characteristicId, "variants"] as const,
	characteristicsList: (itemId: string, withVariants: boolean) =>
		["store", "item", itemId, "characteristics-list", withVariants] as const,
	orders: (all: boolean) => ["store", "orders", all] as const,
	order: (id: string) => ["store", "order", id] as const,
	cart: () => ["store", "cart"] as const,
	cartItems: () => ["store", "cart", "items"] as const,
};

export function useStoreItems(
	params?: Record<string, string | number | boolean | undefined>,
) {
	return useQuery({
		queryKey: keys.items(params),
		queryFn: () => storeApi.listItems(params),
	});
}

export function useStoreItem(id: string, details = false) {
	return useQuery({
		queryKey: keys.item(id),
		queryFn: () => storeApi.getItem(id, details),
		enabled: Boolean(id),
	});
}

export function useItemCharacteristics(itemId: string, withVariants = true) {
	return useQuery({
		queryKey: keys.characteristicsList(itemId, withVariants),
		queryFn: () => storeApi.listCharacteristics(itemId, withVariants),
		enabled: Boolean(itemId),
	});
}

export function useCreateItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateStoreItemInput) => storeApi.createItem(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["store", "items"] });
		},
	});
}

export function useUpdateItem(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateStoreItemInput) => storeApi.updateItem(id, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(id) });
			qc.invalidateQueries({ queryKey: ["store", "items"] });
		},
	});
}

// Characteristics
export function useAddCharacteristic(itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (name: string) => storeApi.addCharacteristic(itemId, name),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
		},
	});
}

export function useUpdateCharacteristic(id: string, itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (name: string) => storeApi.updateCharacteristic(id, name),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
		},
	});
}

// Generic characteristic updater to allow calling mutate with dynamic id (prevents hook-in-loop usage)
export function useUpdateCharacteristicGeneric(itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { id: string; name: string }) =>
			storeApi.updateCharacteristic(payload.id, payload.name),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
			qc.invalidateQueries({
				queryKey: keys.characteristicsList(itemId, true),
			});
			qc.invalidateQueries({
				queryKey: keys.characteristicsList(itemId, false),
			});
		},
	});
}

export function useDeleteCharacteristic(itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => storeApi.deleteCharacteristic(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
		},
	});
}

// Variants
export function useAddVariant(characteristicId: string, itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (value: string) => storeApi.addVariant(characteristicId, value),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
		},
	});
}

export function useUpdateVariant(id: string, itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (value: string) => storeApi.updateVariant(id, value),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
		},
	});
}

// Generic variant updater for dynamic id usage
export function useUpdateVariantGeneric(itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { id: string; value: string }) =>
			storeApi.updateVariant(payload.id, payload.value),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
			qc.invalidateQueries({
				queryKey: keys.characteristicsList(itemId, true),
			});
		},
	});
}

export function useDeleteVariant(itemId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => storeApi.deleteVariant(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.item(itemId) });
		},
	});
}

export function useDeleteItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => storeApi.deleteItem(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["store", "items"] });
		},
	});
}

export function useStoreOrders(all = false) {
	return useQuery({
		queryKey: keys.orders(all),
		queryFn: () => storeApi.listOrders(all),
	});
}

export function useStoreOrder(id: string) {
	return useQuery({
		queryKey: keys.order(id),
		queryFn: () => storeApi.getOrder(id),
		enabled: Boolean(id),
	});
}

export function useOrderAction() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (params: {
			id: string;
			action: "paid" | "confirm" | "accept";
		}) => {
			if (params.action === "paid") return storeApi.markPaid(params.id);
			if (params.action === "confirm") return storeApi.confirm(params.id);
			return storeApi.accept(params.id);
		},
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({ queryKey: keys.order(vars.id) });
			qc.invalidateQueries({ queryKey: ["store", "orders"] });
		},
	});
}

export function useCart() {
	return useQuery({
		queryKey: keys.cart(),
		queryFn: () => storeApi.getOrCreateCart(),
	});
}

export function useCartItems() {
	return useQuery({
		queryKey: keys.cartItems(),
		queryFn: () => storeApi.getCartItems(),
	});
}

export function useAddToCart() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: AddToCartInput) => storeApi.addItemToCart(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.cartItems() });
		},
	});
}

export function useUpdateCartItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (params: { id: string } & UpdateCartItemInput) =>
			storeApi.updateCartItem(params.id, {
				quantity: params.quantity,
				variantIds: params.variantIds,
			}),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.cartItems() });
		},
	});
}

export function useRemoveCartItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => storeApi.removeCartItem(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.cartItems() });
		},
	});
}

export function useClearCart() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => storeApi.clearCart(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: keys.cartItems() });
		},
	});
}

export function useCreateOrder() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => storeApi.createOrder(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["store", "orders"] });
			qc.invalidateQueries({ queryKey: keys.cartItems() });
		},
	});
}
