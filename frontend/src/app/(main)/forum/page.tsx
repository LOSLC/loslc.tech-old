"use client";

import { useState, useMemo } from "react";
import FloatingNav from "@/components/core/FloatingNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessagesSquare, FileText, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useForumPosts } from "@/lib/hooks/use-forum";
import { useAuth } from "@/lib/providers/auth-provider";
import { UserDisplay } from "@/components/common/UserDisplay";
import { useTranslation } from "react-i18next";

function Hero({
  query,
  setQuery,
  onSearch,
}: { query: string; setQuery: (v: string) => void; onSearch: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="relative pb-14 pt-32 md:pt-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] [@media(prefers-reduced-motion:reduce)]:hidden">
        <div className="absolute top-20 left-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/80 motion-preset-pulse motion-duration-[6s]"></div>
        <div className="absolute bottom-32 right-28 w-16 h-16 rounded-full bg-secondary/80 motion-preset-pulse motion-duration-[7s]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <MessagesSquare className="w-6 h-6 text-primary" />
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            {t("forum.badge")}
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          {t("forum.title")}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {t("forum.subtitle")}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t("forum.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pl-10 pr-4 text-base border-border bg-background/60 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
              aria-label={t("forum.searchPlaceholder")}
            />
          </div>
          <Button type="submit" className="h-12 rounded-xl px-6 sm:px-8">
            <Search className="w-4 h-4 mr-2" /> {t("common.search")}
          </Button>
        </form>
      </div>
    </section>
  );
}

function ForumListRow({
  post,
}: {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    postedAt: string | Date;
  };
}) {
  const { t } = useTranslation();
  const date = new Date(post.postedAt);
  return (
    <li className="border-b border-border">
      <Link
        href={`/forum/post/${post.id}`}
        className="block hover:bg-muted/20 transition-colors"
      >
        <div className="py-5 px-4 sm:px-5">
          <h3 className="text-xl font-semibold text-foreground hover:text-primary line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-muted-foreground line-clamp-2 leading-relaxed">
            {post.content}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {date.toLocaleDateString()}
            </span>
            <UserDisplay
              userId={post.authorId}
              showAvatar
              className="text-xs"
            />
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {t("forum.card.type")}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function ForumPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const query = useMemo(
    () => ({ query: activeSearch, offset: (page - 1) * limit, limit }),
    [activeSearch, page],
  );
  const { data: posts = [], isLoading } = useForumPosts(query);

  const onSearch = () => {
    setActiveSearch(search);
    setPage(1);
  };

  const hasPrev = page > 1;
  const hasNext = (posts?.length || 0) >= limit;

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <Hero query={search} setQuery={setSearch} onSearch={onSearch} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MessagesSquare className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              {t("forum.latest")}
            </h2>
          </div>
          {isAuthenticated && (
            <Link href="/forum/create">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> {t("forum.create")}
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <ul className="border-t border-border">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="border-b border-border">
                <div className="py-5 px-4 sm:px-5 animate-pulse">
                  <div className="h-5 w-2/3 bg-muted/40" />
                  <div className="mt-3 h-4 w-full bg-muted/30" />
                </div>
              </li>
            ))}
          </ul>
        ) : posts.length > 0 ? (
          <>
            <ul className="border-t border-border">
              {posts.map((p) => (
                <ForumListRow key={p.id} post={p} />
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setPage((n) => Math.max(1, n - 1))}
                disabled={!hasPrev}
              >
                {t("common.previous")}
              </Button>
              <div className="text-sm text-muted-foreground">
                {t("common.ofItems", {
                  from: (page - 1) * limit + 1,
                  to: (page - 1) * limit + posts.length,
                  total: "—",
                })}
              </div>
              <Button onClick={() => setPage((n) => n + 1)} disabled={!hasNext}>
                {t("common.next")}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
              <MessagesSquare className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("forum.emptyTitle")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("forum.emptyText")}
            </p>
            {isAuthenticated && (
              <Link href="/forum/create">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> {t("forum.create")}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
