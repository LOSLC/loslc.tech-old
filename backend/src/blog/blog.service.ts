import { AccessmgtService } from "@/accessmgt/accessmgt.service";
import { db } from "@/core/db/db";
import {
  blogPostsTable,
  blogPostCommentsTable,
  blogPostLikesTable,
  blogPostViewsTable,
  blogPostCategoriesTable,
  blogTagsTable,
  blogPostTagsTable,
  User,
  usersTable,
} from "@/core/db/schema";
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import {
  eq,
  and,
  desc,
  or,
  ilike,
  isNotNull,
  exists,
  count,
  SQL,
} from "drizzle-orm";
import {
  BlogPostDTO,
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
  BlogCommentDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
  BlogLikeDTO,
  BlogViewDTO,
  CreateViewDTO,
  BlogCategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  BlogTagDTO,
  CreateTagDTO,
  GetBlogPostsQueryDTO,
} from "./blog.dto";
import { checkConditions } from "@/common/checkers/utils";
import { Message } from "@/common/dto/message";

@Injectable()
export class BlogService {
  constructor(readonly accessManager: AccessmgtService) {}

  // Blog Post Methods
  async getBlogPosts(query: GetBlogPostsQueryDTO): Promise<BlogPostDTO[]> {
    const {
      offset,
      limit,
      categoryId,
      tag,
      featured,
      authorId,
      query: searchQuery,
    } = query;

    const whereConditions = [
      eq(blogPostsTable.published, true),
      eq(blogPostsTable.archived, false),
    ];

    if (categoryId) {
      whereConditions.push(eq(blogPostsTable.categoryId, categoryId));
    }
    if (featured !== undefined) {
      whereConditions.push(eq(blogPostsTable.featured, featured));
    }
    if (authorId) {
      whereConditions.push(eq(blogPostsTable.authorId, authorId));
    }

    if (searchQuery || tag) {
      let baseQuery = db
        .select({
          id: blogPostsTable.id,
          title: blogPostsTable.title,
          description: blogPostsTable.description,
          content: blogPostsTable.content,
          authorId: blogPostsTable.authorId,
          categoryId: blogPostsTable.categoryId,
          coverImageId: blogPostsTable.coverImageId,
          featured: blogPostsTable.featured,
          published: blogPostsTable.published,
          archived: blogPostsTable.archived,
          createdAt: blogPostsTable.createdAt,
          updatedAt: blogPostsTable.updatedAt,
        })
        .from(blogPostsTable)
        .leftJoin(usersTable, eq(usersTable.id, blogPostsTable.authorId));

      if (tag) {
        baseQuery = baseQuery
          .innerJoin(
            blogPostTagsTable,
            eq(blogPostTagsTable.postId, blogPostsTable.id),
          )
          .innerJoin(
            blogTagsTable,
            and(
              eq(blogTagsTable.id, blogPostTagsTable.tagId),
              eq(blogTagsTable.name, tag),
            ),
          );
      } else if (searchQuery) {
        baseQuery = baseQuery
          .leftJoin(
            blogPostTagsTable,
            eq(blogPostTagsTable.postId, blogPostsTable.id),
          )
          .leftJoin(
            blogTagsTable,
            eq(blogTagsTable.id, blogPostTagsTable.tagId),
          );
      }

      if (searchQuery) {
        const searchPattern = `%${searchQuery}%`;
        const searchConditions = or(
          ilike(blogPostsTable.title, searchPattern),
          ilike(blogPostsTable.description, searchPattern),
          ilike(blogPostsTable.content, searchPattern),
          ilike(usersTable.fullName, searchPattern),
          ilike(usersTable.username, searchPattern),
          ilike(blogTagsTable.name, searchPattern),
        );
        if (searchConditions) {
          whereConditions.push(searchConditions);
        }
      }

      const posts = await baseQuery
        .where(and(...whereConditions))
        .groupBy(
          blogPostsTable.id,
          blogPostsTable.title,
          blogPostsTable.description,
          blogPostsTable.content,
          blogPostsTable.authorId,
          blogPostsTable.categoryId,
          blogPostsTable.coverImageId,
          blogPostsTable.featured,
          blogPostsTable.published,
          blogPostsTable.archived,
          blogPostsTable.createdAt,
          blogPostsTable.updatedAt,
        )
        .orderBy(desc(blogPostsTable.createdAt))
        .offset(offset ?? 0)
        .limit(limit ?? 10);

      return posts;
    }
    const posts = await db
      .select({
        id: blogPostsTable.id,
        title: blogPostsTable.title,
        description: blogPostsTable.description,
        content: blogPostsTable.content,
        authorId: blogPostsTable.authorId,
        categoryId: blogPostsTable.categoryId,
        coverImageId: blogPostsTable.coverImageId,
        featured: blogPostsTable.featured,
        published: blogPostsTable.published,
        archived: blogPostsTable.archived,
        createdAt: blogPostsTable.createdAt,
        updatedAt: blogPostsTable.updatedAt,
      })
      .from(blogPostsTable)
      .where(and(...whereConditions))
      .orderBy(desc(blogPostsTable.createdAt))
      .offset(offset ?? 0)
      .limit(limit ?? 10);

    return posts;
  }

