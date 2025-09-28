import { api } from "./client";

export interface StoreItem {
	id: string;
	name: string;
	description: string;
	images: string[];
	price: number;
	createdBy: string;
	published: boolean;
	featured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateStoreItemInput {
	name: string;
	description: string;
	images?: string[];
	price: number;
	published?: boolean;
	featured?: boolean;
}

export interface UpdateStoreItemInput extends Partial<CreateStoreItemInput> {}

export interface OrderDTO {
	id: string;
	userId: string;
	cartId: string;
	createdAt: string;
	paidAt?: string | null;
	confirmed: boolean;
	accepted: boolean;
	paid: boolean;
}

export const storeApi = {
	listItems: (params?: Record<string, any>): Promise<StoreItem[]> =>
		api.get("store/items", { searchParams: params }).json(),
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
	addCharacteristic: (itemId: string, name: string) =>
		api
			.post(`store/items/${itemId}/characteristics`, { json: { name } })
			.json(),
	updateCharacteristic: (id: string, name: string) =>
		api.put(`store/characteristics/${id}`, { json: { name } }).json(),
	deleteCharacteristic: (id: string) =>
		api.delete(`store/characteristics/${id}`).json(),
	// Variants
	addVariant: (characteristicId: string, value: string) =>
		api
			.post(`store/characteristics/${characteristicId}/variants`, {
				json: { value },
			})
			.json(),
	updateVariant: (id: string, value: string) =>
		api.put(`store/variants/${id}`, { json: { value } }).json(),
	deleteVariant: (id: string) => api.delete(`store/variants/${id}`).json(),
	// List characteristics (optionally with variants)
	listCharacteristics: (itemId: string, withVariants = true) =>
		api
			.get(`store/items/${itemId}/characteristics`, {
				searchParams: withVariants ? { variants: true } : undefined,
			})
			.json(),
	// Cart
	getOrCreateCart: (): Promise<{ id: string }> => api.get("store/cart").json(),
	getCartItems: (): Promise<any[]> => api.get("store/cart/items").json(),
	getCartItemDetails: (id: string): Promise<any> =>
		api.get(`store/cart/items/${id}/full`).json(),
	addItemToCart: (body: {
		itemId: string;
		quantity: number;
		variantIds?: string[];
	}): Promise<any> => api.post("store/cart/items", { json: body }).json(),
	updateCartItem: (
		id: string,
		body: { quantity: number; variantIds?: string[] },
	): Promise<any> => api.put(`store/cart/items/${id}`, { json: body }).json(),
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
