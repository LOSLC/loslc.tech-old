import type { BlogPost } from "@/core/db/schema/blogPost";
import type { Tag } from "@/core/db/schema/blogPostTag";

export interface BlogPostCreationDTO {
  title: string;
  description?: string;
  content: string;
  authorId: string;
  tags?: string[]; // Array of tag IDs
  categoryId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export type BlogPostUpdateDTO = Partial<BlogPostCreationDTO>;
export type BlogPostTagDTO = Tag;
export type BlogPostDTO = BlogPost;
