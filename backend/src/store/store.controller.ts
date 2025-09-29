import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { StoreService } from "./store.service";
import { AuthGuard } from "@/auth/auth.guard";
import { User } from "@/common/decorators/user.decorator";
import { User as DBUser } from "@/core/db/schema";
import { BulkCreateItemDTO, CreateItemDTO, UpdateItemDTO } from "./store.dto";

@ApiTags("Store")
@Controller("store")
export class StoreController {
	constructor(private readonly store: StoreService) {}

	// ITEMS
	@Get("items")
	@ApiOperation({ summary: "List items (published only unless admin)" })
	@ApiQuery({ name: "offset", required: false, type: Number })
	@ApiQuery({ name: "limit", required: false, type: Number })
	@ApiQuery({ name: "query", required: false, type: String })
	@ApiQuery({ name: "featured", required: false, type: Boolean })
	@ApiQuery({ name: "published", required: false, type: Boolean })
	@UseGuards(AuthGuard)
	async listItems(
		@Query("offset") offset?: number,
		@Query("limit") limit?: number,
		@Query("query") search?: string,
		@Query("featured") featured?: boolean,
		@Query("published") published?: boolean,
		@User() user?: DBUser,
	) {
		return this.store.listItems(
			{ offset, limit, query: search, featured, published },
			user,
		);
	}

	@Get("items/search")
	@ApiOperation({ summary: "Search items by name" })
	@ApiQuery({ name: "term", required: true, type: String })
	async search(@Query("term") term: string) {
		return this.store.searchItems(term);
	}

	@Get("items/:id")
	@ApiOperation({ summary: "Get item by id" })
	@ApiParam({ name: "id", description: "Item ID" })
	async getItem(@Param("id") id: string, @Query("details") details?: string) {
		return this.store.getItem(id, details === "true");
	}

	@Post("items")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Create an item" })
	async createItem(@Body() body: CreateItemDTO, @User() user: DBUser) {
		return this.store.createItem(body, user);
	}

	@Post("items/bulk")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Bulk create item with characteristics & variants" })
	async bulkCreate(@Body() body: BulkCreateItemDTO, @User() user: DBUser) {
		return this.store.bulkCreateItem(body, user);
	}

	@Put("items/:id")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Update item" })
	async updateItem(
		@Param("id") id: string,
		@Body() body: UpdateItemDTO,
		@User() user: DBUser,
	) {
		return this.store.updateItem(id, body, user);
	}

	@Delete("items/:id")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Delete item" })
	async deleteItem(@Param("id") id: string, @User() user: DBUser) {
		return this.store.deleteItem(id, user);
	}

	// CHARACTERISTICS & VARIANTS
	@Get("items/:itemId/characteristics")
	@ApiOperation({ summary: "List characteristics for an item" })
	@ApiParam({ name: "itemId", description: "Item ID" })
	@ApiQuery({
		name: "variants",
		required: false,
		type: Boolean,
		description: "Include variants for each characteristic",
	})
	async listCharacteristics(
		@Param("itemId") itemId: string,
		@Query("variants") variants?: string,
	) {
		return this.store.listCharacteristics(itemId, variants === "true");
	}

	@Post("items/:itemId/characteristics")
	@UseGuards(AuthGuard)
	async addCharacteristic(
		@Param("itemId") itemId: string,
		@Body("name") name: string,
		@User() user: DBUser,
	) {
		return this.store.addCharacteristic(itemId, name, user);
	}

	@Put("characteristics/:id")
	@UseGuards(AuthGuard)
	async updateCharacteristic(
		@Param("id") id: string,
		@Body("name") name: string,
		@User() user: DBUser,
	) {
		return this.store.updateCharacteristic(id, name, user);
	}

	@Delete("characteristics/:id")
	@UseGuards(AuthGuard)
	async deleteCharacteristic(@Param("id") id: string, @User() user: DBUser) {
		return this.store.deleteCharacteristic(id, user);
	}

	@Post("characteristics/:characteristicId/variants")
	@UseGuards(AuthGuard)
	async addVariant(
		@Param("characteristicId") characteristicId: string,
		@Body("value") value: string,
		@User() user: DBUser,
	) {
		return this.store.addVariant(characteristicId, value, user);
	}

