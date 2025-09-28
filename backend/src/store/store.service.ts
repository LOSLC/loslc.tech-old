import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { db } from "@/core/db/db";
import {
	itemsTable,
	itemCaracteristicsTable,
	itemCaracteristicVariantsTable,
	orderedItemsTable,
	orderedItemVariantLinkTable,
	shoppingCartsTable,
	ordersTable,
} from "@/core/db/schema";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { AccessmgtService } from "@/accessmgt/accessmgt.service";
import {
	BulkCreateItemDTO,
	BulkCreatedItemResponseDTO,
	CreateItemDTO,
	ItemCharacteristicVariantResponseDTO,
	ItemCharacteristicWithVariantsDTO,
	ItemResponseDTO,
	ItemWithCharacteristicsDTO,
	UpdateItemDTO,
} from "./store.dto";
import { User } from "@/core/db/schema";

interface ListItemsQuery {
	offset?: number;
	limit?: number;
	query?: string;
	featured?: boolean;
	published?: boolean; // admin only override
}

@Injectable()
export class StoreService {
	constructor(private readonly access: AccessmgtService) {}

	// ITEMS
	async createItem(data: CreateItemDTO, user: User): Promise<ItemResponseDTO> {
		const [row] = await db
			.insert(itemsTable)
			.values({
				name: data.name,
				description: data.description,
				images: data.images ?? [],
				price: data.price,
				createdBy: user.id,
				published: data.published ?? false,
				featured: data.featured ?? false,
			})
			.returning();
		return row as ItemResponseDTO;
	}

	async bulkCreateItem(
		data: BulkCreateItemDTO,
		user: User,
	): Promise<BulkCreatedItemResponseDTO> {
		const item = await this.createItem(data, user);
		const characteristics: ItemCharacteristicWithVariantsDTO[] = [];
		for (const c of data.characteristics) {
			const [charRow] = await db
				.insert(itemCaracteristicsTable)
				.values({ itemId: item.id, name: c.name })
				.returning();
			const variants: ItemCharacteristicVariantResponseDTO[] = [];
			for (const v of c.variants) {
				const [vRow] = await db
					.insert(itemCaracteristicVariantsTable)
					.values({ caracteristicId: charRow.id, value: v.value })
					.returning();
				variants.push(vRow as ItemCharacteristicVariantResponseDTO);
			}
			characteristics.push({
				id: charRow.id,
				itemId: item.id,
				name: charRow.name,
				variants,
			});
		}
		return { ...item, characteristics } as BulkCreatedItemResponseDTO;
	}

	async listItems(
		query: ListItemsQuery,
		user?: User,
	): Promise<ItemResponseDTO[]> {
		const { offset = 0, limit = 20, query: q, featured, published } = query;
		const where = [] as any[];
		if (q) {
			const pattern = `%${q}%`;
			where.push(ilike(itemsTable.name, pattern));
		}
		if (featured !== undefined) where.push(eq(itemsTable.featured, featured));
		if (published !== undefined) {
			// Only admin can override published filter; otherwise enforce published true
			if (user && (await this.access.isAdmin(user))) {
				where.push(eq(itemsTable.published, published));
			} else {
				where.push(eq(itemsTable.published, true));
			}
		} else {
			// default only published unless admin explicitly asked for unpublished
			if (!user || !(await this.access.isAdmin(user))) {
				where.push(eq(itemsTable.published, true));
			}
		}

		const rows = await db
			.select()
			.from(itemsTable)
			.where(
				where.length
					? where.length === 1
						? where[0]
						: and(...where)
					: undefined,
			)
			.orderBy(desc(itemsTable.createdAt))
			.offset(offset)
			.limit(limit);
		return rows as ItemResponseDTO[];
	}

	async searchItems(term: string, limit = 10): Promise<ItemResponseDTO[]> {
		const pattern = `%${term}%`;
		const rows = await db
			.select()
			.from(itemsTable)
			.where(ilike(itemsTable.name, pattern))
			.limit(limit);
		return rows as ItemResponseDTO[];
	}

