import {
	AddToCartInput,
	CartItemServer,
	CartSummary,
	CreateStoreItemInput,
	OrderDTO,
	StoreCharacteristic,
	StoreItem,
	StoreVariant,
	UpdateCartItemInput,
	UpdateStoreItemInput,
} from "../types/store";
import { api } from "./client";

export const storeApi = {
	listItems: (
		params?: Record<string, string | number | boolean | undefined>,
	): Promise<StoreItem[]> => {
		const sp: Record<string, string | number | boolean> | undefined = params
			? Object.fromEntries(
					Object.entries(params).filter(([, v]) => v !== undefined) as Array<
						[string, string | number | boolean]
					>,
				)
			: undefined;
		return api.get("store/items", { searchParams: sp }).json();
	},
	searchItems: (term: string): Promise<StoreItem[]> =>
		api.get("store/items/search", { searchParams: { term } }).json(),
	getItem: (id: string, details = false): Promise<StoreItem> =>
		api
			.get(`store/items/${id}`, {
				searchParams: details ? { details: true } : undefined,
			})
			.json(),
	createItem: (data: CreateStoreItemInput): Promise<StoreItem> =>
		api.post("store/items", { json: data }).json(),
	updateItem: (id: string, data: UpdateStoreItemInput): Promise<StoreItem> =>
		api.put(`store/items/${id}`, { json: data }).json(),
	deleteItem: (id: string): Promise<{ message: string }> =>
		api.delete(`store/items/${id}`).json(),
	addImages: (itemId: string, imageIds: string[]): Promise<StoreItem> =>
		api.post(`store/items/${itemId}/images`, { json: { imageIds } }).json(),
	removeImage: (itemId: string, imageId: string): Promise<StoreItem> =>
		api.delete(`store/items/${itemId}/images/${imageId}`).json(),
	// Characteristics
	addCharacteristic: (
		itemId: string,
		name: string,
	): Promise<StoreCharacteristic> =>
		api
			.post(`store/items/${itemId}/characteristics`, { json: { name } })
			.json(),
	updateCharacteristic: (
		id: string,
		name: string,
	): Promise<StoreCharacteristic> =>
		api.put(`store/characteristics/${id}`, { json: { name } }).json(),
	deleteCharacteristic: (id: string): Promise<{ message: string }> =>
		api.delete(`store/characteristics/${id}`).json(),
	// Variants
	addVariant: (
		characteristicId: string,
		value: string,
	): Promise<StoreVariant> =>
		api
			.post(`store/characteristics/${characteristicId}/variants`, {
				json: { value },
			})
			.json(),
	updateVariant: (id: string, value: string): Promise<StoreVariant> =>
		api.put(`store/variants/${id}`, { json: { value } }).json(),
	deleteVariant: (id: string): Promise<{ message: string }> =>
		api.delete(`store/variants/${id}`).json(),
	// List characteristics (optionally with variants)
	listCharacteristics: (
		itemId: string,
		withVariants = true,
	): Promise<StoreCharacteristic[]> =>
		api
			.get(`store/items/${itemId}/characteristics`, {
				searchParams: withVariants ? { variants: true } : undefined,
			})
			.json(),
	// Cart
	getOrCreateCart: (): Promise<CartSummary> => api.get("store/cart").json(),
	getCartItems: (): Promise<CartItemServer[]> =>
		api.get("store/cart/items").json(),
	getCartItemDetails: (id: string): Promise<CartItemServer> =>
		api.get(`store/cart/items/${id}/full`).json(),
	addItemToCart: (body: AddToCartInput): Promise<CartItemServer> =>
		api.post("store/cart/items", { json: body }).json(),
	updateCartItem: (
		id: string,
		body: UpdateCartItemInput,
	): Promise<CartItemServer> =>
		api.put(`store/cart/items/${id}`, { json: body }).json(),
	removeCartItem: (id: string): Promise<{ message: string }> =>
		api.delete(`store/cart/items/${id}`).json(),
	clearCart: (): Promise<{ message: string }> =>
		api.delete("store/cart").json(),
	// Orders
	createOrder: (): Promise<{ id: string; cartId: string }> =>
		api.post("store/orders").json(),
	listOrders: (all = false): Promise<OrderDTO[]> =>
		api
			.get("store/orders", { searchParams: all ? { all: true } : undefined })
			.json(),
	getOrder: (id: string): Promise<OrderDTO> =>
		api.get(`store/orders/${id}`).json(),
	markPaid: (id: string): Promise<OrderDTO> =>
		api.post(`store/orders/${id}/paid`).json(),
	confirm: (id: string): Promise<OrderDTO> =>
		api.post(`store/orders/${id}/confirm`).json(),
	accept: (id: string): Promise<OrderDTO> =>
		api.post(`store/orders/${id}/accept`).json(),
};
