import { db } from "@/core/db/db";
import { safeQuery } from "../middleware/drizzle";
import { 
  blogPostsTable, 
  blogPostCategoriesTable,
  type BlogPost, 
  type NewBlogPost,
  type BlogPostCategory,
  type NewBlogPostCategory
} from "@/core/db/schema/blogPost";
import { 
  tagsTable,
  postTagsTable,
  type Tag,
  type NewTag,
  type PostTag,
  type NewPostTag
} from "@/core/db/schema/blogPostTag";
import { usersTable } from "@/core/db/schema/user";
import { and, count, desc, eq, sql, or, ilike } from "drizzle-orm";
import type { BlogPostCreationDTO, BlogPostUpdateDTO } from "../dto/blog";

export interface BlogPostWithDetails extends BlogPost {
  author: {
    id: string;
    username: string;
    email: string;
  } | null;
  category: BlogPostCategory | null;
  tags: Tag[];
}

export interface PaginatedBlogPosts {
  posts: BlogPostWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BlogProvider {
  // Blog Post CRUD Operations
  async createBlogPost(data: BlogPostCreationDTO): Promise<BlogPost> {
    const blogPostData: NewBlogPost = {
      title: data.title,
      description: data.description,
      content: data.content,
      authorId: data.authorId,
      categoryId: data.categoryId,
      isPublished: data.isPublished ?? false,
      isFeatured: data.isFeatured ?? false,
      publishedAt: data.isPublished ? new Date() : null,
      updatedAt: new Date(),
    };

    const [post] = await safeQuery(() =>
      db.insert(blogPostsTable).values(blogPostData).returning()
    );

    // Handle tags if provided
    if (data.tags && data.tags.length > 0) {
      const tagAssignments: NewPostTag[] = data.tags.map(tagId => ({
        postId: post.id,
        tagId: tagId,
      }));

      await safeQuery(() =>
        db.insert(postTagsTable).values(tagAssignments)
      );
    }

    return post;
  }

  async getBlogPostById(id: string): Promise<BlogPostWithDetails | null> {
    const [post] = await safeQuery(() =>
      db
        .select({
          post: blogPostsTable,
          author: {
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
          },
          category: blogPostCategoriesTable,
        })
        .from(blogPostsTable)
        .leftJoin(usersTable, eq(blogPostsTable.authorId, usersTable.id))
        .leftJoin(blogPostCategoriesTable, eq(blogPostsTable.categoryId, blogPostCategoriesTable.id))
        .where(eq(blogPostsTable.id, id))
    );

    if (!post) return null;

    // Get tags for this post
    const tags = await safeQuery(() =>
      db
        .select({ tag: tagsTable })
        .from(tagsTable)
        .innerJoin(postTagsTable, eq(tagsTable.id, postTagsTable.tagId))
        .where(eq(postTagsTable.postId, id))
    );

    return {
      ...post.post,
      author: post.author,
      category: post.category,
      tags: tags.map(t => t.tag),
    };
  }

  async getAllBlogPosts(
    page: number = 1,
    limit: number = 10,
    filters: {
      categoryId?: string;
      authorId?: string;
      isPublished?: boolean;
      isFeatured?: boolean;
      search?: string;
      tagId?: string;
    } = {}
  ): Promise<PaginatedBlogPosts> {
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (filters.categoryId) {
      whereConditions.push(eq(blogPostsTable.categoryId, filters.categoryId));
    }
    
    if (filters.authorId) {
      whereConditions.push(eq(blogPostsTable.authorId, filters.authorId));
    }
    
    if (filters.isPublished !== undefined) {
      whereConditions.push(eq(blogPostsTable.isPublished, filters.isPublished));
    }
    
    if (filters.isFeatured !== undefined) {
      whereConditions.push(eq(blogPostsTable.isFeatured, filters.isFeatured));
    }
    
    if (filters.search) {
      whereConditions.push(
        or(
          ilike(blogPostsTable.title, `%${filters.search}%`),
          ilike(blogPostsTable.description, `%${filters.search}%`),
          ilike(blogPostsTable.content, `%${filters.search}%`)
        )
      );
    }

    // Special handling for tag filter
    let baseQuery = db
      .select({
        post: blogPostsTable,
        author: {
          id: usersTable.id,
          username: usersTable.username,
          email: usersTable.email,
        },
        category: blogPostCategoriesTable,
      })
      .from(blogPostsTable)
      .leftJoin(usersTable, eq(blogPostsTable.authorId, usersTable.id))
      .leftJoin(blogPostCategoriesTable, eq(blogPostsTable.categoryId, blogPostCategoriesTable.id));

    if (filters.tagId) {
      baseQuery = baseQuery
        .innerJoin(postTagsTable, eq(blogPostsTable.id, postTagsTable.postId))
        .where(and(eq(postTagsTable.tagId, filters.tagId), ...whereConditions));
    } else {
      baseQuery = baseQuery.where(and(...whereConditions));
    }

    // Get total count
    let countQuery = db
      .select({ total: count() })
      .from(blogPostsTable);

    if (filters.tagId) {
      countQuery = countQuery
        .innerJoin(postTagsTable, eq(blogPostsTable.id, postTagsTable.postId))
        .where(and(eq(postTagsTable.tagId, filters.tagId), ...whereConditions));
    } else {
      countQuery = countQuery.where(and(...whereConditions));
    }

    const [{ total }] = await safeQuery(() => countQuery);

    // Get posts with details
    const posts = await safeQuery(() =>
      baseQuery
        .orderBy(desc(blogPostsTable.createdAt))
        .limit(limit)
        .offset(offset)
    );

    // Get tags for each post
    const postsWithTags: BlogPostWithDetails[] = await Promise.all(
      posts.map(async (post) => {
        const tags = await safeQuery(() =>
          db
            .select({ tag: tagsTable })
            .from(tagsTable)
            .innerJoin(postTagsTable, eq(tagsTable.id, postTagsTable.tagId))
            .where(eq(postTagsTable.postId, post.post.id))
        );

        return {
          ...post.post,
          author: post.author,
          category: post.category,
          tags: tags.map(t => t.tag),
        };
      })
    );

    return {
      posts: postsWithTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateBlogPost(id: string, data: BlogPostUpdateDTO): Promise<BlogPost | null> {
    const updateData: Partial<NewBlogPost> = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.isPublished && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const [post] = await safeQuery(() =>
      db
        .update(blogPostsTable)
        .set(updateData)
        .where(eq(blogPostsTable.id, id))
        .returning()
    );

    if (!post) return null;

    // Update tags if provided
    if (data.tags) {
      // Remove existing tags
      await safeQuery(() =>
        db.delete(postTagsTable).where(eq(postTagsTable.postId, id))
      );

      // Add new tags
      if (data.tags.length > 0) {
        const tagAssignments: NewPostTag[] = data.tags.map(tagId => ({
          postId: id,
          tagId: tagId,
        }));

        await safeQuery(() =>
          db.insert(postTagsTable).values(tagAssignments)
        );
      }
    }

    return post;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    // Delete tag associations first
    await safeQuery(() =>
      db.delete(postTagsTable).where(eq(postTagsTable.postId, id))
    );

    // Delete the blog post
    const result = await safeQuery(() =>
      db.delete(blogPostsTable).where(eq(blogPostsTable.id, id)).returning()
    );

    return result.length > 0;
  }

  // Category Operations
  async createCategory(data: NewBlogPostCategory): Promise<BlogPostCategory> {
    const [category] = await safeQuery(() =>
      db.insert(blogPostCategoriesTable).values(data).returning()
    );
    return category;
  }

  async getAllCategories(): Promise<BlogPostCategory[]> {
    return await safeQuery(() =>
      db.select().from(blogPostCategoriesTable).orderBy(blogPostCategoriesTable.name)
    );
  }

  async getCategoryById(id: string): Promise<BlogPostCategory | null> {
    const [category] = await safeQuery(() =>
      db
        .select()
        .from(blogPostCategoriesTable)
        .where(eq(blogPostCategoriesTable.id, id))
    );
    
    return category || null;
  }

  async updateCategory(id: string, data: Partial<NewBlogPostCategory>): Promise<BlogPostCategory | null> {
    const [category] = await safeQuery(() =>
      db
        .update(blogPostCategoriesTable)
        .set(data)
        .where(eq(blogPostCategoriesTable.id, id))
        .returning()
    );
    
    return category || null;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await safeQuery(() =>
      db.delete(blogPostCategoriesTable).where(eq(blogPostCategoriesTable.id, id)).returning()
    );
    return result.length > 0;
  }

  // Tag Operations
  async createTag(name: string): Promise<Tag> {
    const [tag] = await safeQuery(() =>
      db.insert(tagsTable).values({ name }).returning()
    );
    return tag;
  }

  async getAllTags(): Promise<Tag[]> {
    return await safeQuery(() =>
      db.select().from(tagsTable).orderBy(tagsTable.name)
    );
  }

  async getTagById(id: string): Promise<Tag | null> {
    const [tag] = await safeQuery(() =>
      db.select().from(tagsTable).where(eq(tagsTable.id, id))
    );
    
    return tag || null;
  }

  async updateTag(id: string, name: string): Promise<Tag | null> {
    const [tag] = await safeQuery(() =>
      db
        .update(tagsTable)
        .set({ name })
        .where(eq(tagsTable.id, id))
        .returning()
    );
    
    return tag || null;
  }

  async deleteTag(id: string): Promise<boolean> {
    // Remove tag associations first
    await safeQuery(() =>
      db.delete(postTagsTable).where(eq(postTagsTable.tagId, id))
    );

    // Delete the tag
    const result = await safeQuery(() =>
      db.delete(tagsTable).where(eq(tagsTable.id, id)).returning()
    );
    
    return result.length > 0;
  }

  async getPostsByTag(tagId: string, page: number = 1, limit: number = 10): Promise<PaginatedBlogPosts> {
    return this.getAllBlogPosts(page, limit, { tagId });
  }
}

export const blogProvider = new BlogProvider();
