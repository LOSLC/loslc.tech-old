import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type CreateForumCommentDTO,
	forumApi,
	forumKeys,
	type GetForumPostsQueryDTO,
	type VoteDTO,
} from "@/lib/api/forum";

export function useForumPosts(params: GetForumPostsQueryDTO = {}) {
	return useQuery({
		queryKey: [...forumKeys.posts(), params],
		queryFn: () => forumApi.listPosts(params),
	});
}

export function useForumPost(id: string) {
	return useQuery({
		queryKey: forumKeys.post(id),
		queryFn: () => forumApi.getPost(id),
		enabled: Boolean(id),
	});
}

export function useForumComments(postId: string) {
	return useQuery({
		queryKey: forumKeys.comments(postId),
		queryFn: () => forumApi.listComments(postId),
		enabled: Boolean(postId),
	});
}

export function useCommentHasVoted(commentId: string) {
	return useQuery({
		queryKey: ["forum", "comment", commentId, "has-voted"],
		queryFn: () => forumApi.hasVotedComment(commentId),
		enabled: Boolean(commentId),
	});
}

export function usePostVoteCounts(postId: string) {
	return useQuery({
		queryKey: ["forum", "post", postId, "votes"],
		queryFn: () => forumApi.getPostVoteCounts(postId),
		enabled: Boolean(postId),
		refetchInterval: 10_000,
	});
}

export function useCommentVoteCounts(commentId: string) {
	return useQuery({
		queryKey: ["forum", "comment", commentId, "votes"],
		queryFn: () => forumApi.getCommentVoteCounts(commentId),
		enabled: Boolean(commentId),
		refetchInterval: 10_000,
	});
}

export function useAddComment(postId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateForumCommentDTO) =>
			forumApi.addComment(postId, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: forumKeys.comments(postId) });
		},
	});
}

export function useVotePost(postId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: VoteDTO) => forumApi.votePost(postId, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: forumKeys.post(postId) });
			qc.invalidateQueries({ queryKey: forumKeys.posts() });
		},
	});
}

export function useVoteComment(postId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			commentId,
			voteType,
		}: {
			commentId: string;
			voteType: 1 | -1;
		}) => forumApi.voteComment(commentId, { voteType }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: forumKeys.comments(postId) });
			// Update has-voted status for the comment as well
			qc.invalidateQueries({ queryKey: ["forum", "comment"] });
		},
	});
}
