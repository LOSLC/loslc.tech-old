"use client";

import {
	BookOpen,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Eye,
	FileText,
	Filter,
	Grid,
	Hash,
	List,
	RefreshCw,
	Search,
	Share2,
	SortAsc,
	SortDesc,
	TrendingUp,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LikeButton } from "@/components/blog/LikeButton";
import { UserDisplay } from "@/components/common/UserDisplay";
import FloatingNav from "@/components/core/FloatingNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type BlogPostDTO, type GetBlogPostsQueryDTO } from "@/lib/api/blog";
import {
	useBlogCategories,
	useBlogPosts,
	useBlogTags,
	useFeaturedPosts,
	usePrefetchBlogPost,
} from "@/lib/hooks/use-blog";
import { createPostSlug } from "@/lib/utils/slug";

interface HeroSectionProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	handleSearch: () => void;
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;
	setCurrentPage: (page: number) => void;
	categories: { id: string; name: string }[];
	selectedTag: string;
	setSelectedTag: (tag: string) => void;
	tags: { id: string; name: string }[];
	sortOrder: "asc" | "desc";
	setSortOrder: (order: "asc" | "desc") => void;
	viewMode: "grid" | "list";
	setViewMode: (mode: "grid" | "list") => void;
	activeFilters: string[];
	clearFilters: () => void;
}

