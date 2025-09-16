import { apiWithErrorHandling as api } from "@/lib/api/client";

export type ForumPostDTO = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  postedAt: string | Date;
  updatedAt: string | Date;
};

export type ForumCommentDTO = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  postedAt: string | Date;
  updatedAt: string | Date;
};

export type GetForumPostsQueryDTO = {
  offset?: number;
  limit?: number;
  authorId?: string;
  tag?: string;
  query?: string;
};

export type GetForumCommentsQueryDTO = {
  offset?: number;
  limit?: number;
};

export type CreateForumPostDTO = {
  title: string;
  content: string;
  tags?: string[];
};

export type UpdateForumPostDTO = Partial<CreateForumPostDTO>;

export type CreateForumCommentDTO = {
  content: string;
};

export type UpdateForumCommentDTO = CreateForumCommentDTO;

export type VoteDTO = { voteType: 1 | -1 };

export type VoteResponseDTO = {
  voteType: 1 | -1;
  id: string;
  userId: string;
  createdAt: string | Date;
};

export type ForumTagDTO = { id: string; name: string };

export const forumKeys = {
  all: ["forum"] as const,
  posts: () => [...forumKeys.all, "posts"] as const,
  post: (id: string) => [...forumKeys.posts(), id] as const,
  comments: (postId: string) => [...forumKeys.post(postId), "comments"] as const,
};

export const forumApi = {
  async listPosts(params: GetForumPostsQueryDTO = {}) {
    const searchParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) searchParams[k] = String(v);
    }
    return api.get("forum/posts", { searchParams }).json<ForumPostDTO[]>();
  },
  async getPost(id: string) {
    return api.get(`forum/posts/${id}`).json<ForumPostDTO>();
  },
  async createPost(data: CreateForumPostDTO) {
    return api.post("forum/posts", { json: data }).json<ForumPostDTO>();
  },
  async updatePost(id: string, data: UpdateForumPostDTO) {
    return api.patch(`forum/posts/${id}`, { json: data }).json<ForumPostDTO>();
  },
  async listComments(postId: string, params: GetForumCommentsQueryDTO = {}) {
    // Controller reads body on GET, but we'll pass none and rely on defaults
    const searchParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) searchParams[k] = String(v);
    }
    return api
      .get(`forum/posts/${postId}/comments`, { searchParams })
      .json<ForumCommentDTO[]>();
  },
  async addComment(postId: string, data: CreateForumCommentDTO) {
    return api
      .post(`forum/posts/${postId}/comments`, { json: data })
      .json<ForumCommentDTO>();
  },
  async votePost(postId: string, data: VoteDTO) {
    return api.post(`forum/posts/${postId}/vote`, { json: data }).json<{
      voted: boolean;
      vote?: VoteResponseDTO;
      message: string;
    }>();
  },
  async voteComment(commentId: string, data: VoteDTO) {
    return api.post(`forum/comments/${commentId}/vote`, { json: data }).json<{
      voted: boolean;
      vote?: VoteResponseDTO;
      message: string;
    }>();
  },
  async hasVotedComment(commentId: string) {
    return api
      .get(`forum/comments/${commentId}/has-voted`)
      .json<{ hasVoted: boolean; voteType?: 1 | -1 }>();
  },
  async getPostVoteCounts(postId: string) {
    return api
      .get(`forum/posts/${postId}/votes`)
      .json<{ up: number; down: number; score: number }>();
  },
  async getCommentVoteCounts(commentId: string) {
    return api
      .get(`forum/comments/${commentId}/votes`)
      .json<{ up: number; down: number; score: number }>();
  },
  async searchTags(query: string) {
    return api.get(`forum/tags`, { searchParams: { query } }).json<ForumTagDTO[]>();
  },
  async createTag(name: string) {
    return api.post(`forum/tags`, { json: { name } }).json<ForumTagDTO>();
  },
};

export default forumApi;
