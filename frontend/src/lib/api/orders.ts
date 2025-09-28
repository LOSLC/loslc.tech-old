import { api } from "./client";

// Basic order type based on existing storeApi OrderDTO plus optional fields we may expose later
export interface OrderDTO {
	id: string;
	userId: string;
	cartId: string;
	createdAt: string;
	paidAt?: string | null;
	confirmed: boolean;
	accepted: boolean;
	paid: boolean;
	// Optional extended data (may be provided by a /full endpoint in backend)
	totalAmount?: number;
	currency?: string;
	items?: Array<{
		id: string;
		itemId: string;
		name: string;
		image?: string | null;
		quantity: number;
		price: number;
		variantSummary?: string[];
	}>;
	shippingAddress?: {
		line1: string;
		line2?: string;
		city: string;
		state?: string;
		country: string;
		postalCode?: string;
	};
	billingInfo?: {
		name?: string;
		taxId?: string;
		email?: string;
	};
}

export interface PaginatedOrdersResult {
	page: number;
	pageSize: number;
	total: number;
	pages: number;
	data: OrderDTO[];
}

// We currently don't have server pagination; implement client-side pagination.
export const ordersApi = {
	listAll: async (): Promise<OrderDTO[]> => {
		return api.get("store/orders").json<OrderDTO[]>();
	},
	listPaginated: async (
		page = 1,
		pageSize = 10,
	): Promise<PaginatedOrdersResult> => {
		const all = await ordersApi.listAll();
		const start = (page - 1) * pageSize;
		const sliced = all
			.slice() // copy
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.slice(start, start + pageSize);
		const pages = Math.max(1, Math.ceil(all.length / pageSize));
		return { page, pageSize, total: all.length, pages, data: sliced };
	},
	get: async (id: string): Promise<OrderDTO> => {
		// Try extended endpoint first; if fails fallback to basic
		try {
			return await api.get(`store/orders/${id}/full`).json<OrderDTO>();
		} catch {
			return api.get(`store/orders/${id}`).json<OrderDTO>();
		}
	},
};

export default ordersApi;
