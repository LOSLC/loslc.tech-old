"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { ArrowLeft, Save, Eye, Plus, X, FileText, Edit3, Search, Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  blogApi,
  type BlogCategoryDTO,
  type BlogTagDTO,
  type UpdateBlogPostDTO,
} from "@/lib/api/blog";
import { adminApi, type UploadResponse } from "@/lib/api/admin";
import { generateSlug } from "@/lib/utils/slug";

export default function EditBlogPostPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { theme } = useTheme();
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
  const [isPreview, setIsPreview] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [isPrefilling, setIsPrefilling] = useState(true);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  // Track cursor position within the editor to insert text at caret without relying on ref typing
  const cursorPosRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const updateCursorFromEvent = (ev: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const t = ev.currentTarget;
    cursorPosRef.current.start = t.selectionStart ?? 0;
    cursorPosRef.current.end = t.selectionEnd ?? cursorPosRef.current.start;
  };

  // Queries
  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => blogApi.getCategories(),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: () => blogApi.getTags(),
  });

  const postQuery = useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => blogApi.getBlogPostById(id),
    enabled: !!id,
  });

  const postTagsQuery = useQuery({
    queryKey: ["blog-post-tags", id],
    queryFn: () => blogApi.getPostTags(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (postQuery.data) {
      const p = postQuery.data;
      setTitle(p.title || "");
      setContent(p.content || "");
      setExcerpt(p.description || "");
      setSlug(generateSlug(p.title || ""));
      setCategoryId(p.categoryId || "");
      setStatus(p.published ? "published" : "draft");
      if (p.coverImageId) setCoverImageId(p.coverImageId);
    }
  }, [postQuery.data]);

  useEffect(() => {
    if (postTagsQuery.data) {
      setTagIds(postTagsQuery.data.map((t) => t.id));
    }
  }, [postTagsQuery.data]);

  useEffect(() => {
    if (!postQuery.isLoading && !postTagsQuery.isLoading) {
      setIsPrefilling(false);
    }
  }, [postQuery.isLoading, postTagsQuery.isLoading]);

  // Mutations
  const updatePostMutation = useMutation({
    mutationFn: (data: UpdateBlogPostDTO) => blogApi.updateBlogPost(id, data),
    onSuccess: () => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["blog-post", id] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      router.push("/admin/blog");
    },
    onError: (error) => {
      toast.error("Failed to update post");
      console.error("Error updating post:", error);
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
    setTagSearch("");
  };

  const handleTagRemove = (tagId: string) => {
    setTagIds((prev) => prev.filter((id) => id !== tagId));
  };

  const filteredTags = (tags as BlogTagDTO[]).filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
  );
  const availableTags = filteredTags.filter((tag) => !tagIds.includes(tag.id));

  // File upload handler for cover
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

  // DnD upload for MD editor
  const insertAtSelection = useCallback(
    (textToInsert: string) => {
      const start = cursorPosRef.current.start ?? content.length;
      const end = cursorPosRef.current.end ?? content.length;
      const before = content.slice(0, start);
      const after = content.slice(end);
      const next = `${before}${textToInsert}${after}`;
      setContent(next);
      // Update cursor position reference for future inserts
      const pos = start + textToInsert.length;
      cursorPosRef.current = { start: pos, end: pos };
    },
    [content],
  );

  const handleFilesDrop = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f && f.size > 0);
      if (arr.length === 0) return;
      toast.info(`Uploading ${arr.length} file${arr.length > 1 ? "s" : ""}...`);
      for (const file of arr) {
        try {
          const uploaded = await adminApi.files.upload(file);
          const url = `/api/files/${uploaded.id}/download`;
          const isImage = (uploaded.fileType || "").startsWith("image/");
          const safeName = (uploaded.name || file.name).replace(/\]|\[/g, "");
          const snippet = isImage
            ? `\n![${safeName}](${url})\n`
            : `\n[${safeName}](${url})\n`;
          insertAtSelection(snippet);
        } catch (e) {
          console.error("Upload failed", e);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      toast.success("Upload complete");
    },
    [insertAtSelection],
  );

  const handleEditorDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const dt = e.dataTransfer;
    if (dt?.files && dt.files.length > 0) {
      void handleFilesDrop(dt.files);
    }
  };

  const handleEditorDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleEditorDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  // Click-to-upload (mobile-friendly)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleOpenEditorFilePicker = () => fileInputRef.current?.click();
  const handleEditorFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingFiles(true);
    try {
      await handleFilesDrop(files);
    } finally {
      setIsUploadingFiles(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const data: UpdateBlogPostDTO = {
      title: title.trim(),
      content: content.trim(),
      description: excerpt.trim() || title.trim(),
      categoryId: categoryId || undefined,
      coverImageId: coverImageId || undefined,
      published: status === "published" ? true : false,
      tags: tagIds.length ? tagIds : undefined,
    };
    updatePostMutation.mutate(data);
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="bg-background border rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/blog")}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
                  <p className="text-muted-foreground">Update your blog post</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center"
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
                  disabled={updatePostMutation.isPending || isPrefilling}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={updatePostMutation.isPending || isPrefilling}
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
          </div>

          {isPreview ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center justify-between">
                  <span>Preview</span>
                  <Badge variant={status === "published" ? "default" : "secondary"}>
                    {status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose max-w-none dark:prose-invert">
                  <h1>{title || "Untitled Post"}</h1>
                  {excerpt && <p className="lead text-muted-foreground">{excerpt}</p>}

                  {uploadedCoverImage || coverImageId ? (
                    <div className="my-6">
                      <Image
                        src={`/api/files/${(uploadedCoverImage?.id || coverImageId)}` + 
                          "/download"}
                        alt={title || "Cover image"}
                        width={800}
                        height={400}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : null}

          <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
            code({ className, children, ...props }: { className?: string; children?: React.ReactNode; [key: string]: any }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        return !isInline ? (
                          <SyntaxHighlighter
                            style={tomorrow as any}
                            language={match?.[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...(props as any)}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content || "Start writing your content..."}
                  </ReactMarkdown>

                  {tagIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                      {tagIds.map((tagId) => {
                        const tag = (tags as BlogTagDTO[]).find((t) => t.id === tagId);
                        return tag ? (
                          <Badge key={tagId} variant="outline">
                            {tag.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Post Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Enter post title..."
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="url-friendly-slug"
                          className="mt-1 font-mono text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                          placeholder="Brief description of your post..."
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Markdown Editor with DnD */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle>Content *</CardTitle>
                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleEditorFileSelect}
                            className="hidden"
                            accept="image/*,application/pdf,.doc,.docx,.txt,.md"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleOpenEditorFilePicker}
                            disabled={isUploadingFiles}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            {isUploadingFiles ? "Uploading..." : "Upload Files"}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`rounded-md border ${
                          isDraggingOver ? "border-primary/60 ring-2 ring-primary/20" : "border-transparent"
                        }`}
                        onDrop={handleEditorDrop}
                        onDragOver={handleEditorDragOver}
                        onDragLeave={handleEditorDragLeave}
                        data-color-mode={theme === "dark" ? "dark" : "light"}
                      >
            <MDEditor
                          value={content}
                          onChange={(val) => setContent(val || "")}
                          preview="edit"
                          height={560}
                          textareaProps={{
                            placeholder: "Write your post content in Markdown... (drag & drop files to upload)",
              onSelect: updateCursorFromEvent,
              onKeyUp: updateCursorFromEvent,
              onClick: updateCursorFromEvent,
                          }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Tip: Drag & drop images or files here to upload and insert links automatically.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 lg:sticky lg:top-24 self-start">
                  {/* Publish Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Publish</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={status}
                          onValueChange={(value: "draft" | "published") => setStatus(value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Cover Image */}
                      <div>
                        <Label>Cover Image</Label>
                        {!uploadedCoverImage && !coverImageId ? (
                          <div className="mt-2 border border-dashed rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCoverImageUpload(file);
                              }}
                              className="hidden"
                              id="cover-upload"
                              disabled={isUploadingCover}
                            />
                            <label htmlFor="cover-upload" className="cursor-pointer">
                              {isUploadingCover ? (
                                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                              ) : (
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              )}
                              <p className="text-sm text-muted-foreground">
                                {isUploadingCover ? "Uploading..." : "Click to upload"}
                              </p>
                              {!isUploadingCover && (
                                <p className="mt-1 text-xs text-muted-foreground">Recommended: 1200×630 (JPG/PNG/WebP)</p>
                              )}
                            </label>
                          </div>
                        ) : (
                          <div className="mt-2 space-y-2">
                            <div className="relative">
                              <Image
                                src={`/api/files/${(uploadedCoverImage?.id || coverImageId)}` + 
                                  "/download"}
                                alt="Cover preview"
                                width={480}
                                height={270}
                                className="rounded-lg object-cover w-full"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleCoverImageRemove}
                                className="absolute top-2 right-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(categories as BlogCategoryDTO[]).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tagIds.length > 0 && (
                        <div>
                          <Label className="text-sm">Selected:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tagIds.map((tagId) => {
                              const tag = (tags as BlogTagDTO[]).find((t) => t.id === tagId);
                              return tag ? (
                                <Badge key={tagId} variant="secondary" className="text-xs">
                                  {tag.name}
                                  <button
                                    type="button"
                                    onClick={() => handleTagRemove(tagId)}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search tags..."
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {tagSearch && availableTags.length > 0 && (
                          <div className="mt-2 max-h-32 overflow-y-auto border rounded-lg">
                            {availableTags.slice(0, 5).map((tag) => (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleTagAdd(tag.id)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center space-x-2"
                              >
                                <Plus className="h-3 w-3" />
                                <span>{tag.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