	@Put("variants/:id")
	@UseGuards(AuthGuard)
	async updateVariant(
		@Param("id") id: string,
		@Body("value") value: string,
		@User() user: DBUser,
	) {
		return this.store.updateVariant(id, value, user);
	}

	@Delete("variants/:id")
	@UseGuards(AuthGuard)
	async deleteVariant(@Param("id") id: string, @User() user: DBUser) {
		return this.store.deleteVariant(id, user);
	}

	// IMAGES
	@Post("items/:itemId/images")
	@UseGuards(AuthGuard)
	async addImages(
		@Param("itemId") itemId: string,
		@Body("imageIds") imageIds: string[],
		@User() user: DBUser,
	) {
		return this.store.addImages(itemId, imageIds, user);
	}

	@Delete("items/:itemId/images/:imageId")
	@UseGuards(AuthGuard)
	async removeImage(
		@Param("itemId") itemId: string,
		@Param("imageId") imageId: string,
		@User() user: DBUser,
	) {
		return this.store.removeImage(itemId, imageId, user);
	}

	// CART
	@Get("cart")
	@UseGuards(AuthGuard)
	async getOrCreateCart(@User() user: DBUser) {
		return this.store.getOrCreateCart(user);
	}

	@Get("cart/items")
	@UseGuards(AuthGuard)
	async getCartItems(@User() user: DBUser) {
		const cart = await this.store.getOrCreateCart(user);
		return this.store.getCartItems(cart.id);
	}

	@Get("cart/items/:id/full")
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary:
			"Get full details for a cart item (ordered item + base item + selected variants)",
	})
	@ApiParam({ name: "id", description: "Ordered cart item ID" })
	async getCartItemDetails(@Param("id") id: string, @User() user: DBUser) {
		return this.store.getCartItemDetails(id, user);
	}

	@Post("cart/items")
	@UseGuards(AuthGuard)
	async addItemToCart(
		@User() user: DBUser,
		@Body("itemId") itemId: string,
		@Body("quantity") quantity: number,
		@Body("variantIds") variantIds?: string[],
	) {
		const cart = await this.store.getOrCreateCart(user);
		return this.store.addItemToCart(cart.id, itemId, quantity, variantIds);
	}

	@Put("cart/items/:id")
	@UseGuards(AuthGuard)
	async updateCartItem(
		@Param("id") id: string,
		@Body("quantity") quantity: number,
		@Body("variantIds") variantIds: string[] | undefined,
	) {
		return this.store.updateCartItem(id, quantity, variantIds);
	}

	@Delete("cart/items/:id")
	@UseGuards(AuthGuard)
	async removeCartItem(@Param("id") id: string) {
		return this.store.removeCartItem(id);
	}

	@Delete("cart")
	@UseGuards(AuthGuard)
	async clearCart(@User() user: DBUser) {
		const cart = await this.store.getOrCreateCart(user);
		return this.store.clearCart(cart.id);
	}

	// ORDERS
	@Post("orders")
	@UseGuards(AuthGuard)
	async createOrder(@User() user: DBUser) {
		return this.store.createOrderFromCart(user);
	}

	@Get("orders")
	@UseGuards(AuthGuard)
	async listOrders(@User() user: DBUser, @Query("all") all?: string) {
		return this.store.listOrders(user, all === "true");
	}

	@Get("orders/:id")
	@UseGuards(AuthGuard)
	async getOrder(@Param("id") id: string, @User() user: DBUser) {
		return this.store.getOrder(id, user);
	}

	@Post("orders/:id/paid")
	@UseGuards(AuthGuard)
	async markPaid(@Param("id") id: string, @User() user: DBUser) {
		return this.store.markOrderPaid(id, user);
	}

	@Post("orders/:id/confirm")
	@UseGuards(AuthGuard)
	async confirm(@Param("id") id: string, @User() user: DBUser) {
		return this.store.confirmOrder(id, user);
	}

	@Post("orders/:id/accept")
	@UseGuards(AuthGuard)
	async accept(@Param("id") id: string, @User() user: DBUser) {
		return this.store.acceptOrder(id, user);
	}
}
