import { apiWithErrorHandling as api } from "./client";
import { resolveRequest } from "./request";

// Types based on backend DTOs
export interface BlogPostDTO {
	id: string;
	title: string;
	description: string;
	content: string;
	authorId: string;
	categoryId: string | null;
	coverImageId: string | null;
	featured: boolean;
	published: boolean;
	archived: boolean;
	createdAt: Date;
	updatedAt: Date | null;
}

export interface CreateBlogPostDTO {
	title: string;
	description: string;
	content: string;
	categoryId?: string;
	coverImageId?: string;
	featured?: boolean;
	published?: boolean;
	tags?: string[];
}

export interface UpdateBlogPostDTO {
	title?: string;
	description?: string;
	content?: string;
	categoryId?: string;
	coverImageId?: string;
	featured?: boolean;
	published?: boolean;
	archived?: boolean;
	tags?: string[];
}

export interface BlogCommentDTO {
	id: string;
	postId: string;
	authorId: string;
	parentId: string | null;
	content: string;
}

export interface CreateCommentDTO {
	content: string;
	parentId?: string;
}

export interface UpdateCommentDTO {
	content: string;
}

export interface BlogLikeDTO {
	id: string;
	likerId: string;
	postId: string;
	likedAt: Date;
}

export interface ToggleLikeResponseDTO {
	liked: boolean;
	like?: BlogLikeDTO;
	message: string;
}

export interface BlogViewDTO {
	id: string;
	viewerId: string | null;
	postId: string;
	viewedAt: Date;
	viewTime: number;
}

export interface CreateViewDTO {
	viewTime?: number;
}

export interface BlogCategoryDTO {
	id: string;
	name: string;
}

export interface CreateCategoryDTO {
	name: string;
}

export interface UpdateCategoryDTO {
	name: string;
}

export interface BlogTagDTO {
	id: string;
	name: string;
	userId: string;
	createdAt: Date;
}

export interface CreateTagDTO {
	name: string;
}

export interface GetBlogPostsQueryDTO {
	offset?: number;
	limit?: number;
	categoryId?: string;
	tag?: string;
	featured?: boolean;
	authorId?: string;
	query?: string;
}

export interface Message {
	message: string;
}

// Blog API functions using resolveRequest pattern
export const blogApi = {
	// Blog Post methods
	getBlogPosts: async (query: GetBlogPostsQueryDTO = {}) => {
		const searchParams = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => {
			if (value !== undefined) {
				searchParams.append(key, value.toString());
			}
		});

		const promise = api
			.get(`blog/posts?${searchParams.toString()}`)
			.json<BlogPostDTO[]>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	getBlogPostById: async (id: string) => {
		const promise = api.get(`blog/posts/${id}`).json<BlogPostDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	getBlogPostBySlug: async (slugWithId: string) => {
		// First try to extract postId from the slug-postId format
		const { extractPostIdFromSlug } = await import("@/lib/utils/slug");
		const postId = extractPostIdFromSlug(slugWithId);

		if (postId) {
			// If we have a postId, use direct ID lookup for better performance
			const promise = api.get(`blog/posts/${postId}`).json<BlogPostDTO>();
			const [response, error] = await resolveRequest(promise);
			if (error) {
				throw new Error(error.message);
			}
			return response;
		}

		// Fallback: treat as a regular slug and search by title
		const searchQuery: GetBlogPostsQueryDTO = {
			query: slugWithId,
			limit: 50, // Get more results to find the exact match
		};

		const searchParams = new URLSearchParams();
		Object.entries(searchQuery).forEach(([key, value]) => {
			if (value !== undefined) {
				searchParams.append(key, value.toString());
			}
		});

		const promise = api
			.get(`blog/posts?${searchParams.toString()}`)
			.json<BlogPostDTO[]>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}

		// Find the post that matches the slug exactly
		const { generateSlug } = await import("@/lib/utils/slug");
		const matchingPost = response.find(
			(post) => generateSlug(post.title) === slugWithId,
		);
		if (!matchingPost) {
			throw new Error("Post not found");
		}

		return matchingPost;
	},

	createBlogPost: async (data: CreateBlogPostDTO) => {
		const promise = api.post("blog/posts", { json: data }).json<BlogPostDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	updateBlogPost: async (id: string, data: UpdateBlogPostDTO) => {
		const promise = api
			.put(`blog/posts/${id}`, { json: data })
			.json<BlogPostDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	deleteBlogPost: async (id: string) => {
		const promise = api.delete(`blog/posts/${id}`).json<Message>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	// Comment methods
	getPostComments: async (postId: string) => {
		const promise = api
			.get(`blog/posts/${postId}/comments`)
			.json<BlogCommentDTO[]>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	createComment: async (postId: string, data: CreateCommentDTO) => {
		const promise = api
			.post(`blog/posts/${postId}/comments`, { json: data })
			.json<BlogCommentDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	updateComment: async (commentId: string, data: UpdateCommentDTO) => {
		const promise = api
			.put(`blog/comments/${commentId}`, { json: data })
			.json<BlogCommentDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	deleteComment: async (commentId: string) => {
		const promise = api.delete(`blog/comments/${commentId}`).json<Message>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	// Like methods
	toggleLike: async (postId: string) => {
		const promise = api
			.post(`blog/posts/${postId}/like/toggle`)
			.json<ToggleLikeResponseDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	hasLiked: async (postId: string) => {
		const promise = api
			.get(`blog/posts/${postId}/liked`)
			.json<{ hasLiked: boolean }>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	getPostLikes: async (postId: string) => {
		const promise = api.get(`blog/posts/${postId}/likes`).json<BlogLikeDTO[]>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	// Category methods
	getCategories: async () => {
		const promise = api.get("blog/categories").json<BlogCategoryDTO[]>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	createCategory: async (data: CreateCategoryDTO) => {
		const promise = api
			.post("blog/categories", { json: data })
			.json<BlogCategoryDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	updateCategory: async (id: string, data: UpdateCategoryDTO) => {
		const promise = api
			.put(`blog/categories/${id}`, { json: data })
			.json<BlogCategoryDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	deleteCategory: async (id: string) => {
		const promise = api.delete(`blog/categories/${id}`).json<Message>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	// Tag methods
	getTags: async (userId?: string) => {
		const searchParams = userId ? `?userId=${userId}` : "";
		const promise = api.get(`blog/tags${searchParams}`).json<BlogTagDTO[]>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	createTag: async (data: CreateTagDTO) => {
		const promise = api.post("blog/tags", { json: data }).json<BlogTagDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	getPostTags: async (postId: string) => {
		const promise = api.get(`blog/posts/${postId}/tags`).json<BlogTagDTO[]>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	updateTag: async (id: string, data: CreateTagDTO) => {
		const promise = api
			.put(`blog/tags/${id}`, { json: data })
			.json<BlogTagDTO>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},

	deleteTag: async (id: string) => {
		const promise = api.delete(`blog/tags/${id}`).json<Message>();
		const [response, error] = await resolveRequest(promise);
		if (error) {
			throw new Error(error.message);
		}
		return response;
	},
};
