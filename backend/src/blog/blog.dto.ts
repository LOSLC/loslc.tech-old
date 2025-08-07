import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsUUID, IsArray, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type, Expose } from "class-transformer";

// Blog Post DTOs
export class BlogPostDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  authorId: string;

  @ApiProperty()
  @Expose()
  categoryId: string | null;

  @ApiProperty()
  @Expose()
  coverImageId: string | null;

  @ApiProperty()
  @Expose()
  featured: boolean;

  @ApiProperty()
  @Expose()
  published: boolean;

  @ApiProperty()
  @Expose()
  archived: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date | null;
}

export class CreateBlogPostDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  content: string;

  @IsOptional()
  @IsUUID()
  @Expose()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  @Expose()
  coverImageId?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  tags?: string[];
}

export class UpdateBlogPostDTO {
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsOptional()
  @IsString()
  @Expose()
  content?: string;

  @IsOptional()
  @IsUUID()
  @Expose()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  @Expose()
  coverImageId?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  archived?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  tags?: string[];
}

// Comment DTOs
export class BlogCommentDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  postId: string;

  @ApiProperty()
  @Expose()
  authorId: string;

  @ApiProperty()
  @Expose()
  parentId: string | null;

  @ApiProperty()
  @Expose()
  content: string;
}

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  content: string;

  @IsOptional()
  @IsUUID()
  @Expose()
  parentId?: string;
}

export class UpdateCommentDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  content: string;
}

// Like DTOs
export class BlogLikeDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  likerId: string;

  @ApiProperty()
  @Expose()
  postId: string;

  @ApiProperty()
  @Expose()
  likedAt: Date;
}

export class ToggleLikeResponseDTO {
  @ApiProperty({ description: 'Whether the post is now liked or not' })
  @Expose()
  liked: boolean;

  @ApiProperty({ required: false, description: 'The like object if the post was liked' })
  @Expose()
  like?: BlogLikeDTO;

  @ApiProperty({ description: 'Success message' })
  @Expose()
  message: string;
}

// View DTOs
export class BlogViewDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  viewerId: string | null;

  @ApiProperty()
  @Expose()
  postId: string;

  @ApiProperty()
  @Expose()
  viewedAt: Date;

  @ApiProperty()
  @Expose()
  viewTime: number;
}

export class CreateViewDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(86400) // Max 24 hours in seconds
  @Expose()
  viewTime?: number;
}

// Category DTOs
export class BlogCategoryDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
}

export class UpdateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
}

// Tag DTOs
export class BlogTagDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class CreateTagDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
}
// Query DTOs
export class GetBlogPostsQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @Expose()
  offset?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @Expose()
  limit?: number = 20;

  @IsOptional()
  @IsUUID()
  @Expose()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @Expose()
  tag?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({value}) => value === 'true')
  @Expose()
  featured?: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  authorId?: string;

  @IsOptional()
  @IsString()
  @Expose()
  query?: string;
}
