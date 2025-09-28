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
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react";
import { GuestGuard } from "@/components/guards/auth-guards";

function VerifyEmailContent() {
	const { t } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();

	// Backend sends 'token' parameter as session ID
	// For full verification, we need both session ID and token
	const authSessionId = searchParams.get("token"); // This is actually the session ID from the URL
	const authSessionToken = searchParams.get("authSessionToken"); // This would be the verification token

	const [verificationStatus, setVerificationStatus] = useState<
		"idle" | "pending" | "success" | "error"
	>("idle");
	const [hasAutoVerified, setHasAutoVerified] = useState(false);
	const [manualToken, setManualToken] = useState("");

	const verifyEmailMutation = useMutation({
		mutationKey: ["auth/verify-email"],
		mutationFn: authApi.verifyEmail,
		onSuccess: () => {
			setVerificationStatus("success");
			toast.success(t("auth.emailVerificationSuccess"));
		},
		onError: (error: Error) => {
			setVerificationStatus("error");
			toast.error(error.message);
		},
	});

	// Auto-verify if both URL parameters are present
	useEffect(() => {
		if (authSessionId && authSessionToken && !hasAutoVerified) {
			setHasAutoVerified(true);
			setVerificationStatus("pending");
			verifyEmailMutation.mutate({ authSessionId, authSessionToken });
		}
	}, [authSessionId, authSessionToken, hasAutoVerified, verifyEmailMutation]);

	const handleManualVerify = () => {
		if (!authSessionId) {
			toast.error(t("auth.invalidVerificationLink"));
			return;
		}

		const tokenToUse = authSessionToken || manualToken;
		if (!tokenToUse) {
			toast.error(t("auth.tokenRequired"));
			return;
		}

		setVerificationStatus("pending");
		verifyEmailMutation.mutate({
			authSessionId,
			authSessionToken: tokenToUse,
		});
	};

	const handleProceedToLogin = () => {
		router.push("/login");
	};

	const renderContent = () => {
		switch (verificationStatus) {
			case "pending":
				return (
					<div className="text-center space-y-4">
						<div className="flex justify-center">
							<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">
								{t("auth.verifyingEmail")}
							</h3>
							<p className="text-muted-foreground">{t("auth.pleaseWait")}</p>
						</div>
					</div>
				);

			case "success":
				return (
					<div className="text-center space-y-6">
						<div className="flex justify-center">
							<CheckCircle className="h-16 w-16 text-green-500" />
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-semibold text-green-700">
								{t("auth.emailVerificationSuccess")}
							</h3>
							<p className="text-muted-foreground">
								{t("auth.accountVerificationComplete")}
							</p>
						</div>
						<Button onClick={handleProceedToLogin} className="w-full">
							<div className="flex items-center gap-2">
								{t("auth.proceedToLogin")}
								<ArrowRight className="h-4 w-4" />
							</div>
						</Button>
					</div>
				);

			case "error":
				return (
					<div className="text-center space-y-6">
						<div className="flex justify-center">
							<XCircle className="h-16 w-16 text-red-500" />
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-semibold text-red-700">
								{t("auth.emailVerificationError")}
							</h3>
							<p className="text-muted-foreground">
								{t("auth.verificationLinkInvalid")}
							</p>
						</div>
						<div className="space-y-3">
							{authSessionId && authSessionToken && (
								<Button
									onClick={handleManualVerify}
									variant="outline"
									className="w-full"
									disabled={verifyEmailMutation.isPending}
								>
									<div className="flex items-center gap-2">
										<RefreshCw className="h-4 w-4" />
										{t("auth.tryAgain")}
									</div>
								</Button>
							)}
							<Button
								onClick={handleProceedToLogin}
								variant="ghost"
								className="w-full"
							>
								{t("auth.backToLogin")}
							</Button>
						</div>
					</div>
				);

			default:
				return (
					<div className="text-center space-y-6">
						<div className="space-y-2">
							<h3 className="text-xl font-semibold">
								{t("auth.emailVerificationRequired")}
							</h3>
							<p className="text-muted-foreground">
								{authSessionId
									? t("auth.enterVerificationToken")
									: t("auth.clickLinkInEmail")}
							</p>
						</div>
						{authSessionId && !authSessionToken ? (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label
										htmlFor="verificationToken"
										className="text-sm font-medium"
									>
										{t("auth.verificationToken")}
									</Label>
									<Input
										id="verificationToken"
										type="text"
										placeholder={t("auth.enterTokenFromEmail")}
										value={manualToken}
										onChange={(e) => setManualToken(e.target.value)}
										className="text-center"
									/>
								</div>
								<Button
									onClick={handleManualVerify}
									className="w-full"
									disabled={!manualToken || verifyEmailMutation.isPending}
								>
									<div className="flex items-center gap-2">
										{t("auth.verifyAccount")}
										<ArrowRight className="h-4 w-4" />
									</div>
								</Button>
							</div>
						) : authSessionId && authSessionToken ? (
							<Button onClick={handleManualVerify} className="w-full">
								<div className="flex items-center gap-2">
									{t("auth.verifyAccount")}
									<ArrowRight className="h-4 w-4" />
								</div>
							</Button>
						) : (
							<div className="space-y-4">
								<p className="text-sm text-muted-foreground">
									{t("auth.missingVerificationParams")}
								</p>
								<Button
									onClick={handleProceedToLogin}
									variant="outline"
									className="w-full"
								>
									{t("auth.backToLogin")}
								</Button>
							</div>
						)}
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 pt-32 md:pt-36">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight">
						{t("auth.verifyAccount")}
					</h1>
					<p className="text-muted-foreground mt-2">
						{verificationStatus === "success"
							? t("auth.verificationCompleteSubtitle")
							: t("auth.verifyAccountPageSubtitle")}
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-semibold text-center">
							{verificationStatus === "success"
								? t("auth.verificationComplete")
								: t("auth.emailVerification")}
						</CardTitle>
						<CardDescription className="text-center">
							{verificationStatus === "success"
								? t("auth.welcomeToLoslc")
								: t("auth.verifyEmailDescription")}
						</CardDescription>
					</CardHeader>
					<CardContent className="py-6">{renderContent()}</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function VerifyEmailPage() {
	return (
		<GuestGuard>
			<VerifyEmailContent />
		</GuestGuard>
	);
}