  async getAllBlogPosts(
    query: GetBlogPostsQueryDTO,
    user: User,
  ): Promise<BlogPostDTO[]> {
    await this.accessManager.checkPermissions({
      permissions: [
        {
          action: "r",
          resource: "blogpost",
        },
        {
          action: "rw",
          resource: "blogpost",
        },
      ],
      bypassRole: {
        roleName: "admin",
      },
      user,
    });

    const {
      offset,
      limit,
      categoryId,
      tag,
      featured,
      authorId,
      query: searchQuery,
    } = query;

    const whereConditions: SQL<unknown>[] = [];

    if (categoryId) {
      whereConditions.push(eq(blogPostsTable.categoryId, categoryId));
    }
    if (featured !== undefined) {
      whereConditions.push(eq(blogPostsTable.featured, featured));
    }
    if (authorId) {
      whereConditions.push(eq(blogPostsTable.authorId, authorId));
    }

    // If there's a search query, we need to use joins to search across all fields
    if (searchQuery || tag) {
      let baseQuery = db
        .select({
          id: blogPostsTable.id,
          title: blogPostsTable.title,
          description: blogPostsTable.description,
          content: blogPostsTable.content,
          authorId: blogPostsTable.authorId,
          categoryId: blogPostsTable.categoryId,
          coverImageId: blogPostsTable.coverImageId,
          featured: blogPostsTable.featured,
          published: blogPostsTable.published,
          archived: blogPostsTable.archived,
          createdAt: blogPostsTable.createdAt,
          updatedAt: blogPostsTable.updatedAt,
        })
        .from(blogPostsTable)
        .leftJoin(usersTable, eq(usersTable.id, blogPostsTable.authorId));

      // Add tag joins if needed
      if (tag) {
        baseQuery = baseQuery
          .innerJoin(
            blogPostTagsTable,
            eq(blogPostTagsTable.postId, blogPostsTable.id),
          )
          .innerJoin(
            blogTagsTable,
            and(
              eq(blogTagsTable.id, blogPostTagsTable.tagId),
              eq(blogTagsTable.name, tag),
            ),
          );
      } else if (searchQuery) {
        // Left join tags for searching in tag names
        baseQuery = baseQuery
          .leftJoin(
            blogPostTagsTable,
            eq(blogPostTagsTable.postId, blogPostsTable.id),
          )
          .leftJoin(
            blogTagsTable,
            eq(blogTagsTable.id, blogPostTagsTable.tagId),
          );
      }

      // Add search conditions if searchQuery is provided
      if (searchQuery) {
        const searchPattern = `%${searchQuery}%`;
        const searchConditions = or(
          ilike(blogPostsTable.title, searchPattern),
          ilike(blogPostsTable.description, searchPattern),
          ilike(blogPostsTable.content, searchPattern),
          ilike(usersTable.fullName, searchPattern),
          ilike(usersTable.username, searchPattern),
          ilike(blogTagsTable.name, searchPattern),
        );
        if (searchConditions) {
          whereConditions.push(searchConditions);
        }
      }

      const posts = await baseQuery
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .groupBy(
          blogPostsTable.id,
          blogPostsTable.title,
          blogPostsTable.description,
          blogPostsTable.content,
          blogPostsTable.authorId,
          blogPostsTable.categoryId,
          blogPostsTable.coverImageId,
          blogPostsTable.featured,
          blogPostsTable.published,
          blogPostsTable.archived,
          blogPostsTable.createdAt,
          blogPostsTable.updatedAt,
        )
        .orderBy(desc(blogPostsTable.createdAt))
        .offset(offset ?? 0)
        .limit(limit ?? 10);

      return posts;
    }

    const posts = await db
      .select({
        id: blogPostsTable.id,
        title: blogPostsTable.title,
        description: blogPostsTable.description,
        content: blogPostsTable.content,
        authorId: blogPostsTable.authorId,
        categoryId: blogPostsTable.categoryId,
        coverImageId: blogPostsTable.coverImageId,
        featured: blogPostsTable.featured,
        published: blogPostsTable.published,
        archived: blogPostsTable.archived,
        createdAt: blogPostsTable.createdAt,
        updatedAt: blogPostsTable.updatedAt,
      })
      .from(blogPostsTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(blogPostsTable.createdAt))
      .offset(offset ?? 0)
      .limit(limit ?? 10);

    return posts;
  }

