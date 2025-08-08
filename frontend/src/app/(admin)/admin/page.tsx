"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Shield, Upload, TrendingUp, Star } from "lucide-react";
import { adminApi } from "@/lib/api/admin";

// Admin Dashboard Stats Component
function DashboardStats() {
  const { data: users } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.users.getAll(100, 0),
  });

  const { data: recentPosts } = useQuery({
    queryKey: ["admin", "dashboard", "recent-posts"],
    queryFn: () => adminApi.dashboard.getRecentBlogPosts(100),
  });

  const { data: roles } = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: () => adminApi.accessManagement.getAllRoles(),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            Registered users
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentPosts?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            Published posts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{roles?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            System roles
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">File Storage</CardTitle>
          <Upload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Active</div>
          <p className="text-xs text-muted-foreground">
            Storage system
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PopularBlogPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin", "dashboard", "popular-posts"],
    queryFn: () => adminApi.dashboard.getPopularBlogPosts(5),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Popular Blog Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Popular Blog Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts && posts.length > 0 ? (
            posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-start justify-between border-b pb-3 last:border-b-0">
                <div className="flex-1">
                  <h4 className="text-sm font-medium line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {post.featured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No popular posts yet</p>
          )}
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" className="w-full">
            View All Posts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedBlogPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin", "dashboard", "featured-posts"],
    queryFn: () => adminApi.dashboard.getFeaturedBlogPosts(3),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Featured Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Featured Articles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts && posts.length > 0 ? (
            posts.slice(0, 3).map((post) => (
              <div key={post.id} className="border-b pb-3 last:border-b-0">
                <h4 className="text-sm font-medium line-clamp-1">{post.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {post.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    Published
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No featured articles yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "dashboard", "recent-users"],
    queryFn: () => adminApi.dashboard.getRecentUsers(5),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Recent Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users && users.length > 0 ? (
            users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{user.fullName || user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mb-1">
                    {user.isBanned && (
                      <Badge variant="destructive" className="text-xs">Banned</Badge>
                    )}
                    {user.isVerified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No users found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the admin panel. Monitor and manage your platform.
          </p>
        </div>

        <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PopularBlogPosts />
          <FeaturedBlogPosts />
          <RecentUsers />
        </div>
      </div>
    </AdminLayout>
  );
}
