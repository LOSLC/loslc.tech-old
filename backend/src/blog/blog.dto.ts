import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsUUID, IsArray, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// Blog Post DTOs
export class BlogPostDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  categoryId: string | null;

  @ApiProperty()
  coverImageId: string | null;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  archived: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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
  id: string;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  parentId: string | null;

  @ApiProperty()
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
  id: string;

  @ApiProperty()
  likerId: string;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  likedAt: Date;
}

export class ToggleLikeResponseDTO {
  @ApiProperty({ description: 'Whether the post is now liked or not' })
  liked: boolean;

  @ApiProperty({ required: false, description: 'The like object if the post was liked' })
  like?: BlogLikeDTO;

  @ApiProperty({ description: 'Success message' })
  message: string;
}

// View DTOs
export class BlogViewDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  viewerId: string | null;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  viewedAt: Date;

  @ApiProperty()
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
  id: string;

  @ApiProperty()
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
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
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
  offset?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  authorId?: string;
}
