"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostSlug } from "@/lib/utils/slug";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent,   } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Folder, 
  Tag as TagIcon, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { 
  type BlogPostDTO, 
  type CreateCategoryDTO,
  type BlogCategoryDTO,
  type BlogTagDTO,
} from "@/lib/api/blog";
import { toast } from "sonner";
import { UserDTO } from "@/lib/api/users";

interface PostWithAuthor extends BlogPostDTO {
  author?: UserDTO;
}

function PostCard({ post, onDelete, onView }: {
  post: PostWithAuthor;
  onDelete: (post: PostWithAuthor) => void;
  onView: (post: PostWithAuthor) => void;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={post.published ? "default" : "secondary"} 
                className={`${post.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
              >
                {post.published ? "Published" : "Draft"}
              </Badge>
              {post.featured && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300">
                  Featured
                </Badge>
              )}
              {post.archived && (
                <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300">
                  Archived
                </Badge>
              )}
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg lg:text-xl leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {post.description}
              </p>
            </div>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{post.author ? post.author.fullName : post.authorId}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.updatedAt && (
                <div className="flex items-center gap-1">
                  <Edit className="h-3 w-3" />
                  <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onView(post)}
              aria-label="View"
              className="hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
            >
              <Link href={`/admin/blog/edit/${post.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(post)}
              aria-label="Delete"
              className="hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateCategoryDialog({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDTO) => adminApi.blog.createCategory(data),
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      onOpenChange(false);
      setFormData({ name: "" });
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    createCategoryMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Web Development"
              disabled={createCategoryMutation.isPending}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createCategoryMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createCategoryMutation.isPending}>
            {createCategoryMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BlogManagementPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  // Fetch posts
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ["admin", "blog", "posts"],
    queryFn: () => adminApi.blog.getAllPosts({ limit: 100 }), // Get more posts for admin including drafts and archived
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin", "blog", "categories"],
    queryFn: () => adminApi.blog.getCategories(),
  });

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ["admin", "blog", "tags"],
    queryFn: () => adminApi.blog.getTags(),
  });

  // Delete mutations
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => adminApi.blog.deletePost(id),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => adminApi.blog.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => adminApi.blog.deleteTag(id),
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "blog", "tags"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete tag: ${error.message}`);
    },
  });

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePost = (post: BlogPostDTO) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      deletePostMutation.mutate(post.id);
    }
  };

  const handleViewPost = (post: BlogPostDTO) => {
    const slugWithId = createPostSlug(post.title, post.id);
    window.location.href = `/blog/post/${slugWithId}`;
  };

  const handleDeleteCategory = (category: BlogCategoryDTO) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const handleDeleteTag = (tag: BlogTagDTO) => {
    if (confirm(`Are you sure you want to delete "${tag.name}"?`)) {
      deleteTagMutation.mutate(tag.id);
    }
  };

  if (postsLoading || categoriesLoading || tagsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (postsError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-destructive">Error loading posts: {postsError.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage blog posts, categories, and tags.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex min-w-max gap-1">
            <TabsTrigger value="posts" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Folder className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center space-x-2">
              <TagIcon className="h-4 w-4" />
              <span>Tags</span>
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <h2 className="text-xl font-semibold">Posts</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your blog posts and content.
                </p>
              </div>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/admin/blog/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Link>
              </Button>
            </div>

            {/* Post Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {posts.filter(p => p.published).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Published</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {posts.filter(p => !p.published).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Drafts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {posts.filter(p => p.featured).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Featured</p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onView={handleViewPost}
                />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No posts found. Create one to get started.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <h2 className="text-xl font-semibold">Categories</h2>
                <p className="text-sm text-muted-foreground">
                  Organize your posts with categories.
                </p>
              </div>
              <Button onClick={() => setCreateCategoryOpen(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {categories.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No categories found. Create one to get started.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Tags</h2>
              <p className="text-sm text-muted-foreground">
                Manage post tags and labels.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tags.map((tag) => (
                <Card key={tag.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">#{tag.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(tag.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTag(tag)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {tags.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No tags found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <CreateCategoryDialog
          open={createCategoryOpen}
          onOpenChange={setCreateCategoryOpen}
        />
      </div>
    </AdminLayout>
  );
}
