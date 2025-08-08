"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasLiked, useLikeBlogPost, usePostLikesCount } from "@/lib/hooks/use-blog";
import { useAuth } from "@/lib/providers/auth-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  size?: "sm" | "md";
  className?: string;
  withCount?: boolean;
}

export function LikeButton({ postId, size = "md", className, withCount = true }: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: hasLiked = false, isLoading: likeLoading } = useHasLiked(postId, true);
  const { data: likesCount = 0 } = usePostLikesCount(postId, true);
  const likeMutation = useLikeBlogPost();

  const onToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to like posts");
      return;
    }
    try {
      await likeMutation.mutateAsync(postId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to toggle like");
    }
  };

  const isBusy = likeLoading || likeMutation.isPending;

  const buttonClasses = cn(
    "gap-2",
    size === "sm" ? "h-8 px-2" : "h-10 px-3",
    hasLiked ? "text-rose-500 hover:text-rose-600" : "text-muted-foreground hover:text-primary",
    className,
  );

  return (
    <Button
      size={size === "sm" ? "sm" : undefined}
      variant="ghost"
      aria-label={hasLiked ? "Unlike article" : "Like article"}
      className={buttonClasses}
      onClick={onToggleLike}
      disabled={isBusy}
    >
      <Heart className={cn("w-4 h-4", hasLiked && "fill-rose-500 stroke-rose-500")} />
      {withCount && <span className="text-sm tabular-nums">{likesCount}</span>}
    </Button>
  );
}

export default LikeButton;
