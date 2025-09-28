"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GuestGuard } from "@/components/guards/auth-guards";

function LoginContent() {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);
	const router = useRouter();

	const loginMutation = useMutation({
		mutationKey: ["auth/login"],
		mutationFn: authApi.login,
		onSuccess: () => {
			toast.success(t("auth.loginSuccess"));
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const validateForm = () => {
		const newErrors: { email?: string; password?: string } = {};

		if (!email) {
			newErrors.email = t("validation.required", { field: t("common.email") });
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = t("validation.invalidEmail");
		}

		if (!password) {
			newErrors.password = t("validation.required", {
				field: t("common.password"),
			});
		} else if (password.length < 6) {
			newErrors.password = t("validation.minLength", {
				field: t("common.password"),
				min: 6,
			});
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			loginMutation.mutate({ email, password });
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 pt-32 md:pt-36">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight">
						{t("auth.welcomeBack")}
					</h1>
					<p className="text-muted-foreground mt-2">
						{t("auth.loginSubtitle")}
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-semibold">
							{t("common.login")}
						</CardTitle>
						<CardDescription>{t("auth.enterCredentials")}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium">
									{t("common.email")}
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder={t("auth.emailPlaceholder")}
										className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (errors.email)
												setErrors((prev) => ({ ...prev, email: undefined }));
										}}
										disabled={loginMutation.isPending}
									/>
								</div>
								{errors.email && (
									<p className="text-sm text-red-500">{errors.email}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									{t("common.password")}
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder={t("auth.passwordPlaceholder")}
										className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											if (errors.password)
												setErrors((prev) => ({ ...prev, password: undefined }));
										}}
										disabled={loginMutation.isPending}
									/>
									<button
										type="button"
										className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="text-sm text-red-500">{errors.password}</p>
								)}
							</div>

							<div className="flex items-center justify-between">
								<Link
									href="/forgot-password"
									className="text-sm text-primary hover:underline"
								>
									{t("auth.forgotPassword")}
								</Link>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={loginMutation.isPending}
							>
								{loginMutation.isPending ? (
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										{t("common.loading")}
									</div>
								) : (
									<div className="flex items-center gap-2">
										{t("common.login")}
										<ArrowRight className="h-4 w-4" />
									</div>
								)}
							</Button>
						</form>

						<div className="text-center pt-4 border-t">
							<p className="text-sm text-muted-foreground">
								{t("auth.noAccount")}{" "}
								<Link
									href="/register"
									className="text-primary hover:underline font-medium"
								>
									{t("auth.signUp")}
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<GuestGuard>
			<LoginContent />
		</GuestGuard>
	);
}
