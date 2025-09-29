"use client";

import {
	ArrowLeft,
	BookOpen,
	Calendar,
	Clock,
	Eye,
	FileText,
	Share2,
	Tag,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { LikeButton } from "@/components/blog/LikeButton";
import { UserDisplay } from "@/components/common/UserDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BlogPostDTO, blogApi } from "@/lib/api/blog";
import { extractPostIdFromSlug, isSlugWithPostId } from "@/lib/utils/slug";

export default function BlogPostPage() {
	const { t, i18n } = useTranslation();
	const params = useParams();
	const slugParam = params.slug as string;
	const [post, setPost] = useState<BlogPostDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
				let blogPost: BlogPostDTO;

				// Check if the parameter is in [slug]-[postId] format
				if (isSlugWithPostId(slugParam)) {
					// Extract postId and use direct lookup for better performance
					const postId = extractPostIdFromSlug(slugParam);
					if (postId) {
						blogPost = await blogApi.getBlogPostById(postId);
					} else {
						throw new Error("Invalid post URL format");
					}
				} else {
					// Fallback: try to use slug-based lookup
					blogPost = await blogApi.getBlogPostBySlug(slugParam);
				}

				setPost(blogPost);
			} catch (err) {
				setError(t("blog.post.notFoundTitle"));
				console.error("Failed to fetch blog post:", err);
			} finally {
				setLoading(false);
			}
		};

		if (slugParam) {
			fetchPost();
		}
	}, [slugParam, t]);

	const formatDate = (date: Date | string) => {
		const locale = i18n.language || "en";
		return new Date(date).toLocaleDateString(locale, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const calculateReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		return Math.ceil(wordCount / wordsPerMinute);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				{/* Header with back button */}
				<div className="bg-card border-b border-border">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
						<div className="animate-pulse">
							<div className="h-8 bg-muted rounded w-24 mb-4"></div>
						</div>
					</div>
				</div>

				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="animate-pulse space-y-8">
						{/* Title and meta */}
						<div className="space-y-4">
							<div className="h-8 bg-muted rounded w-3/4"></div>
							<div className="h-6 bg-muted rounded w-1/2"></div>
							<div className="flex gap-4">
								<div className="h-4 bg-muted rounded w-24"></div>
								<div className="h-4 bg-muted rounded w-32"></div>
								<div className="h-4 bg-muted rounded w-20"></div>
							</div>
						</div>

						{/* Cover image */}
						<div className="h-96 bg-muted rounded-xl"></div>

						{/* Content */}
						<div className="space-y-4">
							<div className="h-4 bg-muted rounded w-full"></div>
							<div className="h-4 bg-muted rounded w-3/4"></div>
							<div className="h-4 bg-muted rounded w-5/6"></div>
							<div className="h-4 bg-muted rounded w-2/3"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-4">
					<div className="w-24 h-24 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
						<FileText className="w-12 h-12 text-destructive" />
					</div>
					<h1 className="text-2xl font-bold text-foreground mb-4">
						{error || t("blog.post.notFoundTitle")}
					</h1>
					<p className="text-muted-foreground mb-6">
						{t("blog.post.notFoundText")}
					</p>
					<Link href="/blog">
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
							<ArrowLeft className="w-4 h-4 mr-2" />
							{t("blog.post.backToBlog")}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Enhanced Header with breadcrumb navigation */}
			<header className="border-b border-border sticky top-0 z-10 bg-card/95 supports-[backdrop-filter]:backdrop-blur-sm">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link href="/blog">
								<Button
									variant="ghost"
									size="sm"
									className="text-muted-foreground hover:text-primary"
								>
									<ArrowLeft className="w-4 h-4 mr-2" />
									{t("blog.post.backToBlog")}
								</Button>
							</Link>
							<div className="hidden sm:flex items-center text-sm text-muted-foreground">
								<Link
									href="/blog"
									className="hover:text-primary transition-colors"
								>
									{t("blog.post.breadcrumbBlog")}
								</Link>
								<span className="mx-2">/</span>
								<span className="text-foreground font-medium truncate max-w-xs">
									{post.title}
								</span>
							</div>
						</div>

						{/* Social sharing buttons */}
						<div className="flex items-center space-x-2">
							{post?.id && <LikeButton postId={post.id} size="sm" />}
							<Button
								size="sm"
								variant="ghost"
								aria-label="Share article"
								className="text-muted-foreground hover:text-primary"
							>
								<Share2 className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<article className="prose prose-lg max-w-none">
					{/* Article Header */}
					<header className="mb-12 text-center">
						{/* Article badges */}
						<div className="flex items-center justify-center gap-2 mb-6">
							<Badge variant="secondary" className="gap-1">
								<FileText className="w-3 h-3" />
								{t("blog.post.badges.article")}
							</Badge>
							{post.featured && (
								<Badge className="bg-primary text-primary-foreground gap-1">
									<TrendingUp className="w-3 h-3" />
									{t("blog.post.badges.featured")}
								</Badge>
							)}
							<Badge variant="outline" className="gap-1">
								<Clock className="w-3 h-3" />
								{t("blog.post.badges.minRead", {
									count: calculateReadingTime(post.content),
								})}
							</Badge>
						</div>

						<h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
							{post.title}
						</h1>

						<p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
							{post.description}
						</p>

						{/* Enhanced Meta Information */}
						<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								<span>
									{t("blog.post.meta.publishedOn", {
										date: formatDate(post.createdAt),
									})}
								</span>
							</div>
							<UserDisplay
								userId={post.authorId}
								showAvatar
								className="text-sm"
							/>
							<div className="flex items-center gap-2">
								<Eye className="w-4 h-4" />
								<span>{t("blog.post.meta.views", { count: 0 })}</span>
							</div>
						</div>
					</header>

					{/* Cover Image */}
					{post.coverImageId && (
						<div className="mb-12">
							<div className="relative w-full h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-border">
								<Image
									src={`/api/files/${post.coverImageId}/download`}
									alt={post.title}
									fill
									className="object-cover"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
							</div>
						</div>
					)}

					{/* Article Content */}
					<div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={{
								code({
									className,
									children,
									...props
								}: {
									className?: string;
									children?: React.ReactNode;
								}) {
									const match = /language-(\w+)/.exec(className || "");
									const isInline = !match;
									return !isInline ? (
										<SyntaxHighlighter
											style={tomorrow}
											language={match[1]}
											PreTag="div"
											{...props}
										>
											{String(children).replace(/\n$/, "")}
										</SyntaxHighlighter>
									) : (
										<code className={className} {...props}>
											{children}
										</code>
									);
								},
								h1: ({ children }) => (
									<h1 className="text-3xl font-bold text-foreground mt-12 mb-6 first:mt-0">
										{children}
									</h1>
								),
								h2: ({ children }) => (
									<h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
										{children}
									</h2>
								),
								h3: ({ children }) => (
									<h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
										{children}
									</h3>
								),
								p: ({ children }) => (
									<p className="text-foreground leading-relaxed mb-6">
										{children}
									</p>
								),
								blockquote: ({ children }) => (
									<blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground my-6">
										{children}
									</blockquote>
								),
								ul: ({ children }) => (
									<ul className="my-6 space-y-2">{children}</ul>
								),
								ol: ({ children }) => (
									<ol className="my-6 space-y-2">{children}</ol>
								),
								li: ({ children }) => <li className="mb-2">{children}</li>,
								a: ({ children, href }) => (
									<a
										href={href}
										className="text-primary hover:text-primary/80 underline transition-colors"
										target="_blank"
										rel="noopener noreferrer"
									>
										{children}
									</a>
								),
								table: ({ children }) => (
									<div className="overflow-x-auto my-6">
										<table className="min-w-full border border-border rounded-lg">
											{children}
										</table>
									</div>
								),
								thead: ({ children }) => (
									<thead className="bg-muted">{children}</thead>
								),
								th: ({ children }) => (
									<th className="px-4 py-2 text-left font-semibold border-b border-border">
										{children}
									</th>
								),
								td: ({ children }) => (
									<td className="px-4 py-2 border-b border-border">
										{children}
									</td>
								),
							}}
						>
							{post.content}
						</ReactMarkdown>
					</div>
				</article>

				{/* Enhanced Article Footer */}
				<footer className="mt-16 pt-8 border-t border-border">
					<div className="bg-muted/30 rounded-2xl p-8">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
										<BookOpen className="w-6 h-6 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">
											{t("blog.post.footer.heading")}
										</h3>
										<p className="text-sm text-muted-foreground">
											{t("blog.post.meta.lastUpdated", {
												date: formatDate(post.updatedAt || post.createdAt),
											})}
										</p>
									</div>
								</div>
								<p className="text-sm text-muted-foreground">
									{t("blog.post.footer.tagline")}
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3">
								{post?.id && <LikeButton postId={post.id} size="sm" />}
								<Button variant="outline" size="sm" className="gap-2">
									<Share2 className="w-4 h-4" />
									{t("blog.post.footer.share")}
								</Button>
								<Link href="/blog">
									<Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
										<FileText className="w-4 h-4" />
										{t("blog.post.footer.moreArticles")}
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</footer>

				{/* Newsletter Signup Section */}
				<section className="mt-16">
					<div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border text-center">
						<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<BookOpen className="w-8 h-8 text-primary" />
						</div>
						<h3 className="text-2xl font-bold text-foreground mb-4">
							{t("blog.post.newsletter.title")}
						</h3>
						<p className="text-muted-foreground mb-6 max-w-md mx-auto">
							{t("blog.post.newsletter.text")}
						</p>
						<Button size="lg" className="gap-2">
							<Tag className="w-4 h-4" />
							{t("blog.post.newsletter.subscribe")}
						</Button>
					</div>
				</section>
			</main>
		</div>
	);
}