const HeroSection = ({
	searchQuery,
	setSearchQuery,
	handleSearch,
	selectedCategory,
	setSelectedCategory,
	setCurrentPage,
	categories,
	selectedTag,
	setSelectedTag,
	tags,
	sortOrder,
	setSortOrder,
	viewMode,
	setViewMode,
	activeFilters,
	clearFilters,
}: HeroSectionProps) => {
	const { t } = useTranslation();
	return (
		<section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
			{/* Background decorative elements (reduced motion) */}
			<div className="absolute inset-0 opacity-[0.03] [@media(prefers-reduced-motion:reduce)]:hidden">
				<div className="absolute top-20 left-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/80 motion-preset-pulse motion-duration-[6s]"></div>
				<div className="absolute bottom-32 right-28 w-16 h-16 rounded-full bg-secondary/80 motion-preset-pulse motion-duration-[7s]"></div>
				<div className="absolute top-40 right-1/4 w-40 h-40 rounded-md border border-primary/20 rotate-45"></div>
				<div className="absolute bottom-40 left-1/3 w-28 h-28 rounded-md border border-secondary/20 -rotate-12"></div>
			</div>

			<div className="relative max-w-6xl mx-auto text-center">
				<div className="flex items-center justify-center space-x-2 mb-6">
					<BookOpen className="w-6 h-6 text-primary" />
					<p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
						{t("blog.badge")}
					</p>
				</div>

				<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
					{t("blog.title")}
				</h1>

				<p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
					{t("blog.subtitle")}
				</p>

				{/* Enhanced Search and Filter Section */}
				<div className="space-y-6 max-w-4xl mx-auto">
					{/* Main Search Bar */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSearch();
						}}
						className="flex flex-col sm:flex-row gap-3"
					>
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								type="text"
								placeholder={t("blog.searchPlaceholder")}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-12 pl-10 pr-4 text-base border-border bg-background/60 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
								aria-label={t("common.search")}
							/>
						</div>
						<Button
							type="submit"
							className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 h-12 rounded-xl shadow-sm"
						>
							<Search className="w-4 h-4 mr-2" />
							{t("common.search")}
						</Button>
					</form>

					{/* Filters Row */}
					<div className="flex flex-wrap gap-4 items-center justify-center">
						{/* Category Filter */}
						<div className="flex items-center space-x-2">
							<Filter className="w-4 h-4 text-muted-foreground" />
							<Select
								value={selectedCategory}
								onValueChange={(value) => {
									setSelectedCategory(value);
									setCurrentPage(1);
								}}
							>
								<SelectTrigger className="w-40 h-10 bg-background/70 border-border">
									<SelectValue placeholder={t("common.category")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										{t("common.allCategories")}
									</SelectItem>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Tag Filter */}
						<div className="flex items-center space-x-2">
							<Hash className="w-4 h-4 text-muted-foreground" />
							<Select
								value={selectedTag}
								onValueChange={(value) => {
									setSelectedTag(value);
									setCurrentPage(1);
								}}
							>
								<SelectTrigger className="w-32 h-10 bg-background/70 border-border">
									<SelectValue placeholder={t("common.tag")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">{t("common.allTags")}</SelectItem>
									{tags.slice(0, 10).map((tag) => (
										<SelectItem key={tag.id} value={tag.id}>
											{tag.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Sort Order */}
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setSortOrder(sortOrder === "desc" ? "asc" : "desc")
							}
							className="h-10 bg-background/50 backdrop-blur-sm border-border hover:bg-accent/50"
						>
							{sortOrder === "desc" ? (
								<SortDesc className="w-4 h-4 mr-1" />
							) : (
								<SortAsc className="w-4 h-4 mr-1" />
							)}
							{sortOrder === "desc" ? t("common.newest") : t("common.oldest")}
						</Button>

						{/* View Mode Toggle */}
						<div className="flex border rounded-lg overflow-hidden bg-background/70">
							<Button
								variant={viewMode === "grid" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("grid")}
								className="h-10 rounded-none border-0"
							>
								<Grid className="w-4 h-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
								className="h-10 rounded-none border-0"
							>
								<List className="w-4 h-4" />
							</Button>
						</div>
					</div>

					{/* Active Filters */}
					{activeFilters.length > 0 && (
						<div className="flex flex-wrap gap-2 items-center justify-center">
							<span className="text-sm text-muted-foreground">
								{t("common.activeFilters")}
							</span>
							{activeFilters.map((filter, index) => (
								<Badge key={index} variant="secondary" className="gap-1">
									{filter}
								</Badge>
							))}
							<Button
								variant="ghost"
								size="sm"
								onClick={clearFilters}
								className="h-6 px-2 text-xs hover:bg-destructive/20 hover:text-destructive"
							>
								<X className="w-3 h-3 mr-1" />
								{t("common.clearAll")}
							</Button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default function BlogPage() {
	const { t, i18n } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSearchQuery, setActiveSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedTag, setSelectedTag] = useState<string>("all");
	const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [currentPage, setCurrentPage] = useState(1);

	const POSTS_PER_PAGE = 12;

	const postsQuery = useMemo<GetBlogPostsQueryDTO>(() => {
		const query: GetBlogPostsQueryDTO = {
			limit: POSTS_PER_PAGE,
			offset: (currentPage - 1) * POSTS_PER_PAGE,
		};

		if (activeSearchQuery.trim()) {
			query.query = activeSearchQuery.trim();
		}
		if (selectedCategory !== "all") {
			query.categoryId = selectedCategory;
		}
		if (selectedTag !== "all") {
			query.tag = selectedTag;
		}

		return query;
	}, [activeSearchQuery, selectedCategory, selectedTag, currentPage]);

	// React Query hooks
	const {
		data: posts = [],
		isLoading: postsLoading,
		error: postsError,
		refetch: refetchPosts,
	} = useBlogPosts(postsQuery);

	const { data: featuredPosts = [], isLoading: featuredLoading } =
		useFeaturedPosts(3);

	const { data: categories = [], isLoading: categoriesLoading } =
		useBlogCategories();

	const { data: tags = [], isLoading: tagsLoading } = useBlogTags();

	const prefetchPost = usePrefetchBlogPost();

	// Combined loading state
	const isLoading =
		postsLoading || featuredLoading || categoriesLoading || tagsLoading;

	// Handle search and filtering
	const handleSearch = () => {
		setActiveSearchQuery(searchQuery);
		setCurrentPage(1);
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setActiveSearchQuery("");
		setSelectedCategory("all");
		setSelectedTag("all");
		setCurrentPage(1);
	};

	// Calculate active filters
	const activeFilters = useMemo(() => {
		const filters: string[] = [];

		if (activeSearchQuery.trim()) {
			filters.push(`Search: "${activeSearchQuery}"`);
		}

		// Only add category/tag names if the data is loaded
		if (selectedCategory !== "all") {
			// Use a fallback if categories aren't loaded yet
			const categoryName =
				categories.find((c) => c.id === selectedCategory)?.name ||
				selectedCategory;
			filters.push(`Category: ${categoryName}`);
		}

		if (selectedTag !== "all") {
			// Use a fallback if tags aren't loaded yet
			const tagName =
				tags.find((t) => t.id === selectedTag)?.name || selectedTag;
			filters.push(`Tag: ${tagName}`);
		}

		return filters;
	}, [activeSearchQuery, selectedCategory, selectedTag, categories, tags]);

	// Calculate total pages (this would ideally come from backend with pagination meta)
	const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

	// Calculate reading time
	const calculateReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		return Math.ceil(wordCount / wordsPerMinute);
	};

	// Format date
	const formatDate = (date: Date | string) => {
		const locale = i18n.language || "en";
		return new Date(date).toLocaleDateString(locale, {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	// Enhanced Blog card component with better design and features
	const BlogCard = ({
		post,
		variant = "default",
	}: {
		post: BlogPostDTO;
		variant?: "default" | "compact";
	}) => {
		const readingTime = calculateReadingTime(post.content);

		// Prefetch post data on hover for better UX
		const handleMouseEnter = () => {
			prefetchPost(post.id);
		};

		if (variant === "compact") {
			return (
				<Link
					href={`/blog/post/${createPostSlug(post.title, post.id)}`}
					onMouseEnter={handleMouseEnter}
				>
					<div className="group flex items-start space-x-4 p-4 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
						<div className="relative w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex-shrink-0 overflow-hidden">
							{post.coverImageId && (
								<Image
									src={`/api/files/${post.coverImageId}/download`}
									alt={post.title}
									fill
									className="object-cover"
								/>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-2">
								{post.featured && (
									<Badge variant="default" className="h-5 text-xs">
										<TrendingUp className="w-3 h-3 mr-1" />
										{t("blog.card.featured")}
									</Badge>
								)}
								<Badge variant="outline" className="h-5 text-xs">
									<Clock className="w-3 h-3 mr-1" />
									{t("blog.card.minRead", {
										count: readingTime,
										read: t("common.read"),
									})}
								</Badge>
							</div>

							<h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
								{post.title}
							</h3>

							<p className="text-muted-foreground text-sm line-clamp-2 mb-3">
								{post.description}
							</p>

							<div className="flex items-center text-xs text-muted-foreground">
								<Calendar className="w-3 h-3 mr-1" />
								{formatDate(post.createdAt)}
								<span className="mx-2">•</span>
								<UserDisplay
									userId={post.authorId}
									showAvatar
									className="text-xs"
								/>
							</div>
						</div>
					</div>
				</Link>
			);
		}

		return (
			<Link
				href={`/blog/post/${createPostSlug(post.title, post.id)}`}
				onMouseEnter={handleMouseEnter}
			>
				<div className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-colors duration-200 hover:border-primary/30 h-full flex flex-col">
					<div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex-shrink-0">
						{post.coverImageId && (
							<Image
								src={`/api/files/${post.coverImageId}/download`}
								alt={post.title}
								fill
								className="object-cover"
							/>
						)}
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

						{/* Top badges */}
						<div className="absolute top-4 left-4 flex gap-2">
							<Badge
								variant="secondary"
								className="bg-background/90 text-foreground"
							>
								<FileText className="w-3 h-3 mr-1" />
								{t("blog.card.article")}
							</Badge>
							{post.featured && (
								<Badge className="bg-primary text-primary-foreground">
									<TrendingUp className="w-3 h-3 mr-1" />
									{t("blog.card.featured")}
								</Badge>
							)}
						</div>

						{/* Reading time badge */}
						<div className="absolute top-4 right-4">
							<Badge
								variant="outline"
								className="bg-background/90 text-foreground border-border/50"
							>
								<Clock className="w-3 h-3 mr-1" />
								{t("blog.card.minRead", {
									count: readingTime,
									read: t("common.read"),
								})}
							</Badge>
						</div>

						{/* Interaction buttons */}
						<div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity [@media(prefers-reduced-motion:reduce)]:hidden">
							<LikeButton postId={post.id} size="sm" withCount={false} />
							<Button
								size="sm"
								variant="ghost"
								className="h-8 w-8 p-0 bg-foreground/40 hover:bg-background"
							>
								<Share2 className="w-4 h-4 stroke-foreground" />
							</Button>
						</div>
					</div>

					<div className="p-6 flex flex-col flex-grow">
						<h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
							{post.title}
						</h3>

						<p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
							{post.description}
						</p>

						<div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
							<div className="flex items-center space-x-4">
								<div className="flex items-center">
									<Calendar className="w-3 h-3 mr-1" />
									{formatDate(post.createdAt)}
								</div>
								<UserDisplay
									userId={post.authorId}
									showAvatar
									className="text-xs"
								/>
							</div>

							<div className="flex items-center space-x-2">
								<div className="flex items-center">
									<Eye className="w-3 h-3 mr-1" />0
								</div>
								<LikeButton postId={post.id} size="sm" />
							</div>
						</div>
					</div>
				</div>
			</Link>
		);
	};

	// Enhanced Sidebar item component with improved design
	const SidebarItem = ({
		post,
		showImage = true,
	}: {
		post: BlogPostDTO;
		showImage?: boolean;
	}) => {
		const readingTime = calculateReadingTime(post.content);

		return (
			<Link href={`/blog/post/${createPostSlug(post.title, post.id)}`}>
				<div className="flex space-x-3 group cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border">
					{showImage && (
						<div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex-shrink-0 overflow-hidden border border-border">
							{post.coverImageId ? (
								<Image
									src={`/api/files/${post.coverImageId}/download`}
									alt={post.title}
									width={64}
									height={64}
									className="object-cover w-full h-full"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<FileText className="w-6 h-6 text-muted-foreground" />
								</div>
							)}
						</div>
					)}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<p className="text-xs text-muted-foreground flex items-center">
								<Calendar className="w-3 h-3 mr-1" />
								{formatDate(post.createdAt)}
							</p>
							{post.featured && (
								<Badge variant="outline" className="h-4 text-xs px-1">
									{t("blog.card.featured")}
								</Badge>
							)}
						</div>
						<h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
							{post.title}
						</h4>
						<div className="flex items-center text-xs text-muted-foreground">
							<Clock className="w-3 h-3 mr-1" />
							{t("blog.card.minRead", {
								count: readingTime,
								read: t("common.read"),
							})}
						</div>
					</div>
				</div>
			</Link>
		);
	};

	// Pagination component
	const Pagination = () => {
		if (totalPages <= 1) return null;

		return (
			<div className="flex items-center justify-center space-x-2 mt-12">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
					disabled={currentPage === 1}
					className="gap-1"
				>
					<ChevronLeft className="w-4 h-4" />
					{t("common.previous")}
				</Button>

				<div className="flex items-center space-x-1">
					{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						const page = i + 1;
						return (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								size="sm"
								onClick={() => setCurrentPage(page)}
								className="w-10"
							>
								{page}
							</Button>
						);
					})}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage((prev) => Math.min(totalPages, prev + 1))
					}
					disabled={currentPage === totalPages}
					className="gap-1"
				>
					{t("common.next")}
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-background">
			<FloatingNav />
			<HeroSection
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				handleSearch={handleSearch}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				setCurrentPage={setCurrentPage}
				categories={categories}
				selectedTag={selectedTag}
				setSelectedTag={setSelectedTag}
				tags={tags}
				sortOrder={sortOrder}
				setSortOrder={setSortOrder}
				viewMode={viewMode}
				setViewMode={setViewMode}
				activeFilters={activeFilters}
				clearFilters={clearFilters}
			/>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Left Column - Blog Cards */}
					<div className="lg:col-span-3">
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center space-x-3">
								<FileText className="w-8 h-8 text-primary" />
								<h2 className="text-3xl font-bold text-foreground">
									{t("blog.latest")}
								</h2>
							</div>

							{/* Results counter */}
							{!isLoading && (
								<div className="text-sm text-muted-foreground">
									{t("blog.count", { count: posts.length })}
								</div>
							)}
						</div>

						{isLoading ? (
							<div
								className={
									viewMode === "grid"
										? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
										: "space-y-4"
								}
							>
								{[...Array(6)].map((_, i) => (
									<div key={i} className="animate-pulse">
										{viewMode === "grid" ? (
											<>
												<div className="bg-muted h-48 rounded-xl mb-4"></div>
												<div className="space-y-3">
													<div className="h-4 bg-muted rounded w-3/4"></div>
													<div className="h-4 bg-muted rounded w-1/2"></div>
												</div>
											</>
										) : (
											<div className="flex space-x-4 p-4">
												<div className="w-24 h-24 bg-muted rounded-lg"></div>
												<div className="flex-1 space-y-2">
													<div className="h-4 bg-muted rounded w-3/4"></div>
													<div className="h-3 bg-muted rounded w-1/2"></div>
													<div className="h-3 bg-muted rounded w-1/3"></div>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<>
								{posts.length > 0 ? (
									<div
										className={
											viewMode === "grid"
												? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
												: "space-y-4 flex flex-col"
										}
									>
										{posts.map((post) => (
											<BlogCard
												key={post.id}
												post={post}
												variant={viewMode === "list" ? "compact" : "default"}
											/>
										))}
									</div>
								) : (
									<div className="text-center py-16">
										<div className="w-24 h-24 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
											<FileText className="w-12 h-12 text-muted-foreground" />
										</div>
										<h3 className="text-xl font-semibold text-foreground mb-2">
											{t("blog.emptyTitle")}
										</h3>
										<p className="text-muted-foreground mb-6 max-w-md mx-auto">
											{searchQuery ||
											selectedCategory !== "all" ||
											selectedTag !== "all" ? (
												<>{t("blog.emptyFiltered")}</>
											) : (
												t("blog.empty")
											)}
										</p>
										{activeFilters.length > 0 && (
											<Button onClick={clearFilters} variant="outline">
												<X className="w-4 h-4 mr-2" />
												{t("common.clearFilters")}
											</Button>
										)}
									</div>
								)}

								{/* Error State */}
								{postsError && (
									<div className="text-center py-16">
										<div className="w-24 h-24 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
											<X className="w-12 h-12 text-destructive" />
										</div>
										<h3 className="text-xl font-semibold text-foreground mb-2">
											{t("blog.errorTitle")}
										</h3>
										<p className="text-muted-foreground mb-6 max-w-md mx-auto">
											{t("blog.errorText")}
										</p>
										<Button onClick={() => refetchPosts()} variant="outline">
											<RefreshCw className="w-4 h-4 mr-2" />
											{t("common.tryAgain")}
										</Button>
									</div>
								)}

								{/* Pagination */}
								<Pagination />
							</>
						)}
					</div>

					{/* Right Column - Enhanced Sidebar */}
					<div className="lg:col-span-1">
						<div className="space-y-8 sticky top-8">
							{/* Featured Section */}
							<div className="bg-card rounded-xl p-6 border border-border shadow-sm">
								<div className="flex items-center space-x-2 mb-6">
									<TrendingUp className="w-5 h-5 text-primary" />
									<h3 className="text-xl font-bold text-foreground">
										{t("blog.featured")}
									</h3>
								</div>
								<div className="space-y-4">
									{featuredPosts.length > 0 ? (
										featuredPosts.map((post) => (
											<SidebarItem key={post.id} post={post} />
										))
									) : (
										<div className="text-center py-6">
											<TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
											<p className="text-muted-foreground text-sm">
												{t("blog.noFeatured")}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Categories Section */}
							{categories.length > 0 && (
								<div className="bg-card rounded-xl p-6 border border-border shadow-sm">
									<div className="flex items-center space-x-2 mb-6">
										<Hash className="w-5 h-5 text-primary" />
										<h3 className="text-xl font-bold text-foreground">
											{t("blog.categories")}
										</h3>
									</div>
									<div className="space-y-2">
										{categories.slice(0, 8).map((category) => (
											<Button
												key={category.id}
												variant={
													selectedCategory === category.id ? "default" : "ghost"
												}
												size="sm"
												onClick={() => {
													setSelectedCategory(category.id);
													setCurrentPage(1);
												}}
												className="w-full justify-start text-left"
											>
												{category.name}
											</Button>
										))}
									</div>
								</div>
							)}

							{/* Popular Tags */}
							{tags.length > 0 && (
								<div className="bg-card rounded-xl p-6 border border-border shadow-sm">
									<div className="flex items-center space-x-2 mb-6">
										<Hash className="w-5 h-5 text-primary" />
										<h3 className="text-xl font-bold text-foreground">
											{t("blog.popularTags")}
										</h3>
									</div>
									<div className="flex flex-wrap gap-2">
										{tags.slice(0, 12).map((tag) => (
											<Badge
												key={tag.id}
												variant={
													selectedTag === tag.id ? "default" : "secondary"
												}
												className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
												onClick={() => {
													setSelectedTag(tag.id);
													setCurrentPage(1);
												}}
											>
												#{tag.name}
											</Badge>
										))}
									</div>
								</div>
							)}

							{/* Recent Articles Section */}
							<div className="bg-card rounded-xl p-6 border border-border shadow-sm">
								<div className="flex items-center space-x-2 mb-6">
									<BookOpen className="w-5 h-5 text-primary" />
									<h3 className="text-xl font-bold text-foreground">
										{t("blog.recent")}
									</h3>
								</div>
								<div className="space-y-4">
									{posts.slice(0, 4).map((post) => (
										<SidebarItem key={post.id} post={post} />
									))}
								</div>
							</div>

							{/* Newsletter Signup */}
							<div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-border">
								<div className="text-center">
									<div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
										<BookOpen className="w-6 h-6 text-primary" />
									</div>
									<h3 className="text-lg font-bold text-foreground mb-2">
										{t("blog.stayUpdatedTitle")}
									</h3>
									<p className="text-muted-foreground text-sm mb-4">
										{t("blog.stayUpdatedText")}
									</p>
									<Button className="w-full">{t("blog.subscribeCta")}</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
