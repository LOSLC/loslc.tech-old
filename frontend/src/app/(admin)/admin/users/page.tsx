"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  Ban,
  UnlockKeyhole,
  Trash2,
  Mail,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminApi, type RoleDTO } from "@/lib/api/admin";
import { type UserDTO } from "@/lib/api/users";
import { toast } from "sonner";

interface UserWithRoles extends UserDTO {
  roles: RoleDTO[];
}

function UserCard({
  user,
  onBan,
  onUnban,
  onDelete,
  isDeleting = false,
}: {
  user: UserWithRoles;
  onBan: (user: UserWithRoles) => void;
  onUnban: (user: UserWithRoles) => void;
  onDelete: (user: UserWithRoles) => void;
  isDeleting?: boolean;
}) {
  const [showAllRoles, setShowAllRoles] = useState(false);
  const roleLimit = 4;
  const rolesToShow = showAllRoles ? user.roles : user.roles.slice(0, roleLimit);

  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center space-x-4 min-w-0">
            <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/30 transition">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-full">
                <span className="text-primary font-medium">
                  {user.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <a
                  href={`mailto:${user.email}`}
                  className="text-xs text-muted-foreground break-all hover:underline"
                  title={user.email}
                >
                  {user.email}
                </a>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Joined {new Date(user.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto sm:items-end">
            <div className="w-full sm:w-auto">
              <div className="flex flex-wrap gap-1 rounded-md bg-muted/40 p-1">
                {rolesToShow.map((role: RoleDTO) => (
                  <Badge key={role.id} variant="secondary" className="text-xs">
                    {role.name}
                  </Badge>
                ))}
                {user.roles.length > roleLimit && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setShowAllRoles((v) => !v)}
                    aria-expanded={showAllRoles}
                    aria-label={showAllRoles ? "Show fewer roles" : "Show all roles"}
                  >
                    {showAllRoles ? "Show less" : `+${user.roles.length - roleLimit} more`}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
              <div className="flex items-center gap-2">
                {user.isVerified && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
                {user.isBanned && (
                  <Badge variant="destructive" className="text-xs">
                    <Ban className="h-3 w-3 mr-1" /> Banned
                  </Badge>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="User actions" disabled={isDeleting}>
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.isBanned ? (
                    <DropdownMenuItem
                      onClick={() => onUnban(user)}
                      disabled={isDeleting}
                    >
                      <UnlockKeyhole className="h-4 w-4 mr-2" />
                      Unban User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => onBan(user)}
                      className="text-destructive"
                      disabled={isDeleting}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Ban User
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(user)}
                    className="text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BanUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: {
  user: UserWithRoles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (motive: string) => void;
}) {
  const [motive, setMotive] = useState("");

  const handleConfirm = () => {
    if (motive.trim()) {
      onConfirm(motive);
      onOpenChange(false);
      setMotive("");
    } else {
      toast.error("Please provide a reason for banning this user.");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setMotive("");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">
              <strong>User:</strong> {user.fullName} (@{user.username})
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <div>
            <Label htmlFor="motive">Reason for ban</Label>
            <Input
              id="motive"
              placeholder="Enter reason for banning this user..."
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!motive.trim()}
          >
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: {
  user: UserWithRoles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [confirmationText, setConfirmationText] = useState("");

  const handleConfirm = () => {
    if (confirmationText === "DELETE") {
      onConfirm();
      onOpenChange(false);
      setConfirmationText("");
    } else {
      toast.error("Please type DELETE to confirm user deletion.");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setConfirmationText("");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            ! Delete User Account
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-destructive mb-2">
              DANGER: This action cannot be undone!
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>User:</strong> {user.fullName} (@{user.username})
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              All user data and content will be permanently removed from the
              system.
            </p>
            <div>
              <Label htmlFor="confirmation">
                Type <code className="bg-muted px-1 rounded">DELETE</code> to
                confirm:
              </Label>
              <Input
                id="confirmation"
                placeholder="Type DELETE to confirm"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmationText !== "DELETE"}
          >
            Delete User Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>
      <div className="flex items-center justify-center sm:justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="sm:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="sm:hidden"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Dialog states
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

  // Fetch users with pagination
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "users", currentPage],
    queryFn: () =>
      adminApi.users.getAll(ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE),
  });

  // Fetch roles for each user
  const usersWithRoles = useQuery({
    queryKey: ["admin", "users-with-roles", users.map((u) => u.id)],
    queryFn: async (): Promise<UserWithRoles[]> => {
      const usersWithRolePromises = users.map(async (user) => {
        try {
          const roles = await adminApi.accessManagement.getUserRoles(user.id);
          return { ...user, roles };
        } catch {
          return { ...user, roles: [] as RoleDTO[] };
        }
      });
      return Promise.all(usersWithRolePromises);
    },
    enabled: users.length > 0,
  });

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: (data: { user: UserWithRoles; motive: string }) =>
      adminApi.users.banUser({ userId: data.user.id, motive: data.motive }),
    onSuccess: () => {
      toast.success("User banned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users-with-roles"],
      });
      setBanDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(`Failed to ban user: ${error.message}`);
    },
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.users.unbanUser(userId),
    onSuccess: () => {
      toast.success("User unbanned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users-with-roles"],
      });
    },
    onError: (error) => {
      toast.error(`Failed to unban user: ${error.message}`);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.users.deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users-with-roles"],
      });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  const usersData = usersWithRoles.data || [];

  const filteredUsers = usersData.filter(
    (user: UserWithRoles) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBanUser = (user: UserWithRoles) => {
    setSelectedUser(user);
    setBanDialogOpen(true);
  };

  const handleConfirmBan = (motive: string) => {
    if (selectedUser) {
      banUserMutation.mutate({ user: selectedUser, motive });
    }
  };

  const handleUnbanUser = (user: UserWithRoles) => {
    unbanUserMutation.mutate(user.id);
  };

  const handleDeleteUser = (user: UserWithRoles) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  if (isLoading || usersWithRoles.isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-destructive">
            Error loading users: {error.message}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, permissions, and access.
            </p>
          </div>
        </div>

        {/* Stats */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{usersData.length}</div>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {usersData.filter((u: UserWithRoles) => u.isVerified).length}
              </div>
              <p className="text-xs text-muted-foreground">Verified Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {usersData.filter((u: UserWithRoles) => u.isBanned).length}
              </div>
              <p className="text-xs text-muted-foreground">Banned Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {
                  usersData.filter((u: UserWithRoles) =>
                    u.roles.some((role) => role.name === "Admin"),
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Admin Users</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user: UserWithRoles) => (
            <UserCard
              key={user.id}
              user={user}
              onBan={handleBanUser}
              onUnban={handleUnbanUser}
              onDelete={handleDeleteUser}
              isDeleting={deleteUserMutation.isPending}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No users found matching your search.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalItems={Math.max(
            usersData.length,
            users.length >= ITEMS_PER_PAGE
              ? currentPage * ITEMS_PER_PAGE + 1
              : users.length,
          )}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />

        <BanUserDialog
          user={selectedUser}
          open={banDialogOpen}
          onOpenChange={setBanDialogOpen}
          onConfirm={handleConfirmBan}
        />

        <DeleteUserDialog
          user={selectedUser}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AdminLayout>
  );
}
