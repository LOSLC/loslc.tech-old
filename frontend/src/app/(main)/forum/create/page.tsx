"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FloatingNav from "@/components/core/FloatingNav";
import { useRouter } from "next/navigation";
import { forumApi, type CreateForumPostDTO } from "@/lib/api/forum";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TagSelector from "@/components/forum/TagSelector";

export default function CreateForumPostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: async (data: CreateForumPostDTO) => forumApi.createPost(data),
    onSuccess: (post) => router.push(`/forum/post/${post.id}`),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateForumPostDTO = {
      title: title.trim(),
      content: content.trim(),
      tags: tags,
    };
    if (!payload.title || !payload.content) return;
    createMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32 md:pt-36">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t('forum.createPage.title')}</h1>
          <Link href="/forum" className="text-sm text-muted-foreground hover:underline">{t('forum.createPage.back')}</Link>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('forum.createPage.fields.title')}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('forum.createPage.fields.titlePh')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('forum.createPage.fields.content')}</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t('forum.createPage.fields.contentPh')} className="min-h-48" />
            <p className="text-xs text-muted-foreground">{t('forum.createPage.hints.markdown')}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('forum.createPage.fields.tags')}</label>
            <TagSelector value={tags} onChange={setTags} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? t('forum.createPage.actions.creating') : t('forum.createPage.actions.create')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t('forum.createPage.actions.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
