import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsUUID, IsArray, IsInt, Min, Max, ValidateIf, Allow } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

// Blog Post DTOs
export class BlogPostDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty()
  @ValidateIf((o) => o.categoryId !== null)
  @IsUUID()
  categoryId: string | null;

  @ApiProperty()
  @ValidateIf((o) => o.coverImageId !== null)
  @IsUUID()
  coverImageId: string | null;

  @ApiProperty()
  @IsBoolean()
  featured: boolean;

  @ApiProperty()
  @IsBoolean()
  published: boolean;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  @ApiProperty()
  @Allow()
  createdAt: Date;

  @ApiProperty()
  @ValidateIf((o) => o.updatedAt !== null)
  @Allow()
  updatedAt: Date | null;
}

export class CreateBlogPostDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  coverImageId?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateBlogPostDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  coverImageId?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

// Comment DTOs
export class BlogCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty()
  @ValidateIf((o) => o.parentId !== null)
  @IsUUID()
  parentId: string | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class UpdateCommentDTO {
  @IsNotEmpty()
  @IsString()
  content: string;
}

// Like DTOs
export class BlogLikeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  likerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty()
  @Allow()
  likedAt: Date;
}

export class ToggleLikeResponseDTO {
  @ApiProperty({ description: 'Whether the post is now liked or not' })
  @IsBoolean()
  liked: boolean;

  @ApiProperty({ required: false, description: 'The like object if the post was liked' })
  @IsOptional()
  @Allow()
  like?: BlogLikeDTO;

  @ApiProperty({ description: 'Success message' })
  @IsNotEmpty()
  @IsString()
  message: string;
}

// View DTOs
export class BlogViewDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @ValidateIf((o) => o.viewerId !== null)
  @IsString()
  viewerId: string | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty()
  @Allow()
  viewedAt: Date;

  @ApiProperty()
  @IsInt()
  @Min(0)
  viewTime: number;
}

export class CreateViewDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(86400) // Max 24 hours in seconds
  viewTime?: number;
}

// Category DTOs
export class BlogCategoryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

// Tag DTOs
export class BlogTagDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @Allow()
  createdAt: Date;
}

export class CreateTagDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
// Query DTOs
export class GetBlogPostsQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({value}) => value === 'true')
  featured?: boolean;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  query?: string;
}
