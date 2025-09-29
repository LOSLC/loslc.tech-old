import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
	MaxLength,
	Min,
	ValidateNested,
} from "class-validator";

// ITEM DTOs
export class CreateItemDTO {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	images?: string[]; // file ids

	@IsInt()
	@IsPositive()
	price: number; // store smallest unit (e.g. cents)

	// createdBy removed from input; inferred from authenticated user

	@IsOptional()
	@IsBoolean()
	published?: boolean;

	@IsOptional()
	@IsBoolean()
	featured?: boolean;
}

export class UpdateItemDTO {
	@IsOptional()
	@IsString()
	@MaxLength(255)
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	images?: string[];

	@IsOptional()
	@IsInt()
	@IsPositive()
	price?: number;

	@IsOptional()
	@IsBoolean()
	published?: boolean;

	@IsOptional()
	@IsBoolean()
	featured?: boolean;
}

export class ItemResponseDTO {
	id: string;
	name: string;
	description: string;
	images: string[];
	price: number;
	createdBy: string;
	published: boolean;
	featured: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// CHARACTERISTIC DTOs
export class CreateItemCharacteristicDTO {
	@IsUUID()
	itemId: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}

export class UpdateItemCharacteristicDTO {
	@IsOptional()
	@IsString()
	name?: string;
}

export class ItemCharacteristicResponseDTO {
	id: string;
	itemId: string;
	name: string;
}

// CHARACTERISTIC VARIANT DTOs
export class CreateItemCharacteristicVariantDTO {
	@IsUUID()
	caracteristicId: string; // Keeping DB spelling

	@IsString()
	@IsNotEmpty()
	value: string;
}

export class UpdateItemCharacteristicVariantDTO {
	@IsOptional()
	@IsString()
	value?: string;
}

export class ItemCharacteristicVariantResponseDTO {
	id: string;
	caracteristicId: string;
	value: string;
}

// ORDERED ITEMS (item in cart/order) DTOs
export class CreateOrderedItemDTO {
	@IsUUID()
	itemId: string;

	@IsUUID()
	cartId: string;

	@IsInt()
	@Min(1)
	quantity: number;

	@IsOptional()
	@IsArray()
	@IsUUID(undefined, { each: true })
	variantIds?: string[]; // For linking variants after insert
}

export class UpdateOrderedItemDTO {
	@IsOptional()
	@IsInt()
	@Min(1)
	quantity?: number;

	@IsOptional()
	@IsArray()
	@IsUUID(undefined, { each: true })
	variantIds?: string[];
}

export class OrderedItemVariantLinkResponseDTO {
	orderedItemsId: string;
	variantIds: string; // single variant id per row (schema uses singular column name)
}

export class OrderedItemResponseDTO {
	id: string;
	itemId: string;
	cartId: string;
	quantity: number;
	// aggregated variants
	variants?: ItemCharacteristicVariantResponseDTO[];
}

// SHOPPING CART DTOs
export class CreateShoppingCartDTO {
	@IsString()
	@IsNotEmpty()
	userId: string; // varchar in DB, user table id type
}

export class ShoppingCartResponseDTO {
	id: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	items?: OrderedItemResponseDTO[];
}

// ORDER DTOs
export class CreateOrderDTO {
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsUUID()
	cartId: string;
}

export class OrderResponseDTO {
	id: string;
	userId: string;
	cartId: string;
	createdAt: Date;
	paidAt?: Date | null;
	confirmed: boolean;
	accepted: boolean;
	paid: boolean;
	cart?: ShoppingCartResponseDTO; // optional expansion
}

// COMPOSED DETAIL RESPONSES
export class ItemWithCharacteristicsDTO extends ItemResponseDTO {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ItemCharacteristicResponseDTO)
	characteristics?: ItemCharacteristicWithVariantsDTO[];
}

export class ItemCharacteristicWithVariantsDTO extends ItemCharacteristicResponseDTO {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ItemCharacteristicVariantResponseDTO)
	variants?: ItemCharacteristicVariantResponseDTO[];
}

// BULK CREATE DTO FOR ITEM + CHARACTERISTICS + VARIANTS
export class BulkCreateItemCharacteristicVariantDTO {
	@IsString()
	@IsNotEmpty()
	value: string;
}

export class BulkCreateItemCharacteristicDTO {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BulkCreateItemCharacteristicVariantDTO)
	variants: BulkCreateItemCharacteristicVariantDTO[];
}

export class BulkCreateItemDTO extends CreateItemDTO {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BulkCreateItemCharacteristicDTO)
	characteristics: BulkCreateItemCharacteristicDTO[];
}

export class BulkCreatedItemResponseDTO extends ItemResponseDTO {
	characteristics: ItemCharacteristicWithVariantsDTO[];
}
