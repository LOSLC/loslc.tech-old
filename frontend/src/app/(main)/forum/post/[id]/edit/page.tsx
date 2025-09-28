"use client";

import { useEffect, useState } from "react";
import FloatingNav from "@/components/core/FloatingNav";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { forumApi, type UpdateForumPostDTO } from "@/lib/api/forum";
import { useForumPost } from "@/lib/hooks/use-forum";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function EditForumPostPage() {
	const { t } = useTranslation();
	const router = useRouter();
	const params = useParams();
	const id = String(params?.id ?? "");
	const { data: post, isLoading } = useForumPost(id);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setContent(post.content);
		}
	}, [post]);

	const updateMutation = useMutation({
		mutationFn: async (data: UpdateForumPostDTO) =>
			forumApi.updatePost(id, data),
		onSuccess: (updated) => router.push(`/forum/post/${updated.id}`),
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload: UpdateForumPostDTO = {
			title: title.trim(),
			content: content.trim(),
		};
		if (!payload.title || !payload.content) return;
		updateMutation.mutate(payload);
	};

	return (
		<div className="min-h-screen bg-background">
			<FloatingNav />
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">
						{t("forum.editPage.title", "Edit post")}
					</h1>
					<Link
						href={`/forum/post/${id}`}
						className="text-sm text-muted-foreground hover:underline"
					>
						{t("forum.editPage.back", "Back to post")}
					</Link>
				</div>
				{isLoading ? (
					<div>{t("forum.detail.loadingPost")}</div>
				) : (
					<form onSubmit={submit} className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium">
								{t("forum.createPage.fields.title")}
							</label>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder={t("forum.createPage.fields.titlePh")}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">
								{t("forum.createPage.fields.content")}
							</label>
							<Textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder={t("forum.createPage.fields.contentPh")}
								className="min-h-48"
							/>
							<p className="text-xs text-muted-foreground">
								{t("forum.createPage.hints.markdown")}
							</p>
						</div>
						<div className="flex gap-3">
							<Button type="submit" disabled={updateMutation.isPending}>
								{updateMutation.isPending
									? t("forum.editPage.actions.saving", "Saving...")
									: t("forum.editPage.actions.save", "Save changes")}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
							>
								{t("forum.createPage.actions.cancel")}
							</Button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
