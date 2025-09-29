"use client";
import { Loader2, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/admin-layout";
import { EditItemDialog } from "@/components/admin/store/edit-item-dialog";
import { ImageUploadZone } from "@/components/admin/store/image-upload-zone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { filesApi } from "@/lib/api/files";
import {
	useAddCharacteristic,
	useAddVariant,
	useCreateItem,
	useDeleteCharacteristic,
	useDeleteItem,
	useDeleteVariant,
	useItemCharacteristics,
	useOrderAction,
	useStoreItems,
	useStoreOrders,
	useUpdateCharacteristicGeneric,
	useUpdateVariantGeneric,
} from "@/lib/hooks/use-store";
import {
	OrderDTO,
	StoreCharacteristic,
	StoreItem,
	StoreVariant,
} from "@/lib/types/store";

// cn not needed here removed

function ItemRow({
	item,
	onDelete,
}: {
	item: StoreItem;
	onDelete: () => void;
}) {
	const [open, setOpen] = React.useState(false);
	const [charName, setCharName] = React.useState("");
	const addChar = useAddCharacteristic(item.id);
	const delChar = useDeleteCharacteristic(item.id);
	// Generic updaters (avoid creating hooks inside maps)
	const updateCharGeneric = useUpdateCharacteristicGeneric(item.id);
	const [editingChar, setEditingChar] = React.useState<string | null>(null);
	const [charValue, setCharValue] = React.useState("");
	// Fetch characteristics only when open
	const { data: characteristics, isLoading: charsLoading } =
		useItemCharacteristics(item.id, true);

	return (
		<>
			<TableRow className={open ? "bg-muted/40" : undefined}>
				<TableCell
					className="font-mono text-xs opacity-70 cursor-pointer"
					onClick={() => setOpen((o) => !o)}
				>
					{item.id.slice(0, 8)}
				</TableCell>
				<TableCell
					className="font-medium cursor-pointer"
					onClick={() => setOpen((o) => !o)}
				>
					{item.name}
				</TableCell>
				<TableCell>{(item.price / 100).toFixed(2)}</TableCell>
				<TableCell className="text-center">
					{item.published ? "✓" : "—"}
				</TableCell>
				<TableCell className="text-center">
					{item.featured ? "★" : ""}
				</TableCell>
				<TableCell className="flex gap-2">
					<EditItemDialog item={item} />
					<Button size="sm" variant="destructive" onClick={onDelete}>
						{"Del"}
					</Button>
					<Button
						size="sm"
						variant={open ? "secondary" : "ghost"}
						onClick={() => setOpen((o) => !o)}
					>
						{open ? "Hide" : "Specs"}
					</Button>
				</TableCell>
			</TableRow>
			{open && (
				<TableRow>
					<TableCell
						colSpan={6}
						className="bg-background/60 backdrop-blur p-4 space-y-6"
					>
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Input
									placeholder="Add characteristic"
									value={charName}
									onChange={(e) => setCharName(e.target.value)}
								/>
								<Button
									size="sm"
									disabled={addChar.isPending || !charName.trim()}
									onClick={() =>
										addChar.mutate(charName, {
											onSuccess: () => setCharName(""),
										})
									}
								>
									{addChar.isPending ? "..." : "Add"}
								</Button>
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								{charsLoading && (
									<div className="text-xs text-muted-foreground italic">
										Loading characteristics...
									</div>
								)}
								{!charsLoading &&
									((characteristics as StoreCharacteristic[]) || []).map(
										(c) => {
											const updating = editingChar === c.id;
											return (
												<Card key={c.id} className="border-dashed relative">
													<CardHeader className="py-3 pr-10 space-y-2">
														{updating ? (
															<form
																onSubmit={(e) => {
																	e.preventDefault();
																	if (!charValue.trim()) return;
																	updateCharGeneric.mutate(
																		{ id: c.id, name: charValue },
																		{
																			onSuccess: () => {
																				setEditingChar(null);
																				setCharValue("");
																			},
																		},
																	);
																}}
																className="flex items-center gap-2"
															>
																<Input
																	autoFocus
																	value={charValue}
																	onChange={(e) => setCharValue(e.target.value)}
																	placeholder="Characteristic name"
																	className="h-8 text-xs"
																/>
																<Button
																	size="sm"
																	type="submit"
																	className="h-8 px-3 text-xs"
																>
																	Save
																</Button>
																<Button
																	type="button"
																	size="sm"
																	variant="ghost"
																	className="h-8 px-3 text-xs"
																	onClick={() => {
																		setEditingChar(null);
																		setCharValue("");
																	}}
																>
																	Cancel
																</Button>
															</form>
														) : (
															<CardTitle className="text-sm font-medium flex items-center justify-between gap-2">
																<span>{c.name}</span>
																<div className="flex items-center gap-2">
																	<button
																		type="button"
																		className="text-primary text-xs"
																		onClick={() => {
																			setEditingChar(c.id);
																			setCharValue(c.name);
																		}}
																	>
																		edit
																	</button>
																	<button
																		type="button"
																		className="text-destructive text-xs"
																		onClick={() => delChar.mutate(c.id)}
																	>
																		×
																	</button>
																</div>
															</CardTitle>
														)}
													</CardHeader>
													<CardContent className="space-y-3 pt-0">
														<VariantEditor
															characteristic={c}
															itemId={item.id}
														/>
													</CardContent>
												</Card>
											);
										},
									)}
								{!charsLoading &&
									(!characteristics ||
										(characteristics as StoreCharacteristic[]).length ===
											0) && (
										<div className="text-xs text-muted-foreground italic">
											No characteristics yet
										</div>
									)}
							</div>
						</div>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}

// (DragDropZone moved to reusable component ImageUploadZone)

function VariantEditor({
	characteristic,
	itemId,
}: {
	characteristic: StoreCharacteristic;
	itemId: string;
}) {
	const [value, setValue] = React.useState("");
	const addVar = useAddVariant(characteristic.id, itemId);
	const delVar = useDeleteVariant(itemId);
	const updateVarGeneric = useUpdateVariantGeneric(itemId); // single hook instance
	const [editing, setEditing] = React.useState<string | null>(null);
	const [editValue, setEditValue] = React.useState("");
	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Input
					placeholder="Add variant"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<Button
					size="sm"
					disabled={!value.trim() || addVar.isPending}
					onClick={() =>
						addVar.mutate(value, { onSuccess: () => setValue("") })
					}
				>
					{addVar.isPending ? "..." : "Add"}
				</Button>
			</div>
			<div className="flex flex-wrap gap-2">
				{(characteristic.variants || []).map((v: StoreVariant) => {
					const isEditing = editing === v.id;
					return (
						<span
							key={v.id}
							className="px-2 py-1 rounded bg-muted text-xs flex items-center gap-1"
						>
							{isEditing ? (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										if (!editValue.trim()) return;
										updateVarGeneric.mutate(
											{ id: v.id, value: editValue },
											{
												onSuccess: () => {
													setEditing(null);
													setEditValue("");
												},
											},
										);
									}}
									className="flex items-center gap-1"
								>
									<Input
										value={editValue}
										onChange={(e) => setEditValue(e.target.value)}
										autoFocus
										className="h-6 w-24 text-[10px]"
									/>
									<Button size="sm" type="submit" className="h-6 px-2">
										Save
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-6 px-2"
										onClick={() => setEditing(null)}
									>
										Cancel
									</Button>
								</form>
							) : (
								<>
									<span>{v.value}</span>
									<button
										type="button"
										className="text-primary"
										onClick={() => {
											setEditing(v.id);
											setEditValue(v.value);
										}}
									>
										edit
									</button>
									<button
										type="button"
										className="text-destructive"
										onClick={() => delVar.mutate(v.id)}
									>
										×
									</button>
								</>
							)}
						</span>
					);
				})}
				{(!characteristic.variants || characteristic.variants.length === 0) && (
					<span className="text-[10px] text-muted-foreground">No variants</span>
				)}
			</div>
		</div>
	);
}

function OrderRow({
	order,
	onAction,
}: {
	order: OrderDTO;
	onAction: (action: "paid" | "confirm" | "accept") => void;
}) {
	return (
		<TableRow>
			<TableCell className="font-mono text-xs opacity-70">
				{order.id.slice(0, 8)}
			</TableCell>
			<TableCell>{order.userId.slice(0, 8)}</TableCell>
			<TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
			<TableCell className="text-center">{order.paid ? "Paid" : "-"}</TableCell>
			<TableCell className="text-center">
				{order.confirmed ? "Confirmed" : "-"}
			</TableCell>
			<TableCell className="text-center">
				{order.accepted ? "Accepted" : "-"}
			</TableCell>
			<TableCell className="flex gap-2">
				{!order.paid && (
					<Button
						size="sm"
						onClick={() => onAction("paid")}
						variant="secondary"
					>
						{"Mark Paid"}
					</Button>
				)}
				{order.paid && !order.confirmed && (
					<Button
						size="sm"
						onClick={() => onAction("confirm")}
						variant="secondary"
					>
						{"Confirm"}
					</Button>
				)}
				{order.confirmed && !order.accepted && (
					<Button
						size="sm"
						onClick={() => onAction("accept")}
						variant="secondary"
					>
						{"Accept"}
					</Button>
				)}
			</TableCell>
		</TableRow>
	);
}

type ToggleOption = "all" | "yes" | "no";
type OrderActionType = "paid" | "confirm" | "accept";

function isToggleOption(value: string): value is ToggleOption {
	return value === "all" || value === "yes" || value === "no";
}

export default function AdminStorePage() {
	const { t } = useTranslation();
	const [tab, setTab] = useState<"items" | "orders">("items");
	// Filters state for items listing
	const [filters, setFilters] = useState<{
		search: string;
		published: ToggleOption;
		featured: ToggleOption;
		minPrice: string;
		maxPrice: string;
	}>(
		{
		search: "",
		published: "all",
		featured: "all",
		minPrice: "",
		maxPrice: "",
		},
	);

	const { data: items, isLoading: itemsLoading } = useStoreItems({
		limit: 200,
		search: filters.search || undefined,
		published:
			filters.published === "all"
				? undefined
				: filters.published === "yes"
					? true
					: false,
		featured:
			filters.featured === "all"
				? undefined
				: filters.featured === "yes"
					? true
					: false,
		minPrice: filters.minPrice
			? Math.round(parseFloat(filters.minPrice) * 100)
			: undefined,
		maxPrice: filters.maxPrice
			? Math.round(parseFloat(filters.maxPrice) * 100)
			: undefined,
	});
	const { data: orders, isLoading: ordersLoading } = useStoreOrders(true);
	const createItem = useCreateItem();
	const deleteItem = useDeleteItem();
	// const updateItem = useUpdateItem(""); // removed unused updater
	const orderAction = useOrderAction();

	const handleTriStateChange = (
		key: "published" | "featured",
		value: string,
	) => {
		if (isToggleOption(value)) {
			setFilters((f) => ({ ...f, [key]: value }));
		}
	};

	const handleOrderAction = (orderId: string, action: OrderActionType) => {
		orderAction.mutate({ id: orderId, action });
	};

	const [form, setForm] = useState({
		name: "",
		description: "",
		price: "0",
		published: false,
		featured: false,
		images: [] as string[], // uploaded image ids
	});

	// Image upload state
	const [uploading, setUploading] = useState(false);
	const [uploadErrors, setUploadErrors] = useState<string[]>([]);

	async function handleFiles(files: FileList | null) {
		if (!files) return;
		const fileArr = Array.from(files).slice(0, 5 - form.images.length); // cap at 5
		if (fileArr.length === 0) return;
		setUploading(true);
		setUploadErrors([]);
		const newIds: string[] = [];
		for (const f of fileArr) {
			if (!f.type.startsWith("image/")) {
				setUploadErrors((e) => [...e, `${f.name}: invalid type`]);
				continue;
			}
			if (f.size > 5 * 1024 * 1024) {
				setUploadErrors((e) => [...e, `${f.name}: >5MB`]);
				continue;
			}
			try {
				const info = await filesApi.uploadSingle(f);
				newIds.push(info.id);
			} catch (err) {
				const message = err instanceof Error ? err.message : "upload failed";
				setUploadErrors((e) => [...e, `${f.name}: ${message}`]);
			}
		}
		setForm((fm) => ({ ...fm, images: [...fm.images, ...newIds] }));
		setUploading(false);
	}

	function removeImage(id: string) {
		setForm((fm) => ({ ...fm, images: fm.images.filter((i) => i !== id) }));
	}

	function submitNewItem(e: React.FormEvent) {
		e.preventDefault();
		createItem.mutate(
			{
				name: form.name,
				description: form.description,
				price: Math.round(parseFloat(form.price) * 100),
				published: form.published,
				featured: form.featured,
				images: form.images,
			},
			{
				onSuccess: () =>
					setForm({
						name: "",
						description: "",
						price: "0",
						published: false,
						featured: false,
						images: [],
					}),
			},
		);
	}

	function resetFilters() {
		setFilters({
			search: "",
			published: "all",
			featured: "all",
			minPrice: "",
			maxPrice: "",
		});
	}

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">
						{t("admin.store.title", "Store Management")}
					</h1>
				</div>
				<Tabs
					value={tab}
					onValueChange={(v) => setTab(v as "items" | "orders")}
				>
					<TabsList>
						<TabsTrigger value="items">
							{t("admin.store.itemsTab", "Items")}
						</TabsTrigger>
						<TabsTrigger value="orders">
							{t("admin.store.ordersTab", "Orders")}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="items" className="space-y-8 pt-4">
						{/* Filters Panel */}
						<Card className="border-dashed">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium flex items-center justify-between">
									<span>{t("admin.store.filters", "Filters")}</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={resetFilters}
										className="text-xs"
									>
										{t("common.reset", "Reset")}
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-4 md:grid-cols-5">
								<div className="md:col-span-2 flex flex-col gap-1">
									<label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
										{t("admin.store.filters.search", "Search")}
									</label>
									<Input
										placeholder={t(
											"admin.store.filters.searchPh",
											"Name or description",
										)}
										value={filters.search}
										onChange={(e) =>
											setFilters((f) => ({ ...f, search: e.target.value }))
										}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
										{t("admin.store.filters.published", "Published")}
									</label>
									<select
										className="h-9 rounded-md border bg-background/50 px-2 text-xs"
										value={filters.published}
										onChange={(e) => handleTriStateChange("published", e.target.value)}
									>
										<option value="all">{t("common.all", "All")}</option>
										<option value="yes">{t("common.yes", "Yes")}</option>
										<option value="no">{t("common.no", "No")}</option>
									</select>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
										{t("admin.store.filters.featured", "Featured")}
									</label>
									<select
										className="h-9 rounded-md border bg-background/50 px-2 text-xs"
										value={filters.featured}
										onChange={(e) => handleTriStateChange("featured", e.target.value)}
									>
										<option value="all">{t("common.all", "All")}</option>
										<option value="yes">{t("common.yes", "Yes")}</option>
										<option value="no">{t("common.no", "No")}</option>
									</select>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
										{t("admin.store.filters.minPrice", "Min Price")}
									</label>
									<Input
										placeholder="0.00"
										value={filters.minPrice}
										onChange={(e) =>
											setFilters((f) => ({ ...f, minPrice: e.target.value }))
										}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
										{t("admin.store.filters.maxPrice", "Max Price")}
									</label>
									<Input
										placeholder="999.99"
										value={filters.maxPrice}
										onChange={(e) =>
											setFilters((f) => ({ ...f, maxPrice: e.target.value }))
										}
									/>
								</div>
							</CardContent>
						</Card>
						<Card className="max-w-xl">
							<CardHeader>
								<CardTitle className="text-sm font-medium">
									{t("admin.store.createItem", "Create Item")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<form onSubmit={submitNewItem} className="space-y-4">
									<Input
										placeholder={t("admin.store.form.namePh", "Name")}
										value={form.name}
										onChange={(e) =>
											setForm((f) => ({ ...f, name: e.target.value }))
										}
									/>
									<Textarea
										placeholder={t(
											"admin.store.form.descriptionPh",
											"Description",
										)}
										value={form.description}
										onChange={(e) =>
											setForm((f) => ({ ...f, description: e.target.value }))
										}
									/>
									<Input
										placeholder={t(
											"admin.store.form.pricePh",
											"Price (e.g. 9.99)",
										)}
										value={form.price}
										onChange={(e) =>
											setForm((f) => ({ ...f, price: e.target.value }))
										}
									/>
									{/* Image Upload Area */}
									<div className="space-y-2">
										<label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
											{t("admin.store.images", "Images")}
										</label>
										<ImageUploadZone
											onFiles={(fl: FileList) => handleFiles(fl)}
											disabled={uploading || form.images.length >= 5}
											imagesCount={form.images.length}
										/>
										{uploadErrors.length > 0 && (
											<ul className="text-[10px] text-destructive space-y-0.5">
												{uploadErrors.map((er, i) => (
													<li key={i}>{er}</li>
												))}
											</ul>
										)}
										{form.images.length > 0 && (
											<div className="flex flex-wrap gap-2 pt-1">
												{form.images.map((id) => (
													<div
														key={id}
														className="relative group w-20 h-20 rounded-md overflow-hidden border bg-muted/30"
													>
														{/* eslint-disable-next-line @next/next/no-img-element */}
														<img
															src={`/api/files/${id}/download`}
															alt="item image"
															className="object-cover w-full h-full"
															loading="lazy"
														/>
														<button
															type="button"
															onClick={() => removeImage(id)}
															className="absolute top-1 right-1 bg-black/60 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition"
															aria-label={t(
																"admin.store.removeImage",
																"Remove image",
															)}
														>
															<XIcon className="w-3 h-3" />
														</button>
													</div>
												))}
											</div>
										)}
										<p className="text-[10px] text-muted-foreground">
											{uploading
												? t("admin.store.uploading", "Uploading...")
												: t(
														"admin.store.imagesHelp",
														"Up to 5 images. Max 5MB each. Drag & drop or click.",
													)}
										</p>
									</div>
									<div className="flex flex-col gap-2">
										<label className="flex items-center gap-2 text-sm">
											<Checkbox
												checked={form.published}
												onCheckedChange={(v: boolean) =>
													setForm((f) => ({ ...f, published: v }))
												}
											/>{" "}
											{t("admin.store.published", "Published")}
										</label>
										<label className="flex items-center gap-2 text-sm">
											<Checkbox
												checked={form.featured}
												onCheckedChange={(v: boolean) =>
													setForm((f) => ({ ...f, featured: v }))
												}
											/>{" "}
											{t("admin.store.featured", "Featured")}
										</label>
									</div>
									<Button
										type="submit"
										disabled={createItem.isPending || uploading}
										size="sm"
									>
										{createItem.isPending || uploading ? (
											<span className="flex items-center gap-1">
												<Loader2 className="w-4 h-4 animate-spin" />
												{t("admin.store.form.submitting", "Saving...")}
											</span>
										) : (
											t("admin.store.form.submit", "Add Item")
										)}
									</Button>
								</form>
							</CardContent>
						</Card>
						<div>
							<h2 className="font-semibold mb-3 text-sm tracking-wide uppercase text-muted-foreground">
								{t("admin.store.itemsList", "Items List")}
							</h2>
							{itemsLoading ? (
								<p className="text-sm text-muted-foreground">
									{t("admin.store.loadingItems", "Loading items...")}
								</p>
							) : (
								<Card>
									<CardContent className="p-0">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-[80px]">ID</TableHead>
													<TableHead>{t("admin.store.name", "Name")}</TableHead>
													<TableHead>
														{t("admin.store.price", "Price")}
													</TableHead>
													<TableHead className="text-center">
														{t("admin.store.published", "Published")}
													</TableHead>
													<TableHead className="text-center">
														{t("admin.store.featured", "Featured")}
													</TableHead>
													<TableHead>
														{t("admin.store.actions", "Actions")}
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{items?.map((it) => (
													<ItemRow
														key={it.id}
														item={it}
														onDelete={() => deleteItem.mutate(it.id)}
													/>
												))}
											</TableBody>
										</Table>
									</CardContent>
								</Card>
							)}
						</div>
					</TabsContent>
					<TabsContent value="orders" className="space-y-8 pt-4">
						<div>
							<h2 className="font-semibold mb-3 text-sm tracking-wide uppercase text-muted-foreground">
								{t("admin.store.ordersList", "Orders")}
							</h2>
							{ordersLoading ? (
								<p className="text-sm text-muted-foreground">
									{t("admin.store.loadingOrders", "Loading orders...")}
								</p>
							) : (
								<Card>
									<CardContent className="p-0">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-[80px]">ID</TableHead>
													<TableHead>
														{t("admin.store.order.user", "User")}
													</TableHead>
													<TableHead>
														{t("admin.store.order.created", "Created")}
													</TableHead>
													<TableHead className="text-center">
														{t("admin.store.order.paid", "Paid")}
													</TableHead>
													<TableHead className="text-center">
														{t("admin.store.order.confirmed", "Confirmed")}
													</TableHead>
													<TableHead className="text-center">
														{t("admin.store.order.accepted", "Accepted")}
													</TableHead>
													<TableHead>
														{t("admin.store.actions", "Actions")}
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{orders?.map((o) => (
													<OrderRow
														key={o.id}
														order={o}
														onAction={(action) => handleOrderAction(o.id, action)}
													/>
												))}
											</TableBody>
										</Table>
									</CardContent>
								</Card>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</AdminLayout>
	);
}
