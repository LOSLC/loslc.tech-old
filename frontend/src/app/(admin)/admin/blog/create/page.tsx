"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  X,
  FileText,
  Calendar,
  Tag as TagIcon,
  User,
  Image as ImageIcon,
  Settings,
  Edit3,
  Monitor,
  Search,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  blogApi,
  type CreateBlogPostDTO,
  type BlogCategoryDTO,
  type BlogTagDTO,
} from "@/lib/api/blog";
import { adminApi, type UploadResponse } from "@/lib/api/admin";
import { generateSlug } from "@/lib/utils/slug";

export default function CreateBlogPostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverImageId, setCoverImageId] = useState<string>("");
  const [uploadedCoverImage, setUploadedCoverImage] = useState<UploadResponse | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  // Queries
  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => blogApi.getCategories(),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: () => blogApi.getTags(),
  });

  // Mutations
  const createPostMutation = useMutation({
    mutationFn: blogApi.createBlogPost,
    onSuccess: () => {
      toast.success("Blog post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      router.push("/admin/blog");
    },
    onError: (error) => {
      toast.error("Failed to create blog post");
      console.error("Error creating blog post:", error);
    },
  });

  // Auto-generate slug from title using utility function
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleTagAdd = (tagId: string) => {
    if (!tagIds.includes(tagId)) {
      setTagIds((prev) => [...prev, tagId]);
    }
    setTagSearch(""); // Clear search after adding
  };

  const handleTagRemove = (tagId: string) => {
    setTagIds((prev) => prev.filter((id) => id !== tagId));
  };

  // Filter tags based on search
  const filteredTags = (tags as BlogTagDTO[]).filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // Get available tags (not selected)
  const availableTags = filteredTags.filter((tag) => !tagIds.includes(tag.id));

  // File upload handler
  const handleCoverImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const uploadedFile = await adminApi.files.upload(file);
      setUploadedCoverImage(uploadedFile);
      setCoverImageId(uploadedFile.id);
      toast.success("Cover image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleCoverImageRemove = () => {
    setUploadedCoverImage(null);
    setCoverImageId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const postData: CreateBlogPostDTO = {
      title: title.trim(),
      content: content.trim(),
      description: excerpt.trim() || title.trim(),
      categoryId: categoryId || undefined,
      tags: tagIds.length > 0 ? tagIds : undefined,
      published: status === "published",
      featured: false,
      coverImageId: coverImageId || undefined,
    };

    createPostMutation.mutate(postData);
  };

  const handleSaveAsDraft = () => {
    setStatus("draft");
    handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
  };

  const handlePublish = () => {
    setStatus("published");
    handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Enhanced Header */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/admin/blog")}
                    className="flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Create New Post
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Craft your next masterpiece with markdown support
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    {isPreview ? (
                      <Edit3 className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {isPreview ? "Edit" : "Preview"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    disabled={createPostMutation.isPending}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={createPostMutation.isPending}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {isPreview ? (
            // Preview Mode with Modern Styling
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5 rounded-2xl blur-xl"></div>
              <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-lg">Live Preview</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={status === "published" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Monitor className="h-3 w-3" />
                        <span>Desktop</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4">
                    {title || "Untitled Post"}
                  </h1>
                  {excerpt && (
                    <p className="text-xl text-gray-600 mb-6">{excerpt}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Admin User
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date().toLocaleDateString()}
                    </div>
                    {categoryId && (
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-1" />
                        {
                          (categories as BlogCategoryDTO[]).find(
                            (c) => c.id === categoryId,
                          )?.name
                        }
                      </div>
                    )}
                  </div>
                </div>

                {uploadedCoverImage && (
                  <div className="mb-6 relative w-full h-64">
                    <Image
                      src={`/api/files/${uploadedCoverImage.id}/download`}
                      alt={title || "Cover image preview"}
                      className="object-cover rounded-lg"
                      fill
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }: { className?: string; children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        return !isInline ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match?.[1]}
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
                        <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-foreground mt-6 mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-foreground leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-4 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-4 space-y-1">{children}</ol>
                      ),
                    }}
                  >
                    {content || "Start writing your content..."}
                  </ReactMarkdown>
                </div>

                {tagIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {tagIds.map((tagId) => {
                      const tag = (tags as BlogTagDTO[]).find(
                        (t) => t.id === tagId,
                      );
                      return tag ? (
                        <Badge key={tagId} variant="outline">
                          {tag.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          ) : (
            // Edit Mode with Enhanced Styling
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Content - Takes up more space */}
                <div className="xl:col-span-3 space-y-8">
                  {/* Content Section */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl blur-xl"></div>
                    <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                      <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span>Content</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 p-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-medium">
                            Title *
                          </Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter an engaging title..."
                            required
                            className="text-lg font-medium border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-sm font-medium">
                            URL Slug
                          </Label>
                          <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="url-friendly-slug"
                            className="font-mono text-sm border-slate-200 dark:border-slate-700"
                          />
                          <p className="text-xs text-slate-500">
                            Auto-generated from title, but you can customize it
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="excerpt" className="text-sm font-medium">
                            Excerpt
                          </Label>
                          <Textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Write a compelling excerpt that summarizes your post..."
                            rows={3}
                            className="resize-none border-slate-200 dark:border-slate-700"
                          />
                          <p className="text-xs text-slate-500">
                            This will be used in post previews and SEO
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content" className="text-sm font-medium flex items-center space-x-2">
                            <span>Content *</span>
                            <Badge variant="outline" className="text-xs">
                              Markdown
                            </Badge>
                          </Label>
                          <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`# Your Post Title

Start writing your amazing content here...

## Code Example
\`\`\`javascript
const example = "You can use syntax highlighting!";
console.log(example);
\`\`\`

> Blockquotes look great too!

- Lists work perfectly
- With **bold** and *italic* text
- And [links](https://example.com)
`}
                            rows={20}
                            required
                            className="font-mono text-sm leading-relaxed resize-none border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                          />
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Supports full Markdown syntax with code highlighting</span>
                            <span>{content.length} characters</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* SEO Settings */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-teal-600/5 rounded-2xl blur-xl"></div>
                    <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                      <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                        <CardTitle className="flex items-center space-x-2">
                          <Settings className="h-5 w-5 text-green-600" />
                          <span>SEO & Meta</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                          <Label htmlFor="metaTitle" className="text-sm font-medium">
                            Meta Title
                          </Label>
                          <Input
                            id="metaTitle"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="Custom SEO title (optional)"
                            className="border-slate-200 dark:border-slate-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="metaDescription" className="text-sm font-medium">
                            Meta Description
                          </Label>
                          <Textarea
                            id="metaDescription"
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            placeholder="SEO description for search engines..."
                            rows={3}
                            className="resize-none border-slate-200 dark:border-slate-700"
                          />
                          <p className="text-xs text-slate-500">
                            Recommended: 150-160 characters
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Enhanced Sidebar */}
                <div className="space-y-6">
                  {/* Publish Settings */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-xl"></div>
                    <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                      <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                        <CardTitle className="flex items-center space-x-2">
                          <Settings className="h-5 w-5 text-purple-600" />
                          <span>Publish</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-sm font-medium">
                            Status
                          </Label>
                          <Select
                            value={status}
                            onValueChange={(value: "draft" | "published") =>
                              setStatus(value)
                            }
                          >
                            <SelectTrigger className="border-slate-200 dark:border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span>Draft</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="published">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span>Published</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>Cover Image</span>
                          </Label>
                          
                          {!uploadedCoverImage ? (
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleCoverImageUpload(file);
                                  }
                                }}
                                className="hidden"
                                id="cover-upload"
                                disabled={isUploadingCover}
                              />
                              <label
                                htmlFor="cover-upload"
                                className="cursor-pointer flex flex-col items-center space-y-3"
                              >
                                {isUploadingCover ? (
                                  <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
                                ) : (
                                  <Upload className="h-8 w-8 text-slate-400" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {isUploadingCover ? "Uploading..." : "Click to upload cover image"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    PNG, JPG, WebP up to 10MB
                                  </p>
                                </div>
                              </label>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                <Image
                                  src={`/api/files/${uploadedCoverImage.id}/download`}
                                  alt="Cover image preview"
                                  className="w-full h-full object-cover"
                                  fill
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleCoverImageRemove}
                                    className="flex items-center space-x-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Remove</span>
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{uploadedCoverImage.name}</span>
                                <span>{(uploadedCoverImage.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const input = document.getElementById('cover-upload') as HTMLInputElement;
                                  input?.click();
                                }}
                                className="w-full flex items-center space-x-2"
                                disabled={isUploadingCover}
                              >
                                <Upload className="h-3 w-3" />
                                <span>Replace Image</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5 rounded-2xl blur-xl"></div>
                    <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                      <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                        <CardTitle className="flex items-center space-x-2">
                          <TagIcon className="h-5 w-5 text-orange-600" />
                          <span>Category</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Select value={categoryId} onValueChange={setCategoryId}>
                          <SelectTrigger className="border-slate-200 dark:border-slate-700">
                            <SelectValue placeholder="Choose a category..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(categories as BlogCategoryDTO[]).map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tags */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-cyan-600/5 rounded-2xl blur-xl"></div>
                    <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                      <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                        <CardTitle className="flex items-center space-x-2">
                          <TagIcon className="h-5 w-5 text-teal-600" />
                          <span>Tags</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* Selected Tags Display */}
                        {tagIds.length > 0 && (
                          <div className="mb-6">
                            <p className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
                              Selected Tags ({tagIds.length}):
                            </p>
                            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                              {tagIds.map((tagId) => {
                                const tag = (tags as BlogTagDTO[]).find(
                                  (t) => t.id === tagId,
                                );
                                return tag ? (
                                  <Badge
                                    key={tagId}
                                    variant="secondary"
                                    className="text-xs bg-teal-100 dark:bg-teal-900 border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors px-3 py-1.5"
                                  >
                                    <TagIcon className="h-3 w-3 mr-1" />
                                    {tag.name}
                                    <button
                                      type="button"
                                      onClick={() => handleTagRemove(tagId)}
                                      className="ml-2 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        {/* Tag Search and Add */}
                        <div className="space-y-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search tags..."
                              value={tagSearch}
                              onChange={(e) => setTagSearch(e.target.value)}
                              className="pl-10 border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/20"
                            />
                          </div>

                          {/* Available Tags */}
                          {tagSearch && availableTags.length > 0 && (
                            <div className="max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                              {availableTags.slice(0, 5).map((tag) => (
                                <button
                                  key={tag.id}
                                  type="button"
                                  onClick={() => handleTagAdd(tag.id)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors"
                                >
                                  <Plus className="h-3 w-3 text-teal-600" />
                                  <span>{tag.name}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* All Tags Grid (when not searching) */}
                          {!tagSearch && (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-500 mb-2">
                                Click to add tags:
                              </p>
                              <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                                {(tags as BlogTagDTO[])
                                  .filter((tag) => !tagIds.includes(tag.id))
                                  .map((tag) => (
                                    <button
                                      key={tag.id}
                                      type="button"
                                      onClick={() => handleTagAdd(tag.id)}
                                      className="flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-md transition-colors group"
                                    >
                                      <Plus className="h-3 w-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
                                      <span className="group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                                        {tag.name}
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* No results message */}
                          {tagSearch && availableTags.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-3">
                              No tags found matching &quot;{tagSearch}&quot;
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Floating Action Toolbar */}
          {!isPreview && (
            <div className="fixed bottom-8 right-8 z-50">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreview(true)}
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Quick Preview
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveAsDraft}
                    disabled={createPostMutation.isPending}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePublish}
                    disabled={createPostMutation.isPending}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
