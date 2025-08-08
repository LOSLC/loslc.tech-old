import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  blogApi, 
  type BlogPostDTO, 
  type GetBlogPostsQueryDTO 
} from '../api/blog';

// Query keys factory
export const blogKeys = {
  all: ['blog'] as const,
  posts: () => [...blogKeys.all, 'posts'] as const,
  post: (id: string) => [...blogKeys.all, 'post', id] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  tags: () => [...blogKeys.all, 'tags'] as const,
  featured: () => [...blogKeys.all, 'featured'] as const,
  liked: (id: string) => [...blogKeys.all, 'post', id, 'liked'] as const,
  likesCount: (id: string) => [...blogKeys.all, 'post', id, 'likes', 'count'] as const,
  search: (query: GetBlogPostsQueryDTO) => {
    // Create a stable key by sorting and stringifying the query object
    const stableQuery = Object.keys(query || {})
      .sort()
      .reduce((result, key) => {
        result[key] = query[key as keyof GetBlogPostsQueryDTO];
        return result;
      }, {} as Record<string, unknown>);
    
    return [...blogKeys.all, 'search', stableQuery] as const;
  },
};

// Custom hooks for blog data

/**
 * Hook to fetch blog posts with filtering and pagination
 */
export function useBlogPosts(query: GetBlogPostsQueryDTO = {}) {
  return useQuery({
    queryKey: blogKeys.search(query),
    queryFn: () => blogApi.getBlogPosts(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch featured blog posts
 */
export function useFeaturedPosts(limit: number = 3) {
  return useQuery({
    queryKey: blogKeys.featured(),
    queryFn: () => blogApi.getBlogPosts({ featured: true, limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch a single blog post by ID
 */
export function useBlogPost(id: string) {
  return useQuery({
    queryKey: blogKeys.post(id),
    queryFn: () => blogApi.getBlogPostById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch blog categories
 */
export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: () => blogApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch blog tags
 */
export function useBlogTags(userId?: string) {
  return useQuery({
    queryKey: [...blogKeys.tags(), { userId }],
    queryFn: () => blogApi.getTags(userId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook for infinite scrolling blog posts
 */
export function useInfiniteBlogPosts(baseQuery: Omit<GetBlogPostsQueryDTO, 'offset'> = {}) {
  const POSTS_PER_PAGE = 12;

  return useInfiniteQuery({
    queryKey: ['blog', 'posts', 'infinite', baseQuery],
    queryFn: ({ pageParam = 0 }) => 
      blogApi.getBlogPosts({
        ...baseQuery,
        offset: pageParam * POSTS_PER_PAGE,
        limit: POSTS_PER_PAGE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer posts than the limit, we've reached the end
      return lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to search blog posts
 */
export function useSearchBlogPosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (searchQuery: GetBlogPostsQueryDTO) => blogApi.getBlogPosts(searchQuery),
    onSuccess: (data, variables) => {
      // Update the cache with search results
      queryClient.setQueryData(blogKeys.search(variables), data);
    },
  });
}

/**
 * Hook to prefetch blog post
 */
export function usePrefetchBlogPost() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: blogKeys.post(id),
      queryFn: () => blogApi.getBlogPostById(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };
}

/**
 * Hook to get cached blog posts count
 */
export function useCachedBlogPostsCount(query: GetBlogPostsQueryDTO = {}) {
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData<BlogPostDTO[]>(blogKeys.search(query));
  return cachedData?.length || 0;
}

/**
 * Hook to invalidate and refetch blog data
 */
export function useRefreshBlogData() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
    invalidatePosts: () => queryClient.invalidateQueries({ queryKey: blogKeys.posts() }),
    invalidateCategories: () => queryClient.invalidateQueries({ queryKey: blogKeys.categories() }),
    invalidateTags: () => queryClient.invalidateQueries({ queryKey: blogKeys.tags() }),
    refetchAll: () => queryClient.refetchQueries({ queryKey: blogKeys.all }),
  };
}

/**
 * Hook to check if current user has liked a post
 */
export function useHasLiked(postId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: blogKeys.liked(postId),
    queryFn: () => blogApi.hasLiked(postId),
    select: (data) => data.hasLiked,
    enabled: !!postId && enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to get likes count for a post
 */
export function usePostLikesCount(postId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: blogKeys.likesCount(postId),
    queryFn: () => blogApi.getPostLikes(postId),
    select: (likes) => likes.length,
    enabled: !!postId && enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook for optimistic updates when liking a post
 */
export function useLikeBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => blogApi.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches for the post
      await queryClient.cancelQueries({ queryKey: blogKeys.post(postId) });
      await queryClient.cancelQueries({ queryKey: blogKeys.liked(postId) });
      await queryClient.cancelQueries({ queryKey: blogKeys.likesCount(postId) });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData<BlogPostDTO>(blogKeys.post(postId));
      const previousLiked = queryClient.getQueryData<boolean>(blogKeys.liked(postId));
      const previousCount = queryClient.getQueryData<number>(blogKeys.likesCount(postId));

      // Optimistically update the cache
      if (typeof previousLiked === 'boolean') {
        queryClient.setQueryData<boolean>(blogKeys.liked(postId), !previousLiked);
      }

      if (typeof previousCount === 'number') {
        const next = Math.max(0, previousCount + (previousLiked ? -1 : 1));
        queryClient.setQueryData<number>(blogKeys.likesCount(postId), next);
      }

      return { previousPost, previousLiked, previousCount };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(blogKeys.post(postId), context.previousPost);
      }
      if (typeof context?.previousLiked === 'boolean') {
        queryClient.setQueryData(blogKeys.liked(postId), context.previousLiked);
      }
      if (typeof context?.previousCount === 'number') {
        queryClient.setQueryData(blogKeys.likesCount(postId), context.previousCount);
      }
    },
    onSettled: (data, error, postId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: blogKeys.post(postId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.liked(postId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.likesCount(postId) });
    },
  });
}
