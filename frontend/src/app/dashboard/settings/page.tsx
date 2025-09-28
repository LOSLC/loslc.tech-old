"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, UserDTO, UpdateUserInfoDTO } from "@/lib/api/users";
import { filesApi } from "@/lib/api/files";
import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, User2 } from "lucide-react";

export default function ProfileSettingsPage() {
	const { t } = useTranslation();
	const { user: authUser, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!authLoading && !authUser) router.push("/login");
	}, [authLoading, authUser, router]);

	const { data: user, isLoading } = useQuery<UserDTO>({
		queryKey: ["dashboard/user"],
		queryFn: userApi.getCurrentUser,
		enabled: !!authUser,
	});

	const [fullName, setFullName] = useState("");
	useEffect(() => {
		if (user?.fullName) setFullName(user.fullName);
	}, [user]);

	const updateMutation = useMutation({
		mutationFn: (data: UpdateUserInfoDTO) => userApi.updateCurrentUser(data),
		onSuccess: () => {
			toast.success(t("dashboard.updateSuccess", "Profile updated"));
			queryClient.invalidateQueries({ queryKey: ["dashboard/user"] });
			queryClient.invalidateQueries({ queryKey: ["auth/me"] });
		},
		onError: () =>
			toast.error(t("dashboard.updateError", "Failed to update profile")),
	});

	const avatarMutation = useMutation({
		mutationFn: async (file: File) => {
			const uploaded = await filesApi.uploadSingle(file, { protected: false });
			const me = await userApi.getCurrentUser();
			await userApi.changeProfilePicture(me.id, uploaded.id);
			return uploaded.id;
		},
		onSuccess: () => {
			toast.success(t("dashboard.avatarSuccess", "Profile picture updated"));
			queryClient.invalidateQueries({ queryKey: ["dashboard/user"] });
			queryClient.invalidateQueries({ queryKey: ["auth/me"] });
		},
		onError: () =>
			toast.error(t("dashboard.avatarError", "Failed to update avatar")),
	});

	const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		avatarMutation.mutate(file);
	};

	if (authLoading || isLoading) {
		return <div className="pt-24">{t("common.loading", "Loading...")}</div>;
	}
	if (!user) return null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">
					{t("dashboard.settingsTitle", "Profile Settings")}
				</h1>
				<p className="text-muted-foreground text-sm mt-1">
					{t(
						"dashboard.settingsSubtitle",
						"Manage your personal information and avatar.",
					)}
				</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User2 className="w-5 h-5" /> {t("dashboard.profile", "Profile")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
						<div className="flex items-center gap-4">
							<Avatar className="w-16 h-16">
								{user.profilePictureFileId && (
									<AvatarImage
										src={filesApi.downloadUrl(user.profilePictureFileId)}
										alt={user.username}
									/>
								)}
								<AvatarFallback>
									{user.username.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<Label htmlFor="avatar" className="mb-1 block">
									{t("dashboard.changeAvatar", "Change avatar")}
								</Label>
								<Input
									id="avatar"
									type="file"
									accept="image/*"
									onChange={onAvatarChange}
									disabled={avatarMutation.isPending}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									{t(
										"dashboard.avatarHint",
										"Use a square image (JPG/PNG). Max 2MB for best results.",
									)}
								</p>
							</div>
						</div>
					</div>
					<Separator className="my-6" />
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<Label>{t("dashboard.username", "Username")}</Label>
							<div className="mt-1 flex items-center gap-2 text-sm">
								{user.username}
							</div>
						</div>
						<div>
							<Label>{t("dashboard.email", "Email")}</Label>
							<div className="mt-1 flex items-center gap-2 text-sm">
								<Mail className="w-4 h-4 text-muted-foreground" />
								{user.email}
							</div>
						</div>
						<div className="sm:col-span-2">
							<Label htmlFor="fullName">
								{t("dashboard.fullName", "Full name")}
							</Label>
							<Input
								id="fullName"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder={t(
									"dashboard.fullNamePh",
									"How should we address you?",
								)}
							/>
							<p className="text-xs text-muted-foreground mt-1">
								{t(
									"dashboard.fullNameHint",
									"Your public display name across the site.",
								)}
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="justify-end">
					<Button
						onClick={() => updateMutation.mutate({ fullName })}
						disabled={updateMutation.isPending}
					>
						{t("dashboard.save", "Save changes")}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