	async getItem(
		id: string,
		includeDetails = false,
	): Promise<ItemResponseDTO | ItemWithCharacteristicsDTO> {
		const [item] = await db
			.select()
			.from(itemsTable)
			.where(eq(itemsTable.id, id))
			.limit(1);
		if (!item) throw new NotFoundException("Item not found");
		if (!includeDetails) return item as ItemResponseDTO;

		const characteristics = (await db
			.select()
			.from(itemCaracteristicsTable)
			.where(
				eq(itemCaracteristicsTable.itemId, id),
			)) as ItemCharacteristicWithVariantsDTO[];
		const charIds = characteristics.map((c) => c.id);
		let variants: ItemCharacteristicVariantResponseDTO[] = [];
		if (charIds.length) {
			variants = (await db
				.select()
				.from(itemCaracteristicVariantsTable)
				.where(
					inArray(itemCaracteristicVariantsTable.caracteristicId, charIds),
				)) as ItemCharacteristicVariantResponseDTO[];
		}
		const enriched = characteristics.map((c) => ({
			...c,
			variants: variants.filter((v) => v.caracteristicId === c.id),
		}));
		return {
			...(item as ItemResponseDTO),
			characteristics: enriched,
		} as ItemWithCharacteristicsDTO;
	}

	async updateItem(
		id: string,
		data: UpdateItemDTO,
		user: User,
	): Promise<ItemResponseDTO> {
		const [existing] = await db
			.select()
			.from(itemsTable)
			.where(eq(itemsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Item not found");
		if (existing.createdBy !== user.id && !(await this.access.isAdmin(user))) {
			throw new UnauthorizedException("Not authorized");
		}
		const [updated] = await db
			.update(itemsTable)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(itemsTable.id, id))
			.returning();
		return updated as ItemResponseDTO;
	}

	async deleteItem(id: string, user: User): Promise<{ message: string }> {
		const [existing] = await db
			.select()
			.from(itemsTable)
			.where(eq(itemsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Item not found");
		if (existing.createdBy !== user.id && !(await this.access.isAdmin(user))) {
			throw new UnauthorizedException("Not authorized");
		}
		await db.delete(itemsTable).where(eq(itemsTable.id, id));
		return { message: "Item deleted" };
	}

	// CHARACTERISTICS
	async addCharacteristic(
		itemId: string,
		name: string,
		user: User,
	): Promise<ItemCharacteristicWithVariantsDTO> {
		await this.ensureCanModifyItem(itemId, user);
		const [row] = await db
			.insert(itemCaracteristicsTable)
			.values({ itemId, name })
			.returning();
		return { ...row, variants: [] } as ItemCharacteristicWithVariantsDTO;
	}

	async updateCharacteristic(
		id: string,
		name: string,
		user: User,
	): Promise<ItemCharacteristicWithVariantsDTO> {
		const [existing] = await db
			.select()
			.from(itemCaracteristicsTable)
			.where(eq(itemCaracteristicsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Characteristic not found");
		await this.ensureCanModifyItem(existing.itemId, user);
		const [updated] = await db
			.update(itemCaracteristicsTable)
			.set({ name })
			.where(eq(itemCaracteristicsTable.id, id))
			.returning();
		return {
			...updated,
			variants: await this.getVariantsForCharacteristic(id),
		};
	}

	async deleteCharacteristic(
		id: string,
		user: User,
	): Promise<{ message: string }> {
		const [existing] = await db
			.select()
			.from(itemCaracteristicsTable)
			.where(eq(itemCaracteristicsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Characteristic not found");
		await this.ensureCanModifyItem(existing.itemId, user);
		await db
			.delete(itemCaracteristicsTable)
			.where(eq(itemCaracteristicsTable.id, id));
		return { message: "Characteristic deleted" };
	}

	async listCharacteristics(
		itemId: string,
		withVariants = false,
	): Promise<ItemCharacteristicWithVariantsDTO[]> {
		const characteristics = (await db
			.select()
			.from(itemCaracteristicsTable)
			.where(
				eq(itemCaracteristicsTable.itemId, itemId),
			)) as ItemCharacteristicWithVariantsDTO[];
		if (!withVariants || !characteristics.length)
			return characteristics.map((c) => ({
				...c,
				variants: withVariants ? [] : undefined,
			}));
		const charIds = characteristics.map((c) => c.id);
		const variants = (await db
			.select()
			.from(itemCaracteristicVariantsTable)
			.where(
				inArray(itemCaracteristicVariantsTable.caracteristicId, charIds),
			)) as ItemCharacteristicVariantResponseDTO[];
		return characteristics.map((c) => ({
			...c,
			variants: variants.filter((v) => v.caracteristicId === c.id),
		}));
	}

	async addVariant(
		caracteristicId: string,
		value: string,
		user: User,
	): Promise<ItemCharacteristicVariantResponseDTO> {
		const [charRow] = await db
			.select()
			.from(itemCaracteristicsTable)
			.where(eq(itemCaracteristicsTable.id, caracteristicId))
			.limit(1);
		if (!charRow) throw new NotFoundException("Characteristic not found");
		await this.ensureCanModifyItem(charRow.itemId, user);
		const [row] = await db
			.insert(itemCaracteristicVariantsTable)
			.values({ caracteristicId, value })
			.returning();
		return row as ItemCharacteristicVariantResponseDTO;
	}

	async updateVariant(
		id: string,
		value: string,
		user: User,
	): Promise<ItemCharacteristicVariantResponseDTO> {
		const [existing] = await db
			.select()
			.from(itemCaracteristicVariantsTable)
			.where(eq(itemCaracteristicVariantsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Variant not found");
		const [charRow] = await db
			.select()
			.from(itemCaracteristicsTable)
			.where(eq(itemCaracteristicsTable.id, existing.caracteristicId))
			.limit(1);
		if (!charRow) throw new NotFoundException("Characteristic not found");
		await this.ensureCanModifyItem(charRow.itemId, user);
		const [updated] = await db
			.update(itemCaracteristicVariantsTable)
			.set({ value })
			.where(eq(itemCaracteristicVariantsTable.id, id))
			.returning();
		return updated as ItemCharacteristicVariantResponseDTO;
	}

	async deleteVariant(id: string, user: User): Promise<{ message: string }> {
		const [existing] = await db
			.select()
			.from(itemCaracteristicVariantsTable)
			.where(eq(itemCaracteristicVariantsTable.id, id))
			.limit(1);
		if (!existing) throw new NotFoundException("Variant not found");
		const [charRow] = await db
			.select()
			.from(itemCaracteristicsTable)
			.where(eq(itemCaracteristicsTable.id, existing.caracteristicId))
			.limit(1);
		if (!charRow) throw new NotFoundException("Characteristic not found");
		await this.ensureCanModifyItem(charRow.itemId, user);
		await db
			.delete(itemCaracteristicVariantsTable)
			.where(eq(itemCaracteristicVariantsTable.id, id));
		return { message: "Variant deleted" };
	}

	private async getVariantsForCharacteristic(
		characteristicId: string,
	): Promise<ItemCharacteristicVariantResponseDTO[]> {
		const rows = await db
			.select()
			.from(itemCaracteristicVariantsTable)
			.where(
				eq(itemCaracteristicVariantsTable.caracteristicId, characteristicId),
			);
		return rows as ItemCharacteristicVariantResponseDTO[];
	}

	// IMAGE MANAGEMENT
	async addImages(
		itemId: string,
		imageIds: string[],
		user: User,
	): Promise<ItemResponseDTO> {
		const item = (await this.getItem(itemId)) as ItemResponseDTO;
		await this.ensureCanModifyItem(itemId, user);
		const updatedImages = Array.from(
			new Set([...(item.images || []), ...imageIds]),
		);
		const [updated] = await db
			.update(itemsTable)
			.set({ images: updatedImages, updatedAt: new Date() })
			.where(eq(itemsTable.id, itemId))
			.returning();
		return updated as ItemResponseDTO;
	}

	async removeImage(
		itemId: string,
		imageId: string,
		user: User,
	): Promise<ItemResponseDTO> {
		const item = (await this.getItem(itemId)) as ItemResponseDTO;
		await this.ensureCanModifyItem(itemId, user);
		const updatedImages = (item.images || []).filter((i) => i !== imageId);
		const [updated] = await db
			.update(itemsTable)
			.set({ images: updatedImages, updatedAt: new Date() })
			.where(eq(itemsTable.id, itemId))
			.returning();
		return updated as ItemResponseDTO;
	}

	// STOCK (simplistic; could be transactional)
	async getStock(itemId: string) {
		// Placeholder: if stock table integrated, join; currently not imported due to separate file
		// Implementation would query itemStock table.
		return { itemId, quantity: 0 };
	}

	// CARTS
	async getOrCreateCart(user: User): Promise<{ id: string }> {
		const [existing] = await db
			.select({ id: shoppingCartsTable.id })
			.from(shoppingCartsTable)
			.where(eq(shoppingCartsTable.userId, user.id))
			.limit(1);
		if (existing) return existing;
		const [created] = await db
			.insert(shoppingCartsTable)
			.values({ userId: user.id })
			.returning({ id: shoppingCartsTable.id });
		return created;
	}

	async getCartItems(cartId: string) {
		const rows = await db
			.select()
			.from(orderedItemsTable)
			.where(eq(orderedItemsTable.cartId, cartId));
		return rows;
	}

	async getCartItemDetails(orderedItemId: string, user: User) {
		const [orderedItem] = await db
			.select()
			.from(orderedItemsTable)
			.where(eq(orderedItemsTable.id, orderedItemId))
			.limit(1);
		if (!orderedItem) throw new NotFoundException("Cart item not found");

		const [cart] = await db
			.select()
			.from(shoppingCartsTable)
			.where(eq(shoppingCartsTable.id, orderedItem.cartId))
			.limit(1);
		if (!cart) throw new NotFoundException("Cart not found");
		if (cart.userId !== user.id && !(await this.access.isAdmin(user))) {
			throw new UnauthorizedException("Not authorized");
		}

		const [item] = await db
			.select()
			.from(itemsTable)
			.where(eq(itemsTable.id, orderedItem.itemId))
			.limit(1);

		const variantLinks = await db
			.select()
			.from(orderedItemVariantLinkTable)
			.where(eq(orderedItemVariantLinkTable.orderedItemsId, orderedItem.id));
		const variantIds = variantLinks.map((v) => v.variantIds);
		let selectedVariants: Array<{
			id: string;
			value: string;
			characteristicId: string;
			characteristicName?: string;
		}> = [];
		if (variantIds.length) {
			const variants = (await db
				.select()
				.from(itemCaracteristicVariantsTable)
				.where(
					inArray(itemCaracteristicVariantsTable.id, variantIds),
				)) as any[];
			const characteristicIds = [
				...new Set(variants.map((v) => v.caracteristicId)),
			];
			let characteristics: any[] = [];
			if (characteristicIds.length) {
				characteristics = (await db
					.select()
					.from(itemCaracteristicsTable)
					.where(
						inArray(itemCaracteristicsTable.id, characteristicIds),
					)) as any[];
			}
			selectedVariants = variants.map((v) => ({
				id: v.id,
				value: v.value,
				characteristicId: v.caracteristicId,
				characteristicName: characteristics.find(
					(c) => c.id === v.caracteristicId,
				)?.name,
			}));
		}

		return {
			orderedItem,
			item: item || null,
			selectedVariants,
		};
	}

	async addItemToCart(
		cartId: string,
		itemId: string,
		quantity = 1,
		variantIds?: string[],
	) {
		const [row] = await db
			.insert(orderedItemsTable)
			.values({ cartId, itemId, quantity })
			.returning();
		await this.upsertVariantLinks(row.id, variantIds);
		return row;
	}

	async updateCartItem(
		orderedItemId: string,
		quantity: number,
		variantIds?: string[],
	) {
		const [existing] = await db
			.select()
			.from(orderedItemsTable)
			.where(eq(orderedItemsTable.id, orderedItemId))
			.limit(1);
		if (!existing) throw new NotFoundException("Cart item not found");
		const [updated] = await db
			.update(orderedItemsTable)
			.set({ quantity })
			.where(eq(orderedItemsTable.id, orderedItemId))
			.returning();
		await this.replaceVariantLinks(updated.id, variantIds);
		return updated;
	}

	async removeCartItem(orderedItemId: string) {
		await db
			.delete(orderedItemsTable)
			.where(eq(orderedItemsTable.id, orderedItemId));
		return { message: "Cart item removed" };
	}

	async clearCart(cartId: string) {
		await db
			.delete(orderedItemsTable)
			.where(eq(orderedItemsTable.cartId, cartId));
		return { message: "Cart cleared" };
	}

	private async upsertVariantLinks(
		orderedItemsId: string,
		variantIds?: string[],
	) {
		if (!variantIds?.length) return;
		for (const vid of variantIds) {
			await db
				.insert(orderedItemVariantLinkTable)
				.values({ orderedItemsId, variantIds: vid })
				.onConflictDoNothing();
		}
	}

	private async replaceVariantLinks(
		orderedItemsId: string,
		variantIds?: string[],
	) {
		if (!variantIds) return;
		await db
			.delete(orderedItemVariantLinkTable)
			.where(eq(orderedItemVariantLinkTable.orderedItemsId, orderedItemsId));
		await this.upsertVariantLinks(orderedItemsId, variantIds);
	}

	// ORDERS
	async createOrderFromCart(
		user: User,
	): Promise<{ id: string; cartId: string }> {
		const cart = await this.getOrCreateCart(user);
		const items = await this.getCartItems(cart.id);
		if (!items.length) throw new NotFoundException("Cart is empty");
		const [order] = await db
			.insert(ordersTable)
			.values({ userId: user.id, cartId: cart.id })
			.returning({ id: ordersTable.id, cartId: ordersTable.cartId });
		return order;
	}

	async listOrders(user: User, includeAll = false) {
		if (includeAll && !(await this.access.isAdmin(user))) includeAll = false;
		const rows = await db
			.select()
			.from(ordersTable)
			.where(includeAll ? undefined : eq(ordersTable.userId, user.id))
			.orderBy(desc(ordersTable.createdAt));
		return rows;
	}

	async getOrder(id: string, user: User) {
		const [row] = await db
			.select()
			.from(ordersTable)
			.where(eq(ordersTable.id, id))
			.limit(1);
		if (!row) throw new NotFoundException("Order not found");
		if (row.userId !== user.id && !(await this.access.isAdmin(user))) {
			throw new UnauthorizedException("Not authorized");
		}
		return row;
	}

	async markOrderPaid(id: string, user: User) {
		const order = await this.getOrder(id, user);
		const [updated] = await db
			.update(ordersTable)
			.set({ paid: true, paidAt: new Date() })
			.where(eq(ordersTable.id, order.id))
			.returning();
		return updated;
	}

	async confirmOrder(id: string, user: User) {
		const order = await this.getOrder(id, user);
		const [updated] = await db
			.update(ordersTable)
			.set({ confirmed: true })
			.where(eq(ordersTable.id, order.id))
			.returning();
		return updated;
	}

	async acceptOrder(id: string, user: User) {
		if (!(await this.access.isAdmin(user))) {
			throw new UnauthorizedException("Admin only");
		}
		const [updated] = await db
			.update(ordersTable)
			.set({ accepted: true })
			.where(eq(ordersTable.id, id))
			.returning();
		if (!updated) throw new NotFoundException("Order not found");
		return updated;
	}

	// UTIL
	private async ensureCanModifyItem(itemId: string, user: User) {
		const [existing] = await db
			.select()
			.from(itemsTable)
			.where(eq(itemsTable.id, itemId))
			.limit(1);
		if (!existing) throw new NotFoundException("Item not found");
		if (existing.createdBy !== user.id && !(await this.access.isAdmin(user))) {
			throw new UnauthorizedException("Not authorized");
		}
	}
}
