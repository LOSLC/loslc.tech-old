"use client";
import { useParams } from "next/navigation";
import {
  useForumPost,
  useForumComments,
  useAddComment,
  useVotePost,
  useVoteComment,
  useCommentHasVoted,
  usePostVoteCounts,
  useCommentVoteCounts,
} from "@/lib/hooks/use-forum";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserDisplay } from "@/components/common/UserDisplay";
import Link from "next/link";
import { useAuth } from "@/lib/providers/auth-provider";
import { Calendar } from "lucide-react";

export default function PostDetail() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const params = useParams();
  const id = String(params?.id ?? "");
  const { data: post, isLoading: loadingPost } = useForumPost(id);
  const { data: postVotes } = usePostVoteCounts(id);
  const { data: comments, isLoading: loadingComments } = useForumComments(id);
  const addComment = useAddComment(id);
  const votePost = useVotePost(id);
  const voteComment = useVoteComment(id);
  const [content, setContent] = useState("");

  const submitComment = async () => {
    if (!content.trim()) return;
    await addComment.mutateAsync({ content });
    setContent("");
  };

  return (
    <div className="space-y-6">
      {loadingPost ? (
        <div>{t("forum.detail.loadingPost")}</div>
      ) : post ? (
        <article className="border-y border-border bg-card p-5 sm:p-6 shadow-sm hover:bg-accent/50 transition">
          <header className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <UserDisplay userId={post.authorId} showAvatar />
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.postedAt).toLocaleDateString()}
              </span>
              {user?.id === post.authorId && (
                <Link
                  href={`/forum/post/${post.id}/edit`}
                  className="ml-auto text-primary hover:underline text-sm font-medium"
                >
                  {t("forum.detail.edit", "Edit")}
                </Link>
              )}
            </div>
          </header>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 pt-1 min-w-10">
              <Button size="icon" variant="ghost" onClick={() => votePost.mutate({ voteType: 1 })}>▲</Button>
              <span className="text-sm font-medium tabular-nums">{postVotes ? postVotes.score : "—"}</span>
              <Button size="icon" variant="ghost" onClick={() => votePost.mutate({ voteType: -1 })}>▼</Button>
            </div>
            <div className="flex-1 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-7">
                {post.content}
              </div>
            </div>
          </div>
        </article>
      ) : (
        <div>{t("forum.detail.notFound")}</div>
      )}

      <section className="space-y-3">
        <h2 className="font-medium">{t("forum.detail.comments")}</h2>
        {loadingComments ? (
          <div>{t("forum.detail.loadingComments")}</div>
        ) : (
          <ul className="space-y-3">
            {comments?.map((c) => (
              <CommentItem
                key={c.id}
                id={c.id}
                content={c.content}
                onVote={(voteType) =>
                  voteComment.mutate({ commentId: c.id, voteType })
                }
              />
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="font-medium">{t("forum.detail.addComment")}</h3>
        {isAuthenticated ? (
          <>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("forum.detail.commentPh")}
            />
            <div>
              <Button onClick={submitComment} disabled={addComment.isPending}>
                {t("forum.detail.commentBtn")}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("forum.detail.loginToComment")}{" "}
            <Link href="/login" className="text-primary underline">
              {t("common.login")}
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}

function CommentItem({ id, content, onVote }: { id: string; content: string; onVote: (voteType: 1 | -1) => void }) {
  const { data: voted } = useCommentHasVoted(id);
  const { data: voteCounts } = useCommentVoteCounts(id);
  const upActive = voted?.hasVoted && voted.voteType === 1;
  const downActive = voted?.hasVoted && voted.voteType === -1;
  return (
    <li className="border-y p-3 sm:p-4 hover:bg-accent/50 transition">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 min-w-10">
          <Button size="icon" variant={upActive ? "default" : "ghost"} onClick={() => onVote(1)}>▲</Button>
          <span className="text-sm font-medium tabular-nums">{voteCounts ? voteCounts.score : "—"}</span>
          <Button size="icon" variant={downActive ? "default" : "ghost"} onClick={() => onVote(-1)}>▼</Button>
        </div>
        <div className="flex-1">
          <div className="whitespace-pre-wrap leading-7">{content}</div>
        </div>
      </div>
    </li>
  );
}
