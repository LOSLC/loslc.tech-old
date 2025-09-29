"use client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, XIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { filesApi } from "@/lib/api/files";
import { storeApi } from "@/lib/api/store";
import { useUpdateItem } from "@/lib/hooks/use-store";
import { StoreCharacteristic, StoreItem } from "@/lib/types/store";
import { ImageUploadZone } from "./image-upload-zone";

interface EditItemDialogProps {
	item: StoreItem & { characteristics?: StoreCharacteristic[] };
	trigger?: React.ReactNode;
}

export function EditItemDialog({ item, trigger }: EditItemDialogProps) {
	const [open, setOpen] = React.useState(false);
	const [local, setLocal] = React.useState({
		name: item.name,
		description: item.description,
		price: (item.price / 100).toFixed(2),
		published: item.published,
		featured: item.featured,
		images: item.images || [],
	});
	const [uploading, setUploading] = React.useState(false);
	const [errors, setErrors] = React.useState<string[]>([]);
	const updateItem = useUpdateItem(item.id);
	const qc = useQueryClient();

	React.useEffect(() => {
		if (open) {
			setLocal({
				name: item.name,
				description: item.description,
				price: (item.price / 100).toFixed(2),
				published: item.published,
				featured: item.featured,
				images: item.images || [],
			});
		}
	}, [open, item]);

	async function handleFiles(files: FileList) {
		if (!files) return;
		const remaining = 5 - local.images.length;
		const toProcess = Array.from(files).slice(0, remaining);
		if (!toProcess.length) return;
		setUploading(true);
		setErrors([]);
		const newIds: string[] = [];
		for (const f of toProcess) {
			if (!f.type.startsWith("image/")) {
				setErrors((e) => [...e, `${f.name}: invalid type`]);
				continue;
			}
			if (f.size > 5 * 1024 * 1024) {
				setErrors((e) => [...e, `${f.name}: >5MB`]);
				continue;
			}
			try {
				const info = await filesApi.uploadSingle(f);
				newIds.push(info.id);
			} catch (er) {
				const msg = er instanceof Error ? er.message : "upload failed";
				setErrors((e) => [...e, `${f.name}: ${msg}`]);
			}
		}
		if (newIds.length) {
			// Persist images immediately using addImages API for incremental saving
			try {
				await storeApi.addImages(item.id, newIds);
				qc.invalidateQueries({ queryKey: ["store", "item", item.id] });
				qc.invalidateQueries({ queryKey: ["store", "items"] });
			} catch (er) {
				const msg = er instanceof Error ? er.message : "add images failed";
				setErrors((e) => [...e, msg]);
			}
			setLocal((l) => ({ ...l, images: [...l.images, ...newIds] }));
		}
		setUploading(false);
	}

	function removeLocal(id: string) {
		// remove local + call removeImage API (optimistic)
		setLocal((l) => ({
			...l,
			images: l.images.filter((i: string) => i !== id),
		}));
		storeApi
			.removeImage(item.id, id)
			.then(() => {
				qc.invalidateQueries({ queryKey: ["store", "item", item.id] });
				qc.invalidateQueries({ queryKey: ["store", "items"] });
			})
			.catch((er) => {
				const msg = er instanceof Error ? er.message : "remove failed";
				setErrors((e) => [...e, msg]);
			});
	}

	function submit(e: React.FormEvent) {
		e.preventDefault();
		updateItem.mutate(
			{
				name: local.name,
				description: local.description,
				price: Math.round(parseFloat(local.price) * 100),
				published: local.published,
				featured: local.featured,
			},
			{
				onSuccess: () => {
					qc.invalidateQueries({ queryKey: ["store", "items"] });
					setOpen(false);
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm">
						Edit
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Item</DialogTitle>
				</DialogHeader>
				<form onSubmit={submit} className="space-y-4">
					<Input
						value={local.name}
						onChange={(e) => setLocal((l) => ({ ...l, name: e.target.value }))}
						placeholder="Name"
					/>
					<Textarea
						value={local.description}
						onChange={(e) =>
							setLocal((l) => ({ ...l, description: e.target.value }))
						}
						placeholder="Description"
					/>
					<Input
						value={local.price}
						onChange={(e) => setLocal((l) => ({ ...l, price: e.target.value }))}
						placeholder="Price (e.g. 9.99)"
					/>
					<div className="flex flex-col gap-2">
						<label className="flex items-center gap-2 text-sm">
							<Checkbox
								checked={local.published}
								onCheckedChange={(v: boolean) =>
									setLocal((l) => ({ ...l, published: v }))
								}
							/>{" "}
							Published
						</label>
						<label className="flex items-center gap-2 text-sm">
							<Checkbox
								checked={local.featured}
								onCheckedChange={(v: boolean) =>
									setLocal((l) => ({ ...l, featured: v }))
								}
							/>{" "}
							Featured
						</label>
					</div>
					<div className="space-y-2">
						<label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Images
						</label>
						<ImageUploadZone
							onFiles={handleFiles}
							disabled={uploading || local.images.length >= 5}
							imagesCount={local.images.length}
						/>
						{errors.length > 0 && (
							<ul className="text-[10px] text-destructive space-y-0.5">
								{errors.map((er, i) => (
									<li key={i}>{er}</li>
								))}
							</ul>
						)}
						{local.images.length > 0 && (
							<div className="flex flex-wrap gap-2 pt-1">
								{local.images.map((id: string) => (
									<div
										key={id}
										className="group relative w-20 h-20 rounded-md overflow-hidden border bg-muted/30"
									>
										<img
											src={`/api/files/${id}/download`}
											alt="item image"
											className="object-cover w-full h-full"
										/>
										<button
											type="button"
											onClick={() => removeLocal(id)}
											className="absolute top-1 right-1 bg-black/60 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition"
											aria-label="Remove image"
										>
											<XIcon className="w-3 h-3" />
										</button>
									</div>
								))}
							</div>
						)}
						<p className="text-[10px] text-muted-foreground">
							{uploading ? "Uploading..." : "Up to 5 images. Saved instantly."}
						</p>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={updateItem.isPending || uploading}>
							{updateItem.isPending ? (
								<span className="flex items-center gap-1">
									<Loader2 className="w-4 h-4 animate-spin" /> Saving...
								</span>
							) : (
								"Save Changes"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
