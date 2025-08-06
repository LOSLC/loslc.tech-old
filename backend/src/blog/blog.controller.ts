import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import {
  BlogPostDTO,
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
  BlogCommentDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
  BlogLikeDTO,
  ToggleLikeResponseDTO,
  BlogCategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  BlogTagDTO,
  CreateTagDTO,
  GetBlogPostsQueryDTO,
} from "./blog.dto";
import { User, OptionalUser } from "@/common/decorators/user.decorator";
import { AuthGuard } from "@/auth/auth.guard";
import { User as DBUser } from "@/core/db/schema";
import { Message } from "@/common/dto/message";

@ApiTags("Blog")
@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Blog Post Endpoints
  @Get("posts")
  @ApiOperation({ summary: "Get blog posts with optional filters" })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "Number of posts to skip",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of posts to return",
  })
  @ApiQuery({
    name: "categoryId",
    required: false,
    type: String,
    description: "Filter by category ID",
  })
  @ApiQuery({
    name: "tag",
    required: false,
    type: String,
    description: "Filter by tag name",
  })
  @ApiQuery({
    name: "featured",
    required: false,
    type: Boolean,
    description: "Filter by featured status",
  })
  @ApiQuery({
    name: "authorId",
    required: false,
    type: String,
    description: "Filter by author ID",
  })
  @ApiQuery({
    name: "query",
    required: false,
    type: String,
    description: "Search in title, description, content, tags, and author name",
  })
  @ApiResponse({
    status: 200,
    description: "List of blog posts",
    type: [BlogPostDTO],
  })
  async getBlogPosts(
    @Query() query: GetBlogPostsQueryDTO,
  ): Promise<BlogPostDTO[]> {
    return await this.blogService.getBlogPosts(query);
  }

  @Get("admin/posts")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all blog posts (including drafts and archived) - Admin only" })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "Number of posts to skip",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of posts to return",
  })
  @ApiQuery({
    name: "categoryId",
    required: false,
    type: String,
    description: "Filter by category ID",
  })
  @ApiQuery({
    name: "tag",
    required: false,
    type: String,
    description: "Filter by tag name",
  })
  @ApiQuery({
    name: "featured",
    required: false,
    type: Boolean,
    description: "Filter by featured status",
  })
  @ApiQuery({
    name: "authorId",
    required: false,
    type: String,
    description: "Filter by author ID",
  })
  @ApiQuery({
    name: "query",
    required: false,
    type: String,
    description: "Search in title, description, content, tags, and author name",
  })
  @ApiResponse({
    status: 200,
    description: "List of all blog posts (including drafts and archived)",
    type: [BlogPostDTO],
  })
  @ApiResponse({ status: 403, description: "Access denied - Admin permission required" })
  async getAllBlogPosts(
    @Query() query: GetBlogPostsQueryDTO,
    @User() user: DBUser,
  ): Promise<BlogPostDTO[]> {
    return await this.blogService.getAllBlogPosts(query, user);
  }

  @Get("posts/:id")
  @ApiOperation({ summary: "Get a blog post by ID" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  @ApiResponse({
    status: 200,
    description: "Blog post details",
    type: BlogPostDTO,
  })
  @ApiResponse({ status: 404, description: "Blog post not found" })
  async getBlogPostById(
    @Param("id") id: string,
    @OptionalUser() user?: DBUser,
  ): Promise<BlogPostDTO> {
    return await this.blogService.getBlogPostById(id, user);
  }

  @Get("posts/popular")
  @ApiOperation({ summary: "Get popular blog posts" })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of popular posts to return (default: 10)",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "Number of posts to skip for pagination (default: 0)",
  })
  @ApiResponse({
    status: 200,
    description: "List of popular blog posts",
    type: [BlogPostDTO],
  })
  async getPopularPosts(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<BlogPostDTO[]> {
    return await this.blogService.getPopularBlogPosts({
      limit: limit ?? 10,
      offset: offset ?? 0,
    });
  }

  @Post("posts")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new blog post" })
  @ApiBody({
    type: CreateBlogPostDTO,
    examples: {
      example1: {
        summary: "Create blog post example",
        value: {
          title: "My First Blog Post",
          description: "This is a short description of my blog post",
          content: "This is the full content of my blog post...",
          categoryId: "uuid-category-id",
          coverImageId: "uuid-image-id",
          featured: false,
          published: true,
          tags: ["javascript", "web-development"],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Blog post created successfully",
    type: BlogPostDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  async createBlogPost(
    @Body() createBlogPostDto: CreateBlogPostDTO,
    @User() user: DBUser,
  ): Promise<BlogPostDTO> {
    return await this.blogService.createBlogPost(createBlogPostDto, user);
  }

  @Put("posts/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a blog post" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  @ApiBody({
    type: UpdateBlogPostDTO,
    examples: {
      example1: {
        summary: "Update blog post example",
        value: {
          title: "Updated Blog Post Title",
          description: "Updated description",
          content: "Updated content...",
          published: true,
          featured: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Blog post updated successfully",
    type: BlogPostDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - not the author or insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Blog post not found" })
  async updateBlogPost(
    @Param("id") id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDTO,
    @User() user: DBUser,
  ): Promise<BlogPostDTO> {
    return await this.blogService.updateBlogPost(id, updateBlogPostDto, user);
  }

  @Delete("posts/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a blog post" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  @ApiResponse({
    status: 200,
    description: "Blog post deleted successfully",
    type: Message,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - not the author or insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Blog post not found" })
  async deleteBlogPost(
    @Param("id") id: string,
    @User() user: DBUser,
  ): Promise<Message> {
    return await this.blogService.deleteBlogPost(id, user);
  }

  // Comment Endpoints
  @Get("posts/:postId/comments")
  @ApiOperation({ summary: "Get comments for a blog post" })
  @ApiParam({ name: "postId", description: "Blog post ID" })
  @ApiResponse({
    status: 200,
    description: "List of comments",
    type: [BlogCommentDTO],
  })
  async getPostComments(
    @Param("postId") postId: string,
  ): Promise<BlogCommentDTO[]> {
    return await this.blogService.getPostComments(postId);
  }

  @Post("posts/:postId/comments")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a comment on a blog post" })
  @ApiParam({ name: "postId", description: "Blog post ID" })
  @ApiBody({
    type: CreateCommentDTO,
    examples: {
      example1: {
        summary: "Create comment example",
        value: {
          content: "This is a great blog post! Thanks for sharing.",
          parentId: "uuid-parent-comment-id",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Comment created successfully",
    type: BlogCommentDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Blog post not found" })
  async createComment(
    @Param("postId") postId: string,
    @Body() createCommentDto: CreateCommentDTO,
    @User() user: DBUser,
  ): Promise<BlogCommentDTO> {
    return await this.blogService.createComment(postId, createCommentDto, user);
  }

  @Put("comments/:commentId")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a comment" })
  @ApiParam({ name: "commentId", description: "Comment ID" })
  @ApiBody({
    type: UpdateCommentDTO,
    examples: {
      example1: {
        summary: "Update comment example",
        value: {
          content: "Updated comment content",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Comment updated successfully",
    type: BlogCommentDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - not the author or insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Comment not found" })
  async updateComment(
    @Param("commentId") commentId: string,
    @Body() updateCommentDto: UpdateCommentDTO,
    @User() user: DBUser,
  ): Promise<BlogCommentDTO> {
    return await this.blogService.updateComment(
      commentId,
      updateCommentDto,
      user,
    );
  }

  @Delete("comments/:commentId")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a comment" })
  @ApiParam({ name: "commentId", description: "Comment ID" })
  @ApiResponse({
    status: 200,
    description: "Comment deleted successfully",
    type: Message,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - not the author or insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Comment not found" })
  async deleteComment(
    @Param("commentId") commentId: string,
    @User() user: DBUser,
  ): Promise<Message> {
    return await this.blogService.deleteComment(commentId, user);
  }

  // Like Endpoints
  @Post("posts/:postId/like/toggle")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle like/unlike a blog post" })
  @ApiParam({ name: "postId", description: "Blog post ID" })
  @ApiResponse({
    status: 200,
    description: "Post like toggled successfully",
    type: ToggleLikeResponseDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Blog post not found" })
  async toggleLike(
    @Param("postId") postId: string,
    @User() user: DBUser,
  ): Promise<ToggleLikeResponseDTO> {
    return await this.blogService.toggleLike(postId, user);
  }

  @Get("posts/:postId/liked")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Check if user has liked a blog post" })
  @ApiParam({ name: "postId", description: "Blog post ID" })
  @ApiResponse({
    status: 200,
    description: "Like status retrieved successfully",
    schema: {
      type: 'object',
      properties: {
        hasLiked: {
          type: 'boolean',
          description: 'Whether the user has liked the post'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async hasLiked(
    @Param("postId") postId: string,
    @User() user: DBUser,
  ): Promise<{ hasLiked: boolean }> {
    const hasLiked = await this.blogService.hasLiked(postId, user);
    return { hasLiked };
  }

  @Get("posts/:postId/likes")
  @ApiOperation({ summary: "Get likes for a blog post" })
  @ApiParam({ name: "postId", description: "Blog post ID" })
  @ApiResponse({
    status: 200,
    description: "List of likes",
    type: [BlogLikeDTO],
  })
  async getPostLikes(@Param("postId") postId: string): Promise<BlogLikeDTO[]> {
    return await this.blogService.getPostLikes(postId);
  }

  // Category Endpoints
  @Get("categories")
  @ApiOperation({ summary: "Get all blog categories" })
  @ApiResponse({
    status: 200,
    description: "List of categories",
    type: [BlogCategoryDTO],
  })
  async getCategories(): Promise<BlogCategoryDTO[]> {
    return await this.blogService.getCategories();
  }

  @Post("categories")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new blog category" })
  @ApiBody({
    type: CreateCategoryDTO,
    examples: {
      example1: {
        summary: "Create category example",
        value: {
          name: "Web Development",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Category created successfully",
    type: BlogCategoryDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDTO,
    @User() user: DBUser,
  ): Promise<BlogCategoryDTO> {
    return await this.blogService.createCategory(createCategoryDto, user);
  }

  @Put("categories/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a blog category" })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiBody({
    type: UpdateCategoryDTO,
    examples: {
      example1: {
        summary: "Update category example",
        value: {
          name: "Advanced Web Development",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Category updated successfully",
    type: BlogCategoryDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Category not found" })
  async updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDTO,
    @User() user: DBUser,
  ): Promise<BlogCategoryDTO> {
    return await this.blogService.updateCategory(id, updateCategoryDto, user);
  }

  @Delete("categories/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a blog category" })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiResponse({
    status: 200,
    description: "Category deleted successfully",
    type: Message,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Category not found" })
  async deleteCategory(
    @Param("id") id: string,
    @User() user: DBUser,
  ): Promise<Message> {
    return await this.blogService.deleteCategory(id, user);
  }

  // Tag Endpoints
  @Get("tags")
  @ApiOperation({ summary: "Get all blog tags or user-specific tags" })
  @ApiQuery({
    name: "userId",
    required: false,
    type: String,
    description: "Filter by user ID",
  })
  @ApiResponse({ status: 200, description: "List of tags", type: [BlogTagDTO] })
  async getTags(@Query("userId") userId?: string): Promise<BlogTagDTO[]> {
    return await this.blogService.getTags(userId);
  }

  @Post("tags")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new blog tag" })
  @ApiBody({
    type: CreateTagDTO,
    examples: {
      example1: {
        summary: "Create tag example",
        value: {
          name: "javascript",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Tag created successfully",
    type: BlogTagDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createTag(
    @Body() createTagDto: CreateTagDTO,
    @User() user: DBUser,
  ): Promise<BlogTagDTO> {
    return await this.blogService.createTag(createTagDto, user);
  }

  @Get("posts/:postId/tags")
  @ApiOperation({ summary: "Get tags for a specific blog post" })
  @ApiParam({ name: "postId", description: "Blog post ID" })
  @ApiResponse({
    status: 200,
    description: "List of post tags",
    type: [BlogTagDTO],
  })
  async getPostTags(@Param("postId") postId: string): Promise<BlogTagDTO[]> {
    return await this.blogService.getPostTags(postId);
  }

  @Put("tags/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a blog tag" })
  @ApiParam({ name: "id", description: "Tag ID" })
  @ApiBody({
    type: CreateTagDTO,
    examples: {
      example1: {
        summary: "Update tag example",
        value: {
          name: "typescript",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Tag updated successfully",
    type: BlogTagDTO,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - not the creator or insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Tag not found" })
  async updateTag(
    @Param("id") id: string,
    @Body() updateTagDto: CreateTagDTO,
    @User() user: DBUser,
  ): Promise<BlogTagDTO> {
    return await this.blogService.updateTag(id, updateTagDto, user);
  }

  @Delete("tags/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a blog tag" })
  @ApiParam({ name: "id", description: "Tag ID" })
  @ApiResponse({
    status: 200,
    description: "Tag deleted successfully",
    type: Message,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - not the creator or insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Tag not found" })
  async deleteTag(
    @Param("id") id: string,
    @User() user: DBUser,
  ): Promise<Message> {
    return await this.blogService.deleteTag(id, user);
  }
}
