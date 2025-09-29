// Centralized store domain types
// These mirror backend entities (simplified to what the frontend currently uses)

export interface StoreItem {
	id: string;
	name: string;
	description: string;
	images: string[];
	price: number; // cents
	createdBy: string;
	published: boolean;
	featured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface StoreCharacteristic {
	id: string;
	itemId: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
	variants?: StoreVariant[];
}

export interface StoreVariant {
	id: string;
	characteristicId: string;
	value: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CartSummary {
	id: string;
}

export interface CartItemServer {
	id: string; // cart item id
	cartId: string;
	itemId: string;
	quantity: number;
	variantIds?: string[];
	unitPrice?: number; // cents
	item?: Partial<StoreItem>;
	// extended details endpoint may return selectedVariants
	selectedVariants?: Array<{
		id: string;
		value: string;
		characteristicId: string;
		characteristicName?: string;
	}>;
}

export interface OrderDTO {
	id: string;
	userId: string;
	cartId: string;
	createdAt: string;
	paidAt?: string | null;
	confirmed: boolean;
	accepted: boolean;
	paid: boolean;
	// Optional enriched fields (not always present)
	totalAmount?: number; // amount in chosen currency units already divided (NOT cents)
	currency?: string;
	items?: Array<{
		id: string; // item id (or cart line id?) using item id for display
		name: string;
		price: number; // display price (already adjusted)
		quantity: number;
	}>;
}

export interface CreateStoreItemInput {
	name: string;
	description: string;
	images?: string[];
	price: number; // cents
	published?: boolean;
	featured?: boolean;
}

export type UpdateStoreItemInput = Partial<CreateStoreItemInput>;

export interface AddToCartInput {
	itemId: string;
	quantity: number;
	variantIds?: string[];
}

export interface UpdateCartItemInput {
	quantity: number;
	variantIds?: string[];
}
