"use client";

import { Loader2, Plus, Tag as TagIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { type ForumTagDTO, forumApi } from "@/lib/api/forum";

type Props = {
	value: string[];
	onChange: (tags: string[]) => void;
};

export default function TagSelector({ value, onChange }: Props) {
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState<ForumTagDTO[]>([]);

	useEffect(() => {
		let active = true;
		if (!query.trim()) {
			setOptions([]);
			return;
		}
		setLoading(true);
		forumApi
			.searchTags(query)
			.then((res) => {
				if (!active) return;
				setOptions(res);
			})
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, [query]);

	const lower = useMemo(() => value.map((v) => v.toLowerCase()), [value]);
	const exists = (name: string) => lower.includes(name.toLowerCase());
	const hasOptions = options.length > 0;
	const trimmed = query.trim();
	const hasExactMatch = options.some(
		(o) => o.name.toLowerCase() === trimmed.toLowerCase(),
	);
	const canCreate = Boolean(trimmed) && !exists(trimmed) && !hasExactMatch;

	const createIfMissing = async (name: string) => {
		if (!name.trim()) return;
		if (exists(name)) return;
		const tag = await forumApi.createTag(name.trim());
		onChange([...value, tag.name]);
		setQuery("");
	};

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-2">
				{value.map((tag) => (
					<Badge key={tag} className="gap-1" variant="secondary">
						<TagIcon className="w-3 h-3" /> {tag}
						<button
							type="button"
							aria-label={t("forum.tags.removeTag", { tag })}
							className="ml-1 inline-flex"
							onClick={() => onChange(value.filter((t) => t !== tag))}
						>
							<X className="w-3 h-3" />
						</button>
					</Badge>
				))}
			</div>

			<div className="border rounded-md">
				<Command>
					<div
						className="flex items-center px-2"
						data-slot="command-input-wrapper"
					>
						<CommandInput
							value={query}
							onValueChange={setQuery}
							placeholder={t("forum.createPage.fields.tagsPh")}
						/>
					</div>
					<CommandList>
						{loading && (
							<div className="px-2 py-3 text-sm text-muted-foreground flex items-center gap-2">
								<Loader2 className="w-4 h-4 animate-spin" />{" "}
								{t("common.loading")}
							</div>
						)}
						{!loading && (
							<>
								<CommandEmpty>
									<div className="px-2 py-3 text-sm text-muted-foreground">
										<div>{t("forum.tags.noResults")}</div>
										{canCreate && !hasOptions && (
											<button
												type="button"
												onClick={() => createIfMissing(trimmed)}
												className="mt-2 inline-flex items-center gap-2 text-foreground hover:text-primary"
												aria-label={t("forum.tags.create", { name: trimmed })}
											>
												<Plus className="w-4 h-4" />{" "}
												{t("forum.tags.create", { name: trimmed })}
											</button>
										)}
									</div>
								</CommandEmpty>
								{hasOptions && (
									<CommandGroup heading={t("forum.tags.suggestions")}>
										{options.map((opt) => (
											<CommandItem
												key={opt.id}
												onSelect={() => {
													if (exists(opt.name)) return;
													onChange([...value, opt.name]);
													setQuery("");
												}}
											>
												<TagIcon className="w-4 h-4 mr-2" /> {opt.name}
											</CommandItem>
										))}
									</CommandGroup>
								)}
								{hasOptions && canCreate && (
									<CommandGroup>
										<CommandItem onSelect={() => createIfMissing(trimmed)}>
											<Plus className="w-4 h-4 mr-2" />{" "}
											{t("forum.tags.create", { name: trimmed })}
										</CommandItem>
									</CommandGroup>
								)}
							</>
						)}
					</CommandList>
				</Command>
			</div>
		</div>
	);
}
