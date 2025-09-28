"use client";
import Link from "next/link";
import { useForumPosts } from "@/lib/hooks/use-forum";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PostList() {
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const { data, isLoading } = useForumPosts({ query });

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Input
					placeholder={t("forum.searchPlaceholder")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<Button onClick={() => null}>{t("common.search")}</Button>
			</div>
			{isLoading && <div>{t("forum.detail.loadingPost")}</div>}
			<ul className="space-y-2">
				{data?.map((p) => (
					<li key={p.id} className="border rounded-md p-3 hover:bg-muted/30">
						<Link href={`/forum/post/${p.id}`} className="font-medium">
							{p.title}
						</Link>
						<div className="text-sm text-muted-foreground line-clamp-2">
							{p.content}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
