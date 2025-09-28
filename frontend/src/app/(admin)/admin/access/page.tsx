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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Shield,
	Key,
	Users,
	Settings,
	Trash2,
	Plus,
	Loader2,
	UserPlus,
	Link as LinkIcon,
	ChevronLeft,
	ChevronRight,
	Mail,
} from "lucide-react";
import {
	adminApi,
	type RoleDTO,
	type PermissionDTO,
	type CreateRoleDTO,
	type CreatePermissionDTO,
	type RoleAssignmentDTO,
} from "@/lib/api/admin";
import { type UserDTO } from "@/lib/api/users";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface UserWithRoles extends UserDTO {
	roles: RoleDTO[];
}

interface RoleWithPermissions extends RoleDTO {
	permissions: PermissionDTO[];
}

function UserRoleCard({
	user,
	onAssignRole,
	onRevokeRole,
}: {
	user: UserWithRoles;
	onAssignRole: (user: UserWithRoles) => void;
	onRevokeRole: (user: UserWithRoles, role: RoleDTO) => void;
}) {
	const [showAllRoles, setShowAllRoles] = useState(false);
	const roleLimit = 4;
	const rolesToShow = showAllRoles
		? user.roles
		: user.roles.slice(0, roleLimit);

	return (
		<Card className="group hover:shadow-lg transition-all">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex items-center space-x-4 min-w-0">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div className="min-w-0">
							<h3 className="font-semibold truncate">{user.fullName}</h3>
							<p className="text-sm text-muted-foreground truncate">
								@{user.username}
							</p>
							<div className="flex items-center gap-2 mt-1">
								<Mail className="h-3 w-3 text-muted-foreground" />
								<a
									href={`mailto:${user.email}`}
									className="text-xs text-muted-foreground break-all hover:underline"
									title={user.email}
								>
									{user.email}
								</a>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
						<div className="w-full sm:w-auto">
							<div className="flex flex-wrap gap-1 rounded-md bg-muted/40 p-1">
								{rolesToShow.map((role: RoleDTO) => (
									<Badge
										key={role.id}
										variant="secondary"
										className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
										onClick={() => onRevokeRole(user, role)}
										title="Click to revoke this role"
									>
										{role.name} ×
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
										aria-label={
											showAllRoles ? "Show fewer roles" : "Show all roles"
										}
									>
										{showAllRoles
											? "Show less"
											: `+${user.roles.length - roleLimit} more`}
									</Button>
								)}
							</div>
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={() => onAssignRole(user)}
							className="w-full sm:w-auto"
						>
							<UserPlus className="h-4 w-4 mr-2" />
							Assign Role
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function CreateRoleDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		priority: 10,
	});

	const createRoleMutation = useMutation({
		mutationFn: (data: CreateRoleDTO) =>
			adminApi.accessManagement.createRole(data),
		onSuccess: () => {
			toast.success("Role created successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "all-roles"] });
			queryClient.invalidateQueries({
				queryKey: ["admin", "users-with-roles"],
			});
			onOpenChange(false);
			setFormData({ name: "", description: "", priority: 10 });
		},
		onError: (error) => {
			toast.error(`Failed to create role: ${error.message}`);
		},
	});

	const handleSave = () => {
		if (!formData.name.trim() || !formData.description.trim()) {
			toast.error("Please fill in all required fields");
			return;
		}
		createRoleMutation.mutate(formData);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] mx-4">
				<DialogHeader>
					<DialogTitle>Create New Role</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Role Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, name: e.target.value }))
							}
							placeholder="e.g., Content Editor"
							disabled={createRoleMutation.isPending}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							placeholder="Brief description of role"
							disabled={createRoleMutation.isPending}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="priority">Priority</Label>
						<Input
							id="priority"
							type="number"
							value={formData.priority}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									priority: parseInt(e.target.value) || 0,
								}))
							}
							disabled={createRoleMutation.isPending}
						/>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={createRoleMutation.isPending}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={createRoleMutation.isPending}
						className="w-full sm:w-auto"
					>
						{createRoleMutation.isPending && (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						)}
						Create Role
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function CreatePermissionDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		action: "",
		resource: "",
		resourceId: "",
	});

	const createPermissionMutation = useMutation({
		mutationFn: (data: CreatePermissionDTO) =>
			adminApi.accessManagement.createPermission(data),
		onSuccess: () => {
			toast.success("Permission created successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "all-permissions"] });
			queryClient.invalidateQueries({
				queryKey: ["admin", "roles-with-permissions"],
			});
			onOpenChange(false);
			setFormData({
				name: "",
				description: "",
				action: "",
				resource: "",
				resourceId: "",
			});
		},
		onError: (error) => {
			toast.error(`Failed to create permission: ${error.message}`);
		},
	});

	const handleSave = () => {
		if (
			!formData.name.trim() ||
			!formData.description.trim() ||
			!formData.action.trim() ||
			!formData.resource.trim()
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		const permissionData: CreatePermissionDTO = {
			name: formData.name,
			description: formData.description,
			action: formData.action,
			resource: formData.resource,
			...(formData.resourceId && { resourceId: formData.resourceId }),
		};

		createPermissionMutation.mutate(permissionData);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] mx-4">
				<DialogHeader>
					<DialogTitle>Create New Permission</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Permission Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, name: e.target.value }))
							}
							placeholder="e.g., Edit Posts"
							disabled={createPermissionMutation.isPending}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							placeholder="What this permission allows"
							disabled={createPermissionMutation.isPending}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="action">Action</Label>
						<Input
							id="action"
							value={formData.action}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, action: e.target.value }))
							}
							placeholder="e.g., read, write, delete"
							disabled={createPermissionMutation.isPending}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="resource">Resource</Label>
						<Input
							id="resource"
							value={formData.resource}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, resource: e.target.value }))
							}
							placeholder="e.g., blog, users, files"
							disabled={createPermissionMutation.isPending}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="resourceId">Resource ID (Optional)</Label>
						<Input
							id="resourceId"
							value={formData.resourceId}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, resourceId: e.target.value }))
							}
							placeholder="Specific resource ID"
							disabled={createPermissionMutation.isPending}
						/>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={createPermissionMutation.isPending}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={createPermissionMutation.isPending}
						className="w-full sm:w-auto"
					>
						{createPermissionMutation.isPending && (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						)}
						Create Permission
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function AssignRoleDialog({
	open,
	onOpenChange,
	user,
	knownRoles,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: UserWithRoles | null;
	knownRoles: RoleDTO[];
}) {
	const queryClient = useQueryClient();
	const [selectedRoleId, setSelectedRoleId] = useState("");

	const assignRoleMutation = useMutation({
		mutationFn: (data: RoleAssignmentDTO) =>
			adminApi.accessManagement.assignRoleToUser(data),
		onSuccess: () => {
			toast.success("Role assigned successfully");
			queryClient.invalidateQueries({
				queryKey: ["admin", "users-with-roles"],
			});
			onOpenChange(false);
			setSelectedRoleId("");
		},
		onError: (error) => {
			toast.error(`Failed to assign role: ${error.message}`);
		},
	});

	const handleAssign = () => {
		if (!selectedRoleId || !user) {
			toast.error("Please select a role");
			return;
		}
		assignRoleMutation.mutate({ userId: user.id, roleId: selectedRoleId });
	};

	if (!user) return null;

	const availableRoles = knownRoles.filter(
		(role) => !user.roles.some((userRole) => userRole.id === role.id),
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] mx-4">
				<DialogHeader>
					<DialogTitle>Assign Role to {user.fullName}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="role">Select Role</Label>
						<Select
							value={selectedRoleId}
							onValueChange={setSelectedRoleId}
							disabled={assignRoleMutation.isPending}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose a role to assign" />
							</SelectTrigger>
							<SelectContent>
								{availableRoles.map((role) => (
									<SelectItem key={role.id} value={role.id}>
										{role.name} - {role.description}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={assignRoleMutation.isPending}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					<Button
						onClick={handleAssign}
						disabled={assignRoleMutation.isPending || !selectedRoleId}
						className="w-full sm:w-auto"
					>
						{assignRoleMutation.isPending && (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						)}
						Assign Role
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function RoleCard({
	role,
	onDelete,
	onManagePermissions,
}: {
	role: RoleWithPermissions;
	onDelete: (role: RoleDTO) => void;
	onManagePermissions: (role: RoleDTO) => void;
}) {
	const [showAllPerms, setShowAllPerms] = useState(false);
	const permLimit = 3;
	const permsToShow = showAllPerms
		? role.permissions
		: role.permissions.slice(0, permLimit);

	return (
		<Card className="group hover:shadow-md transition">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex items-center space-x-4">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Shield className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h3 className="font-semibold">{role.name}</h3>
							<p className="text-sm text-muted-foreground">
								{role.description}
							</p>
							<div className="flex items-center space-x-4 mt-2">
								<div className="flex items-center space-x-1">
									<Settings className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										Priority: {role.priority}
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<Key className="h-3 w-3 text-muted-foreground stroke-foreground" />
									<span className="text-xs text-muted-foreground">
										{role.permissions.length} permissions
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 sm:justify-end">
						<div className="flex flex-wrap gap-1 max-w-full">
							{permsToShow.map((permission: PermissionDTO) => (
								<Badge
									key={permission.id}
									variant="outline"
									className="text-xs"
								>
									{permission.name}
								</Badge>
							))}
							{role.permissions.length > permLimit && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-6 px-2 text-xs"
									onClick={() => setShowAllPerms((v) => !v)}
									aria-expanded={showAllPerms}
									aria-label={
										showAllPerms
											? "Show fewer permissions"
											: "Show all permissions"
									}
								>
									{showAllPerms
										? "Show less"
										: `+${role.permissions.length - permLimit} more`}
								</Button>
							)}
						</div>

						<div className="flex items-center gap-2 sm:gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onManagePermissions(role)}
								className="w-full sm:w-auto"
							>
								<LinkIcon className="h-4 w-4 mr-2" />
								Permissions
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onDelete(role)}
								className="text-destructive hover:text-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
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

	if (totalPages <= 1) return null;

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

function ManageRolePermissionsDialog({
	open,
	onOpenChange,
	role,
	allPermissions,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	role: RoleWithPermissions | null;
	allPermissions: PermissionDTO[];
}) {
	const queryClient = useQueryClient();
	const [selectedPermissionId, setSelectedPermissionId] = useState("");

	const assignPermissionMutation = useMutation({
		mutationFn: (data: { roleId: string; permissionId: string }) =>
			adminApi.accessManagement.assignPermissionToRole({
				roleId: data.roleId,
				permissionId: data.permissionId,
			}),
		onSuccess: () => {
			toast.success("Permission assigned");
			queryClient.invalidateQueries({
				queryKey: ["admin", "roles-with-permissions"],
			});
			setSelectedPermissionId("");
			onOpenChange(false);
		},
		onError: (error) => {
			toast.error(`Failed to assign permission: ${error.message}`);
		},
	});

	const revokePermissionMutation = useMutation({
		mutationFn: (data: { roleId: string; permissionId: string }) =>
			adminApi.accessManagement.revokePermissionFromRole({
				roleId: data.roleId,
				permissionId: data.permissionId,
			}),
		onSuccess: () => {
			toast.success("Permission revoked");
			queryClient.invalidateQueries({
				queryKey: ["admin", "roles-with-permissions"],
			});
		},
		onError: (error) => {
			toast.error(`Failed to revoke permission: ${error.message}`);
		},
	});

	if (!role) return null;

	const availablePermissions = allPermissions.filter(
		(p) => !role.permissions.some((rp) => rp.id === p.id),
	);

	const handleAssign = () => {
		if (!selectedPermissionId) {
			toast.error("Please select a permission");
			return;
		}
		assignPermissionMutation.mutate({
			roleId: role.id,
			permissionId: selectedPermissionId,
		});
	};

	const handleRevoke = (permission: PermissionDTO) => {
		if (
			confirm(
				`Revoke permission "${permission.name}" from role "${role.name}"?`,
			)
		) {
			revokePermissionMutation.mutate({
				roleId: role.id,
				permissionId: permission.id,
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[520px] mx-4">
				<DialogHeader>
					<DialogTitle>Manage Permissions — {role.name}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-2">
					<div className="grid gap-2">
						<Label htmlFor="permission">Add Permission</Label>
						<Select
							value={selectedPermissionId}
							onValueChange={setSelectedPermissionId}
							disabled={assignPermissionMutation.isPending}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose a permission" />
							</SelectTrigger>
							<SelectContent>
								{availablePermissions.length === 0 ? (
									<div className="px-3 py-2 text-sm text-muted-foreground">
										No available permissions
									</div>
								) : (
									availablePermissions.map((p) => (
										<SelectItem key={p.id} value={p.id}>
											{p.name} — {p.action}:{p.resource}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
						<div className="flex justify-end">
							<Button
								onClick={handleAssign}
								disabled={
									assignPermissionMutation.isPending || !selectedPermissionId
								}
								className="w-full sm:w-auto"
							>
								{assignPermissionMutation.isPending && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								Assign
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Current Permissions</Label>
						<div className="flex flex-wrap gap-2">
							{role.permissions.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No permissions assigned
								</p>
							) : (
								role.permissions.map((perm) => (
									<Badge
										key={perm.id}
										variant="outline"
										className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
										onClick={() => handleRevoke(perm)}
										title="Click to revoke"
									>
										{perm.name} ×
									</Badge>
								))
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function AccessManagementPage() {
	const queryClient = useQueryClient();
	const [createRoleOpen, setCreateRoleOpen] = useState(false);
	const [createPermissionOpen, setCreatePermissionOpen] = useState(false);
	const [assignRoleOpen, setAssignRoleOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
	const [managePermsOpen, setManagePermsOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
		null,
	);
	const [activeTab, setActiveTab] = useState("users");

	// Pagination states
	const [usersPage, setUsersPage] = useState(1);
	const [rolesPage, setRolesPage] = useState(1);
	const [permissionsPage, setPermissionsPage] = useState(1);
	const ITEMS_PER_PAGE = 10;

	// Reset pagination when switching tabs
	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		if (tab === "users") setUsersPage(1);
		if (tab === "roles") setRolesPage(1);
		if (tab === "permissions") setPermissionsPage(1);
	};

	// Fetch users with pagination
	const { data: usersResponse, isLoading: usersLoading } = useQuery({
		queryKey: ["admin", "users", usersPage],
		queryFn: () =>
			adminApi.users.getAll(ITEMS_PER_PAGE, (usersPage - 1) * ITEMS_PER_PAGE),
	});

	const users = usersResponse || [];

	// Fetch all roles directly from the API with pagination
	const { data: rolesResponse, isLoading: rolesLoading } = useQuery({
		queryKey: ["admin", "all-roles", rolesPage],
		queryFn: () =>
			adminApi.accessManagement.getAllRoles(
				false,
				ITEMS_PER_PAGE,
				(rolesPage - 1) * ITEMS_PER_PAGE,
			),
	});

	const allRoles = rolesResponse || [];

	// Fetch all permissions directly from the API with pagination
	const { data: permissionsResponse, isLoading: permissionsLoading } = useQuery(
		{
			queryKey: ["admin", "all-permissions", permissionsPage],
			queryFn: () =>
				adminApi.accessManagement.getAllPermissions(
					false,
					ITEMS_PER_PAGE,
					(permissionsPage - 1) * ITEMS_PER_PAGE,
				),
		},
	);

	const allPermissions = permissionsResponse || [];

	// Fetch users with their roles
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

	// Fetch roles with their permissions using the real data
	const rolesWithPermissions = useQuery({
		queryKey: ["admin", "roles-with-permissions", allRoles.map((r) => r.id)],
		queryFn: async (): Promise<RoleWithPermissions[]> => {
			const rolesWithPermissionPromises = allRoles.map(async (role) => {
				try {
					const permissions =
						await adminApi.accessManagement.getRolePermissions(role.id);
					return { ...role, permissions };
				} catch {
					return { ...role, permissions: [] as PermissionDTO[] };
				}
			});
			return Promise.all(rolesWithPermissionPromises);
		},
		enabled: allRoles.length > 0,
	});

	// Revoke role mutation
	const revokeRoleMutation = useMutation({
		mutationFn: (data: RoleAssignmentDTO) =>
			adminApi.accessManagement.revokeRoleFromUser(data),
		onSuccess: () => {
			toast.success("Role revoked successfully");
			queryClient.invalidateQueries({
				queryKey: ["admin", "users-with-roles"],
			});
		},
		onError: (error) => {
			toast.error(`Failed to revoke role: ${error.message}`);
		},
	});

	// Delete role mutation
	const deleteRoleMutation = useMutation({
		mutationFn: (roleId: string) =>
			adminApi.accessManagement.deleteRole(roleId),
		onSuccess: () => {
			toast.success("Role deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "all-roles"] });
			queryClient.invalidateQueries({
				queryKey: ["admin", "users-with-roles"],
			});
			queryClient.invalidateQueries({
				queryKey: ["admin", "roles-with-permissions"],
			});
		},
		onError: (error) => {
			toast.error(`Failed to delete role: ${error.message}`);
		},
	});

	const handleAssignRole = (user: UserWithRoles) => {
		setSelectedUser(user);
		setAssignRoleOpen(true);
	};

	const handleRevokeRole = (user: UserWithRoles, role: RoleDTO) => {
		if (
			confirm(
				`Are you sure you want to revoke the role "${role.name}" from ${user.fullName}?`,
			)
		) {
			revokeRoleMutation.mutate({ userId: user.id, roleId: role.id });
		}
	};

	const handleDeleteRole = (role: RoleDTO) => {
		if (
			confirm(
				`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
			)
		) {
			deleteRoleMutation.mutate(role.id);
		}
	};

	const handleManagePermissions = (role: RoleDTO) => {
		const roleFull = rolesData.find((r) => r.id === role.id) || null;
		setSelectedRole(roleFull);
		setManagePermsOpen(true);
	};

	const deletePermissionMutation = useMutation({
		mutationFn: (permissionId: string) =>
			adminApi.accessManagement.deletePermission(permissionId),
		onSuccess: () => {
			toast.success("Permission deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "all-permissions"] });
			queryClient.invalidateQueries({
				queryKey: ["admin", "roles-with-permissions"],
			});
		},
		onError: (error) => {
			toast.error(`Failed to delete permission: ${error.message}`);
		},
	});

	const handleDeletePermission = (permission: PermissionDTO) => {
		if (
			confirm(
				`Are you sure you want to delete the permission "${permission.name}"? This action cannot be undone.`,
			)
		) {
			deletePermissionMutation.mutate(permission.id);
		}
	};

	if (usersLoading || rolesLoading || permissionsLoading) {
		return (
			<AdminLayout>
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold">Access Management</h1>
						<p className="text-muted-foreground">
							Manage roles and permissions for your platform.
						</p>
					</div>
					<div className="flex items-center justify-center h-96">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				</div>
			</AdminLayout>
		);
	}

	const usersData = usersWithRoles.data || [];
	const rolesData = rolesWithPermissions.data || [];
	const knownRolesData = allRoles || []; // Use all roles from API instead of extracted roles

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Access Management</h1>
					<p className="text-muted-foreground">
						Manage roles and permissions for your platform.
					</p>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full"
				>
					<div className="w-full overflow-x-auto">
						<TabsList className="inline-flex min-w-max gap-1">
							<TabsTrigger
								value="users"
								className="flex items-center space-x-2"
							>
								<Users className="h-4 w-4" />
								<span>User Roles</span>
							</TabsTrigger>
							<TabsTrigger
								value="roles"
								className="flex items-center space-x-2"
							>
								<Shield className="h-4 w-4" />
								<span>Roles ({rolesData.length})</span>
							</TabsTrigger>
							<TabsTrigger
								value="permissions"
								className="flex items-center space-x-2"
							>
								<Key className="h-4 w-4 stroke-foreground" />
								<span>Permissions ({allPermissions.length})</span>
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="users" className="space-y-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<h2 className="text-xl font-semibold">User Role Assignments</h2>
							<div className="flex space-x-2">
								<Button
									onClick={() => setCreateRoleOpen(true)}
									className="w-full sm:w-auto"
								>
									<Plus className="h-4 w-4 mr-2" />
									Create Role
								</Button>
							</div>
						</div>

						<div className="space-y-4">
							{usersWithRoles.isLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-6 w-6 animate-spin" />
								</div>
							) : (
								usersData.map((user: UserWithRoles) => (
									<UserRoleCard
										key={user.id}
										user={user}
										onAssignRole={handleAssignRole}
										onRevokeRole={handleRevokeRole}
									/>
								))
							)}
						</div>

						<PaginationControls
							currentPage={usersPage}
							totalItems={
								users.length >= ITEMS_PER_PAGE
									? usersPage * ITEMS_PER_PAGE + 1
									: users.length
							}
							itemsPerPage={ITEMS_PER_PAGE}
							onPageChange={setUsersPage}
						/>
					</TabsContent>

					<TabsContent value="roles" className="space-y-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<h2 className="text-xl font-semibold">Role Management</h2>
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
								<Button
									onClick={() => setCreatePermissionOpen(true)}
									variant="outline"
									className="w-full sm:w-auto"
								>
									<Plus className="h-4 w-4 mr-2" />
									Create Permission
								</Button>
								<Button
									onClick={() => setCreateRoleOpen(true)}
									className="w-full sm:w-auto"
								>
									<Plus className="h-4 w-4 mr-2" />
									Create Role
								</Button>
							</div>
						</div>

						<div className="space-y-4">
							{rolesWithPermissions.isLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-6 w-6 animate-spin" />
								</div>
							) : (
								rolesData.map((role: RoleWithPermissions) => (
									<RoleCard
										key={role.id}
										role={role}
										onDelete={handleDeleteRole}
										onManagePermissions={handleManagePermissions}
									/>
								))
							)}
						</div>

						{rolesData.length === 0 && (
							<Card>
								<CardContent className="p-12 text-center">
									<Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
									<p className="text-muted-foreground">
										No roles found. Create your first role to get started.
									</p>
								</CardContent>
							</Card>
						)}

						<PaginationControls
							currentPage={rolesPage}
							totalItems={
								allRoles.length >= ITEMS_PER_PAGE
									? rolesPage * ITEMS_PER_PAGE + 1
									: allRoles.length
							}
							itemsPerPage={ITEMS_PER_PAGE}
							onPageChange={setRolesPage}
						/>
					</TabsContent>

					<TabsContent value="permissions" className="space-y-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<h2 className="text-xl font-semibold">Permission Management</h2>
							<div className="flex w-full sm:w-auto">
								<Button
									onClick={() => setCreatePermissionOpen(true)}
									className="w-full sm:w-auto"
								>
									<Plus className="h-4 w-4 mr-2" />
									Create Permission
								</Button>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{permissionsLoading ? (
								<div className="col-span-full flex items-center justify-center py-8">
									<Loader2 className="h-6 w-6 animate-spin" />
								</div>
							) : (
								allPermissions.map((permission: PermissionDTO) => (
									<Card key={permission.id} className="h-fit">
										<CardContent className="p-4">
											<div className="flex flex-col space-y-3">
												<div className="flex items-start justify-between">
													<div className="flex items-center space-x-3 min-w-0 flex-1">
														<div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
															<Key className="h-4 w-4 text-secondary-foreground stroke-foreground" />
														</div>
														<div className="flex-1 min-w-0">
															<h3 className="font-medium truncate text-sm">
																{permission.name}
															</h3>
															<p
																className="text-xs text-muted-foreground mt-1 overflow-hidden"
																style={{
																	display: "-webkit-box",
																	WebkitLineClamp: 2,
																	WebkitBoxOrient: "vertical",
																}}
															>
																{permission.description}
															</p>
														</div>
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleDeletePermission(permission)}
														className="text-destructive hover:text-destructive flex-shrink-0 ml-2"
													>
														<Trash2 className="h-3 w-3" />
													</Button>
												</div>
												<div className="flex flex-col space-y-1">
													<Badge variant="outline" className="text-xs w-fit">
														{permission.action}:{permission.resource}
													</Badge>
													{permission.resourceId && (
														<Badge
															variant="secondary"
															className="text-xs w-fit"
														>
															ID: {permission.resourceId.slice(0, 8)}...
														</Badge>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								))
							)}
						</div>

						{allPermissions.length === 0 && (
							<Card>
								<CardContent className="p-12 text-center">
									<Key className="h-12 w-12 mx-auto text-muted-foreground mb-4 stroke-foreground" />
									<p className="text-muted-foreground">
										No permissions found. Create your first permission to get
										started.
									</p>
								</CardContent>
							</Card>
						)}

						<PaginationControls
							currentPage={permissionsPage}
							totalItems={
								allPermissions.length >= ITEMS_PER_PAGE
									? permissionsPage * ITEMS_PER_PAGE + 1
									: allPermissions.length
							}
							itemsPerPage={ITEMS_PER_PAGE}
							onPageChange={setPermissionsPage}
						/>
					</TabsContent>
				</Tabs>

				<CreateRoleDialog
					open={createRoleOpen}
					onOpenChange={setCreateRoleOpen}
				/>

				<CreatePermissionDialog
					open={createPermissionOpen}
					onOpenChange={setCreatePermissionOpen}
				/>

				<AssignRoleDialog
					open={assignRoleOpen}
					onOpenChange={setAssignRoleOpen}
					user={selectedUser}
					knownRoles={knownRolesData}
				/>

				<ManageRolePermissionsDialog
					open={managePermsOpen}
					onOpenChange={setManagePermsOpen}
					role={selectedRole}
					allPermissions={allPermissions}
				/>
			</div>
		</AdminLayout>
	);
}
