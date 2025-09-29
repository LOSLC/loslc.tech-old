"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { GuestGuard } from "@/components/guards/auth-guards";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";

function ForgotPasswordContent() {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");

	const forgotPasswordMutation = useMutation({
		mutationKey: ["auth/forgot-password"],
		mutationFn: authApi.requestPasswordReset,
		onSuccess: () => {
			toast.success(t("auth.passwordResetSuccess"));
			// Optionally redirect or show success state
		},
		onError: (error: Error) => {
			setError(error.message);
			toast.error(error.message);
		},
	});

	const validateEmail = (email: string) => {
		const emailRegex = /\S+@\S+\.\S+/;
		return emailRegex.test(email);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			setError(t("validation.required", { field: t("common.email") }));
			return;
		}

		if (!validateEmail(email)) {
			setError(t("validation.invalidEmail"));
			return;
		}

		setError("");
		forgotPasswordMutation.mutate({ email });
	};

	const handleEmailChange = (value: string) => {
		setEmail(value);
		if (error) setError("");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 pt-32 md:pt-36">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight">
						{t("auth.forgotPassword")}
					</h1>
					<p className="text-muted-foreground mt-2">
						{t("auth.forgotPasswordSubtitle")}
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-semibold">
							{t("auth.resetPassword")}
						</CardTitle>
						<CardDescription>
							{t("auth.passwordResetInstructions")}
						</CardDescription>
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
										className={`pl-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
										value={email}
										onChange={(e) => handleEmailChange(e.target.value)}
										disabled={forgotPasswordMutation.isPending}
									/>
								</div>
								{error && <p className="text-sm text-red-500">{error}</p>}
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={forgotPasswordMutation.isPending || !email}
							>
								{forgotPasswordMutation.isPending ? (
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										{t("common.loading")}
									</div>
								) : (
									<div className="flex items-center gap-2">
										{t("auth.sendResetLink")}
										<ArrowRight className="h-4 w-4" />
									</div>
								)}
							</Button>
						</form>

						<div className="text-center pt-4 border-t">
							<p className="text-sm text-muted-foreground">
								{t("auth.rememberedPassword")}{" "}
								<Link
									href="/login"
									className="text-primary hover:underline font-medium"
								>
									<div className="inline-flex items-center gap-1">
										<ArrowLeft className="h-3 w-3" />
										{t("auth.backToLogin")}
									</div>
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function ForgotPasswordPage() {
	return (
		<GuestGuard>
			<ForgotPasswordContent />
		</GuestGuard>
	);
}
