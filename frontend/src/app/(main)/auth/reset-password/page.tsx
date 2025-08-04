"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GuestGuard } from "@/components/guards/auth-guards";

function ResetPasswordContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Backend sends session ID as 'token' parameter in the URL
  // The actual verification token is sent separately in the email content
  const sessionId = searchParams.get('token'); // This is actually the session ID
  
  const [formData, setFormData] = useState({
    verificationToken: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetPasswordMutation = useMutation({
    mutationKey: ["auth/reset-password"],
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success(t("auth.passwordResetCompleteSuccess"));
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.verificationToken) {
      newErrors.verificationToken = t("validation.required", { field: t("auth.verificationToken") });
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = t("validation.required", { field: t("auth.newPassword") });
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("validation.minLength", { field: t("auth.newPassword"), min: 8 });
    }
    
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = t("validation.required", { field: t("auth.confirmNewPassword") });
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = t("validation.passwordMatch");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId) {
      toast.error(t("auth.invalidResetLink"));
      return;
    }
    
    if (validateForm()) {
      resetPasswordMutation.mutate({
        sessionId,
        token: formData.verificationToken,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });
    }
  };

  // If no session ID, show invalid link message
  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-red-600">
                {t("auth.invalidResetLink")}
              </CardTitle>
              <CardDescription>
                {t("auth.resetLinkExpired")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/forgot-password">
                <Button className="w-full">
                  {t("auth.requestNewResetLink")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("auth.resetPassword")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.resetPasswordSubtitle")}</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">{t("auth.createNewPassword")}</CardTitle>
            <CardDescription>
              {t("auth.chooseSecurePassword")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationToken" className="text-sm font-medium">
                  {t("auth.verificationToken")}
                </Label>
                <Input
                  id="verificationToken"
                  type="text"
                  placeholder={t("auth.enterTokenFromEmail")}
                  className={`${errors.verificationToken ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  value={formData.verificationToken}
                  onChange={(e) => updateFormData("verificationToken", e.target.value)}
                  disabled={resetPasswordMutation.isPending}
                />
                {errors.verificationToken && (
                  <p className="text-sm text-red-500">{errors.verificationToken}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t("auth.verificationTokenDescription")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  {t("auth.newPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPasswords.newPassword ? "text" : "password"}
                    placeholder={t("auth.newPasswordPlaceholder")}
                    className={`pl-10 pr-10 ${errors.newPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.newPassword}
                    onChange={(e) => updateFormData("newPassword", e.target.value)}
                    disabled={resetPasswordMutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    {showPasswords.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword" className="text-sm font-medium">
                  {t("auth.confirmNewPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmNewPassword"
                    type={showPasswords.confirmNewPassword ? "text" : "password"}
                    placeholder={t("auth.confirmNewPasswordPlaceholder")}
                    className={`pl-10 pr-10 ${errors.confirmNewPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.confirmNewPassword}
                    onChange={(e) => updateFormData("confirmNewPassword", e.target.value)}
                    disabled={resetPasswordMutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={() => togglePasswordVisibility("confirmNewPassword")}
                  >
                    {showPasswords.confirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={resetPasswordMutation.isPending || !formData.verificationToken || !formData.newPassword || !formData.confirmNewPassword}
              >
                {resetPasswordMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("auth.resettingPassword")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t("auth.resetPassword")}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t("auth.rememberedPassword")}{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  {t("auth.backToLogin")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <GuestGuard>
      <ResetPasswordContent />
    </GuestGuard>
  );
}