  async getPopularBlogPosts({
    offset,
    limit,
  }: { offset: number; limit: number }) {
    const posts = await db
      .select({
        id: blogPostsTable.id,
        title: blogPostsTable.title,
        description: blogPostsTable.description,
        content: blogPostsTable.content,
        authorId: blogPostsTable.authorId,
        categoryId: blogPostsTable.categoryId,
        coverImageId: blogPostsTable.coverImageId,
        featured: blogPostsTable.featured,
        published: blogPostsTable.published,
        archived: blogPostsTable.archived,
        createdAt: blogPostsTable.createdAt,
        updatedAt: blogPostsTable.updatedAt,
      })
      .from(blogPostsTable)
      .leftJoin(
        blogPostViewsTable,
        eq(blogPostViewsTable.postId, blogPostsTable.id),
      )
      .where(
        and(
          eq(blogPostsTable.published, true),
          eq(blogPostsTable.archived, false),
        ),
      )
      .orderBy(desc(count(blogPostsTable.createdAt)))
      .offset(offset ?? 0)
      .limit(limit ?? 10);

    return posts;
  }

  async getBlogPostById(id: string, optionalUser?: User): Promise<BlogPostDTO> {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, id))
      .limit(1);

    checkConditions({
      conditions: [!!post],
      message: "Blog post not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    if (post.archived || !post.published) {
      if (!optionalUser) {
        throw new NotFoundException("Blog post not accessible");
      }

      // Check if user is author or has permissions
      if (post.authorId !== optionalUser.id) {
        await this.accessManager.checkPermissions({
          permissions: [
            {
              action: "r",
              resource: "blogpost",
              resourceId: id,
            },
            {
              action: "rw",
              resource: "blogpost",
              resourceId: id,
            },
          ],
          bypassRole: {
            roleName: "admin",
          },
          user: optionalUser,
          either: true,
        });
      }
    }

    return {
      id: post.id,
      title: post.title,
      description: post.description,
      content: post.content,
      authorId: post.authorId,
      categoryId: post.categoryId,
      coverImageId: post.coverImageId,
      featured: post.featured,
      published: post.published,
      archived: post.archived,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async createBlogPost(
    data: CreateBlogPostDTO,
    author: User,
  ): Promise<BlogPostDTO> {
    // Check if user has general permission to create blog posts
    // If not, we can still allow users to create their own posts
    try {
      await this.accessManager.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "blogpost",
          },
        ],
        user: author,
      });
    } catch (error) {
      // If user doesn't have general permission, we'll still allow them to create their own post
      // The role/permission will be created below to give them access to their own post
    }

    const postData = {
      title: data.title,
      description: data.description,
      content: data.content,
      authorId: author.id,
      categoryId: data.categoryId || null,
      coverImageId: data.coverImageId || null,
      featured: data.featured || false,
      published: data.published || false,
      archived: false,
    };

    const [post] = await db.insert(blogPostsTable).values(postData).returning();

    // Create specific role and permission for this post and assign to author
    const rwRole = await this.accessManager.createRole({
      name: `blogpost-${post.id}-rw`,
      description: `Read/Write access for blog post ${post.id}`,
    });
    const rwPermission = await this.accessManager.createPermission({
      name: `blogpost-${post.id}-rw`,
      description: `Read/Write permission for blog post ${post.id}`,
      action: "rw",
      resource: "blogpost",
      resourceId: post.id,
    });
    await this.accessManager.assignRoleToUser({
      roleId: rwRole.id,
      userId: author.id,
    });
    await this.accessManager.assignPermissionToRole({
      permissionId: rwPermission.id,
      roleId: rwRole.id,
    });

    // Handle tags if provided
    if (data.tags && data.tags.length > 0) {
      await this.addTagsToPost(post.id, data.tags, author);
    }

    return {
      id: post.id,
      title: post.title,
      description: post.description,
      content: post.content,
      authorId: post.authorId,
      categoryId: post.categoryId,
      coverImageId: post.coverImageId,
      featured: post.featured,
      published: post.published,
      archived: post.archived,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async updateBlogPost(
    id: string,
    data: UpdateBlogPostDTO,
    user: User,
  ): Promise<BlogPostDTO> {
    const [existingPost] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, id))
      .limit(1);

    checkConditions({
      conditions: [!!existingPost],
      message: "Blog post not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    // Check if user is author or has permissions
    if (existingPost.authorId !== user.id) {
      await this.accessManager.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "blogpost",
            resourceId: id,
          },
        ],
        bypassRole: {
          roleName: "admin",
        },
        user,
      });
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const [updatedPost] = await db
      .update(blogPostsTable)
      .set(updateData)
      .where(eq(blogPostsTable.id, id))
      .returning();

    // Handle tags if provided
    if (data.tags) {
      // Remove existing tags
      await db
        .delete(blogPostTagsTable)
        .where(eq(blogPostTagsTable.postId, id));
      // Add new tags
      if (data.tags.length > 0) {
        await this.addTagsToPost(id, data.tags, user);
      }
    }

    return {
      id: updatedPost.id,
      title: updatedPost.title,
      description: updatedPost.description,
      content: updatedPost.content,
      authorId: updatedPost.authorId,
      categoryId: updatedPost.categoryId,
      coverImageId: updatedPost.coverImageId,
      featured: updatedPost.featured,
      published: updatedPost.published,
      archived: updatedPost.archived,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  }

  async deleteBlogPost(id: string, user: User): Promise<Message> {
    const [existingPost] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, id))
      .limit(1);

    checkConditions({
      conditions: [!!existingPost],
      message: "Blog post not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    // Check if user is author or has permissions
    if (existingPost.authorId !== user.id) {
      await this.accessManager.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "blogpost",
            resourceId: id,
          },
        ],
        bypassRole: {
          roleName: "admin",
        },
        user,
      });
    }

    // Delete the blog post
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));

    return { message: "Blog post deleted successfully" };
  }

  // Comment Methods
  async getPostComments(postId: string): Promise<BlogCommentDTO[]> {
    const comments = await db
      .select()
      .from(blogPostCommentsTable)
      .where(eq(blogPostCommentsTable.postId, postId));

    return comments;
  }

  async createComment(
    postId: string,
    data: CreateCommentDTO,
    author: User,
  ): Promise<BlogCommentDTO> {
    // Verify post exists and is accessible
    await this.getBlogPostById(postId);

    const commentData = {
      postId,
      authorId: author.id,
      parentId: data.parentId || null,
      content: data.content,
    };

    const [comment] = await db
      .insert(blogPostCommentsTable)
      .values(commentData)
      .returning();

    // Create specific role and permission for this comment and assign to author
    const rwRole = await this.accessManager.createRole({
      name: `blogcomment-${comment.id}-rw`,
      description: `Read/Write access for blog comment ${comment.id}`,
    });
    const rwPermission = await this.accessManager.createPermission({
      name: `blogcomment-${comment.id}-rw`,
      description: `Read/Write permission for blog comment ${comment.id}`,
      action: "rw",
      resource: "blogcomment",
      resourceId: comment.id,
    });
    await this.accessManager.assignRoleToUser({
      roleId: rwRole.id,
      userId: author.id,
    });
    await this.accessManager.assignPermissionToRole({
      permissionId: rwPermission.id,
      roleId: rwRole.id,
    });

    return comment;
  }

  async updateComment(
    commentId: string,
    data: UpdateCommentDTO,
    user: User,
  ): Promise<BlogCommentDTO> {
    const [existingComment] = await db
      .select()
      .from(blogPostCommentsTable)
      .where(eq(blogPostCommentsTable.id, commentId))
      .limit(1);

    checkConditions({
      conditions: [!!existingComment],
      message: "Comment not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    // Check if user is author or has permissions
    if (existingComment.authorId !== user.id) {
      await this.accessManager.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "blogcomment",
            resourceId: commentId,
          },
        ],
        bypassRole: {
          roleName: "admin",
        },
        user,
      });
    }

    const [updatedComment] = await db
      .update(blogPostCommentsTable)
      .set({ content: data.content })
      .where(eq(blogPostCommentsTable.id, commentId))
      .returning();

    return updatedComment;
  }

  async deleteComment(commentId: string, user: User): Promise<Message> {
    const [existingComment] = await db
      .select()
      .from(blogPostCommentsTable)
      .where(eq(blogPostCommentsTable.id, commentId))
      .limit(1);

    checkConditions({
      conditions: [!!existingComment],
      message: "Comment not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    // Check if user is author or has permissions
    if (existingComment.authorId !== user.id) {
      await this.accessManager.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "blogcomment",
            resourceId: commentId,
          },
        ],
        bypassRole: {
          roleName: "admin",
        },
        user,
      });
    }

    await db
      .delete(blogPostCommentsTable)
      .where(eq(blogPostCommentsTable.id, commentId));
    return { message: "Comment deleted successfully" };
  }

  async toggleLike(
    postId: string,
    user: User,
  ): Promise<{ liked: boolean; like?: BlogLikeDTO; message: string }> {
    // Verify post exists
    await this.getBlogPostById(postId);

    const [existingLike] = await db
      .select()
      .from(blogPostLikesTable)
      .where(
        and(
          eq(blogPostLikesTable.postId, postId),
          eq(blogPostLikesTable.likerId, user.id),
        ),
      )
      .limit(1);

    if (existingLike) {
      // Unlike the post
      await db
        .delete(blogPostLikesTable)
        .where(
          and(
            eq(blogPostLikesTable.postId, postId),
            eq(blogPostLikesTable.likerId, user.id),
          ),
        );

      return {
        liked: false,
        message: "Post unliked successfully",
      };
    }
    // Like the post
    const [like] = await db
      .insert(blogPostLikesTable)
      .values({
        postId,
        likerId: user.id,
      })
      .returning();

    // Create specific role and permission for this like and assign to user
    const rwRole = await this.accessManager.createRole({
      name: `bloglike-${like.id}-rw`,
      description: `Read/Write access for blog like ${like.id}`,
    });
    const rwPermission = await this.accessManager.createPermission({
      name: `bloglike-${like.id}-rw`,
      description: `Read/Write permission for blog like ${like.id}`,
      action: "rw",
      resource: "bloglike",
      resourceId: like.id,
    });
    await this.accessManager.assignRoleToUser({
      roleId: rwRole.id,
      userId: user.id,
    });
    await this.accessManager.assignPermissionToRole({
      permissionId: rwPermission.id,
      roleId: rwRole.id,
    });

    return {
      liked: true,
      like,
      message: "Post liked successfully",
    };
  }

  async hasLiked(postId: string, user: User): Promise<boolean> {
    const [existingLike] = await db
      .select()
      .from(blogPostLikesTable)
      .where(
        and(
          eq(blogPostLikesTable.postId, postId),
          eq(blogPostLikesTable.likerId, user.id),
        ),
      )
      .limit(1);

    return !!existingLike;
  }

  async getPostLikes(postId: string): Promise<BlogLikeDTO[]> {
    const likes = await db
      .select()
      .from(blogPostLikesTable)
      .where(eq(blogPostLikesTable.postId, postId));

    return likes;
  }

  // View Methods
  async recordView(
    postId: string,
    data: CreateViewDTO,
    user?: User,
  ): Promise<BlogViewDTO> {
    // Verify post exists
    await this.getBlogPostById(postId);

    const viewData = {
      postId,
      viewerId: user?.id || null,
      viewTime: data.viewTime || 0,
    };

    const [view] = await db
      .insert(blogPostViewsTable)
      .values(viewData)
      .returning();

    // Create specific role and permission for this view if user is provided
    if (user) {
      const rwRole = await this.accessManager.createRole({
        name: `blogview-${view.id}-rw`,
        description: `Read/Write access for blog view ${view.id}`,
      });
      const rwPermission = await this.accessManager.createPermission({
        name: `blogview-${view.id}-rw`,
        description: `Read/Write permission for blog view ${view.id}`,
        action: "rw",
        resource: "blogview",
        resourceId: view.id,
      });
      await this.accessManager.assignRoleToUser({
        roleId: rwRole.id,
        userId: user.id,
      });
      await this.accessManager.assignPermissionToRole({
        permissionId: rwPermission.id,
        roleId: rwRole.id,
      });
    }

    return view;
  }

  // Category Methods
  async getCategories(): Promise<BlogCategoryDTO[]> {
    const categories = await db.select().from(blogPostCategoriesTable);
    return categories;
  }

  async createCategory(
    data: CreateCategoryDTO,
    user: User,
  ): Promise<BlogCategoryDTO> {
    await this.accessManager.checkPermissions({
      permissions: [
        {
          action: "rw",
          resource: "blogcategory",
        },
      ],
      user,
      bypassRole: { roleName: "admin" },
    });

    const [category] = await db
      .insert(blogPostCategoriesTable)
      .values(data)
      .returning();

    // Create role and permission for this category
    const rwRole = await this.accessManager.createRole({
      name: `blogcategory-${category.id}-rw`,
      description: `Read/Write access for blog category ${category.id}`,
    });
    const rwPermission = await this.accessManager.createPermission({
      name: `blogcategory-${category.id}-rw`,
      description: `Read/Write permission for blog category ${category.id}`,
      action: "rw",
      resource: "blogcategory",
      resourceId: category.id,
    });
    await this.accessManager.assignRoleToUser({
      roleId: rwRole.id,
      userId: user.id,
    });
    await this.accessManager.assignPermissionToRole({
      permissionId: rwPermission.id,
      roleId: rwRole.id,
    });

    return category;
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryDTO,
    user: User,
  ): Promise<BlogCategoryDTO> {
    await this.accessManager.checkPermissions({
      permissions: [
        {
          action: "rw",
          resource: "blogcategory",
          resourceId: id,
        },
      ],
      user,
    });

    const [updatedCategory] = await db
      .update(blogPostCategoriesTable)
      .set(data)
      .where(eq(blogPostCategoriesTable.id, id))
      .returning();

    checkConditions({
      conditions: [!!updatedCategory],
      message: "Category not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    return updatedCategory;
  }

  async deleteCategory(id: string, user: User): Promise<Message> {
    await this.accessManager.checkPermissions({
      permissions: [
        {
          action: "rw",
          resource: "blogcategory",
          resourceId: id,
        },
      ],
      user,
    });

    const [deletedCategory] = await db
      .delete(blogPostCategoriesTable)
      .where(eq(blogPostCategoriesTable.id, id))
      .returning();

    checkConditions({
      conditions: [!!deletedCategory],
      message: "Category not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    return { message: "Category deleted successfully" };
  }

  // Tag Methods
  async getTags(userId?: string): Promise<BlogTagDTO[]> {
    if (userId) {
      const tags = await db
        .select()
        .from(blogTagsTable)
        .where(eq(blogTagsTable.userId, userId));
      return tags;
    }
    const tags = await db.select().from(blogTagsTable);
    return tags;
  }

  async createTag(data: CreateTagDTO, user: User): Promise<BlogTagDTO> {
    const [tag] = await db
      .insert(blogTagsTable)
      .values({
        name: data.name,
        userId: user.id,
      })
      .returning();

    // Create specific role and permission for this tag and assign to user
    const rwRole = await this.accessManager.createRole({
      name: `blogtag-${tag.id}-rw`,
      description: `Read/Write access for blog tag ${tag.id}`,
    });
    const rwPermission = await this.accessManager.createPermission({
      name: `blogtag-${tag.id}-rw`,
      description: `Read/Write permission for blog tag ${tag.id}`,
      action: "rw",
      resource: "blogtag",
      resourceId: tag.id,
    });
    await this.accessManager.assignRoleToUser({
      roleId: rwRole.id,
      userId: user.id,
    });
    await this.accessManager.assignPermissionToRole({
      permissionId: rwPermission.id,
      roleId: rwRole.id,
    });

    return tag;
  }

  async updateTag(
    id: string,
    data: CreateTagDTO,
    user: User,
  ): Promise<BlogTagDTO> {
    const [existingTag] = await db
      .select()
      .from(blogTagsTable)
      .where(eq(blogTagsTable.id, id))
      .limit(1);

    checkConditions({
      conditions: [!!existingTag],
      message: "Tag not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    // Check if user is creator or has permissions
    if (existingTag.userId !== user.id) {
      await this.accessManager.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "blogtag",
            resourceId: id,
          },
        ],
        bypassRole: {
          roleName: "admin",
        },
        user,
      });
    }

    const [updatedTag] = await db
      .update(blogTagsTable)
      .set({ name: data.name })
      .where(eq(blogTagsTable.id, id))
      .returning();

    return updatedTag;
  }

  async deleteTag(id: string, user: User): Promise<Message> {
    const [existingTag] = await db
      .select()
      .from(blogTagsTable)
      .where(eq(blogTagsTable.id, id))
      .limit(1);

    checkConditions({
      conditions: [!!existingTag],
      message: "Tag not found",
      statusCode: HttpStatus.NOT_FOUND,
    });

    // Check if user is creator or has permissions
    if (existingTag.userId !== user.id) {
      await this.accessManager.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "blogtag",
            resourceId: id,
          },
        ],
        bypassRole: {
          roleName: "admin",
        },
        user,
      });
    }

    await db.delete(blogTagsTable).where(eq(blogTagsTable.id, id));
    return { message: "Tag deleted successfully" };
  }

  async getPostTags(postId: string): Promise<BlogTagDTO[]> {
    const tags = await db
      .select({
        id: blogTagsTable.id,
        name: blogTagsTable.name,
        userId: blogTagsTable.userId,
        createdAt: blogTagsTable.createdAt,
      })
      .from(blogTagsTable)
      .innerJoin(
        blogPostTagsTable,
        eq(blogPostTagsTable.tagId, blogTagsTable.id),
      )
      .where(eq(blogPostTagsTable.postId, postId));

    return tags;
  }

  // Helper Methods
  private async addTagsToPost(
    postId: string,
    tagNames: string[],
    user: User,
  ): Promise<void> {
    for (const tagName of tagNames) {
      // Try to find existing tag
      let [existingTag] = await db
        .select()
        .from(blogTagsTable)
        .where(
          and(
            eq(blogTagsTable.name, tagName),
            eq(blogTagsTable.userId, user.id),
          ),
        )
        .limit(1);

      // Create tag if it doesn't exist
      if (!existingTag) {
        [existingTag] = await db
          .insert(blogTagsTable)
          .values({
            name: tagName,
            userId: user.id,
          })
          .returning();
      }

      // Link tag to post
      await db
        .insert(blogPostTagsTable)
        .values({
          postId,
          tagId: existingTag.id,
        })
        .onConflictDoNothing();
    }
  }

  async getRelatedPosts({
    tagId,
    limit,
    offset,
  }: { tagId: string; limit?: number; offset?: number }) {
    const [tag] = await db
      .select()
      .from(blogTagsTable)
      .where(eq(blogTagsTable.id, tagId))
      .limit(1);
    checkConditions({
      conditions: [!!tag],
      message: "Tag not found",
      statusCode: HttpStatus.NOT_FOUND,
    });
    const relatedPosts: BlogPostDTO[] = await db
      .select({
        id: blogPostsTable.id,
        title: blogPostsTable.title,
        description: blogPostsTable.description,
        content: blogPostsTable.content,
        authorId: blogPostsTable.authorId,
        categoryId: blogPostsTable.categoryId,
        coverImageId: blogPostsTable.coverImageId,
        featured: blogPostsTable.featured,
        published: blogPostsTable.published,
        archived: blogPostsTable.archived,
        createdAt: blogPostsTable.createdAt,
        updatedAt: blogPostsTable.updatedAt,
      })
      .from(blogPostsTable)
      .innerJoin(
        blogPostTagsTable,
        and(
          eq(blogPostTagsTable.tagId, tagId),
          eq(blogPostTagsTable.postId, blogPostsTable.id),
        ),
      )
      .where(
        and(
          eq(blogPostsTable.published, true),
          eq(blogPostsTable.archived, false),
        ),
      )
      .orderBy(desc(blogPostsTable.createdAt))
      .offset(offset ?? 0)
      .limit(limit ?? 10);
    return relatedPosts;
  }
}
